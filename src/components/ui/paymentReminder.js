// payment.service.js
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
const schedule = require('node-schedule');

class PaymentReminderService {
  constructor(dbConfig) {
    this.dbConfig = dbConfig;
    this.emailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }

  async processPayment(cargoId, amount) {
    const connection = await mysql.createConnection(this.dbConfig);
    try {
      await connection.beginTransaction();

      // Get current payment record
      const [payments] = await connection.execute(
        'SELECT * FROM payments WHERE cargo_id = ?',
        [cargoId]
      );

      if (payments.length === 0) {
        throw new Error('Payment record not found');
      }

      const payment = payments[0];
      const newAmountPaid = payment.amount_paid + amount;
      const newAmountPending = payment.amount - newAmountPaid;
      const newStatus = newAmountPending <= 0 ? 'paid' : 'partial';

      // Update payment record
      await connection.execute(
        `UPDATE payments 
         SET amount_paid = ?,
             amount_pending = ?,
             payment_status = ?
         WHERE cargo_id = ?`,
        [newAmountPaid, newAmountPending, newStatus, cargoId]
      );

      await connection.commit();
      return { status: newStatus, amountPending: newAmountPending };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      await connection.end();
    }
  }

  // Schedule daily check for pending payments
  setupReminderSchedule() {
    schedule.scheduleJob('0 9 * * *', async () => {  // Run daily at 9 AM
      await this.sendPaymentReminders();
    });
  }

  async sendPaymentReminders() {
    const connection = await mysql.createConnection(this.dbConfig);
    try {
      // Get overdue payments
      const [overduePayments] = await connection.execute(
        `SELECT 
          p.*,
          c.cargo_number,
          cl.name as client_name,
          cl.email as client_email,
          u.email as user_email
         FROM payments p
         JOIN cargo c ON p.cargo_id = c.id
         JOIN clients cl ON c.client_id = cl.id
         JOIN users u ON c.created_by = u.id
         WHERE p.payment_status IN ('pending', 'partial')
         AND p.last_reminder_sent < DATE_SUB(NOW(), INTERVAL 7 DAY)
         OR p.last_reminder_sent IS NULL`
      );

      for (const payment of overduePayments) {
        // Send reminder to client
        await this.emailTransporter.sendMail({
          from: process.env.SMTP_FROM,
          to: payment.client_email,
          subject: `Payment Reminder for Cargo ${payment.cargo_number}`,
          text: `Dear ${payment.client_name},\n\nThis is a reminder that payment of $${payment.amount_pending} is pending for cargo ${payment.cargo_number}.\n\nPlease process the payment at your earliest convenience.`
        });

        // Send notification to user
        await this.emailTransporter.sendMail({
          from: process.env.SMTP_FROM,
          to: payment.user_email,
          subject: `Payment Reminder Sent - ${payment.cargo_number}`,
          text: `Payment reminder has been sent to ${payment.client_name} for cargo ${payment.cargo_number}. Pending amount: $${payment.amount_pending}`
        });

        // Update last reminder sent date
        await connection.execute(
          'UPDATE payments SET last_reminder_sent = NOW() WHERE id = ?',
          [payment.id]
        );
      }
    } catch (error) {
      console.error('Error sending payment reminders:', error);
    } finally {
      await connection.end();
    }
  }

  async getPaymentStatus(cargoId) {
    const connection = await mysql.createConnection(this.dbConfig);
    try {
      const [payments] = await connection.execute(
        `SELECT 
          p.*,
          c.cargo_number,
          cl.name as client_name
         FROM payments p
         JOIN cargo c ON p.cargo_id = c.id
         JOIN clients cl ON c.client_id = cl.id
         WHERE p.cargo_id = ?`,
        [cargoId]
      );

      return payments[0];
    } finally {
      await connection.end();
    }
  }
}

module.exports = PaymentReminderService;
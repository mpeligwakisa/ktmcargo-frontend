import React, { useState, useEffect } from 'react';
import './Payments.css';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Alert, AlertDescription } from '../components/ui/alert';
import { DollarSign, CreditCard, AlertTriangle, CheckCircle, Send } from 'lucide-react';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch('/api/payments');
      const data = await res.json();
      setPayments(data);
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to fetch payment data' });
    }
  };

  const processPayment = async () => {
    if (!selectedPayment || !paymentAmount) {
      setAlert({ type: 'error', message: 'Select a payment and enter amount' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cargoId: selectedPayment.cargo_id,
          amount: parseFloat(paymentAmount)
        })
      });

      if (res.ok) {
        fetchPayments();
        setSelectedPayment(null);
        setPaymentAmount('');
        setAlert({ type: 'success', message: 'Payment processed successfully' });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to process payment' });
    } finally {
      setLoading(false);
    }
  };

  const sendReminder = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/payments/${id}/remind`, { method: 'POST' });
      if (res.ok) {
        setAlert({ type: 'success', message: 'Reminder sent' });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to send reminder' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircle className="icon green" />;
      case 'partial': return <AlertTriangle className="icon yellow" />;
      default: return <DollarSign className="icon red" />;
    }
  };

  const pending = payments.filter(p => p.payment_status !== 'paid');
  const totalPending = pending.reduce((sum, p) => sum + p.amount_pending, 0);
  const overdue = payments.filter(p => p.days_overdue > 30).length;
  const monthlyPaid = payments.filter(p => p.paid_this_month).reduce((sum, p) => sum + p.amount_paid, 0);

  return (
    <div className="pm-container">
      {alert && (
        <Alert variant={alert.type === 'error' ? 'destructive' : 'default'}>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <div className="pm-summary">
        <Card>
          <CardHeader className="pm-header">
            <CardTitle className="pm-title">Total Pending</CardTitle>
            <DollarSign className="icon gray" />
          </CardHeader>
          <CardContent>
            <div className="pm-amount red">${totalPending.toFixed(2)}</div>
            <p className="pm-text">{pending.length} outstanding</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pm-header">
            <CardTitle className="pm-title">Overdue</CardTitle>
            <AlertTriangle className="icon gray" />
          </CardHeader>
          <CardContent>
            <div className="pm-amount orange">{overdue}</div>
            <p className="pm-text">Over 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pm-header">
            <CardTitle className="pm-title">This Month</CardTitle>
            <CreditCard className="icon gray" />
          </CardHeader>
          <CardContent>
            <div className="pm-amount green">${monthlyPaid.toFixed(2)}</div>
            <p className="pm-text">Payments received</p>
          </CardContent>
        </Card>
      </div>

      {selectedPayment && (
        <Card>
          <CardHeader><CardTitle>Process Payment</CardTitle></CardHeader>
          <CardContent className="pm-form">
            <div className="pm-grid">
              <div><label>Cargo:</label><p className="mono">{selectedPayment.cargo_number}</p></div>
              <div><label>Client:</label><p>{selectedPayment.client_name}</p></div>
              <div><label>Total:</label><p className="bold">${selectedPayment.amount}</p></div>
              <div><label>Pending:</label><p className="bold red">${selectedPayment.amount_pending}</p></div>
            </div>
            <div className="pm-actions">
              <Input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Amount"
              />
              <Button onClick={processPayment} disabled={loading}>
                {loading ? 'Processing...' : 'Pay'}
              </Button>
              <Button variant="outline" onClick={() => setSelectedPayment(null)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Payment Overview</CardTitle></CardHeader>
        <CardContent>
          <div className="table-wrap">
            <table className="pm-table">
              <thead>
                <tr>
                  <th>Cargo</th>
                  <th>Client</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Pending</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id}>
                    <td className="mono">{p.cargo_number}</td>
                    <td>{p.client_name}</td>
                    <td>${p.amount}</td>
                    <td className="green">${p.amount_paid}</td>
                    <td className="red">${p.amount_pending}</td>
                    <td>
                      <div className="pm-status">
                        {getStatusIcon(p.payment_status)}
                        <span className={p.payment_status}>{p.payment_status}</span>
                      </div>
                    </td>
                    <td>
                      <div className="pm-btns">
                        {p.payment_status !== 'paid' && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => setSelectedPayment(p)}>Pay</Button>
                            <Button size="sm" variant="ghost" onClick={() => sendReminder(p.id)} disabled={loading}>
                              <Send className="icon" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;

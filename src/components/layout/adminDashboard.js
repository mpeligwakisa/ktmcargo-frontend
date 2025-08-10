import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line
} from 'recharts';
import {
  Users, Package, DollarSign, AlertCircle, Plane, Ship
} from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCargo: 0, airCargo: 0, seaCargo: 0,
    totalPaid: 0, pendingAmount: 0,
    totalClients: 0, repeatClients: 0
  });
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/dashboard');
      const data = await res.json();
      setStats(data.stats);
      setMonthlyData(data.monthlyData);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  return (
    <div className="ad-wrap">
      <div className="ad-grid">
        <div className="ad-card">
          <div className="ad-header">
            <span className="ad-title">Total Cargo</span>
            <Package className="ad-icon" />
          </div>
          <div className="ad-content">
            <div className="ad-value">{stats.totalCargo}</div>
            <div className="ad-sub">
              <div><Plane className="ad-mini" /> {stats.airCargo}</div>
              <div><Ship className="ad-mini" /> {stats.seaCargo}</div>
            </div>
          </div>
        </div>

        <div className="ad-card">
          <div className="ad-header">
            <span className="ad-title">Total Revenue</span>
            <DollarSign className="ad-icon" />
          </div>
          <div className="ad-content">
            <div className="ad-value">${stats.totalPaid}</div>
            <p className="ad-note">Pending: ${stats.pendingAmount}</p>
          </div>
        </div>

        <div className="ad-card">
          <div className="ad-header">
            <span className="ad-title">Total Clients</span>
            <Users className="ad-icon" />
          </div>
          <div className="ad-content">
            <div className="ad-value">{stats.totalClients}</div>
            <p className="ad-note">Repeat Clients: {stats.repeatClients}</p>
          </div>
        </div>

        <div className="ad-card">
          <div className="ad-header">
            <span className="ad-title">Pending Payments</span>
            <AlertCircle className="ad-icon" />
          </div>
          <div className="ad-content">
            <div className="ad-value">${stats.pendingAmount}</div>
          </div>
        </div>
      </div>

      <div className="ad-charts">
        <div className="ad-chart-card">
          <div className="ad-chart-title">Monthly Cargo Distribution</div>
          <BarChart width={500} height={300} data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="airCargo" fill="#8884d8" name="Air Cargo" />
            <Bar dataKey="seaCargo" fill="#82ca9d" name="Sea Cargo" />
          </BarChart>
        </div>

        <div className="ad-chart-card">
          <div className="ad-chart-title">Revenue Trend</div>
          <LineChart width={500} height={300} data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
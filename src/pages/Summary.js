import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/useDataStore';
import { Card } from '../components/ui/card';
import  BarChart  from '../components/charts/BarChart';
import  LineChart  from '../components/charts/LineChart';
import  PieChart  from '../components/charts/PieChart';
import { Package, Plane, Ship, Users, RefreshCw, DollarSign } from 'lucide-react';
import Login from './Login';


const Summary = () => {
  const { user } = useAuthStore();
  const { dashboardMetrics, monthlyData, fetchDashboardMetrics } = useDataStore();

  const location = user?.role === 'admin' ? 'All' : user?.location || '';
//   const [cargoCount, setCargoCount] = useState(0);
//   const [clientCount, setClientCount] = useState(0);

  useEffect(() => {
    fetchDashboardMetrics()
    //   .then(response => response.json())
    //   .then((data) => {
    //     if(!data){
    //         console.warn("No data returned from fetchDashboardMetrics.");
    //         return;
    //     }
    //     console.log("Dashboard Metrics: ", data);

    //     setCargoCount(data.cargoCount || 0);
    //     setClientCount(data.clientCount || 0);
    //   });
    //   catch((error)=>{
    //     console.error("Error fetching dashboard metrics: ", error);
    //   });
  }, [location]);  
  
  // If data hasn't loaded yet
  if (!dashboardMetrics) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  const transportModeData = [
    { name: 'Air', value: dashboardMetrics.cargoShipped.air.overall },
    { name: 'Sea', value: dashboardMetrics.cargoShipped.sea.overall },
    //{ name: 'Road', value: dashboardMetrics.roadCount },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <Card title="Total Cargo Shipped" value={dashboardMetrics.cargoShipped.air.overall + dashboardMetrics.cargoShipped.sea.overall} subtitle="All time" icon={<Package size={24} className="text-blue-600" />} />
        <Card title="Air Shipments" value={dashboardMetrics.cargoShipped.air.overall} subtitle={`${dashboardMetrics.cargoShipped.air.monthly} this month`} icon={<Plane size={24} className="text-blue-600" />} />
        <Card title="Sea Shipments" value={dashboardMetrics.cargoShipped.sea.overall} subtitle={`${dashboardMetrics.cargoShipped.sea.monthly} this month`} icon={<Ship size={24} className="text-blue-600" />} />
        <Card title="Total Clients" value={dashboardMetrics.clients.overall.total} subtitle={`${dashboardMetrics.clients.monthly.total} new this month`} icon={<Users size={24} className="text-blue-600" />} />
        <Card title="Repeating Clients" value={dashboardMetrics.clients.overall.repeating} subtitle={`${Math.round((dashboardMetrics.clients.overall.repeating / dashboardMetrics.clients.overall.total) * 100)}% of total clients`} icon={<RefreshCw size={24} className="text-blue-600" />} />
        <Card title="Total Revenue" value={`$${dashboardMetrics.revenue.overall.toLocaleString()}`} subtitle="All time" icon={<DollarSign size={24} className="text-blue-600" />} />
        <Card title="Monthly Revenue" value={`$${dashboardMetrics.revenue.monthly.toLocaleString()}`} subtitle="Current month" icon={<DollarSign size={24} className="text-blue-600" />} />
        <Card title="Pending Payments" value={`$${dashboardMetrics.payments.totalPending.toLocaleString()}`} subtitle="Outstanding balance" icon={<DollarSign size={24} className="text-blue-600" />} />
        {/* <p>Total Cargo: {cargoCount}</p>
        <p>Total Clients: {clientCount}</p> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BarChart title="Monthly Shipments" data={monthlyData} xDataKey="month" bars={[
            { dataKey: 'air', fill: '#3b82f6', name: 'Air Shipments' }, 
            { dataKey: 'sea', fill: '#10b981', name: 'Sea Shipments' },
        ]} />

        <LineChart title="Monthly Revenue" data={monthlyData} xDataKey="month" lines={[
            { dataKey: 'revenue', stroke: '#3b82f6', name: 'Revenue ($)' },
        ]} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PieChart title="Transport Mode Distribution" data={transportModeData} dataKey="value" nameKey="name" colors={['#3b82f6','#10b981']}/>
        <LineChart title="Client Acquisition" data={monthlyData} xDataKey="month" lines={[
            { dataKey: 'clients', stroke: '#3b82f6', name: 'New Clients' }, 
            { dataKey: 'repeatingClients', stroke: '#10b981', name: 'Repeating Clients' }
        ]} />
      </div>
    </div>
  );
};

export default Summary;
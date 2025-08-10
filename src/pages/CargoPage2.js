import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/useDataStore';
import { format } from 'date-fns';
import { Plus, Search } from 'lucide-react';

const CargoPage2 = () => {
  const { user } = useAuthStore();
  const { cargo, clients, fetchCargo, fetchClients, addCargo } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCargo, setNewCargo] = useState({
    clientId: '',
    transportMode: 'AIR',
    measureUnit: 'WEIGHT',
    measureValue: 0,
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
    paymentStatus: 'UNPAID'
  });

  const location = user?.role === 'admin' ? 'All' : user?.location || '';

  useEffect(() => {
    fetchCargo(location);
    fetchClients(location);
  }, [fetchCargo, fetchClients, location]);

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor('cargoNumber', {
      header: 'Cargo #',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('trackingNumber', {
      header: 'Tracking #',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('clientId', {
      header: 'Client',
      cell: info => {
        const client = clients.find(c => c.id === info.getValue());
        return client ? client.name : 'Unknown';
      },
    }),
    columnHelper.accessor('transportMode', {
      header: 'Transport Mode',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('measureUnit', {
      header: 'Measure Unit',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('measureValue', {
      header: 'Measure Value',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('totalAmount', {
      header: 'Total Amount',
      cell: info => `$${info.getValue().toLocaleString()}`,
    }),
    columnHelper.accessor('paymentStatus', {
      header: 'Payment Status',
      cell: info => {
        const status = info.getValue();
        let color = 'bg-gray-100 text-gray-800';

        if (status === 'PAID') {
          color = 'bg-green-100 text-green-800';
        } else if (status === 'PARTIAL') {
          color = 'bg-yellow-100 text-yellow-800';
        } else if (status === 'UNPAID') {
          color = 'bg-red-100 text-red-800';
        }

        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
            {status}
          </span>
        );
      },
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created At',
      cell: info => format(new Date(info.getValue()), 'MMM dd, yyyy'),
    }),
  ];

  const filteredCargo = cargo.filter(c => {
    const client = clients.find(client => client.id === c.clientId);
    const clientName = client ? client.name.toLowerCase() : '';

    return (
      c.cargoNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clientName.includes(searchTerm.toLowerCase())
    );
  });

  const handleAddCargo = (e) => {
    e.preventDefault();

    if (newCargo.clientId && newCargo.totalAmount > 0) {
      const client = clients.find(c => c.id === newCargo.clientId);

      if (client) {
        const pendingAmount = newCargo.totalAmount - newCargo.paidAmount;

        let paymentStatus;
        if (newCargo.paidAmount === 0) {
          paymentStatus = 'UNPAID';
        } else if (newCargo.paidAmount === newCargo.totalAmount) {
          paymentStatus = 'PAID';
        } else {
          paymentStatus = 'PARTIAL';
        }

        addCargo({
          ...newCargo,
          pendingAmount,
          paymentStatus,
          location: client.location
        });

        setNewCargo({
          clientId: '',
          transportMode: 'AIR',
          measureUnit: 'WEIGHT',
          measureValue: 0,
          totalAmount: 0,
          paidAmount: 0,
          pendingAmount: 0,
          paymentStatus: 'UNPAID'
        });

        setShowAddForm(false);
      }
    }
  };

  const handleTotalAmountChange = (amount) => {
    setNewCargo(prev => {
      const paidAmount = prev.paidAmount;
      return {
        ...prev,
        totalAmount: amount,
        pendingAmount: amount - paidAmount
      };
    });
  };

  const handlePaidAmountChange = (amount) => {
    setNewCargo(prev => {
      const totalAmount = prev.totalAmount;
      const paidAmount = Math.min(amount, totalAmount);
      return {
        ...prev,
        paidAmount,
        pendingAmount: totalAmount - paidAmount
      };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Cargo Management</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Add Cargo
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="mb-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search cargo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <DataTable
          data={filteredCargo}
          columns={columns}
        />
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Cargo</h2>

            <form onSubmit={handleAddCargo}>
              <div className="mb-4">
                <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-1">
                  Client
                </label>
                <select
                  id="clientId"
                  value={newCargo.clientId}
                  onChange={(e) => setNewCargo({ ...newCargo, clientId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="transportMode" className="block text-sm font-medium text-gray-700 mb-1">
                  Transport Mode
                </label>
                <select
                  id="transportMode"
                  value={newCargo.transportMode}
                  onChange={(e) => setNewCargo({ ...newCargo, transportMode: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="AIR">Air</option>
                  <option value="SEA">Sea</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="measureUnit" className="block text-sm font-medium text-gray-700 mb-1">
                  Measure Unit
                </label>
                <select
                  id="measureUnit"
                  value={newCargo.measureUnit}
                  onChange={(e) => setNewCargo({ ...newCargo, measureUnit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="WEIGHT">Weight (kg)</option>
                  <option value="CBM">CBM (m³)</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="measureValue" className="block text-sm font-medium text-gray-700 mb-1">
                  Measure Value
                </label>
                <input
                  id="measureValue"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newCargo.measureValue}
                  onChange={(e) => setNewCargo({ ...newCargo, measureValue: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Total Amount ($)
                </label>
                <input
                  id="totalAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newCargo.totalAmount}
                  onChange={(e) => handleTotalAmountChange(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="paidAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Paid Amount ($)
                </label>
                <input
                  id="paidAmount"
                  type="number"
                  min="0"
                  max={newCargo.totalAmount}
                  step="0.01"
                  value={newCargo.paidAmount}
                  onChange={(e) => handlePaidAmountChange(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pending Amount ($)
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {(newCargo.totalAmount - newCargo.paidAmount).toFixed(2)}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Cargo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CargoPage2;
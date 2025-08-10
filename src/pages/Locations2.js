import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/useDataStore';
import { format } from 'date-fns';
import { Search } from 'lucide-react';
import './Locations.css';

const Location = () => {
  const { user } = useAuthStore();
  const { cargo, fetchCargo } = useDataStore();
  const [search, setSearch] = useState('');

  const userLocation = user?.role === 'admin' ? 'All' : user?.location || '';

  useEffect(() => {
    fetchCargo(userLocation);
  }, [userLocation]);

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor('cargoNumber', { header: 'Cargo Number' }),
    columnHelper.accessor('trackingNumber', { header: 'Tracking Number' }),
    columnHelper.accessor('transportMode', { header: 'Mode' }),
    columnHelper.accessor('measureUnit', { header: 'Unit' }),
    columnHelper.accessor('measureValue', { header: 'Value' }),
    columnHelper.accessor('paymentStatus', { header: 'Status' }),
    columnHelper.accessor('totalAmount', { header: 'Total' }),
    columnHelper.accessor('location', { header: 'Location' }),
    columnHelper.accessor('createdAt', {
      header: 'Date',
      cell: info => format(new Date(info.getValue()), 'MMM dd, yyyy'),
    }),
  ];

  const filteredCargo = cargo.filter(item =>
    item.cargoNumber.toLowerCase().includes(search.toLowerCase()) ||
    item.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
    item.transportMode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="location-page">
      <div className="location-header">
        <h2 className="text-xl font-bold">Cargo at {userLocation}</h2>
        <div className="search-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by cargo or mode"
            className="search-input"
          />
        </div>
      </div>

      <div className="location-table">
        <DataTable
          data={filteredCargo}
          columns={columns}
        />
      </div>
    </div>
  );
};

export default Location;

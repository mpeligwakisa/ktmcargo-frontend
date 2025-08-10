import { format, subMonths } from 'date-fns';

// Mock Locations
export const locations = [
  { id: '1', name: 'New York' },
  { id: '2', name: 'Los Angeles' },
  { id: '3', name: 'Chicago' },
  { id: '4', name: 'Miami' },
  { id: '5', name: 'Houston' }
];

// Mock Users
export const users = [
  { id: '1', name: 'Admin User', email: 'admin@logistics.com', role: 'admin', location: 'All' },
  { id: '2', name: 'New York Agent', email: 'ny@logistics.com', role: 'user', location: 'New York' },
  { id: '3', name: 'LA Agent', email: 'la@logistics.com', role: 'user', location: 'Los Angeles' },
  { id: '4', name: 'Chicago Agent', email: 'chicago@logistics.com', role: 'user', location: 'Chicago' },
  { id: '5', name: 'Miami Agent', email: 'miami@logistics.com', role: 'user', location: 'Miami' },
  { id: '6', name: 'Houston Agent', email: 'houston@logistics.com', role: 'user', location: 'Houston' }
];

// Generate mock clients (30 clients)
export const generateClients = () => {
  const clients = [];
  const availableLocations = ['New York', 'Los Angeles', 'Chicago', 'Miami', 'Houston'];

  for (let i = 1; i <= 30; i++) {
    const locationIndex = Math.floor(Math.random() * availableLocations.length);
    const createdDate = subMonths(new Date(), Math.floor(Math.random() * 12));

    clients.push({
      id: i.toString(),
      name: `Client ${i}`,
      email: `client${i}@example.com`,
      phone: `+1-555-${100 + i}`,
      location: availableLocations[locationIndex],
      createdAt: createdDate.toISOString(),
      isRepeating: Math.random() > 0.7 // 30% chance of being a repeating client
    });
  }

  return clients;
};

// Generate mock cargo shipments (50 shipments)
export const generateCargo = (clients) => {
  const cargo = [];

  for (let i = 1; i <= 50; i++) {
    const clientIndex = Math.floor(Math.random() * clients.length);
    const client = clients[clientIndex];
    const totalAmount = Math.floor(Math.random() * 10000) + 1000;
    const paidAmount = Math.random() > 0.3 ? totalAmount : Math.floor(Math.random() * totalAmount);
    const pendingAmount = totalAmount - paidAmount;
    const createdDate = subMonths(new Date(), Math.floor(Math.random() * 12));

    let paymentStatus;
    if (paidAmount === totalAmount) {
      paymentStatus = 'PAID';
    } else if (paidAmount === 0) {
      paymentStatus = 'UNPAID';
    } else {
      paymentStatus = 'PARTIAL';
    }

    cargo.push({
      id: i.toString(),
      clientId: client.id,
      cargoNumber: `CARGO-${10000 + i}`,
      trackingNumber: `TRK-${100000 + i}`,
      transportMode: Math.random() > 0.5 ? 'AIR' : 'SEA',
      measureUnit: Math.random() > 0.5 ? 'WEIGHT' : 'CBM',
      measureValue: Math.floor(Math.random() * 1000) + 10,
      totalAmount,
      paidAmount,
      pendingAmount,
      paymentStatus,
      location: client.location,
      createdAt: createdDate.toISOString()
    });
  }

  return cargo;
};

// Generate monthly data for charts
export const generateMonthlyData = () => {
  const data = [];

  for (let i = 0; i < 12; i++) {
    const date = subMonths(new Date(), i);
    data.push({
      month: format(date, 'MMM yyyy'),
      air: Math.floor(Math.random() * 30) + 5,
      sea: Math.floor(Math.random() * 20) + 10,
      revenue: Math.floor(Math.random() * 50000) + 10000,
      clients: Math.floor(Math.random() * 15) + 5,
      repeatingClients: Math.floor(Math.random() * 8) + 2
    });
  }

  // Reverse to get chronological order
  return data.reverse();
};

// Generate dashboard metrics
export const generateDashboardMetrics = (location = 'All') => {
  const mockClients = generateClients();
  const mockCargo = generateCargo(mockClients);

  // Filter by location if not admin
  const filteredCargo = location === 'All'
    ? mockCargo
    : mockCargo.filter(c => c.location === location);

  const filteredClients = location === 'All'
    ? mockClients
    : mockClients.filter(c => c.location === location);

  // Get current month cargos
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentMonthCargo = filteredCargo.filter(c => {
    const date = new Date(c.createdAt);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const currentMonthClients = filteredClients.filter(c => {
    const date = new Date(c.createdAt);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  // Calculate metrics
  const airMonthly = currentMonthCargo.filter(c => c.transportMode === 'AIR').length;
  const airOverall = filteredCargo.filter(c => c.transportMode === 'AIR').length;
  const seaMonthly = currentMonthCargo.filter(c => c.transportMode === 'SEA').length;
  const seaOverall = filteredCargo.filter(c => c.transportMode === 'SEA').length;

  const totalPaid = filteredCargo.reduce((sum, c) => sum + c.paidAmount, 0);
  const totalPending = filteredCargo.reduce((sum, c) => sum + c.pendingAmount, 0);

  const clientsMonthly = currentMonthClients.length;
  const clientsOverall = filteredClients.length;
  const repeatingClientsMonthly = currentMonthClients.filter(c => c.isRepeating).length;
  const repeatingClientsOverall = filteredClients.filter(c => c.isRepeating).length;

  const revenueMonthly = currentMonthCargo.reduce((sum, c) => sum + c.paidAmount, 0);
  const revenueOverall = totalPaid;

  return {
    cargoShipped: {
      air: {
        monthly: airMonthly,
        overall: airOverall
      },
      sea: {
        monthly: seaMonthly,
        overall: seaOverall
      }
    },
    payments: {
      totalPaid,
      totalPending
    },
    clients: {
      monthly: {
        total: clientsMonthly,
        repeating: repeatingClientsMonthly
      },
      overall: {
        total: clientsOverall,
        repeating: repeatingClientsOverall
      }
    },
    revenue: {
      monthly: revenueMonthly,
      overall: revenueOverall
    }
  };
};

// Initialize mock data
export const mockClients = generateClients();
export const mockCargo = generateCargo(mockClients);
export const mockMonthlyData = generateMonthlyData();
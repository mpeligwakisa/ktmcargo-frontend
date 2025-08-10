import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);

  const fetchDashboardMetrics = (location) => {
    fetch(`http://127.0.0.1:8081/api/dashboard?location=${location}`)
      .then((response) => response.json())
      .then((data) => {
        setDashboardMetrics(data.index);
        setMonthlyData(data.monthlyData);
      });
  };

  return (
    <DataContext.Provider value={{ dashboardMetrics, monthlyData, fetchDashboardMetrics }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../src/store/authStore';
import { Layout } from '../src/components/layout/Layout';
import { Login } from '../src/pages/Login';
import  Summary  from '../src/pages/Summary';
import  Clients  from '../src/pages/Clients';
import  CargoPage  from '../src/pages/CargoPage';
import  UserManagement  from '../src/pages/UserManagement';
//import UsersPage from './pages/UserPage';
import  Payments  from '../src/pages/Payments';
import Locations from '../src/pages/Locations';
import Location from './pages/Locations2';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Protected route component
const ProtectedRoute = ({ children, requiredRole }) => {
  // const { isAuthenticated } = useAuthStore();
  //const { isAuthenticated, role:userRole } = useAuthStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userRole = useAuthStore((state) => state.user?.role);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (requiredRole && userRole !== requiredRole) {
    return <div>Unauthorized</div>;
  }
  return <>{children}</>;
};

function App() {
  return (
    <>
      <Routes>
        
        {/* Public Route */}
        <Route path="/login" element={<Login onLoginSuccess={() => window.location.href = "/"}/>} />

        {/* Protected Routes (require login) */}
        <Route
          path="/"
          element={

              <Layout />
          }
        >
          <Route index element={<Summary/>} />
          {/* <Route path="dashboard" element={<Dashboard />} /> */}
          <Route path="clients" element={<Clients />} />
          <Route path="cargo" element={<CargoPage />} />
          <Route path="payments" element={<Payments />} />
          <Route path="location" element={<Locations />} />
          <Route 
            path="userManagement" 
            element={
              <ProtectedRoute requiredRole="admin"> 
                <UserManagement /> 
              </ProtectedRoute> 
            } 
          />
            



          {/* Future Placeholder Routes */}
          <Route path="transportation" element={<div className="p-4">Transportation (Coming Soon)</div>} />
          <Route path="reports" element={<div className="p-4">Reports (Coming Soon)</div>} />
          <Route path="settings" element={<div className="p-4">Settings (Coming Soon)</div>} />
        </Route>

        {/* Catch all and redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

       {/* Toasts work everywhere */}
       <ToastContainer
       position="top-right"
       autoClose={3000}
       hideProgressBar={false}
       newestOnTop
       closeOnClick
       pauseOnFocusLoss
       draggable
       pauseOnHover
     />
    </>    
  );
}

export default App;
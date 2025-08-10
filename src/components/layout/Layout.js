import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import './Layout.css';
import { useLocationStore } from '../../store/useLocationStore';

export const Layout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  //const location = useLocationStore();
  const [menuItems, setMenuItems] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const updateSidebarState = () => {
      if (window.innerWidth <= 1024) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };
    window.addEventListener('resize', updateSidebarState);
    return () => window.removeEventListener('resize', updateSidebarState);
  }, []);

  useEffect(() => {
    if (!user || !user.role) {
      setMenuItems([]);
      return;
    }

    const adminMenu = [
      { label: 'Dashboard', path: '/', icon: '📄' },
      { label: 'Clients', path: '/clients', icon: '👤' },
      { label: 'Cargo', path: '/cargo', icon: '✈️' },
      { label: 'Payments', path: '/payments', icon: '💰' },
      { label: 'Settings', path: '/settings', icon: '⚙️' },
      { label: 'Location', path: '/locations', icon: '📍' },
      { label: 'Transportation', path: '/transportation', icon: '🚚' },
      { label: 'Reports', path: '/reports', icon: '📊' },
      { label: 'User Management', path: '/userManagement', icon: '🧑‍🤝‍🧑' },
    ];

    const userMenu = [
      { label: 'Dashboard', path: '/', icon: '📄' },
      { label: 'Clients', path: '/clients', icon: '👤' },
      { label: 'Cargo', path: '/cargo', icon: '✈️' },
      { label: 'Payments', path: '/payments', icon: '💰' },
      { label: 'Transportation', path: '/transportation', icon: '🚚' },
      { label: 'Reports', path: '/reports', icon: '📊' },
    ];

    setMenuItems(user.role === 'admin' ? adminMenu : userMenu);
  }, [user]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className={`layout-container ${sidebarCollapsed ? 'sidebarCollapsed' : ''}`}>
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <span className="logo-text">LogiTrack</span>
          <button className="sidebar-close-btn" onClick={() => setSidebarCollapsed(true)}>
            &times;
          </button>
        </div>

        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li
              key={item.path}
              onClick={() => {
                navigate(item.path);
                if (window.innerWidth <= 1024) setSidebarCollapsed(true);
              }}
              className={isActive(item.path) ? 'active' : ''}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
            </li>
          ))}
        </ul>

        <div className="sidebar-footer">
          <div className="logout-button" onClick={handleLogout}>
            <span className="menu-icon">↩️</span>
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {!sidebarCollapsed && window.innerWidth <= 1024 && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Main Content */}
      <div className="main-content">
        <header className="main-header">
          {sidebarCollapsed && (
          <div className="toggle-sidebar">
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>☰</button>
          </div>
          )}
          <div className="user-info">
            <span className="notification-icon">🔔</span>
            <div className="user-profile">
              <span className="user-icon">👤</span>
              <span className="user-name">{user?.name}</span>
            </div>
          </div>
        </header>

        <div className="content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import SuperAdminLayout from './pages/super-admin/SuperAdminLayout';
import CompanyPortal from './pages/CompanyPortal';
import Login from './pages/Login';

function App() {
  const [currentApp, setCurrentApp] = useState(() => {
    return sessionStorage.getItem('currentApp') || 'portal';
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('isAuthenticated') === 'true';
  });

  const handleSetCurrentApp = (appId) => {
    setCurrentApp(appId);
    sessionStorage.setItem('currentApp', appId);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('isAuthenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('isAuthenticated');
    handleSetCurrentApp('portal');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  if (currentApp === 'portal') {
    return <CompanyPortal onSelectApp={handleSetCurrentApp} onLogout={handleLogout} />;
  }

  if (currentApp === 'nagarsevak') {
    return <SuperAdminLayout onBackToPortal={() => handleSetCurrentApp('portal')} onLogout={handleLogout} />;
  }

  return null;
}

export default App;

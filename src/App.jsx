import React, { useState, useEffect } from 'react';
import SuperAdminLayout from './pages/super-admin/SuperAdminLayout';
import CompanyPortal from './pages/CompanyPortal';

function App() {
  const [currentApp, setCurrentApp] = useState(() => {
    return localStorage.getItem('currentApp') || 'portal';
  });

  const handleSetCurrentApp = (appId) => {
    setCurrentApp(appId);
    localStorage.setItem('currentApp', appId);
  };

  if (currentApp === 'portal') {
    return <CompanyPortal onSelectApp={handleSetCurrentApp} />;
  }

  if (currentApp === 'nagarsevak') {
    return <SuperAdminLayout onBackToPortal={() => handleSetCurrentApp('portal')} />;
  }

  return null;
}

export default App;

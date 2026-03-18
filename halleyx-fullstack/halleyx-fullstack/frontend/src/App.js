import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { AppShell } from './components/Layout/AppShell';
import { DashboardPage } from './components/Dashboard/DashboardPage';
import { DashboardConfigPage } from './components/Dashboard/DashboardConfigPage';
import { CustomerOrdersPage } from './components/CustomerOrder/CustomerOrdersPage';
import { ToastContainer } from './components/Layout/SharedUI';
import { useApp } from './context/AppContext';

function AppInner() {
  const [page, setPage] = useState('dashboard');
  const { saveDashboard } = useApp();

  const handleSaveDashboard = (layout) => {
    saveDashboard(layout);
    setPage('dashboard');
  };

  return (
    <AppShell page={page} onNavigate={setPage}>
      {page === 'dashboard' && <DashboardPage onConfigure={() => setPage('config')} />}
      {page === 'config' && <DashboardConfigPage onSave={handleSaveDashboard} onBack={() => setPage('dashboard')} />}
      {page === 'orders' && <CustomerOrdersPage />}
      <ToastContainer />
    </AppShell>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}

import { useEffect, useState } from 'react';
import { MobileNav } from '../components/layout/MobileNav';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';
import { AttendancePage } from '../features/attendance/AttendancePage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { FinancePage } from '../features/finance/FinancePage';
import { InventoryPage } from '../features/inventory/InventoryPage';
import { SettingsPage } from '../features/settings/SettingsPage';
import { TeamsPage } from '../features/teams/TeamsPage';
import { WorkersPage } from '../features/workers/WorkersPage';
import { LoginPage } from '../features/auth/LoginPage';
import { SetPasswordPage } from '../features/auth/SetPasswordPage';
import { ReportsPage } from '../features/reports/ReportsPage';
import { AuditLogsPage } from '../features/auditLogs/AuditLogsPage';
import { UsersPage } from '../features/users/UsersPage';
import { clearStoredAuth, getStoredAuth } from '../features/auth/authStorage';
import { LoginState } from '../types/api';
import { PageKey } from './navigation';

export function App() {
  const [auth, setAuth] = useState<LoginState | null>(() => getStoredAuth());
  const [activePage, setActivePage] = useState<PageKey>('dashboard');

  const isSetPasswordRoute =
    window.location.pathname.toLowerCase() === '/set-password';

  useEffect(() => {
    function handleAuthExpired() {
      clearStoredAuth();
      setAuth(null);
      setActivePage('dashboard');
    }

    window.addEventListener('church-admin-auth-expired', handleAuthExpired);

    return () => {
      window.removeEventListener('church-admin-auth-expired', handleAuthExpired);
    };
  }, []);

  if (isSetPasswordRoute) {
    return <SetPasswordPage onLogin={setAuth} />;
  }

  if (!auth) {
    return <LoginPage onLogin={setAuth} />;
  }

  function logout() {
    clearStoredAuth();
    setAuth(null);
    setActivePage('dashboard');
  }

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      <main className="main">
        <Topbar user={auth.user} onLogout={logout} />

        <div className="content">
          {activePage === 'dashboard' && <DashboardPage />}
          {activePage === 'attendance' && <AttendancePage />}
          {activePage === 'workers' && <WorkersPage />}
          {activePage === 'teams' && <TeamsPage />}
          {activePage === 'finance' && <FinancePage />}
          {activePage === 'inventory' && <InventoryPage />}
          {activePage === 'reports' && <ReportsPage />}
          {activePage === 'auditLogs' && <AuditLogsPage />}
          {activePage === 'users' && <UsersPage />}
          {activePage === 'settings' && <SettingsPage />}
        </div>
      </main>

      <MobileNav activePage={activePage} onNavigate={setActivePage} />
    </div>
  );
}
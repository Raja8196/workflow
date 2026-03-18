import React, { useState } from 'react';
import { Icons } from './SharedUI';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', Icon: Icons.Dashboard },
  { id: 'orders', label: 'Customer Orders', Icon: Icons.Orders },
];

export function AppShell({ page, onNavigate, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="app-shell">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }} />
      )}

      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-mark">H</div>
          <div className="logo-text">Halle<span>yx</span></div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section-label">Main Menu</div>
          {navItems.map(({ id, label, Icon }) => (
            <div key={id} className={`nav-item ${page === id || (page === 'config' && id === 'dashboard') ? 'active' : ''}`}
              onClick={() => { onNavigate(id); setMobileOpen(false); }}>
              <span className="nav-icon"><Icon /></span>
              {label}
            </div>
          ))}
        </nav>
        <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
            <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 3 }}>Halleyx Platform</div>
            Dashboard Builder v1.0
          </div>
        </div>
      </aside>

      <div className="main-content">
        <header className="top-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="btn btn-ghost btn-icon" style={{ display: 'none' }}
              onClick={() => setMobileOpen(o => !o)}
              id="mobile-menu-btn">
              <Icons.Menu />
            </button>
            <div className="top-bar-title">
              {page === 'dashboard' ? 'Dashboard' : page === 'config' ? 'Configure Dashboard' : 'Customer Orders'}
            </div>
          </div>
          <div className="top-bar-actions">
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#54bd95,#6c8fff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>A</div>
          </div>
        </header>
        <main className="page-content">{children}</main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

/* ===== TOAST ===== */
export function ToastContainer() {
  const { state } = useApp();
  return (
    <div className="toast-container">
      {state.toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span>{t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

/* ===== CONFIRM DIALOG ===== */
export function ConfirmDialog({ title, desc, onConfirm, onCancel, danger = true }) {
  return (
    <div className="modal-backdrop">
      <div className="confirm-dialog">
        <div className="confirm-icon">{danger ? '🗑' : '⚠'}</div>
        <div className="confirm-title">{title}</div>
        <div className="confirm-desc">{desc}</div>
        <div className="confirm-actions">
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>
            {danger ? 'Delete' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===== NUMBER INPUT ===== */
export function NumberInput({ value, onChange, min = 0, max = 999, step = 1 }) {
  return (
    <div className="number-input-wrap">
      <button className="num-btn" type="button" onClick={() => onChange(Math.max(min, value - step))}>−</button>
      <input
        type="number" className="form-control"
        value={value}
        min={min} max={max}
        onChange={e => onChange(Math.max(min, Math.min(max, Number(e.target.value))))}
        style={{ borderRadius: 0 }}
      />
      <button className="num-btn" type="button" onClick={() => onChange(Math.min(max, value + step))}>+</button>
    </div>
  );
}

/* ===== MULTISELECT ===== */
export function MultiSelect({ options, value = [], onChange, placeholder = 'Select...' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    function h(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const toggle = opt => {
    if (value.includes(opt)) onChange(value.filter(v => v !== opt));
    else onChange([...value, opt]);
  };
  return (
    <div className="multiselect-wrap" ref={ref}>
      <div className="multiselect-display" onClick={() => setOpen(o => !o)}>
        {value.length === 0 && <span className="ms-placeholder">{placeholder}</span>}
        {value.map(v => (
          <span key={v} className="ms-tag">
            {v}
            <button type="button" onClick={e => { e.stopPropagation(); toggle(v); }}>×</button>
          </span>
        ))}
      </div>
      {open && (
        <div className="ms-dropdown">
          {options.map(opt => (
            <div key={opt} className={`ms-option ${value.includes(opt) ? 'selected' : ''}`} onClick={() => toggle(opt)}>
              <span style={{ fontSize: 12 }}>{value.includes(opt) ? '☑' : '☐'}</span>
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ===== COLOR PICKER ===== */
export function ColorPickerInput({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const [hexInput, setHexInput] = useState(value);
  useEffect(() => setHexInput(value), [value]);
  useEffect(() => {
    function h(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const presets = ['#54bd95','#6c8fff','#f7c35f','#f06a6a','#a78bfa','#38bdf8','#fb923c','#ec4899','#10b981','#3b82f6','#f59e0b','#ef4444'];
  return (
    <div className="color-picker-wrap" ref={ref}>
      <div className="color-input-row">
        <div className="color-swatch" style={{ background: value }} onClick={() => setOpen(o => !o)} />
        <input
          className="form-control"
          value={hexInput}
          onChange={e => {
            setHexInput(e.target.value);
            if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) onChange(e.target.value);
          }}
          placeholder="#000000"
        />
      </div>
      {open && (
        <div className="color-dropdown">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 6 }}>
            {presets.map(c => (
              <div key={c} onClick={() => { onChange(c); setHexInput(c); setOpen(false); }}
                style={{ width: 28, height: 28, background: c, borderRadius: 6, cursor: 'pointer', border: c === value ? '2px solid #fff' : '2px solid transparent', transition: 'transform 0.15s' }}
                onMouseEnter={e => e.target.style.transform = 'scale(1.1)'}
                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
              />
            ))}
          </div>
          <input type="color" value={value} onChange={e => { onChange(e.target.value); setHexInput(e.target.value); }}
            style={{ width: '100%', height: 36, marginTop: 10, borderRadius: 6, border: 'none', cursor: 'pointer', background: 'none' }}
          />
        </div>
      )}
    </div>
  );
}

/* ===== BADGE ===== */
export function StatusBadge({ status }) {
  const cls = status === 'Completed' ? 'badge-completed' : status === 'In progress' ? 'badge-inprogress' : 'badge-pending';
  return <span className={`badge ${cls}`}>{status}</span>;
}

/* ===== CONTEXT MENU ===== */
export function ContextMenu({ x, y, onEdit, onDelete, onClose }) {
  const ref = useRef();
  useEffect(() => {
    function h(e) { if (ref.current && !ref.current.contains(e.target)) onClose(); }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);
  return (
    <div className="ctx-menu" ref={ref} style={{ top: y, left: x, position: 'fixed' }}>
      <div className="ctx-item" onClick={() => { onEdit(); onClose(); }}>
        <span>✏</span> Edit
      </div>
      <div className="ctx-item danger" onClick={() => { onDelete(); onClose(); }}>
        <span>🗑</span> Delete
      </div>
    </div>
  );
}

/* ===== PAGINATION ===== */
export function Pagination({ total, page, perPage, onPage }) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="pagination">
      <button className="page-btn" onClick={() => onPage(page - 1)} disabled={page === 1}>‹</button>
      {pages.map(p => (
        <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => onPage(p)}>{p}</button>
      ))}
      <button className="page-btn" onClick={() => onPage(page + 1)} disabled={page === totalPages}>›</button>
    </div>
  );
}

/* ===== SVG ICONS ===== */
export const Icons = {
  Dashboard: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  Orders: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="2"/><path d="M9 12h6M9 16h4"/>
    </svg>
  ),
  Settings: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  ),
  BarChart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="14" width="4" height="7"/><rect x="10" y="8" width="4" height="13"/><rect x="17" y="4" width="4" height="17"/>
    </svg>
  ),
  LineChart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="22 12 18 8 13 13 9 9 2 16"/>
    </svg>
  ),
  PieChart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21.21 15.89A10 10 0 118 2.83"/><path d="M22 12A10 10 0 0012 2v10z"/>
    </svg>
  ),
  AreaChart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="22 12 18 8 13 13 9 9 2 16"/><path d="M2 16v6h20v-6"/>
    </svg>
  ),
  ScatterPlot: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="7" cy="17" r="2"/><circle cx="17" cy="7" r="2"/><circle cx="13" cy="13" r="2"/><circle cx="5" cy="9" r="2"/>
    </svg>
  ),
  Table: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>
    </svg>
  ),
  KPI: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
    </svg>
  ),
  Drag: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/>
      <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
      <circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/>
    </svg>
  ),
  Menu: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M3 12h18M3 6h18M3 18h18"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
  ),
  ChevronDown: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 9l6 6 6-6"/></svg>
  ),
};

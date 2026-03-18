import React, { useState } from 'react';
import { getTableRow, computeKPI, sortOrders, applyFilters } from '../../utils/helpers';
import { StatusBadge, Pagination } from '../Layout/SharedUI';

export function TableWidget({ widget, orders }) {
  const [page, setPage] = useState(1);
  const cols = widget.columns || ['Customer name', 'Product', 'Status', 'Total amount'];
  const perPage = widget.pagination || 10;
  const fontSize = widget.fontSize || 14;
  const headerBg = widget.headerBg || '#54bd95';

  let filtered = applyFilters(orders, widget.applyFilter ? widget.filters : []);
  filtered = sortOrders(filtered, widget.sortBy);

  const total = filtered.length;
  const paginated = widget.pagination ? filtered.slice((page - 1) * perPage, page * perPage) : filtered;

  if (!cols.length) {
    return <div style={{ padding: 16, color: 'var(--text-muted)', fontSize: 13 }}>No columns selected. Configure this widget to choose columns.</div>;
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize }}>
          <thead>
            <tr style={{ background: headerBg }}>
              {cols.map(c => (
                <th key={c} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, fontSize: fontSize - 1, color: '#0a0d14', whiteSpace: 'nowrap' }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 && (
              <tr><td colSpan={cols.length} style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)', fontSize: 13 }}>No data</td></tr>
            )}
            {paginated.map((order, ri) => {
              const row = getTableRow(order, cols);
              return (
                <tr key={order.id} style={{ borderBottom: '1px solid var(--border)', background: ri % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                  {row.map((cell, ci) => (
                    <td key={ci} style={{ padding: '8px 12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      {cols[ci] === 'Status' ? <StatusBadge status={cell} /> : cell}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {widget.pagination && total > perPage && (
        <div style={{ padding: '8px 12px' }}>
          <Pagination total={total} page={page} perPage={perPage} onPage={setPage} />
        </div>
      )}
    </div>
  );
}

export function KPIWidget({ widget, orders }) {
  const value = computeKPI(orders, widget.metric || 'Total amount', widget.aggregation || 'Sum', widget.decimalPrecision || 0);
  const isCount = widget.aggregation === 'Count';
  const prefix = (widget.dataFormat === 'Currency' && !isCount) ? '$' : '';

  return (
    <div className="kpi-widget-content">
      <div className="kpi-value">{prefix}{Number(value).toLocaleString()}</div>
      <div className="kpi-label">{widget.metric || 'Total amount'}</div>
      {widget.aggregation && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{widget.aggregation}</div>}
      {widget.description && <div className="kpi-desc">{widget.description}</div>}
    </div>
  );
}

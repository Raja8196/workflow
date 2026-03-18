import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { filterOrdersByDate, DATE_RANGES } from '../../utils/helpers';
import { BarChartWidget, LineChartWidget, AreaChartWidget, ScatterChartWidget, PieChartWidget } from '../Widgets/ChartWidgets';
import { TableWidget, KPIWidget } from '../Widgets/TableKPIWidgets';

function WidgetContent({ widget, orders }) {
  const ROW_H = 80;
  const h = widget.heightRows * ROW_H;
  const style = { height: h, minHeight: h, overflow: 'hidden' };
  switch (widget.type) {
    case 'Bar Chart': return <div style={style}><BarChartWidget widget={widget} orders={orders} /></div>;
    case 'Line Chart': return <div style={style}><LineChartWidget widget={widget} orders={orders} /></div>;
    case 'Area Chart': return <div style={style}><AreaChartWidget widget={widget} orders={orders} /></div>;
    case 'Scatter Plot': return <div style={style}><ScatterChartWidget widget={widget} orders={orders} /></div>;
    case 'Pie Chart': return <div style={style}><PieChartWidget widget={widget} orders={orders} /></div>;
    case 'Table': return <div style={{ height: h, minHeight: h, overflow: 'hidden' }}><TableWidget widget={widget} orders={orders} /></div>;
    case 'KPI Value': return <KPIWidget widget={widget} orders={orders} />;
    default: return null;
  }
}

export function DashboardPage({ onConfigure }) {
  const { state } = useApp();
  const [dateRange, setDateRange] = useState('All time');
  const layout = state.dashboardLayout;
  const orders = filterOrdersByDate(state.orders, dateRange);

  if (!layout.length) {
    return (
      <div>
        <div className="section-header">
          <div>
            <div className="section-title">Dashboard</div>
            <div className="section-subtitle">Your personalized data overview</div>
          </div>
          <button className="btn btn-primary" onClick={onConfigure}>
            ⚙ Configure Dashboard
          </button>
        </div>
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <div className="empty-title">No widgets configured</div>
          <div className="empty-desc">Click "Configure Dashboard" to build your personalized dashboard with charts, tables, and KPI cards.</div>
          <button className="btn btn-primary" style={{ marginTop: 6 }} onClick={onConfigure}>Get Started</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Dashboard</div>
          <div className="section-subtitle">{layout.length} widgets · {orders.length} orders in view</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Show data for</span>
            <select className="form-control" style={{ width: 140 }} value={dateRange} onChange={e => setDateRange(e.target.value)}>
              {DATE_RANGES.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <button className="btn btn-secondary" onClick={onConfigure}>⚙ Configure Dashboard</button>
        </div>
      </div>

      <div className="canvas-grid">
        {layout.map(widget => (
          <div key={widget.id} className={`canvas-widget col-span-${Math.min(widget.widthCols, 12)}`}>
            <div className="canvas-widget-header">
              <div style={{ overflow: 'hidden' }}>
                <div className="canvas-widget-title">{widget.title}</div>
                {widget.description && (
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {widget.description}
                  </div>
                )}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--bg-input)', padding: '2px 8px', borderRadius: 99, flexShrink: 0 }}>
                {widget.type}
              </div>
            </div>
            <div className="canvas-widget-body">
              <WidgetContent widget={widget} orders={orders} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useApp } from '../../context/AppContext';
import { filterOrdersByDate, getDefaultWidgetConfig, DATE_RANGES } from '../../utils/helpers';
import { WidgetSettingsPanel } from '../Widgets/WidgetSettingsPanel';
import { BarChartWidget, LineChartWidget, AreaChartWidget, ScatterChartWidget, PieChartWidget } from '../Widgets/ChartWidgets';
import { TableWidget, KPIWidget } from '../Widgets/TableKPIWidgets';
import { ConfirmDialog, Icons } from '../Layout/SharedUI';

const WIDGET_CATEGORIES = [
  {
    label: 'Charts', icon: '📊',
    items: [
      { type: 'Bar Chart', Icon: Icons.BarChart },
      { type: 'Line Chart', Icon: Icons.LineChart },
      { type: 'Pie Chart', Icon: Icons.PieChart },
      { type: 'Area Chart', Icon: Icons.AreaChart },
      { type: 'Scatter Plot', Icon: Icons.ScatterPlot },
    ],
  },
  {
    label: 'Tables', icon: '📋',
    items: [{ type: 'Table', Icon: Icons.Table }],
  },
  {
    label: 'KPIs', icon: '💡',
    items: [{ type: 'KPI Value', Icon: Icons.KPI }],
  },
];

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
    case 'KPI Value': return <div style={{ padding: '0 2px', minHeight: 60 }}><KPIWidget widget={widget} orders={orders} /></div>;
    default: return null;
  }
}

export function DashboardConfigPage({ onSave, onBack }) {
  const { state, addToast } = useApp();
  const [layout, setLayout] = useState(() => (state.dashboardLayout.length ? [...state.dashboardLayout] : []));
  const [dateRange, setDateRange] = useState('All time');
  const [dragOverCanvas, setDragOverCanvas] = useState(false);
  const [settingsWidget, setSettingsWidget] = useState(null);
  const [deleteWidgetId, setDeleteWidgetId] = useState(null);
  const [expandedCats, setExpandedCats] = useState({ Charts: true, Tables: true, KPIs: true });
  const canvasRef = useRef();
  const dragType = useRef(null);

  const orders = filterOrdersByDate(state.orders, dateRange);

  const handleDragStart = (e, type) => {
    dragType.current = type;
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOverCanvas(false);
    if (!dragType.current) return;
    const cfg = getDefaultWidgetConfig(dragType.current);
    cfg.id = uuidv4();
    setLayout(l => [...l, cfg]);
    dragType.current = null;
    addToast(`${cfg.type} added to canvas`, 'info');
  };

  const handleUpdateWidget = (updated) => {
    setLayout(l => l.map(w => w.id === updated.id ? updated : w));
    setSettingsWidget(null);
    addToast('Widget updated', 'success');
  };

  const handleDeleteWidget = (id) => {
    setLayout(l => l.filter(w => w.id !== id));
    setDeleteWidgetId(null);
    addToast('Widget removed', 'error');
  };

  const handleSave = () => {
    onSave(layout);
    addToast('Dashboard saved successfully!', 'success');
  };

  const toggleCat = cat => setExpandedCats(e => ({ ...e, [cat]: !e[cat] }));

  return (
    <div>
      {/* Config Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="btn btn-secondary" onClick={onBack}>← Back</button>
          <div>
            <div className="section-title" style={{ fontSize: 17 }}>Configure Dashboard</div>
            <div className="section-subtitle">{layout.length} widgets placed</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Show data for</span>
            <select className="form-control" style={{ width: 140 }} value={dateRange} onChange={e => setDateRange(e.target.value)}>
              {DATE_RANGES.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" onClick={handleSave}>
            ✓ Save Configuration
          </button>
        </div>
      </div>

      <div className="config-layout">
        {/* Widget Panel */}
        <div className="widget-panel">
          <div className="widget-panel-title">Widgets</div>
          {WIDGET_CATEGORIES.map(cat => (
            <div key={cat.label} className="widget-category">
              <div className="widget-cat-label" onClick={() => toggleCat(cat.label)}>
                <span>{cat.icon}</span>
                <span style={{ flex: 1 }}>{cat.label}</span>
                <span style={{ fontSize: 12, transition: 'transform 0.2s', transform: expandedCats[cat.label] ? 'rotate(90deg)' : 'none' }}>›</span>
              </div>
              {expandedCats[cat.label] && (
                <div className="widget-cat-items">
                  {cat.items.map(({ type, Icon }) => (
                    <div key={type} className="widget-item"
                      draggable
                      onDragStart={e => handleDragStart(e, type)}>
                      <span style={{ width: 16, height: 16, display: 'flex', alignItems: 'center', color: 'var(--accent)' }}><Icon /></span>
                      {type}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Canvas */}
        <div className="canvas-area"
          ref={canvasRef}
          onDragOver={e => { e.preventDefault(); setDragOverCanvas(true); }}
          onDragLeave={() => setDragOverCanvas(false)}
          onDrop={handleDrop}>
          {layout.length === 0 ? (
            <div className={`canvas-empty ${dragOverCanvas ? 'drag-over' : ''}`}>
              <span style={{ fontSize: 32 }}>📊</span>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Drop widgets here</div>
              <div style={{ fontSize: 13 }}>Drag widgets from the left panel to build your dashboard</div>
            </div>
          ) : (
            <div className="canvas-grid">
              {dragOverCanvas && <div className="drop-placeholder">Drop here</div>}
              {layout.map(widget => (
                <div key={widget.id} className={`canvas-widget col-span-${Math.min(widget.widthCols, 12)}`}>
                  <div className="canvas-widget-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
                      <span className="drag-handle"><Icons.Drag /></span>
                      <span className="canvas-widget-title">{widget.title}</span>
                    </div>
                    <div className="canvas-widget-actions">
                      <div className="widget-action-btn" title="Settings" onClick={() => setSettingsWidget(widget)}>⚙</div>
                      <div className="widget-action-btn delete" title="Delete" onClick={() => setDeleteWidgetId(widget.id)}>🗑</div>
                    </div>
                  </div>
                  <div className="canvas-widget-body">
                    <WidgetContent widget={widget} orders={orders} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      {settingsWidget && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 140 }} onClick={() => setSettingsWidget(null)} />
          <WidgetSettingsPanel
            widget={settingsWidget}
            onUpdate={handleUpdateWidget}
            onClose={() => setSettingsWidget(null)}
          />
        </>
      )}

      {/* Delete Confirm */}
      {deleteWidgetId && (
        <div className="modal-backdrop">
          <ConfirmDialog
            title="Remove Widget"
            desc="Are you sure you want to remove this widget from the dashboard?"
            onConfirm={() => handleDeleteWidget(deleteWidgetId)}
            onCancel={() => setDeleteWidgetId(null)}
          />
        </div>
      )}
    </div>
  );
}

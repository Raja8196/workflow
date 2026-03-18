import React, { useState, useEffect } from 'react';
import { CHART_METRICS, KPI_METRICS, TABLE_COLUMNS, NUMERIC_METRICS } from '../../utils/helpers';
import { NumberInput, MultiSelect, ColorPickerInput } from '../Layout/SharedUI';

const FILTER_OPERATORS = ['equals', 'contains', 'starts with'];
const FILTER_COLUMNS = ['Product', 'Status', 'Created by', 'Customer name'];

export function WidgetSettingsPanel({ widget, onUpdate, onClose }) {
  const [cfg, setCfg] = useState({ ...widget });
  useEffect(() => { setCfg({ ...widget }); }, [widget]);

  const set = (k, v) => setCfg(c => ({ ...c, [k]: v }));

  const addFilter = () => set('filters', [...(cfg.filters || []), { column: 'Status', operator: 'equals', value: '' }]);
  const removeFilter = (i) => set('filters', cfg.filters.filter((_, fi) => fi !== i));
  const updateFilter = (i, k, v) => set('filters', cfg.filters.map((f, fi) => fi === i ? { ...f, [k]: v } : f));

  const isChart = ['Bar Chart', 'Line Chart', 'Area Chart', 'Scatter Plot'].includes(cfg.type);
  const isPie = cfg.type === 'Pie Chart';
  const isTable = cfg.type === 'Table';
  const isKPI = cfg.type === 'KPI Value';

  return (
    <div className={`side-panel open`}>
      <div className="side-panel-header">
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Widget Settings</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{cfg.type}</div>
        </div>
        <div className="close-btn" onClick={onClose}>×</div>
      </div>

      <div className="side-panel-body">
        {/* General */}
        <div className="form-group">
          <label className="form-label">Widget title<span className="required">*</span></label>
          <input className="form-control" value={cfg.title} onChange={e => set('title', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Widget type</label>
          <input className="form-control" value={cfg.type} disabled />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-control" rows={2} value={cfg.description || ''} onChange={e => set('description', e.target.value)} placeholder="Optional description" style={{ resize: 'vertical' }} />
        </div>

        {/* Widget Size */}
        <div className="section-divider">Widget Size</div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Width (Columns)</label>
            <NumberInput value={cfg.widthCols} min={1} max={12} onChange={v => set('widthCols', v)} />
          </div>
          <div className="form-group">
            <label className="form-label">Height (Rows)</label>
            <NumberInput value={cfg.heightRows} min={1} max={20} onChange={v => set('heightRows', v)} />
          </div>
        </div>

        {/* Data Settings */}
        <div className="section-divider">Data Settings</div>

        {isKPI && (
          <>
            <div className="form-group">
              <label className="form-label">Select metric<span className="required">*</span></label>
              <select className="form-control" value={cfg.metric || ''} onChange={e => set('metric', e.target.value)}>
                {KPI_METRICS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Aggregation</label>
              <select className="form-control" value={cfg.aggregation || 'Count'}
                disabled={!NUMERIC_METRICS.includes(cfg.metric)}
                onChange={e => set('aggregation', e.target.value)}>
                {['Sum', 'Average', 'Count'].map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Data format</label>
                <select className="form-control" value={cfg.dataFormat || 'Number'} onChange={e => set('dataFormat', e.target.value)}>
                  <option>Number</option><option>Currency</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Decimal precision</label>
                <NumberInput value={cfg.decimalPrecision || 0} min={0} max={6} onChange={v => set('decimalPrecision', v)} />
              </div>
            </div>
          </>
        )}

        {isChart && (
          <>
            <div className="form-group">
              <label className="form-label">X-Axis data<span className="required">*</span></label>
              <select className="form-control" value={cfg.xAxis || ''} onChange={e => set('xAxis', e.target.value)}>
                {CHART_METRICS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Y-Axis data<span className="required">*</span></label>
              <select className="form-control" value={cfg.yAxis || ''} onChange={e => set('yAxis', e.target.value)}>
                {CHART_METRICS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          </>
        )}

        {isPie && (
          <div className="form-group">
            <label className="form-label">Chart data<span className="required">*</span></label>
            <select className="form-control" value={cfg.chartData || ''} onChange={e => set('chartData', e.target.value)}>
              {['Product', 'Quantity', 'Unit price', 'Total amount', 'Status', 'Created by'].map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
        )}

        {isTable && (
          <>
            <div className="form-group">
              <label className="form-label">Choose columns<span className="required">*</span></label>
              <MultiSelect options={TABLE_COLUMNS} value={cfg.columns || []} onChange={v => set('columns', v)} placeholder="Select columns..." />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Sort by</label>
                <select className="form-control" value={cfg.sortBy || ''} onChange={e => set('sortBy', e.target.value)}>
                  <option value="">None</option>
                  <option>Ascending</option><option>Descending</option><option>Order date</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Pagination</label>
                <select className="form-control" value={cfg.pagination || ''} onChange={e => set('pagination', Number(e.target.value))}>
                  <option value="">None</option>
                  <option value={5}>5</option><option value={10}>10</option><option value={15}>15</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="checkbox-group">
                <input type="checkbox" checked={!!cfg.applyFilter} onChange={e => set('applyFilter', e.target.checked)} />
                <span className="checkbox-label">Apply filter</span>
              </label>
            </div>
            {cfg.applyFilter && (
              <div className="filter-section">
                {(cfg.filters || []).map((f, i) => (
                  <div key={i} className="filter-row">
                    <div>
                      <select className="form-control" value={f.column} onChange={e => updateFilter(i, 'column', e.target.value)}>
                        {FILTER_COLUMNS.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <select className="form-control" value={f.operator} onChange={e => updateFilter(i, 'operator', e.target.value)}>
                        {FILTER_OPERATORS.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <input className="form-control" value={f.value} onChange={e => updateFilter(i, 'value', e.target.value)} placeholder="Value" />
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={() => removeFilter(i)} style={{ color: 'var(--accent-4)', flexShrink: 0 }}>×</button>
                  </div>
                ))}
                <button className="add-filter-btn" type="button" onClick={addFilter}>+ Add filter</button>
              </div>
            )}
          </>
        )}

        {/* Styling */}
        {(isChart || isPie || isTable) && (
          <>
            <div className="section-divider">Styling</div>
            {isChart && (
              <>
                <div className="form-group">
                  <label className="form-label">Chart color</label>
                  <ColorPickerInput value={cfg.chartColor || '#54bd95'} onChange={v => set('chartColor', v)} />
                </div>
                <div className="form-group">
                  <label className="checkbox-group">
                    <input type="checkbox" checked={!!cfg.showDataLabel} onChange={e => set('showDataLabel', e.target.checked)} />
                    <span className="checkbox-label">Show data label</span>
                  </label>
                </div>
              </>
            )}
            {isPie && (
              <div className="form-group">
                <label className="checkbox-group">
                  <input type="checkbox" checked={!!cfg.showLegend} onChange={e => set('showLegend', e.target.checked)} />
                  <span className="checkbox-label">Show legend</span>
                </label>
              </div>
            )}
            {isTable && (
              <>
                <div className="form-group">
                  <label className="form-label">Font size</label>
                  <NumberInput value={cfg.fontSize || 14} min={12} max={18} onChange={v => set('fontSize', v)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Header background</label>
                  <ColorPickerInput value={cfg.headerBg || '#54bd95'} onChange={v => set('headerBg', v)} />
                </div>
              </>
            )}
          </>
        )}
      </div>

      <div className="side-panel-footer">
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { onUpdate(cfg); onClose(); }}>Apply</button>
      </div>
    </div>
  );
}

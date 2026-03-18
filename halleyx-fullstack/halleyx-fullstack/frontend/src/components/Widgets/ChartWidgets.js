import React from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  ScatterChart, Scatter, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LabelList,
} from 'recharts';
import { getChartData, getPieData, PIE_COLORS } from '../../utils/helpers';

const AXIS_STYLE = { fontSize: 11, fill: '#8b93a8' };
const TOOLTIP_STYLE = { background: '#161b28', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12.5, color: '#e8ecf5' };

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={TOOLTIP_STYLE}>
      <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontWeight: 600, fontSize: 12 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ padding: '6px 12px', color: p.color }}>
          {p.name}: <strong>{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</strong>
        </div>
      ))}
    </div>
  );
}

export function BarChartWidget({ widget, orders }) {
  const data = getChartData(orders, widget.xAxis || 'Product', widget.yAxis || 'Total amount');
  const color = widget.chartColor || '#54bd95';
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="name" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip />} />
        <Bar dataKey={widget.yAxis || 'Total amount'} fill={color} radius={[4, 4, 0, 0]}>
          {widget.showDataLabel && <LabelList dataKey={widget.yAxis || 'Total amount'} position="top" style={{ fontSize: 10, fill: '#8b93a8' }} />}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function LineChartWidget({ widget, orders }) {
  const data = getChartData(orders, widget.xAxis || 'Product', widget.yAxis || 'Total amount');
  const color = widget.chartColor || '#54bd95';
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="name" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip />} />
        <Line type="monotone" dataKey={widget.yAxis || 'Total amount'} stroke={color} strokeWidth={2.5} dot={{ fill: color, r: 4 }} activeDot={{ r: 6 }}>
          {widget.showDataLabel && <LabelList dataKey={widget.yAxis || 'Total amount'} position="top" style={{ fontSize: 10, fill: '#8b93a8' }} />}
        </Line>
      </LineChart>
    </ResponsiveContainer>
  );
}

export function AreaChartWidget({ widget, orders }) {
  const data = getChartData(orders, widget.xAxis || 'Product', widget.yAxis || 'Total amount');
  const color = widget.chartColor || '#54bd95';
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id={`areaGrad-${widget.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="name" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip />} />
        <Area type="monotone" dataKey={widget.yAxis || 'Total amount'} stroke={color} strokeWidth={2.5} fill={`url(#areaGrad-${widget.id})`}>
          {widget.showDataLabel && <LabelList dataKey={widget.yAxis || 'Total amount'} position="top" style={{ fontSize: 10, fill: '#8b93a8' }} />}
        </Area>
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function ScatterChartWidget({ widget, orders }) {
  const color = widget.chartColor || '#54bd95';
  const data = orders.map((o, i) => ({
    x: o.totalAmount || 0,
    y: o.quantity || 0,
    name: `${o.firstName} ${o.lastName}`,
  }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="x" name="Total Amount" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
        <YAxis dataKey="y" name="Quantity" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltip />} />
        <Scatter data={data} fill={color} opacity={0.8} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

const RADIAN = Math.PI / 180;
function PieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.06) return null;
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export function PieChartWidget({ widget, orders }) {
  const data = getPieData(orders, widget.chartData || 'Product');
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" outerRadius="75%" labelLine={false} label={PieLabel}
          dataKey="value" nameKey="name">
          {data.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
        </Pie>
        <Tooltip content={<ChartTooltip />} />
        {widget.showLegend && <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 11, color: '#8b93a8' }} />}
      </PieChart>
    </ResponsiveContainer>
  );
}

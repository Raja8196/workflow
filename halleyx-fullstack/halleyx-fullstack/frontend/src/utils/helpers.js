import { isWithinInterval, subDays, startOfDay, endOfDay, parseISO } from 'date-fns';

export const PRODUCTS = ['Fiber Internet 300 Mbps', '5G Unlimited Mobile Plan', 'Fiber Internet 1 Gbps', 'Business Internet 500 Mbps', 'VoIP Corporate Package'];
export const COUNTRIES = ['United States', 'Canada', 'Australia', 'Singapore', 'Hong Kong'];
export const STATUSES = ['Pending', 'In progress', 'Completed'];
export const CREATED_BY = ['Mr. Michael Harris', 'Mr. Ryan Cooper', 'Ms. Olivia Carter', 'Mr. Lucas Martin'];
export const DATE_RANGES = ['All time', 'Today', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days'];

export const WIDGET_TYPES = {
  BAR: 'Bar Chart', LINE: 'Line Chart', PIE: 'Pie Chart', AREA: 'Area Chart',
  SCATTER: 'Scatter Plot', TABLE: 'Table', KPI: 'KPI Value',
};

export const CHART_METRICS = ['Product', 'Quantity', 'Unit price', 'Total amount', 'Status', 'Created by', 'Duration'];
export const KPI_METRICS = ['Customer ID', 'Customer name', 'Email id', 'Address', 'Order date', 'Product', 'Created by', 'Status', 'Total amount', 'Unit price', 'Quantity'];
export const TABLE_COLUMNS = ['Customer ID', 'Customer name', 'Email id', 'Phone number', 'Address', 'Order ID', 'Order date', 'Product', 'Quantity', 'Unit price', 'Total amount', 'Status', 'Created by'];
export const NUMERIC_METRICS = ['Total amount', 'Unit price', 'Quantity'];

export function filterOrdersByDate(orders, dateRange) {
  if (!dateRange || dateRange === 'All time') return orders;
  const now = new Date();
  let start;
  if (dateRange === 'Today') start = startOfDay(now);
  else if (dateRange === 'Last 7 Days') start = subDays(now, 7);
  else if (dateRange === 'Last 30 Days') start = subDays(now, 30);
  else if (dateRange === 'Last 90 Days') start = subDays(now, 90);
  else return orders;
  return orders.filter(o => {
    const d = parseISO(o.orderDate);
    return isWithinInterval(d, { start, end: endOfDay(now) });
  });
}

export function computeKPI(orders, metric, aggregation, decimals = 0) {
  if (!orders.length) return '0';
  const fieldMap = {
    'Customer ID': o => 1, 'Customer name': o => 1, 'Email id': o => 1, 'Address': o => 1,
    'Order date': o => 1, 'Product': o => 1, 'Created by': o => 1, 'Status': o => 1,
    'Total amount': o => o.totalAmount, 'Unit price': o => o.unitPrice, 'Quantity': o => o.quantity,
  };
  const vals = orders.map(o => fieldMap[metric] ? fieldMap[metric](o) : 1).filter(v => !isNaN(v));
  if (!vals.length) return '0';
  let result;
  if (aggregation === 'Count') result = orders.length;
  else if (aggregation === 'Sum') result = vals.reduce((a, b) => a + b, 0);
  else if (aggregation === 'Average') result = vals.reduce((a, b) => a + b, 0) / vals.length;
  else result = vals.length;
  return result.toFixed(Number(decimals));
}

export function getChartData(orders, xAxis, yAxis) {
  const grouped = {};
  orders.forEach(o => {
    const key = getFieldValue(o, xAxis);
    if (!grouped[key]) grouped[key] = { name: key, value: 0, count: 0 };
    const yVal = getNumericValue(o, yAxis);
    grouped[key].value += yVal;
    grouped[key].count++;
  });
  return Object.values(grouped).map(g => ({ name: g.name, [yAxis]: parseFloat(g.value.toFixed(2)), count: g.count }));
}

export function getPieData(orders, field) {
  const grouped = {};
  orders.forEach(o => {
    const key = getFieldValue(o, field);
    grouped[key] = (grouped[key] || 0) + 1;
  });
  return Object.entries(grouped).map(([name, value]) => ({ name, value }));
}

function getFieldValue(order, field) {
  const map = {
    'Product': o => o.product, 'Quantity': o => String(o.quantity),
    'Unit price': o => `$${o.unitPrice}`, 'Total amount': o => `$${o.totalAmount.toFixed(0)}`,
    'Status': o => o.status, 'Created by': o => o.createdBy.split(' ').slice(-1)[0],
    'Duration': o => o.orderDate,
  };
  return map[field] ? map[field](order) : field;
}

function getNumericValue(order, field) {
  const map = {
    'Quantity': o => o.quantity, 'Unit price': o => o.unitPrice,
    'Total amount': o => o.totalAmount, 'Product': o => 1,
    'Status': o => 1, 'Created by': o => 1, 'Duration': o => 1,
  };
  return map[field] ? map[field](order) : 0;
}

export function getTableRow(order, columns) {
  const map = {
    'Customer ID': order.customerId, 'Customer name': `${order.firstName} ${order.lastName}`,
    'Email id': order.email, 'Phone number': order.phone,
    'Address': `${order.street}, ${order.city}`, 'Order ID': order.id,
    'Order date': order.orderDate, 'Product': order.product,
    'Quantity': order.quantity, 'Unit price': `$${order.unitPrice}`,
    'Total amount': `$${order.totalAmount.toFixed(2)}`, 'Status': order.status,
    'Created by': order.createdBy,
  };
  return columns.map(c => map[c] ?? '—');
}

export function sortOrders(orders, sortBy) {
  if (!sortBy) return orders;
  const arr = [...orders];
  if (sortBy === 'Ascending') return arr.sort((a, b) => a.totalAmount - b.totalAmount);
  if (sortBy === 'Descending') return arr.sort((a, b) => b.totalAmount - a.totalAmount);
  if (sortBy === 'Order date') return arr.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  return arr;
}

export function applyFilters(orders, filters) {
  if (!filters || !filters.length) return orders;
  return orders.filter(order => {
    return filters.every(f => {
      if (!f.column || !f.operator || f.value === '') return true;
      const val = String(getFieldValue(order, f.column)).toLowerCase();
      const fv = String(f.value).toLowerCase();
      if (f.operator === 'equals') return val === fv;
      if (f.operator === 'contains') return val.includes(fv);
      if (f.operator === 'starts with') return val.startsWith(fv);
      return true;
    });
  });
}

export const PIE_COLORS = ['#54bd95', '#6c8fff', '#f7c35f', '#f06a6a', '#a78bfa', '#38bdf8', '#fb923c'];

export function isValidHex(hex) { return /^#[0-9A-Fa-f]{6}$/.test(hex); }

export function getDefaultWidgetConfig(type) {
  const base = { id: null, type, title: 'Untitled', description: '', widthCols: 5, heightRows: 5 };
  if (type === 'KPI Value') return { ...base, widthCols: 2, heightRows: 2, metric: 'Total amount', aggregation: 'Sum', dataFormat: 'Number', decimalPrecision: 0 };
  if (type === 'Pie Chart') return { ...base, widthCols: 4, heightRows: 4, chartData: 'Product', showLegend: true };
  if (type === 'Table') return { ...base, widthCols: 4, heightRows: 4, columns: ['Customer name', 'Product', 'Status', 'Total amount'], sortBy: '', pagination: 10, applyFilter: false, filters: [], fontSize: 14, headerBg: '#54bd95' };
  return { ...base, xAxis: 'Product', yAxis: 'Total amount', chartColor: '#54bd95', showDataLabel: false };
}

export function validateOrder(data) {
  const errors = {};
  const required = ['firstName', 'lastName', 'email', 'phone', 'street', 'city', 'state', 'postal', 'country', 'product', 'unitPrice', 'status', 'createdBy'];
  required.forEach(f => { if (!data[f] || String(data[f]).trim() === '') errors[f] = 'Please fill the field'; });
  if (data.quantity < 1) errors.quantity = 'Quantity cannot be less than 1';
  return errors;
}

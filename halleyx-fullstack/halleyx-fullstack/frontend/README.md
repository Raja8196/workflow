# Halleyx Custom Dashboard Builder

A full-stack React application for building personalized dashboards with drag-and-drop widgets, integrated with a Customer Order module.

## Features

### Dashboard
- Drag-and-drop widget placement from the widget panel to canvas
- 7 widget types: Bar Chart, Line Chart, Area Chart, Scatter Plot, Pie Chart, Table, KPI Card
- Per-widget settings panel (title, size, data fields, styling)
- Date range filter: All time / Today / Last 7 / 30 / 90 Days
- Responsive grid: 12-col desktop → 8-col tablet → 4-col mobile
- Save & reload dashboard layout

### Customer Orders
- Full CRUD: Create, Edit, Delete orders
- Right-click context menu for Edit/Delete
- Field-level validation with "Please fill the field" messages
- Total Amount auto-calculated from Quantity × Unit Price
- Status badges: Pending / In progress / Completed

### Widget Configuration
- **KPI Card**: Metric, Aggregation (Sum/Avg/Count), Data format, Decimal precision
- **Charts (Bar/Line/Area/Scatter)**: X-axis, Y-axis, Chart color picker, Data labels
- **Pie Chart**: Chart data field, Show legend
- **Table**: Column multiselect, Sort, Pagination (5/10/15), Filters (multi), Font size, Header bg color

## Setup & Run

```bash
npm install
npm start
```

Open http://localhost:3000

## Project Structure

```
src/
  App.js                          # Root component + routing
  index.js                        # Entry point
  index.css                       # Global design system styles
  context/
    AppContext.js                  # Global state (orders, dashboard layout, toasts)
  utils/
    helpers.js                    # Data helpers, filters, chart data transformers
  components/
    Layout/
      AppShell.js                 # Sidebar + top bar layout
      SharedUI.js                 # Toast, ConfirmDialog, NumberInput, MultiSelect, etc.
    CustomerOrder/
      CustomerOrdersPage.js       # Orders table with context menu
      OrderModal.js               # Create/Edit order form
    Dashboard/
      DashboardPage.js            # Dashboard viewer
      DashboardConfigPage.js      # Drag-drop builder canvas
    Widgets/
      ChartWidgets.js             # Bar/Line/Area/Scatter/Pie using Recharts
      TableKPIWidgets.js          # Table + KPI card renderers
      WidgetSettingsPanel.js      # Side panel for widget configuration
```

## Tech Stack
- React 18 (hooks + context)
- Recharts (charts)
- date-fns (date filtering)
- uuid (unique IDs)
- CSS custom properties (design tokens)
- No external UI libraries (pure custom CSS)

## Responsive Behavior
- **Desktop (≥1025px)**: 12-column grid
- **Tablet (769–1024px)**: 8-column grid; widgets > 8 cols wrap to next row
- **Mobile (≤768px)**: 4-column grid; all widgets stack vertically

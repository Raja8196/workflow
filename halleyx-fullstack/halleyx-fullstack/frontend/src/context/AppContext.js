import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AppContext = createContext(null);

const sampleOrders = [
  { id: 'ORD-001', customerId: 'CUS-001', firstName: 'Alice', lastName: 'Johnson', email: 'alice@example.com', phone: '555-1001', street: '123 Maple St', city: 'New York', state: 'NY', postal: '10001', country: 'United States', product: 'Fiber Internet 1 Gbps', quantity: 2, unitPrice: 89.99, totalAmount: 179.98, status: 'Completed', createdBy: 'Mr. Michael Harris', orderDate: '2024-01-15' },
  { id: 'ORD-002', customerId: 'CUS-002', firstName: 'Bob', lastName: 'Smith', email: 'bob@example.com', phone: '555-1002', street: '456 Oak Ave', city: 'Los Angeles', state: 'CA', postal: '90001', country: 'United States', product: '5G Unlimited Mobile Plan', quantity: 3, unitPrice: 49.99, totalAmount: 149.97, status: 'In progress', createdBy: 'Ms. Olivia Carter', orderDate: '2024-01-18' },
  { id: 'ORD-003', customerId: 'CUS-003', firstName: 'Carol', lastName: 'White', email: 'carol@example.com', phone: '555-1003', street: '789 Pine Rd', city: 'Toronto', state: 'ON', postal: 'M5H 2N2', country: 'Canada', product: 'Business Internet 500 Mbps', quantity: 1, unitPrice: 149.99, totalAmount: 149.99, status: 'Pending', createdBy: 'Mr. Ryan Cooper', orderDate: '2024-01-20' },
  { id: 'ORD-004', customerId: 'CUS-004', firstName: 'David', lastName: 'Lee', email: 'david@example.com', phone: '555-1004', street: '321 Elm St', city: 'Sydney', state: 'NSW', postal: '2000', country: 'Australia', product: 'VoIP Corporate Package', quantity: 5, unitPrice: 29.99, totalAmount: 149.95, status: 'Completed', createdBy: 'Mr. Lucas Martin', orderDate: '2024-01-22' },
  { id: 'ORD-005', customerId: 'CUS-005', firstName: 'Eva', lastName: 'Chen', email: 'eva@example.com', phone: '555-1005', street: '654 Cedar Blvd', city: 'Singapore', state: 'SG', postal: '018960', country: 'Singapore', product: 'Fiber Internet 300 Mbps', quantity: 1, unitPrice: 59.99, totalAmount: 59.99, status: 'In progress', createdBy: 'Mr. Michael Harris', orderDate: '2024-01-25' },
  { id: 'ORD-006', customerId: 'CUS-006', firstName: 'Frank', lastName: 'Nguyen', email: 'frank@example.com', phone: '555-1006', street: '987 Birch Lane', city: 'Hong Kong', state: 'HK', postal: '00000', country: 'Hong Kong', product: 'Fiber Internet 1 Gbps', quantity: 2, unitPrice: 89.99, totalAmount: 179.98, status: 'Completed', createdBy: 'Ms. Olivia Carter', orderDate: '2024-02-01' },
  { id: 'ORD-007', customerId: 'CUS-007', firstName: 'Grace', lastName: 'Kim', email: 'grace@example.com', phone: '555-1007', street: '147 Walnut Dr', city: 'Chicago', state: 'IL', postal: '60601', country: 'United States', product: '5G Unlimited Mobile Plan', quantity: 4, unitPrice: 49.99, totalAmount: 199.96, status: 'Pending', createdBy: 'Mr. Lucas Martin', orderDate: '2024-02-05' },
  { id: 'ORD-008', customerId: 'CUS-008', firstName: 'Henry', lastName: 'Patel', email: 'henry@example.com', phone: '555-1008', street: '258 Spruce St', city: 'Melbourne', state: 'VIC', postal: '3000', country: 'Australia', product: 'Business Internet 500 Mbps', quantity: 2, unitPrice: 149.99, totalAmount: 299.98, status: 'Completed', createdBy: 'Mr. Ryan Cooper', orderDate: '2024-02-08' },
];

const initialState = {
  orders: sampleOrders,
  dashboardLayout: [],
  dashboardSaved: false,
  toasts: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_ORDER':
      return { ...state, orders: [...state.orders, { ...action.payload, id: `ORD-${String(state.orders.length + 1).padStart(3, '0')}`, customerId: `CUS-${String(state.orders.length + 1).padStart(3, '0')}`, orderDate: new Date().toISOString().slice(0, 10) }] };
    case 'UPDATE_ORDER':
      return { ...state, orders: state.orders.map(o => o.id === action.payload.id ? action.payload : o) };
    case 'DELETE_ORDER':
      return { ...state, orders: state.orders.filter(o => o.id !== action.payload) };
    case 'SET_DASHBOARD_LAYOUT':
      return { ...state, dashboardLayout: action.payload, dashboardSaved: false };
    case 'SAVE_DASHBOARD':
      return { ...state, dashboardLayout: action.payload, dashboardSaved: true };
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, { id: uuidv4(), ...action.payload }] };
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addOrder = useCallback(order => dispatch({ type: 'ADD_ORDER', payload: order }), []);
  const updateOrder = useCallback(order => dispatch({ type: 'UPDATE_ORDER', payload: order }), []);
  const deleteOrder = useCallback(id => dispatch({ type: 'DELETE_ORDER', payload: id }), []);
  const setDashboardLayout = useCallback(layout => dispatch({ type: 'SET_DASHBOARD_LAYOUT', payload: layout }), []);
  const saveDashboard = useCallback(layout => dispatch({ type: 'SAVE_DASHBOARD', payload: layout }), []);
  const addToast = useCallback((msg, type = 'success') => {
    const id = uuidv4();
    dispatch({ type: 'ADD_TOAST', payload: { id, message: msg, type } });
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', payload: id }), 3200);
  }, []);

  return (
    <AppContext.Provider value={{ state, addOrder, updateOrder, deleteOrder, setDashboardLayout, saveDashboard, addToast }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
};

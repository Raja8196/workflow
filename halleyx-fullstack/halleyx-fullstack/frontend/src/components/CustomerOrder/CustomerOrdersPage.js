import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OrderModal } from './OrderModal';
import { StatusBadge, ConfirmDialog, ContextMenu, Icons } from '../Layout/SharedUI';

export function CustomerOrdersPage() {
  const { state, addOrder, updateOrder, deleteOrder, addToast } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [ctxMenu, setCtxMenu] = useState(null);

  const orders = state.orders;

  const handleContextMenu = (e, order) => {
    e.preventDefault();
    setCtxMenu({ x: e.clientX, y: e.clientY, order });
  };

  const handleSave = (form) => {
    if (editOrder) {
      updateOrder({ ...editOrder, ...form });
      addToast('Order updated successfully', 'success');
    } else {
      addOrder(form);
      addToast('Order created successfully', 'success');
    }
    setShowModal(false);
    setEditOrder(null);
  };

  const handleDelete = (id) => {
    deleteOrder(id);
    setDeleteId(null);
    addToast('Order deleted', 'error');
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Customer Orders</div>
          <div className="section-subtitle">{orders.length} total orders</div>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditOrder(null); setShowModal(true); }}>
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Create Order
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-title">No orders yet</div>
          <div className="empty-desc">Click "Create Order" to add your first customer order.</div>
        </div>
      ) : (
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
                <th>Status</th>
                <th>Created By</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} onContextMenu={e => handleContextMenu(e, order)}
                  style={{ cursor: 'context-menu' }}>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{order.id}</td>
                  <td>{order.firstName} {order.lastName}</td>
                  <td style={{ fontSize: 12.5 }}>{order.email}</td>
                  <td>{order.product}</td>
                  <td>{order.quantity}</td>
                  <td>${order.unitPrice}</td>
                  <td style={{ color: 'var(--accent)', fontWeight: 600 }}>${order.totalAmount?.toFixed(2)}</td>
                  <td><StatusBadge status={order.status} /></td>
                  <td style={{ fontSize: 12.5 }}>{order.createdBy}</td>
                  <td style={{ fontSize: 12.5 }}>{order.orderDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p style={{ marginTop: 12, fontSize: 12.5, color: 'var(--text-muted)' }}>
        💡 Right-click on any row to edit or delete
      </p>

      {ctxMenu && (
        <ContextMenu
          x={ctxMenu.x} y={ctxMenu.y}
          onEdit={() => { setEditOrder(ctxMenu.order); setShowModal(true); }}
          onDelete={() => setDeleteId(ctxMenu.order.id)}
          onClose={() => setCtxMenu(null)}
        />
      )}

      {showModal && (
        <OrderModal
          order={editOrder}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditOrder(null); }}
        />
      )}

      {deleteId && (
        <div className="modal-backdrop">
          <ConfirmDialog
            title="Delete Order"
            desc="Are you sure you want to delete this order? This action cannot be undone."
            onConfirm={() => handleDelete(deleteId)}
            onCancel={() => setDeleteId(null)}
          />
        </div>
      )}
    </div>
  );
}

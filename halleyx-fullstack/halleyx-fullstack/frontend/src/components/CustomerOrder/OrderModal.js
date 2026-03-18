import React, { useState, useEffect } from 'react';
import { PRODUCTS, COUNTRIES, STATUSES, CREATED_BY, validateOrder } from '../../utils/helpers';
import { NumberInput } from '../Layout/SharedUI';

const EMPTY = {
  firstName: '', lastName: '', email: '', phone: '',
  street: '', city: '', state: '', postal: '', country: '',
  product: '', quantity: 1, unitPrice: '', totalAmount: 0,
  status: 'Pending', createdBy: '',
};

export function OrderModal({ order, onSave, onClose }) {
  const [form, setForm] = useState(order ? { ...order } : { ...EMPTY });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const qty = Number(form.quantity) || 0;
    const price = parseFloat(form.unitPrice) || 0;
    setForm(f => ({ ...f, totalAmount: parseFloat((qty * price).toFixed(2)) }));
  }, [form.quantity, form.unitPrice]);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: '' }));
  };

  const handleSubmit = () => {
    const errs = validateOrder(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave(form);
  };

  const Field = ({ label, name, type = 'text', required = true, disabled }) => (
    <div className="form-group">
      <label className="form-label">{label}{required && <span className="required">*</span>}</label>
      <input className="form-control" type={type} value={form[name] || ''} disabled={disabled}
        onChange={e => set(name, e.target.value)} placeholder={`Enter ${label.toLowerCase()}`} />
      {errors[name] && <div className="form-error">⚠ {errors[name]}</div>}
    </div>
  );

  const SelectField = ({ label, name, options, required = true }) => (
    <div className="form-group">
      <label className="form-label">{label}{required && <span className="required">*</span>}</label>
      <select className="form-control" value={form[name] || ''} onChange={e => set(name, e.target.value)}>
        <option value="">Select {label}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      {errors[name] && <div className="form-error">⚠ {errors[name]}</div>}
    </div>
  );

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-lg">
        <div className="modal-header">
          <div className="modal-title">{order ? 'Edit Order' : 'Create Order'}</div>
          <div className="close-btn" onClick={onClose}>×</div>
        </div>
        <div className="modal-body">
          {/* Customer Information */}
          <div className="section-divider">Customer Information</div>
          <div className="form-row">
            <Field label="First name" name="firstName" />
            <Field label="Last name" name="lastName" />
          </div>
          <div className="form-row">
            <Field label="Email id" name="email" type="email" />
            <Field label="Phone number" name="phone" />
          </div>
          <Field label="Street Address" name="street" />
          <div className="form-row-3">
            <Field label="City" name="city" />
            <Field label="State / Province" name="state" />
            <Field label="Postal code" name="postal" />
          </div>
          <SelectField label="Country" name="country" options={COUNTRIES} />

          {/* Order Information */}
          <div className="section-divider" style={{ marginTop: 10 }}>Order Information</div>
          <SelectField label="Choose product" name="product" options={PRODUCTS} />
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Quantity<span className="required">*</span></label>
              <NumberInput value={form.quantity} min={1} onChange={v => set('quantity', v)} />
              {errors.quantity && <div className="form-error">⚠ {errors.quantity}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Unit price<span className="required">*</span></label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 14 }}>$</span>
                <input className="form-control" style={{ paddingLeft: 26 }} type="number" min="0" step="0.01"
                  value={form.unitPrice} onChange={e => set('unitPrice', e.target.value)} placeholder="0.00" />
              </div>
              {errors.unitPrice && <div className="form-error">⚠ {errors.unitPrice}</div>}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Total amount</label>
            <input className="form-control" disabled value={`$${form.totalAmount}`} />
          </div>
          <div className="form-row">
            <SelectField label="Status" name="status" options={STATUSES} />
            <SelectField label="Created by" name="createdBy" options={CREATED_BY} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {order ? 'Save Changes' : 'Submit Order'}
          </button>
        </div>
      </div>
    </div>
  );
}

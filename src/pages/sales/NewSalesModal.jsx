// components/sales/NewSalesModal.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { productPrices } from "../../data/productPrices";

const emptySale = {
  customerName: "",
  date: new Date().toISOString().split("T")[0], // today by default
  paymentMethod: "cash",
  items: [],
  discount: 0,
  notes: "",
};

const paymentMethods = ["cash", "m-pesa", "bank", "credit"];

export default function NewSalesModal({
  isOpen,
  onClose,
  onSave,
  editingSale,
}) {
  const [form, setForm] = useState(emptySale);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
  if (isOpen) {
    if (editingSale) {
      const normalizedItems = (editingSale.items || []).map((item) => ({
        ...item,
        qty: Number(item.qty) || 1,
        price: Number(item.price) || productPrices[item.product] || 0,
        total: (Number(item.price) || productPrices[item.product] || 0) * (Number(item.qty) || 1),
        id: item.id || Date.now() + Math.random(),
      }));

      setForm({
        customerName: editingSale.customer_name || "", // normalize here
        date: editingSale.date || new Date().toISOString().split("T")[0],
        paymentMethod: editingSale.payment_method || "cash",
        items: normalizedItems,
        discount: Number(editingSale.discount) || 0,
        notes: editingSale.notes || "",
      });
    } else {
      setForm(emptySale);
    }
    setErrors({});
  }
}, [isOpen, editingSale]);


  // Close on Escape
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { id: Date.now(), product: "", qty: 1, price: 0, total: 0 }],
    }));
  };

  const updateItem = (id, field, value) => {
  setForm((prev) => {
    const updated = prev.items.map((item) => {
      if (item.id === id) {
        const newItem = { ...item, [field]: value };

        if (field === "product") {
          newItem.price = Number(productPrices[value] || 0);
        } else if (field === "qty") {
          newItem.qty = Number(value) || 1;
        }

        // Recalculate total for only this item
        newItem.total = (Number(newItem.price) || 0) * (Number(newItem.qty) || 1);

        return newItem;
      }
      return item; // leave other items untouched
    });

    return { ...prev, items: updated };
  });
};


  const removeItem = (id) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const subtotal = form.items.reduce((sum, item) => sum + item.total, 0);
  const grandTotal = subtotal - (form.discount || 0);

  const validateForm = () => {
    const newErrors = {};

    if (!form.customerName.trim()) newErrors.customerName = "Customer name is required";
    if (!form.date) newErrors.date = "Date is required";
    if (form.items.length === 0) newErrors.items = "Add at least one product";

    form.items.forEach((item, i) => {
      if (!item.product) newErrors[`product_${i}`] = "Select a product";
      if (!item.qty || item.qty < 1) newErrors[`qty_${i}`] = "Quantity must be ≥ 1";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSave({
        ...form,
        subtotal,
        grandTotal,
        items: form.items.map(({ id, ...item }) => item), // remove temp id
      });
      onClose();
    } catch (err) {
      alert("Failed to save sale. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-screen overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {editingSale ? "Edit Sale" : "New Sale"}
              </h2>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {/* Customer Name */}
                <div>
                  <label className="block text-sm font-medium mb-1">Customer Name</label>
                  <input
                    type="text"
                    className={`w-full border ${errors.customerName ? "border-red-500" : "border-gray-300"} rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    placeholder="e.g. John Doe"
                  />
                  {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium mb-1">Payment Method</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    value={form.paymentMethod}
                    onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                  >
                    {paymentMethods.map((method) => (
                      <option key={method} value={method}>
                        {method.charAt(0).toUpperCase() + method.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Discount */}
                <div>
                  <label className="block text-sm font-medium mb-1">Discount (Tsh)</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    value={form.discount || ""}
                    onChange={(e) => setForm({ ...form, discount: Number(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Products</h3>
                {errors.items && <p className="text-red-500 text-sm mb-2">{errors.items}</p>}

                <div className="space-y-3">
                  {form.items.map((item, index) => (
                    <ItemRow
                      key={item.id}
                      item={item}
                      index={index}
                      updateItem={updateItem}
                      removeItem={removeItem}
                      error={errors}
                    />
                  ))}
                </div>

                <button
                  onClick={addItem}
                  className="mt-4 w-full border-2 border-dashed border-blue-400 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition"
                >
                  + Add Another Product
                </button>
              </div>

              {/* Totals */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-right font-mono">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{subtotal.toLocaleString()} Tsh</span>
                </div>
                {form.discount > 0 && (
                  <div className="flex justify-between text-orange-600">
                    <span>Discount:</span>
                    <span>- {form.discount.toLocaleString()} Tsh</span>
                  </div>
                )}
                <div className="text-xl font-bold text-green-600 border-t pt-2">
                  <div className="flex justify-between">
                    <span>Grand Total:</span>
                    <span>{grandTotal.toLocaleString()} Tsh</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="mt-6">
                <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                <textarea
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Any additional info..."
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>Saving...</>
                  ) : (
                    <>{editingSale ? "Update Sale" : "Save Sale"}</>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Reusable Item Row Component
function ItemRow({ item, index, updateItem, removeItem, error }) {
  return (
    <div className="grid grid-cols-12 gap-3 items-end border rounded-lg p-4 bg-gray-50">
      <div className="col-span-5">
        <select
          className={`w-full border ${error[`product_${index}`] ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2`}
          value={item.product}
          onChange={(e) => updateItem(item.id, "product", e.target.value)}
        >
          <option value="">Select Product</option>
          {Object.keys(productPrices).map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        {error[`product_${index}`] && <p className="text-red-500 text-xs mt-1">{error[`product_${index}`]}</p>}
      </div>

      <div className="col-span-2">
        <input
          type="number"
          min="1"
          className={`w-full border ${error[`qty_${index}`] ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2 text-center`}
          value={item.qty}
          onChange={(e) => updateItem(item.id, "qty", Number(e.target.value) || 1)}
        />
      </div>

      <div className="col-span-2">
        <input
          type="number"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-center"
          value={item.price || 0}
          readOnly
        />
      </div>

      <div className="col-span-2 text-right font-semibold text-lg">
        {(item.total || 0).toLocaleString()}
      </div>

      <div className="col-span-1 text-center">
        <button
          onClick={() => removeItem(item.id)}
          className="text-red-600 hover:bg-red-100 w-10 h-10 rounded-full text-xl font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
}
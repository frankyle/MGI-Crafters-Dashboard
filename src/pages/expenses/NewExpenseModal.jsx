import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const emptyForm = {
  category: "",
  name: "",
  description: "",
  vendor: "",
  date: "",
  amount: "",
  paymentMethod: "",
};

const NewExpenseModal = ({ isOpen, onClose, onSave, editingExpense }) => {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false); // <-- loading state

  useEffect(() => {
    if (editingExpense) {
      setForm(editingExpense);
    } else {
      setForm(emptyForm);
    }
  }, [editingExpense]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true); // start loading
    try {
      await onSave({
        ...form,
        amount: Number(form.amount),
        payment_method: form.paymentMethod,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white rounded-lg p-6 shadow-xl w-full max-w-lg"
          >
            <h2 className="text-xl font-semibold mb-4">
              {editingExpense ? "Edit Expense" : "Add New Expense"}
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              />

              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              />

              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              />

              <input
                type="text"
                name="vendor"
                placeholder="Vendor"
                value={form.vendor}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              />

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              />

              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={form.amount}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              />

              <select
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              >
                <option value="">Select Payment Method</option>
                <option value="Cash">Cash</option>
                <option value="Airtel Money">Airtel Money</option>
                <option value="Voda Lipa">Voda Lipa</option>
                <option value="Mix Ya Lipa">Mix Ya Lipa</option>
                <option value="Not Paid Yet">Not Paid Yet</option>
              </select>

              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                  disabled={loading} // disable cancel while loading
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  disabled={loading} // disable save while loading
                >
                  {loading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                  ) : null}
                  {editingExpense ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewExpenseModal;

// AddItemForm.js
import React, { useState } from "react";

const AddItemForm = ({ onSubmit, onClose }) => {
  const [form, setForm] = useState({
    type: "raw",
    name: "",
    quantity: "",
    unit: "",
    reorderLevel: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add Inventory Item</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block font-medium text-sm mb-1">Category</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="raw">Raw Material</option>
              <option value="finished">Finished Product</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-sm mb-1">Name</label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-sm mb-1">Quantity</label>
            <input
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-sm mb-1">Unit</label>
            <input
              name="unit"
              type="text"
              value={form.unit}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-sm mb-1">Reorder Level</label>
            <input
              name="reorderLevel"
              type="number"
              value={form.reorderLevel}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Save Item
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddItemForm;

// components/sales/SalesItemsTable.jsx
import React from "react";

const SalesItemsTable = ({ items }) => {
  if (!items || items.length === 0) {
    return <p className="text-gray-500 text-sm">No items for this sale.</p>;
  }

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <div className="overflow-x-auto bg-gray-50 rounded-lg p-4 mt-2">
      <table className="min-w-full text-left">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="py-2 px-3">#</th>
            <th className="py-2 px-3">Product</th>
            <th className="py-2 px-3">Quantity</th>
            <th className="py-2 px-3">Price</th>
            <th className="py-2 px-3">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id} className="border-b hover:bg-gray-50 transition">
              <td className="py-2 px-3">{index + 1}</td>
              <td className="py-2 px-3">{item.product}</td>
              <td className="py-2 px-3">{item.quantity}</td>
              <td className="py-2 px-3">{item.price?.toLocaleString() || 0}</td>
              <td className="py-2 px-3 font-semibold">
                {(item.quantity * item.price).toLocaleString()}
              </td>
            </tr>
          ))}
          <tr className="border-t font-bold bg-gray-100">
            <td colSpan="4" className="py-2 px-3 text-right">
              Subtotal:
            </td>
            <td className="py-2 px-3">{subtotal.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SalesItemsTable;

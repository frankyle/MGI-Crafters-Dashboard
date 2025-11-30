// components/sales/SalesTable.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";

const SalesTable = ({ sales, onEdit, onDelete }) => {
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (saleId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [saleId]: !prev[saleId],
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-md p-6 overflow-x-auto"
    >
      <table className="min-w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-3 px-4">S/N</th>
            <th className="py-3 px-4">Customer</th>
            <th className="py-3 px-4">Total</th>
            <th className="py-3 px-4">Date</th>
            <th className="py-3 px-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {sales.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-6 text-gray-500">
                No sales recorded yet.
              </td>
            </tr>
          ) : (
            sales.map((sale, index) => (
              <React.Fragment key={sale.id}>
                <tr className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{sale.customer_name || "N/A"}</td>
                  <td className="py-3 px-4 font-semibold">{sale.total_amount?.toLocaleString() || 0} Tsh</td>
                  <td className="py-3 px-4">{new Date(sale.created_at).toLocaleDateString()}</td>
                  <td className="py-3 px-4 flex items-center justify-center gap-2">
                    <button
                      onClick={() => toggleRow(sale.id)}
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                    >
                      {expandedRows[sale.id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>

                    <button
                      onClick={() => onEdit(sale)}
                      className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition"
                    >
                      <Pencil size={18} className="text-blue-600" />
                    </button>

                    <button
                      onClick={() => onDelete(sale.id)}
                      className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition"
                    >
                      <Trash2 size={18} className="text-red-600" />
                    </button>
                  </td>
                </tr>

                {/* Expandable Items */}
                <AnimatePresence>
                  {expandedRows[sale.id] && sale.sales_items && sale.sales_items.length > 0 && (
                    <motion.tr
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-gray-50"
                    >
                      <td colSpan="5" className="px-8 py-2">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b">
                              <th className="py-2 px-3">Product</th>
                              <th className="py-2 px-3">Qty</th>
                              <th className="py-2 px-3">Price</th>
                              <th className="py-2 px-3">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sale.sales_items.map((item) => (
                              <tr key={item.id} className="border-b">
                                <td className="py-2 px-3">{item.product}</td>
                                <td className="py-2 px-3">{item.quantity}</td>
                                <td className="py-2 px-3">{item.price?.toLocaleString()}</td>
                                <td className="py-2 px-3 font-semibold">
                                  {(item.quantity * item.price).toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
    </motion.div>
  );
};

export default SalesTable;

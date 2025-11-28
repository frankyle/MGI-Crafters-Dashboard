// RawMaterialsTable.js
import React from "react";
import { motion } from "framer-motion";

const RawMaterialsTable = ({ data }) => {
  const getStatusBadge = (status) =>
    status === "low" ? (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Low Stock
      </span>
    ) : (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Adequate
      </span>
    );

  return (
    <>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Raw Materials Stock</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Material</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Quantity</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Reorder Level</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {data.map((item, index) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-6 text-sm font-medium text-gray-900">{item.name}</td>
                <td className="py-4 px-6 text-sm text-gray-700">{item.quantity} {item.unit}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{item.reorderLevel} {item.unit}</td>
                <td className="py-4 px-6">{getStatusBadge(item.status)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default RawMaterialsTable;

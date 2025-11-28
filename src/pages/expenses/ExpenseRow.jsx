import React from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";

const ExpenseRow = ({ expense, index, onEdit, onDelete }) => {
  // Format date as 25th Nov 2025
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const daySuffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";

    return `${day}${daySuffix} ${date.toLocaleString("en-US", {
      month: "short",
    })} ${date.getFullYear()}`;
  };

  return (
    <>
      {/* DESKTOP */}
      <motion.tr
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className="hover:bg-gray-50 transition-colors hidden md:table-row"
      >
        <td className="py-4 px-6">{index + 1}</td>
        <td className="py-4 px-6">{expense.category}</td>
        <td className="py-4 px-6">{expense.name}</td>
        <td className="py-4 px-6">{expense.description}</td>
        <td className="py-4 px-6">{expense.vendor}</td>
        <td className="py-4 px-6">{formatDate(expense.date)}</td>
        <td className="py-4 px-6 text-right font-semibold">
          Tsh {Number(expense.amount).toLocaleString()}
        </td>
        <td className="py-4 px-6 text-right">{expense.payment_method || "-"}</td>
        <td className="py-4 px-6 text-right flex justify-end gap-2">
          <button
            onClick={() => onEdit(expense)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => onDelete(expense.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 size={18} />
          </button>
        </td>
      </motion.tr>

      {/* MOBILE CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="md:hidden bg-white p-4 rounded-xl shadow-sm border mb-3"
      >
        <div className="flex justify-between mb-2">
          <span className="font-semibold">{expense.name}</span>
          <span className="text-blue-600 font-bold">
            Tsh {Number(expense.amount).toLocaleString()}
          </span>
        </div>

        <p className="text-sm text-gray-600">
          <strong>Category:</strong> {expense.category}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Vendor:</strong> {expense.vendor}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Date:</strong> {formatDate(expense.date)}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Payment Method:</strong> {expense.payment_method || "-"}
        </p>

        {expense.description && (
          <p className="text-xs text-gray-500 mt-2 italic">{expense.description}</p>
        )}

        <div className="flex justify-end gap-4 mt-3">
          <button onClick={() => onEdit(expense)} className="text-blue-600 mr-2">
            Edit
          </button>

          <button onClick={() => onDelete(expense.id)} className="text-red-600">
            Delete
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default ExpenseRow;

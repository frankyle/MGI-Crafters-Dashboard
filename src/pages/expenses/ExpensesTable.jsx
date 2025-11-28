import React from "react";
import { motion } from "framer-motion";
import ExpenseRow from "./ExpenseRow";

const ExpensesTable = ({ expenses, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Recent Expenses</h2>
      </div>

      {/* DESKTOP TABLE */}
      <div className="overflow-x-auto hidden md:block">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">S/N</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Category</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Name</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Description</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Vendor</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Date</th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">Amount</th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">Payment Method</th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {expenses.map((expense, index) => (
              <ExpenseRow
                key={expense.id}
                expense={expense}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden p-4">
        {expenses.map((expense, index) => (
          <ExpenseRow
            key={expense.id}
            expense={expense}
            index={index}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default ExpensesTable;

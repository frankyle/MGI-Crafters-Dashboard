import { motion } from "framer-motion";
import { ShoppingBag, Trash2 } from "lucide-react";

const SalesTable = ({ sales, onDelete }) => {
  if (sales.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <p className="text-gray-500">No sales recorded yet. Click the + button to add your first sale!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-5 border-b border-gray-200">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-blue-600" />
          Recent Sales
        </h2>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden">
        {sales.map((sale) => (
          <motion.div
            key={sale.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="border-b border-gray-200 p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-900">{sale.customer}</p>
                <p className="text-sm text-gray-600">{sale.product}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {sale.quantity} × TZS {sale.amount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">{sale.date}</p>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-green-600">
                  TZS {sale.amount.toLocaleString()}
                </p>

                <button
                  onClick={() => onDelete(sale.id)}
                  className="mt-3 text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {["Customer", "Category", "Product", "Qty", "Date", "Amount", ""].map((h) => (
                <th
                  key={h}
                  className="text-left py-4 px-6 text-sm font-medium text-gray-700"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {sales.map((sale) => (
              <motion.tr
                key={sale.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hover:bg-gray-50"
              >
                <td className="py-4 px-6">{sale.customer}</td>
                <td className="py-4 px-6">{sale.category}</td>
                <td className="py-4 px-6">{sale.product}</td>
                <td className="py-4 px-6">{sale.quantity}</td>
                <td className="py-4 px-6">{sale.date}</td>

                <td className="py-4 px-6 text-right font-medium text-green-600">
                  TZS {sale.amount.toLocaleString()}
                </td>

                <td className="py-4 px-6 text-center">
                  <button
                    onClick={() => onDelete(sale.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesTable;

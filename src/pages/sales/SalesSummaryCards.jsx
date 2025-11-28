// components/sales/SalesSummaryCards.jsx
import { motion } from "framer-motion";
import { ShoppingBag, TrendingUp } from "lucide-react";

const SalesSummaryCards = ({ totalRevenue, totalOrders }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {/* Total Revenue */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Total Revenue (Jan)
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              TZS {totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </motion.div>

      {/* Total Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {totalOrders}
            </p>
          </div>
          <div className="p-3 bg-green-100 rounded-lg">
            <ShoppingBag className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </motion.div>

      {/* Avg Order */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Avg. Order Value
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              TZS {(totalRevenue / totalOrders).toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-purple-100 rounded-lg">
            <span className="text-2xl font-bold text-purple-600">₳</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SalesSummaryCards;

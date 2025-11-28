// components/sales/SalesHeader.jsx
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

const SalesHeader = ({ onAddNew }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Sales</h1>
        <p className="text-gray-600 mt-1">
          Manage your sales orders and track revenue
        </p>
      </div>

      <motion.button
        onClick={onAddNew}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-3 rounded-lg shadow-md transition-all"
      >
        <Plus className="w-5 h-5" />
        Record New Sale
      </motion.button>
    </div>
  );
};

export default SalesHeader;

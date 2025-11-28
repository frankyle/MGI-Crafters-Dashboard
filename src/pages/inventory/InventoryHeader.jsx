// components/inventory/InventoryHeader.jsx
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

const InventoryHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
        <p className="text-gray-600 mt-1">Track raw materials and finished goods</p>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-3 rounded-lg shadow-md transition-all"
      >
        <Plus className="w-5 h-5" />
        Add Item
      </motion.button>
    </div>
  );
};

export default InventoryHeader;

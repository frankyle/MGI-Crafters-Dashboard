import React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

const SalesHeader = ({ openModal }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
          Sales
        </h1>
        <p className="text-gray-600 mt-1">Track and manage your business Sales</p>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={openModal}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-3 rounded-lg shadow-md transition-all w-full sm:w-auto justify-center"
      >
        <Plus className="w-5 h-5" />
        Add Sale
      </motion.button>
    </div>
  );
};

export default SalesHeader;

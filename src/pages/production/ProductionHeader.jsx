import { motion } from "framer-motion";
import { Plus } from "lucide-react";

const ProductionHeader = ({ openModal }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Production</h1>
        <p className="text-gray-600 mt-1">Manage batches and track manufacturing progress</p>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={openModal}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-3 rounded-lg shadow-md transition-all"
      >
        <Plus className="w-5 h-5" />
        Start New Batch
      </motion.button>
    </div>
  );
};

export default ProductionHeader;

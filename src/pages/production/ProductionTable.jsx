import { AnimatePresence, motion } from "framer-motion";
import { Beaker } from "lucide-react";
import { getStatusConfig } from "./statusConfig";

const ProductionTable = ({ batches, filter, setFilter }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex flex-wrap">
          {["all", "in-progress", "quality-check", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`flex-1 min-w-fit px-6 py-4 text-sm font-medium transition-all capitalize ${
                filter === tab
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {tab === "all"
                ? "All Batches"
                : tab === "in-progress"
                ? "In Progress"
                : tab === "quality-check"
                ? "Quality Check"
                : "Completed"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Beaker className="w-6 h-6 text-blue-600" />
          Production Batches
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Batch No.</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Product</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Quantity</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Start Date</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Expected</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              <AnimatePresence mode="wait">
                {batches.map((batch, index) => {
                  const status = getStatusConfig(batch.status);

                  return (
                    <motion.tr
                      key={batch.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-6 text-sm font-bold text-blue-600">{batch.batchNo}</td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">{batch.product}</td>
                      <td className="py-4 px-6 text-sm text-gray-700">{batch.quantity} {batch.unit}</td>
                      <td className="py-4 px-6 text-sm text-gray-600">{batch.startDate}</td>
                      <td className="py-4 px-6 text-sm text-gray-600">{batch.expectedDate}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          {status.icon}
                          {batch.status === "in-progress"
                            ? "In Progress"
                            : batch.status === "quality-check"
                            ? "Quality Check"
                            : "Completed"}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductionTable;

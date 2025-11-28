import { motion } from "framer-motion";
import { Beaker, Clock, AlertCircle, CheckCircle2 } from "lucide-react";

const ProductionStats = ({ stats }) => {
  const statCards = [
    { label: "Total Batches", value: stats.total, icon: Beaker, color: "text-gray-600", bg: "bg-gray-100" },
    { label: "In Progress", value: stats.inProgress, icon: Clock, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Quality Check", value: stats.qualityCheck, icon: AlertCircle, color: "text-purple-600", bg: "bg-purple-100" },
    { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
      {statCards.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ProductionStats;

import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

export const getStatusConfig = (status) => {
  const configs = {
    "in-progress": { color: "bg-blue-100 text-blue-800", icon: <Clock className="w-4 h-4" /> },
    "completed": { color: "bg-green-100 text-green-800", icon: <CheckCircle2 className="w-4 h-4" /> },
    "quality-check": { color: "bg-purple-100 text-purple-800", icon: <AlertCircle className="w-4 h-4" /> },
  };
  return configs[status] || configs["in-progress"];
};

// components/inventory/StatusBadge.jsx
const StatusBadge = ({ status }) => {
  return status === "low" ? (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
      Low Stock
    </span>
  ) : (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
      Adequate
    </span>
  );
};

export default StatusBadge;

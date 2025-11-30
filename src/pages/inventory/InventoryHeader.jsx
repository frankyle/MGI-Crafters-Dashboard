// components/inventory/InventoryHeader.jsx (IMEBORESHWA)
import React from 'react';
import { Package, TrendingUp, AlertTriangle } from 'lucide-react';

/**
 * Component inayoonyesha muhtasari wa takwimu za hesabu (Inventory Statistics Header).
 *
 * @param {Object[]} items - Orodha ya bidhaa zote.
 * @param {function} openModal - Function ya kufungua modal ya kuongeza bidhaa mpya.
 * @param {string} title - Jina la sehemu ya hesabu (mfano: Raw Materials, Finished Goods).
 */
// REKEBISHO: Weka items = [] kama default ili kuepuka kosa la 'undefined.length'
const InventoryHeader = ({ items = [], openModal, title }) => {
  
  // 1. Mahesabu ya Takwimu
  // items.length sasa ni salama kwa sababu items imethibitishwa kuwa array.
  const totalItems = items.length;
  
  const totalQuantity = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  
  const lowStockCount = items.filter(
    item => (Number(item.quantity) || 0) <= (Number(item.reorder_level) || 0)
  ).length;

  // Maneno ya kutafsiri
  const stats = [
    {
      label: "Jumla ya Bidhaa Tofauti",
      value: totalItems,
      icon: Package,
      color: "bg-blue-100 text-blue-600"
    },
    {
      label: "Idadi Yote Stock",
      value: totalQuantity.toLocaleString(), // Huonyesha namba kwa umbile zuri
      icon: TrendingUp,
      color: "bg-green-100 text-green-600"
    },
    {
      label: "Bidhaa Chache (Low Stock)",
      value: lowStockCount,
      icon: AlertTriangle,
      color: "bg-red-100 text-red-600"
    }
  ];

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      
      {/* Kichwa na Kitufe cha Kuongeza */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-3xl font-extrabold text-gray-900">
          {title || "Muhtasari wa Hesabu"}
        </h1>
        
        {/* Kitufe cha Kuongeza Bidhaa */}
        <button
          onClick={openModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors flex items-center gap-2 font-medium"
        >
          <span>+</span> Ongeza Bidhaa Mpya
        </button>
      </div>

      {/* Grid ya Takwimu (Statistics Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm transition duration-300 hover:shadow-md"
          >
            <div className="flex items-center">
              {/* Icon */}
              <div className={`p-3 rounded-full ${stat.color} mr-4`}>
                <stat.icon size={20} />
              </div>
              
              <div>
                {/* Thamani (Value) */}
                <p className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </p>
                {/* Jina la Takwimu (Label) */}
                <p className="text-sm font-medium text-gray-500 mt-1">
                  {stat.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryHeader;
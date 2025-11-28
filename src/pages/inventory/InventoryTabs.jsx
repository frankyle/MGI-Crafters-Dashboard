// InventoryTabs.js
import React from "react";
import { Package2, Boxes } from "lucide-react";

const InventoryTabs = ({ activeTab, setActiveTab }) => (
  <div className="border-b border-gray-200">
    <div className="flex">
      <button
        onClick={() => setActiveTab("raw")}
        className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 text-sm font-medium transition-all ${
          activeTab === "raw"
            ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        }`}
      >
        <Package2 className="w-5 h-5" />
        Raw Materials
      </button>

      <button
        onClick={() => setActiveTab("finished")}
        className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 text-sm font-medium transition-all ${
          activeTab === "finished"
            ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        }`}
      >
        <Boxes className="w-5 h-5" />
        Finished Goods
      </button>
    </div>
  </div>
);

export default InventoryTabs;

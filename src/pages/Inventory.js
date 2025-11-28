// Inventory.js
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import AddItemForm from "./inventory/AddItemModal";
import InventoryTabs from "./inventory/InventoryTabs";
import RawMaterialsTable from "./inventory/RawMaterialTable";
import FinishedGoodsTable from "./inventory/FinishedGoodsTable";


const Inventory = () => {
  const [activeTab, setActiveTab] = useState("raw");
  const [showForm, setShowForm] = useState(false);

  const [rawMaterials, setRawMaterials] = useState([
    { id: 1, name: "Fresh Moringa Leaves", quantity: 150, unit: "kg", reorderLevel: 50, status: "adequate" },
    { id: 2, name: "Fresh Beetroot", quantity: 200, unit: "kg", reorderLevel: 80, status: "adequate" },
  ]);

  const [finishedGoods, setFinishedGoods] = useState([
    { id: 1, name: "Moringa Powder", quantity: 120, unit: "packets", reorderLevel: 30, status: "adequate" },
    { id: 2, name: "Beetroot Powder", quantity: 85, unit: "packets", reorderLevel: 40, status: "adequate" },
  ]);

  const addNewItem = (item) => {
    const newItem = {
      id: Date.now(),
      name: item.name,
      quantity: Number(item.quantity),
      unit: item.unit,
      reorderLevel: Number(item.reorderLevel),
      status: item.quantity <= item.reorderLevel ? "low" : "adequate"
    };

    if (item.type === "raw") {
      setRawMaterials([...rawMaterials, newItem]);
    } else {
      setFinishedGoods([...finishedGoods, newItem]);
    }
  };

  return (
      <div>
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
            <p className="text-gray-600">Track raw materials and finished goods</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-3 rounded-lg shadow-md"
          >
            <Plus className="w-5 h-5" />
            Add Item
          </motion.button>
        </div>

        {/* Tabs */}
        <InventoryTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <AnimatePresence mode="wait">
            {activeTab === "raw" ? (
              <motion.div key=" raw" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <RawMaterialsTable data={rawMaterials} />
              </motion.div>
            ) : (
              <motion.div key="finished" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <FinishedGoodsTable data={finishedGoods} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {showForm && <AddItemForm onSubmit={addNewItem} onClose={() => setShowForm(false)} />}
      </div>
  );
};

export default Inventory;

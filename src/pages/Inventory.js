import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { supabase } from "../supabaseClient";
import InventoryHeader from "./inventory/InventoryHeader";
import InventoryTabs from "./inventory/InventoryTabs";
import InventoryTable from "./inventory/InventoryTable";
import AddEditItemModal from "./inventory/AddEditItemModal";

// Assuming these components exist in your structure

const InventoryPage = () => {
  const [activeTab, setActiveTab] = useState("raw");
  const [rawMaterials, setRawMaterials] = useState([]);
  const [finishedGoods, setFinishedGoods] = useState([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [loading, setLoading] = useState(true);

  // Dynamic table name based on tab
  const tableName = activeTab === "raw" ? "raw_materials" : "finished_goods";

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const [rawRes, finishedRes] = await Promise.all([
        supabase.from("raw_materials").select("*").order("created_at", { ascending: false }),
        supabase.from("finished_goods").select("*").order("created_at", { ascending: false }),
      ]);

      if (rawRes.error) throw rawRes.error;
      if (finishedRes.error) throw finishedRes.error;

      setRawMaterials(rawRes.data || []);
      setFinishedGoods(finishedRes.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Toast Container */}
        <Toaster position="top-right" />

        <InventoryHeader
          rawMaterials={rawMaterials}
          finishedGoods={finishedGoods}
          openModal={openAddModal}
        />

        <InventoryTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
          </div>
        ) : (
          <InventoryTable
            // Ensure we pass the correct data based on the tab
            data={activeTab === "raw" ? rawMaterials : finishedGoods}
            tableName={tableName}
            onRefresh={fetchInventory}
            onEdit={openEditModal}
          />
        )}

        <AddEditItemModal
          isOpen={isModalOpen}
          editingItem={editingItem}
          tableName={tableName}
          onClose={closeModal}
          // The fix: onSave only fetches data. 
          // Closing is handled by the modal calling onClose right after.
          onSave={fetchInventory} 
        />
      </div>
    </div>
  );
};

export default InventoryPage;
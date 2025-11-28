import React, { useState } from "react";
import ProductionHeader from "./production/ProductionHeader";
import ProductionStats from "./production/ProductionStats";
import ProductionTable from "./production/ProductionTable";
import NewBatchModal from "./production/NewBatchModal";

// Local mock data
const initialBatches = [
  { id: 1, batchNo: "BATCH-1024", product: "Moringa Powder", quantity: 100, unit: "packets", status: "in-progress", startDate: "2025-01-10", expectedDate: "2025-01-15" },
  { id: 2, batchNo: "BATCH-1023", product: "Pilau Masala", quantity: 150, unit: "packets", status: "completed", startDate: "2025-01-08", expectedDate: "2025-01-12" },
  { id: 3, batchNo: "BATCH-1022", product: "Ginger Powder", quantity: 80, unit: "packets", status: "in-progress", startDate: "2025-01-09", expectedDate: "2025-01-14" },
  { id: 4, batchNo: "BATCH-1021", product: "Natural Body Scrub", quantity: 50, unit: "jars", status: "quality-check", startDate: "2025-01-07", expectedDate: "2025-01-11" },
];

const ProductionPage = () => {
  const [filter, setFilter] = useState("all");
  const [batches, setBatches] = useState(initialBatches);

  // Modal control
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Add new batch to list
  const addBatch = (data) => {
    const newBatch = {
      id: Date.now(),
      ...data,
      status: "in-progress",
      startDate: new Date().toISOString().slice(0, 10),
      expectedDate: "TBD"
    };

    setBatches(prev => [newBatch, ...prev]);
  };

  // Stats
  const stats = {
    total: batches.length,
    inProgress: batches.filter(b => b.status === "in-progress").length,
    completed: batches.filter(b => b.status === "completed").length,
    qualityCheck: batches.filter(b => b.status === "quality-check").length,
  };

  const filtered = filter === "all"
    ? batches
    : batches.filter(b => b.status === filter);

  return (
    <div className="space-y-8">
      <ProductionHeader openModal={() => setIsModalOpen(true)} />

      <ProductionStats stats={stats} />

      <ProductionTable
        batches={filtered}
        filter={filter}
        setFilter={setFilter}
      />

      <NewBatchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addBatch}
      />
    </div>
  );
};

export default ProductionPage;

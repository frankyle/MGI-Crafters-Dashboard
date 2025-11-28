import React, { useState, useEffect } from "react";

import SalesHeader from "./sales/SalesHeader";
import SalesSummaryCards from "./sales/SalesSummaryCards";
import SalesTable from "./sales/SalesTable";
import NewSaleForm from "./sales/NewSaleForm";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [formOpen, setFormOpen] = useState(false);

  // Load from localStorage on first load
  useEffect(() => {
    const stored = localStorage.getItem("salesData");
    if (stored) {
      setSales(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage when sales change
  useEffect(() => {
    localStorage.setItem("salesData", JSON.stringify(sales));
  }, [sales]);

  // Add new sale
  const handleAddSale = (sale) => {
    const newSale = {
      id: Date.now(),
      ...sale,
    };

    setSales([newSale, ...sales]);
  };

  // Delete sale
  const handleDelete = (id) => {
    const filtered = sales.filter((s) => s.id !== id);
    setSales(filtered);
  };

  const totalRevenue = sales.reduce((s, x) => s + Number(x.amount), 0);

  return (
    <div className="space-y-8">
      <SalesHeader onAddNew={() => setFormOpen(true)} />

      <SalesSummaryCards
        totalRevenue={totalRevenue}
        totalOrders={sales.length}
      />

      <SalesTable sales={sales} onDelete={handleDelete} />

      <NewSaleForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleAddSale}
      />
    </div>
  );
};

export default Sales;

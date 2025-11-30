// pages/SalesPage.js
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import SalesTable from "./sales/SalesTable";
import NewSalesModal from "./sales/NewSalesModal";
import SalesHeader from "./sales/SalesHeader";

const SalesPage = () => {
  const [sales, setSales] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // -----------------------------
  // GET CURRENT USER ID
  // -----------------------------
  const getUserId = async () => {
    const { data } = await supabase.auth.getUser();
    return data?.user?.id;
  };

  // -----------------------------
  // FETCH SALES (with items)
  // -----------------------------
  const fetchSales = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("sales")
      .select(`*, sales_items(*)`)
      .order("created_at", { ascending: false });

    if (error) toast.error("Failed to fetch sales: " + error.message);
    else setSales(data);

    setLoading(false);
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // -----------------------------
  // SAVE SALE (create or update)
  // -----------------------------
  const saveSale = async (formData) => {
    const userId = await getUserId();

    if (editingSale) {
      // Update sale
      const { error: saleError } = await supabase
        .from("sales")
        .update({
          customer_name: formData.customerName,
          total_amount: formData.grandTotal,
        })
        .eq("id", editingSale.id)
        .select();

      if (saleError) {
        toast.error("Failed to update sale: " + saleError.message);
        return;
      }

      // Delete old items
      await supabase.from("sales_items").delete().eq("sale_id", editingSale.id);

      // Insert new items
      const itemsToInsert = formData.items.map((item) => ({
        sale_id: editingSale.id,
        product: item.product,
        quantity: item.qty,
        price: item.price,
      }));

      const { error: itemsError } = await supabase.from("sales_items").insert(itemsToInsert);

      if (itemsError) toast.error("Failed to update sale items: " + itemsError.message);
      else toast.success("Sale updated successfully!");
    } else {
      // Create new sale
      const { data: saleData, error: saleError } = await supabase
        .from("sales")
        .insert([
          {
            user_id: userId,
            customer_name: formData.customerName,
            total_amount: formData.grandTotal,
          },
        ])
        .select()
        .single();

      if (saleError) {
        toast.error("Failed to save sale: " + saleError.message);
        return;
      }

      const itemsToInsert = formData.items.map((item) => ({
        sale_id: saleData.id,
        product: item.product,
        quantity: item.qty,
        price: item.price,
      }));

      const { error: itemsError } = await supabase.from("sales_items").insert(itemsToInsert);

      if (itemsError) toast.error("Failed to save sale items: " + itemsError.message);
      else toast.success("Sale saved successfully!");
    }

    fetchSales();
    setEditingSale(null);
    setIsModalOpen(false);
  };

  // -----------------------------
  // DELETE SALE
  // -----------------------------
  const deleteSale = async (saleId) => {
    const { error } = await supabase.from("sales").delete().eq("id", saleId);

    if (error) toast.error("Failed to delete sale: " + error.message);
    else {
      toast.success("Sale deleted successfully!");
      fetchSales();
    }
  };

  // -----------------------------
  // START EDIT
  // -----------------------------
  const startEdit = (sale) => {
    setEditingSale({
      ...sale,
      items: sale.sales_items.map((item) => ({
        product: item.product,
        qty: item.quantity,
        price: item.price,
      })),
    });
    setIsModalOpen(true);
  };

  // -----------------------------
  // CALCULATE WIDGETS
  // -----------------------------
  const totalSales = sales.reduce((sum, s) => sum + (s.total_amount || 0), 0);
  const totalOrders = sales.length;
  const productCount = {};
  sales.forEach((s) =>
    s.sales_items.forEach((i) => {
      productCount[i.product] = (productCount[i.product] || 0) + i.quantity;
    })
  );
  const topProduct = Object.entries(productCount)
    .map(([product, qty]) => ({ product, qty }))
    .sort((a, b) => b.qty - a.qty)[0];

  return (
    <div className="space-y-6 p-4">
      <Toaster position="top-right" />

      <h1 className="text-2xl font-bold">Sales Dashboard</h1>

      {/* Top Widgets */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Sales Amount</p>
          <p className="text-xl font-bold">{totalSales.toLocaleString()} Tsh</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-xl font-bold">{totalOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Top Product</p>
          <p className="text-xl font-bold">{topProduct?.product || "-"}</p>
        </div>
      </div>

      {/* View Full Dashboard Button */}
      <div className="flex justify-end mt-2">
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={() => navigate("/dashboard/SalesDashboard")}
        >
          View Full Dashboard
        </button>
      </div>

      {/* Table & Modal */}
      <SalesHeader openModal={() => setIsModalOpen(true)} />

      <SalesTable sales={sales} onEdit={startEdit} onDelete={deleteSale} loading={loading} />

      <NewSalesModal
        isOpen={isModalOpen}
        editingSale={editingSale}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSale(null);
        }}
        onSave={saveSale}
      />
    </div>
  );
};

export default SalesPage;

// pages/dashboard/SalesDashboardPage.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import toast, { Toaster } from "react-hot-toast";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const SalesDashboardPage = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("sales").select("*, sales_items(*)");
    if (error) toast.error("Failed to fetch sales: " + error.message);
    else setSales(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // -----------------------------
  // Prepare data for charts
  // -----------------------------
  const totalSalesByDate = {};
  const productSales = {};

  sales.forEach((sale) => {
    const date = new Date(sale.created_at).toLocaleDateString();
    totalSalesByDate[date] = (totalSalesByDate[date] || 0) + (sale.total_amount || 0);

    sale.sales_items.forEach((item) => {
      productSales[item.product] = (productSales[item.product] || 0) + item.quantity;
    });
  });

  const salesByDateData = {
    labels: Object.keys(totalSalesByDate),
    datasets: [
      {
        label: "Sales Amount (Tsh)",
        data: Object.values(totalSalesByDate),
        borderColor: "rgba(54, 162, 235, 0.7)",
        backgroundColor: "rgba(54, 162, 235, 0.3)",
        tension: 0.4,
      },
    ],
  };

  const productSalesData = {
    labels: Object.keys(productSales),
    datasets: [
      {
        label: "Units Sold",
        data: Object.values(productSales),
        backgroundColor: ["#3B82F6", "#F59E0B", "#10B981", "#EF4444", "#8B5CF6"],
      },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold mb-4">Full Sales Dashboard</h1>

      {loading ? (
        <p>Loading sales data...</p>
      ) : (
        <>
          {/* Total Sales Over Time */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Sales Over Time</h2>
            <Line data={salesByDateData} />
          </div>

          {/* Product Sales Pie Chart */}
          <div className="bg-white p-4 rounded-lg shadow mt-6">
            <h2 className="text-lg font-semibold mb-2">Product Sales Breakdown</h2>
            <Pie data={productSalesData} />
          </div>

          {/* Additional Widgets */}
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Total Sales Amount</p>
              <p className="text-xl font-bold">{sales.reduce((sum, s) => sum + (s.total_amount || 0), 0).toLocaleString()} Tsh</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-xl font-bold">{sales.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Top Product</p>
              <p className="text-xl font-bold">
                {Object.entries(productSales).sort((a, b) => b[1] - a[1])[0]?.[0] || "-"}
              </p>
            </div>
          </div>
          {/* Product Sales Bar Chart */}
<div className="bg-white p-4 rounded-lg shadow mt-6">
  <h2 className="text-lg font-semibold mb-2">Product Sales (Bar Chart)</h2>
  <Bar
    data={{
      labels: Object.keys(productSales),
      datasets: [
        {
          label: "Units Sold",
          data: Object.values(productSales),
          backgroundColor: ["#3B82F6", "#F59E0B", "#10B981", "#EF4444", "#8B5CF6"],
        },
      ],
    }}
    options={{
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Units Sold per Product" },
      },
    }}
  />
</div>

        </>
      )}
    </div>
  );
};

export default SalesDashboardPage;

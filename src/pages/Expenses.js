// pages/Expenses.js
import React, { useState, useEffect } from "react";
import ExpensesHeader from "./expenses/ExpensesHeader";
import ExpensesTable from "./expenses/ExpensesTable";
import NewExpenseModal from "./expenses/NewExpenseModal";
import { supabase } from "../supabaseClient";
import toast, { Toaster } from "react-hot-toast";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // -----------------------------
  // Get logged-in user ID
  // -----------------------------
  const getUserId = async () => {
    const { data } = await supabase.auth.getUser();
    return data?.user?.id;
  };

  // -----------------------------
  // Fetch all expenses
  // -----------------------------
  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch expenses: " + error.message);
    } else {
      setExpenses(data);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // -----------------------------
  // Save (create or update)
  // -----------------------------
  const saveExpense = async (formData) => {
    const userId = await getUserId();

    if (editingExpense) {
      // Update
      const { error } = await supabase
        .from("expenses")
        .update({
          category: formData.category,
          name: formData.name,
          description: formData.description,
          vendor: formData.vendor,
          date: formData.date,
          amount: formData.amount,
          payment_method: formData.payment_method,
        })
        .eq("id", editingExpense.id)
        .select();

      if (error) toast.error("Failed to update: " + error.message);
      else {
        toast.success("Expense updated successfully!");
        fetchExpenses();
      }

      setEditingExpense(null);
    } else {
      // Create
      const { error } = await supabase
        .from("expenses")
        .insert([
          {
            category: formData.category,
            name: formData.name,
            description: formData.description,
            vendor: formData.vendor,
            date: formData.date,
            amount: formData.amount,
            payment_method: formData.payment_method,
            user_id: userId,
          },
        ])
        .select();

      if (error) toast.error("Failed to save: " + error.message);
      else {
        toast.success("Expense saved successfully!");
        fetchExpenses();
      }
    }
  };

  // -----------------------------
  // Delete expense
  // -----------------------------
  const deleteExpense = async (id) => {
    const { error } = await supabase.from("expenses").delete().eq("id", id);

    if (error) toast.error("Failed to delete: " + error.message);
    else {
      toast.success("Expense deleted successfully!");
      fetchExpenses();
    }
  };

  // -----------------------------
  // Edit handler
  // -----------------------------
  const startEdit = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <Toaster position="top-right" />
      <ExpensesHeader openModal={() => setIsModalOpen(true)} />

      <ExpensesTable
        expenses={expenses}
        onEdit={startEdit}
        onDelete={deleteExpense}
      />

      <NewExpenseModal
        isOpen={isModalOpen}
        editingExpense={editingExpense}
        onClose={() => {
          setIsModalOpen(false);
          setEditingExpense(null);
        }}
        onSave={saveExpense}
      />
    </div>
  );
};

export default Expenses;

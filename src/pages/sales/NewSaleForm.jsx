import { motion } from "framer-motion";

const NewSaleForm = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const sale = Object.fromEntries(formData);

    // convert values to correct types
    const formattedSale = {
      customer: sale.customer,
      category: sale.category,
      product: sale.product,
      quantity: Number(sale.quantity),
      amount: Number(sale.amount),
      date: sale.date,
    };

    onSubmit(formattedSale);
    e.target.reset(); // Clear form
    onClose(); // Close modal
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.form
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">Record New Sale</h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input name="customer" required placeholder="Customer Name" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />

            <input name="category" required placeholder="Category" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />

            <input name="product" required placeholder="Product" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />

            <input name="quantity" type="number" min="1" required placeholder="Quantity" className="w-full px-4 py-3 border rounded-lg" />

            <input name="amount" type="number" min="0" step="500" required placeholder="Amount (TZS)" className="w-full px-4 py-3 border rounded-lg" />

            <input name="date" type="date" required className="w-full px-4 py-3 border rounded-lg" />
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button type="button" onClick={onClose} className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300">
            Cancel
          </button>

          <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Save Sale
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default NewSaleForm;

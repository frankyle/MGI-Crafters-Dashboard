import { motion } from "framer-motion";

const NewBatchModal = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Create New Batch
        </h2>

        {/* FORM */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.target));
            onSave(data);
            onClose();
          }}
          className="space-y-4"
        >
          <div>
            <label className="text-sm font-medium text-gray-700">Batch No.</label>
            <input
              name="batchNo"
              className="mt-1 w-full border rounded-lg p-2"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Product</label>
            <input
              name="product"
              className="mt-1 w-full border rounded-lg p-2"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              name="quantity"
              className="mt-1 w-full border rounded-lg p-2"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Unit</label>
            <input
              name="unit"
              className="mt-1 w-full border rounded-lg p-2"
              placeholder="kg, grams, pcs..."
              required
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default NewBatchModal;

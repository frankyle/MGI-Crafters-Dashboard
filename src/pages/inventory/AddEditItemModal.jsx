// components/inventory/AddEditItemModal.jsx
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { supabase } from "../../supabaseClient";
import { Globe } from "lucide-react"; // Import Globe icon

// Object inayoshikilia maneno yote yanayotakiwa kutafsiriwa
const translations = {
  sw: {
    titleAdd: "Ongeza Bidhaa Mpya",
    titleEdit: "Badilisha Bidhaa",
    nameLabel: "Jina la Bidhaa",
    namePlaceholder: "Mfano: Tangawizi, Manjano, Binzari",
    requiredError: "Jina la bidhaa linahitajika!",
    quantityLabel: "Idadi Iliyopo Sasa",
    reorderLabel: "Kiwango cha Kuagiza Tena (Reorder Level)",
    reorderHelp: "Kumbusho: Ikiwa idadi itafika au chini ya namba hii, itaonyesha 'Low Stock' kwenye jedwali.",
    reorderExample: "Mfano: Weka 20 → ukibaki na 20 au chini, utapata taarifa.",
    unitLabel: "Kipimo",
    supplierLabel: "Muuzaji / Supplier (hiari)",
    supplierPlaceholder: "Mfano: Mama Bamia, Morogoro",
    notesLabel: "Maelezo ya Ziada (hiari)",
    notesPlaceholder: "Mfano: Tangawizi, Manjano, Binzari inauzwa haraka...",
    cancel: "Ghairi",
    save: "Ongeza Bidhaa",
    update: "Badilisha",
    saving: "Inahifadhi...",
    successAdd: "Bidhaa imeongezwa kikamilifu!",
    successEdit: "Bidhaa imebadilishwa kikamilifu!",
    fail: "Imeshindwa kuhifadhi:",
  },
  en: {
    titleAdd: "Add New Item",
    titleEdit: "Edit Item",
    nameLabel: "Item Name",
    namePlaceholder: "E.g.: Ginger, Turmeric, Cumin",
    requiredError: "Item name is required!",
    quantityLabel: "Current Quantity in Stock",
    reorderLabel: "Reorder Level",
    reorderHelp: "Reminder: If the quantity reaches or goes below this number, it will show 'Low Stock' in the table.",
    reorderExample: "Example: Set 20 → when you remain with 20 or less, you'll get a notification.",
    unitLabel: "Unit",
    supplierLabel: "Supplier (optional)",
    supplierPlaceholder: "E.g.: Mama Bamia, Morogoro",
    notesLabel: "Additional Notes (optional)",
    notesPlaceholder: "E.g.: Ginger, Turmeric, Cumin sells fast...",
    cancel: "Cancel",
    save: "Add Item",
    update: "Update",
    saving: "Saving...",
    successAdd: "Item added successfully!",
    successEdit: "Item updated successfully!",
    fail: "Failed to save:",
  },
};

// Vifupisho vya lugha unavyoweza kuvitumia
const unitOptions = [
    { value: "pcs", sw: "Vipande (pcs)", en: "Pieces (pcs)" },
    { value: "kg", sw: "Kilo (kg)", en: "Kilogram (kg)" },
    { value: "g", sw: "Gramu (g)", en: "Grams (g)" },
    { value: "liter", sw: "Lita", en: "Liter" },
    { value: "box", sw: "Boksa", en: "Box" },
    { value: "pack", sw: "Paketi", en: "Pack" },
    { value: "sack", sw: "Gunia", en: "Sack" },
];


const AddEditItemModal = ({ isOpen, onClose, editingItem, tableName, onSave }) => {
  // State mpya ya lugha. Default ni Swahili (sw)
  const [language, setLanguage] = useState("sw"); 
  
  // Kutafsiri maneno kulingana na lugha iliyopo
  const t = translations[language]; 

  const [formData, setFormData] = useState({
    name: "",
    quantity: 0,
    unit: "pcs",
    reorder_level: 10,
    supplier: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || "",
        quantity: editingItem.quantity || 0,
        unit: editingItem.unit || "pcs",
        reorder_level: editingItem.reorder_level || 10,
        supplier: editingItem.supplier || "",
        notes: editingItem.notes || "",
      });
    } else {
      setFormData({
        name: "",
        quantity: 0,
        unit: "pcs",
        reorder_level: 10,
        supplier: "",
        notes: "",
      });
    }
  }, [editingItem, isOpen]);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleNumber = (field) => (e) => {
    // Hii hapa nitaibadilisha kidogo, ili value iweze kuwa 'empty string' katika input type="number"
    const rawValue = e.target.value;
    const value = rawValue === "" ? "" : parseFloat(rawValue) || 0;
    setFormData({ ...formData, [field]: value });
  };
  
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'sw' ? 'en' : 'sw');
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      // Inatumia ujumbe wa kosa uliotafsiriwa
      toast.error(t.requiredError); 
      return;
    }
    
    // Hakikisha namba zinaenda Supabase kama namba
    const dataToSave = {
        ...formData,
        quantity: Number(formData.quantity) || 0,
        reorder_level: Number(formData.reorder_level) || 0,
    };


    setLoading(true);
    try {
      if (editingItem) {
        // INATUMIA tableName ILIYOPITISHWA:
        const { error } = await supabase
          .from(tableName)
          .update(dataToSave)
          .eq("id", editingItem.id);

        if (error) throw error;
        toast.success(t.successEdit);
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        
        // INATUMIA tableName ILIYOPITISHWA:
        const { error } = await supabase.from(tableName).insert({
          ...dataToSave,
          user_id: user?.id,
        });

        if (error) throw error;
        toast.success(t.successAdd);
      }

      onSave();
      onClose();
    } catch (err) {
      toast.error(t.fail + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto">
        
        {/* Header yenye Title na Lugha Button */}
        <div className="bg-blue-600 text-white p-4 rounded-t-xl flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {editingItem ? t.titleEdit : t.titleAdd}
          </h2>
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1 p-1.5 rounded-full hover:bg-blue-700 transition"
            title={language === 'sw' ? "Change to English" : "Badili kwenda Kiswahili"}
          >
            <Globe size={20} />
            <span className="font-semibold text-sm">
              {language === 'sw' ? 'EN' : 'SW'}
            </span>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Jina */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.nameLabel} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={handleChange("name")}
              placeholder={t.namePlaceholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Idadi na Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.quantityLabel}
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={handleNumber("quantity")}
                placeholder="0"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.unitLabel}
              </label>
              <select
                value={formData.unit}
                onChange={handleChange("unit")}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {/* Tumia unitOptions kwa kutafsiri vizuri */}
                {unitOptions.map(option => (
                    <option key={option.value} value={option.value}>
                        {language === 'sw' ? option.sw : option.en}
                    </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reorder Level - na maelezo wazi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.reorderLabel}
            </label>
            <input
              type="number"
              value={formData.reorder_level}
              onChange={handleNumber("reorder_level")}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-2">
              {t.reorderHelp} 
              <span className="font-semibold text-red-600"> {language === 'sw' ? "itaonyesha 'Low Stock'" : "will show 'Low Stock'"}</span>
              <br />
              <strong>{t.reorderExample.split("→")[0]} →</strong> {t.reorderExample.split("→")[1]}
            </p>
          </div>

          {/* Supplier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.supplierLabel}
            </label>
            <input
              type="text"
              value={formData.supplier}
              onChange={handleChange("supplier")}
              placeholder={t.supplierPlaceholder}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.notesLabel}
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={handleChange("notes")}
              placeholder={t.notesPlaceholder}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 p-6 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-medium transition"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70 font-medium transition shadow-lg"
          >
            {loading ? t.saving : editingItem ? t.update : t.save}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditItemModal;

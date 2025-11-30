// components/inventory/InventoryTable.jsx
import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { supabase } from "../../supabaseClient";
import AddEditItemModal from "./AddEditItemModal";
import { Edit, Trash2, Search, AlertTriangle, Globe } from "lucide-react";

// Maneno ya Kutafsiri - Tutaongeza maneno machache ya ziada hapa kwa ajili ya Table
const translations = {
  sw: {
    title: "Orodha ya Bidhaa",
    searchPlaceholder: "Tafuta jina la bidhaa...",
    addItem: "Ongeza Bidhaa Mpya",
    itemName: "Jina la Bidhaa",
    currentStock: "Idadi Ilipo",
    unit: "Kipimo",
    reorderLevel: "Kiwango cha Kuagiza",
    supplier: "Muuzaji",
    notes: "Maelezo",
    actions: "Vitendo",
    lowStock: "Bidhaa Chache",
    noItems: "Hakuna bidhaa zilizopatikana.",
    loading: "Inapakia data...",
    confirmDelete: "Je, una uhakika unataka kufuta bidhaa hii?",
    deleteSuccess: "Bidhaa imefutwa kikamilifu!",
    deleteFail: "Imeshindwa kufuta:",
  },
  en: {
    title: "Inventory List",
    searchPlaceholder: "Search item name...",
    addItem: "Add New Item",
    itemName: "Item Name",
    currentStock: "Current Stock",
    unit: "Unit",
    reorderLevel: "Reorder Level",
    supplier: "Supplier",
    notes: "Notes",
    actions: "Actions",
    lowStock: "Low Stock",
    noItems: "No items found.",
    loading: "Loading data...",
    confirmDelete: "Are you sure you want to delete this item?",
    deleteSuccess: "Item deleted successfully!",
    deleteFail: "Failed to delete:",
  },
};

// Vifupisho vya lugha unavyoweza kuvitumia (Kama ilivyo kwenye Modal)
const unitOptions = [
    { value: "pcs", sw: "Vipande (pcs)", en: "Pieces (pcs)" },
    { value: "kg", sw: "Kilo (kg)", en: "Kilogram (kg)" },
    { value: "g", sw: "Gramu (g)", en: "Grams (g)" },
    { value: "liter", sw: "Lita", en: "Liter" },
    { value: "box", sw: "Boksa", en: "Box" },
    { value: "pack", sw: "Paketi", en: "Pack" },
    { value: "sack", sw: "Gunia", en: "Sack" },
];

// **********************************************
// KUMBUKA: TABLE_NAME IMEONDOLEWA NA KUBADILISHWA KUWA PROP
// **********************************************


const InventoryTable = ({ tableName }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [language, setLanguage] = useState("sw"); // State ya lugha

  const t = translations[language]; // Mtafsiri

  // Function ya kuchagua jina la unit
  const getUnitName = (value) => {
    const unit = unitOptions.find(opt => opt.value === value);
    if (!unit) return value; // Inarudi value ikiwa haikupatikana
    return language === 'sw' ? unit.sw : unit.en;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'sw' ? 'en' : 'sw');
  };

  // Function ya kupakia data
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setItems([]);
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from(tableName) // TUMIA TABLE NAME KUTOKA PROPS
        .select("*")
        .eq("user_id", user.id)
        .order("name", { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      toast.error(t.fail + err.message);
    } finally {
      setLoading(false);
    }
  }, [tableName, t.fail]); // TEGEMEZI LA TABLE NAME LIMEONGEZWA

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm(t.confirmDelete)) {
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from(tableName) // TUMIA TABLE NAME KUTOKA PROPS
        .delete()
        .eq("id", itemId);

      if (error) throw error;
      toast.success(t.deleteSuccess);
      fetchItems();
    } catch (err) {
      toast.error(t.deleteFail + err.message);
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };
  
  // Data iliyochujwa kulingana na searchTerm
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      
      {/* Header na Vitendo */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold text-gray-800">{t.title} ({tableName.replace('_', ' ').toUpperCase()})</h1> {/* KUTAMBULISHA JEDWALI */}
        <div className="flex items-center space-x-3">
          
          {/* Kitufe cha Lugha */}
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1 p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            title={language === 'sw' ? "Change to English" : "Badili kwenda Kiswahili"}
          >
            <Globe size={20} className="text-blue-600"/>
            <span className="font-semibold text-sm">
              {language === 'sw' ? 'EN' : 'SW'}
            </span>
          </button>
          
          {/* Kitufe cha Kuongeza Bidhaa */}
          <button
            onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            {t.addItem}
          </button>
        </div>
      </div>

      {/* Sehemu ya Kutafuta */}
      <div className="mb-6 relative">
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      {/* Jedwali */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.itemName}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.currentStock}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.unit}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">{t.reorderLevel}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">{t.supplier}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">{t.notes}</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t.actions}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  {t.loading}
                </td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  {t.noItems}
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const isLowStock = item.quantity <= item.reorder_level;
                return (
                  <tr key={item.id} className={isLowStock ? 'bg-red-50 hover:bg-red-100 transition' : 'hover:bg-gray-50 transition'}>
                    
                    {/* Jina la Bidhaa - Inaonyesha Alama ya Hatari */}
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      <div className="flex items-center">
                        {isLowStock && (
                          <AlertTriangle className="w-5 h-5 text-red-600 mr-2" title={t.lowStock} />
                        )}
                        {item.name}
                      </div>
                    </td>
                    
                    {/* Idadi Ilipo */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.quantity}
                    </td>
                    
                    {/* Kipimo (Unit) */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                       {getUnitName(item.unit)}
                    </td>
                    
                    {/* Kiwango cha Kuagiza */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      {item.reorder_level}
                    </td>
                    
                    {/* Muuzaji */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                      {item.supplier || '-'}
                    </td>
                    
                    {/* Maelezo */}
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate hidden lg:table-cell">
                      {item.notes || '-'}
                    </td>
                    
                    {/* Vitendo */}
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-900 transition"
                          title={language === 'sw' ? "Badilisha" : "Edit"}
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900 transition disabled:opacity-50"
                          disabled={loading}
                          title={language === 'sw' ? "Futa" : "Delete"}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal ya Kuongeza/Kuhariri Bidhaa */}
      <AddEditItemModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        editingItem={editingItem}
        tableName={tableName} // TUMIA TABLE NAME KUTOKA PROPS
        onSave={fetchItems} // Inapakia tena data baada ya kuhifadhi
      />
    </div>
  );
};

export default InventoryTable;
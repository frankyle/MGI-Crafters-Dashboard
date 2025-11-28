import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, DollarSign, ShoppingCart, Package, Beaker, X, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Expenses", url: "/expenses", icon: DollarSign },
  { title: "Sales", url: "/sales", icon: ShoppingCart },
  { title: "Inventory", url: "/inventory", icon: Package },
  { title: "Production", url: "/production", icon: Beaker },
];

export function AppSidebar({ mobileOpen, setMobileOpen }) {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Get current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/signin");
  };

  return (
    <div
      className={`
        fixed lg:static z-30 h-full bg-white border-r
        transition-all duration-300
        ${collapsed ? "w-16" : "w-64"}
        ${mobileOpen ? "left-0" : "-left-64"} 
        lg:left-0
      `}
    >
      {/* Top section */}
      <div className="p-4 border-b flex items-center justify-between">
        {!collapsed && (
          <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
            MGI Flavour Crafters
          </h2>
        )}

        {/* Collapse btn (desktop) */}
        <button
          className="hidden lg:block text-gray-500 hover:text-gray-800"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? "➡️" : "⬅️"}
        </button>

        {/* Close button (mobile) */}
        <button
          className="lg:hidden text-gray-700"
          onClick={() => setMobileOpen(false)}
        >
          <X />
        </button>
      </div>

      {/* Menu */}
      <nav className="mt-2 overflow-y-auto h-[calc(100%-120px)] flex flex-col justify-between">
        <ul>
          {menuItems.map((item) => (
            <li key={item.title}>
              <NavLink
                to={item.url}
                end
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-600 font-bold border-l-2 border-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
                onClick={() => setMobileOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Logout Button */}
        {user && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-100 w-full"
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span>Logout</span>}
          </button>
        )}
      </nav>
    </div>
  );
}

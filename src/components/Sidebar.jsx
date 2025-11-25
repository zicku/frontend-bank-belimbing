import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Users, Percent, Wallet, LayoutDashboard, LogOut } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const menuItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      path: "/rekening",
      label: "Rekening & Transaksi",
      icon: <Wallet size={20} />,
    },
    {
      path: "/nasabah",
      label: "Master Nasabah",
      icon: <Users size={20} />,
    },
    {
      path: "/deposito",
      label: "Master Deposito",
      icon: <Percent size={20} />,
    },
  ];

  return (
    <aside className="w-64 bg-white shadow-xl min-h-screen hidden md:flex flex-col z-10 sticky top-0">
      {/* Header Sidebar */}
      <div className="p-6 border-b border-slate-100">
        <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
          <LayoutDashboard className="text-blue-600" />
          Bank App
        </h1>
        <p className="text-xs text-slate-400 mt-1 pl-8">Belimbing AI Bank</p>
      </div>

      {/* Menu Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <span
                className={
                  isActive
                    ? "text-white"
                    : "text-slate-400 group-hover:text-blue-600"
                }
              >
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Sidebar */}
      <div className="p-4 border-t border-slate-100">
        <button className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg w-full transition-colors text-sm font-medium">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}

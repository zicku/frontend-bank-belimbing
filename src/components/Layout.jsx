import React from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex">
      <Sidebar />
      <main className="flex-1 h-screen overflow-y-auto">
        <div className="p-8 pb-20">{children}</div>
      </main>
    </div>
  );
}

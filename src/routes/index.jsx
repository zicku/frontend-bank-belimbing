import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";

import DashboardPage from "../pages/DashboardPage";
import RekeningPage from "../pages/RekeningPage";
import NasabahPage from "../pages/NasabahPage";
import DepositoPage from "../pages/DepositoPage";

export default function AppRouter() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/rekening" element={<RekeningPage />} />
        <Route path="/nasabah" element={<NasabahPage />} />
        <Route path="/deposito" element={<DepositoPage />} />
      </Routes>
    </Layout>
  );
}

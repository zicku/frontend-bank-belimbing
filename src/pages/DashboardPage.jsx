import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Wallet,
  Users,
  TrendingUp,
  Award,
  PieChart,
} from "lucide-react";
import apiService from "../services/api";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalNasabah: 0,
    totalRekening: 0,
    totalAset: 0,
    topDepositos: [], // Untuk chart deposito populer
    topSultans: [], // Untuk list nasabah saldo terbanyak
  });

  const formatIDR = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await apiService.getDashboardData();
        const { customers, accounts } = res.data;

        // Hitung Total Aset
        const totalAset = accounts.reduce(
          (sum, acc) => sum + parseFloat(acc.balance),
          0
        );

        // Hitung Deposito Terpopuler
        const depositoCount = {};
        accounts.forEach((acc) => {
          const typeName = acc.deposito_name || "Unknown";
          depositoCount[typeName] = (depositoCount[typeName] || 0) + 1;
        });

        const sortedDepositos = Object.keys(depositoCount)
          .map((key) => ({ name: key, count: depositoCount[key] }))
          .sort((a, b) => b.count - a.count);

        // Cari Nasabah Sultan
        const nasabahBalances = {};
        accounts.forEach((acc) => {
          const name = acc.customer_name;
          nasabahBalances[name] =
            (nasabahBalances[name] || 0) + parseFloat(acc.balance);
        });

        const sortedSultans = Object.keys(nasabahBalances)
          .map((key) => ({ name: key, balance: nasabahBalances[key] }))
          .sort((a, b) => b.balance - a.balance)
          .slice(0, 5);

        setStats({
          totalNasabah: customers.length,
          totalRekening: accounts.length,
          totalAset,
          topDepositos: sortedDepositos,
          topSultans: sortedSultans,
        });
      } catch (err) {
        console.error("Error dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-slate-500 animate-pulse">
        Sedang menyiapkan dashboard...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <LayoutDashboard className="text-blue-600" size={32} /> Dashboard
          Eksekutif
        </h1>
        <p className="text-slate-500 mt-1">
          Ringkasan performa Belimbing Bank hari ini.
        </p>
      </div>

      {/* KARTU STATISTIK UTAMA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Aset */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Wallet size={24} className="text-white" />
            </div>
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
              Update Live
            </span>
          </div>
          <p className="text-blue-100 text-sm font-medium">
            Total Aset Dikelola
          </p>
          <h2 className="text-3xl font-bold mt-1">
            {formatIDR(stats.totalAset)}
          </h2>
        </div>

        {/* Total Nasabah */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
              <Users size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Total Nasabah</p>
              <h2 className="text-2xl font-bold text-slate-800">
                {stats.totalNasabah}
              </h2>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-50 text-xs text-slate-400">
            Nasabah aktif terdaftar
          </div>
        </div>

        {/* Total Rekening */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Total Rekening Deposito</p>
              <h2 className="text-2xl font-bold text-slate-800">
                {stats.totalRekening}
              </h2>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-50 text-xs text-slate-400">
            Akun deposito yang dibuka
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* DEPOSITO TERPOPULER */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
            <PieChart size={20} className="text-purple-500" />
            Deposito Paling Laris
          </h3>
          <div className="space-y-4">
            {stats.topDepositos.length === 0 ? (
              <p className="text-slate-400 text-center py-4">Belum ada data</p>
            ) : (
              stats.topDepositos.map((item, index) => {
                const percentage = (item.count / stats.totalRekening) * 100;
                return (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-bold text-slate-700">
                        #{index + 1} {item.name}
                      </span>
                      <span className="text-slate-500">
                        {item.count} Rekening ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${
                          index === 0 ? "bg-purple-600" : "bg-purple-300"
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* TOP SULTAN*/}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
            <Award size={20} className="text-yellow-500" />
            Top 5 Nasabah Sultan
          </h3>
          <div className="overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                <tr>
                  <th className="py-3 px-4 text-left">Peringkat</th>
                  <th className="py-3 px-4 text-left">Nama Nasabah</th>
                  <th className="py-3 px-4 text-right">Total Simpanan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.topSultans.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-6 text-slate-400">
                      Belum ada data
                    </td>
                  </tr>
                ) : (
                  stats.topSultans.map((sultan, index) => (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="py-3 px-4">
                        {index === 0 ? (
                          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold border border-yellow-200">
                            👑 Juara 1
                          </span>
                        ) : (
                          <span className="text-slate-500 font-mono">
                            #{index + 1}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-700">
                        {sultan.name}
                      </td>
                      <td className="py-3 px-4 text-right text-blue-600 font-bold">
                        {formatIDR(sultan.balance)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import {
  CreditCard,
  PlusCircle,
  Edit2,
  Trash2,
  ArrowUpCircle,
  ArrowDownCircle,
  Save,
  X,
  Calculator,
  CalendarClock,
} from "lucide-react";
import apiService from "../services/api";

export default function RekeningPage() {
  const [accounts, setAccounts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal Create/Edit Account
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [accountForm, setAccountForm] = useState({
    customer_id: "",
    deposito_type_id: "",
  });

  // Modal Transaction
  const [showTransModal, setShowTransModal] = useState(false);
  const [transForm, setTransForm] = useState({
    accountId: null,
    currentBalance: 0,
    lastDate: null,
    type: "deposit",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [calculationResult, setCalculationResult] = useState(null);

  const fetchData = async () => {
    try {
      const res = await apiService.getDashboardData();
      setAccounts(res.data.accounts);
      setCustomers(res.data.customers);
      setTypes(res.data.types);
    } catch (err) {
      alert("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatIDR = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(num);

  const formatDate = (dateString) => {
    if (!dateString) return "Baru Buka";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleSaveAccount = async (e) => {
    if (e) e.preventDefault();

    try {
      if (editingAccount) {
        await apiService.updateAccount(
          editingAccount.id,
          accountForm.deposito_type_id
        );
      } else {
        if (!accountForm.customer_id || !accountForm.deposito_type_id)
          return alert("Lengkapi data");
        await apiService.createAccount(accountForm);
      }
      setShowAccountModal(false);
      setEditingAccount(null);
      setAccountForm({ customer_id: "", deposito_type_id: "" });
      fetchData();
    } catch (err) {
      alert("Gagal simpan akun");
    }
  };

  const handleDeleteAccount = async (id) => {
    if (!window.confirm("Hapus rekening?")) return;
    try {
      await apiService.deleteAccount(id);
      fetchData();
    } catch (err) {
      alert("Gagal hapus");
    }
  };

  const openEditModal = (acc) => {
    setEditingAccount(acc);
    setAccountForm({
      customer_id: acc.customer_id,
      deposito_type_id: acc.deposito_type_id || "",
    });
    setShowAccountModal(true);
  };

  const openTransactionModal = (acc, type) => {
    setTransForm({
      accountId: acc.id,
      currentBalance: parseFloat(acc.balance),
      lastDate: acc.last_transaction_date,
      type: type,
      amount: "",
      date: new Date().toISOString().split("T")[0],
    });
    setCalculationResult(null);
    setShowTransModal(true);
  };

  const handleCalculate = async () => {
    if (!transForm.date) return alert("Pilih tanggal penarikan");
    try {
      const res = await apiService.calculateWithdraw({
        accountId: transForm.accountId,
        withdrawDate: transForm.date,
      });
      setCalculationResult(res.data);
      setTransForm((prev) => ({ ...prev, amount: res.data.ending_balance }));
    } catch (err) {
      alert("Gagal hitung: " + (err.response?.data?.message || err.message));
    }
  };

  const handleProcessTransaction = async (e) => {
    if (e) e.preventDefault();

    if (!transForm.amount || transForm.amount <= 0)
      return alert("Masukkan jumlah uang yang valid");

    try {
      await apiService.processTransaction({
        accountId: transForm.accountId,
        type: transForm.type,
        amount: transForm.amount,
        date: transForm.date,
      });
      alert("Transaksi Berhasil!");
      setShowTransModal(false);
      fetchData();
    } catch (err) {
      alert("Gagal: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
          <CreditCard className="text-blue-600" /> Master Rekening
        </h2>
        <button
          onClick={() => {
            setEditingAccount(null);
            setAccountForm({ customer_id: "", deposito_type_id: "" });
            setShowAccountModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex gap-2 font-bold hover:bg-blue-700"
        >
          <PlusCircle size={20} /> Buka Rekening
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Nasabah</th>
              <th className="px-6 py-3 text-left">Paket Deposito</th>
              <th className="px-6 py-3 text-right">Saldo</th>
              <th className="px-6 py-3 text-left">Update Terakhir</th>
              <th className="px-6 py-3 text-center">Transaksi</th>
              <th className="px-6 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc) => (
              <tr key={acc.id} className="border-b hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-700">
                    {acc.customer_name}
                  </div>
                  <div className="font-mono text-xs text-slate-400">
                    ID: {acc.id}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-yellow-100 text-yellow-800 py-1 px-2 rounded-full text-xs font-bold">
                    {acc.deposito_name}
                  </span>
                  <div className="text-xs text-slate-400 mt-1">
                    {acc.yearly_return}% / tahun
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-bold text-slate-700 text-base">
                  {formatIDR(acc.balance)}
                </td>
                <td className="px-6 py-4 text-slate-500">
                  <div className="flex items-center gap-2">
                    <CalendarClock size={16} />
                    {formatDate(acc.last_transaction_date)}
                  </div>
                </td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button
                    onClick={() => openTransactionModal(acc, "deposit")}
                    className="bg-green-100 text-green-700 p-2 rounded hover:bg-green-200"
                    title="Setor"
                  >
                    <ArrowUpCircle size={18} />
                  </button>
                  <button
                    onClick={() => openTransactionModal(acc, "withdraw")}
                    className="bg-orange-100 text-orange-700 p-2 rounded hover:bg-orange-200"
                    title="Tarik"
                  >
                    <ArrowDownCircle size={18} />
                  </button>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => openEditModal(acc)}
                    className="text-blue-500"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteAccount(acc.id)}
                    className="text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL ACCOUNT */}
      {showAccountModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
            <h3 className="font-bold text-lg mb-4">
              {editingAccount ? "Edit Akun" : "Buka Rekening"}
            </h3>
            {/* TAMBAHAN FORM */}
            <form onSubmit={handleSaveAccount}>
              <div className="space-y-4">
                <select
                  className="w-full border p-2 rounded"
                  value={accountForm.customer_id}
                  disabled={!!editingAccount}
                  autoFocus
                  onChange={(e) =>
                    setAccountForm({
                      ...accountForm,
                      customer_id: e.target.value,
                    })
                  }
                >
                  <option value="">-- Pilih Nasabah --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <select
                  className="w-full border p-2 rounded"
                  value={accountForm.deposito_type_id}
                  onChange={(e) =>
                    setAccountForm({
                      ...accountForm,
                      deposito_type_id: e.target.value,
                    })
                  }
                >
                  <option value="">-- Pilih Paket --</option>
                  {types.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.yearly_return}%)
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAccountModal(false)}
                  className="flex-1 border p-2 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white p-2 rounded"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TRANSAKSI */}
      {showTransModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[450px] shadow-2xl">
            <div className="flex justify-between mb-4 border-b pb-2">
              <h3
                className={`font-bold text-xl flex items-center gap-2 ${
                  transForm.type === "deposit"
                    ? "text-green-600"
                    : "text-orange-600"
                }`}
              >
                {transForm.type === "deposit" ? (
                  <ArrowUpCircle />
                ) : (
                  <ArrowDownCircle />
                )}
                {transForm.type === "deposit"
                  ? "Setor Tunai"
                  : "Tarik Tunai (Withdraw)"}
              </h3>
              <button onClick={() => setShowTransModal(false)}>
                <X size={20} />
              </button>
            </div>

            {/* TAMBAHAN FORM */}
            <form onSubmit={handleProcessTransaction}>
              <div className="space-y-4">
                <div className="bg-slate-50 p-3 rounded text-sm grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-xs text-slate-400">
                      Saldo Awal
                    </span>
                    <span className="font-bold text-slate-700 text-lg">
                      {formatIDR(transForm.currentBalance)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400">
                      Transaksi Terakhir
                    </span>
                    <span className="font-bold text-blue-600">
                      {formatDate(transForm.lastDate)}
                    </span>
                  </div>
                </div>

                {/* INPUT TANGGAL */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    Tanggal Transaksi
                  </label>
                  <input
                    type="date"
                    autoFocus
                    className="w-full border p-2 rounded"
                    value={transForm.date}
                    onChange={(e) => {
                      setTransForm({ ...transForm, date: e.target.value });
                      setCalculationResult(null);
                    }}
                  />
                </div>

                {/* TOMBOL KALKULASI BUNGA*/}
                {transForm.type === "withdraw" && (
                  <div className="bg-blue-50 p-3 rounded border border-blue-100">
                    <button
                      type="button"
                      onClick={handleCalculate}
                      className="w-full bg-slate-800 text-white py-2 rounded flex items-center justify-center gap-2 hover:bg-slate-900 text-sm mb-2"
                    >
                      <Calculator size={16} /> Hitung Saldo Akhir (Pokok +
                      Bunga)
                    </button>

                    {calculationResult && (
                      <div className="text-sm space-y-1 animate-in fade-in">
                        <div className="flex justify-between">
                          <span>Lama Simpan:</span>
                          <span className="font-bold">
                            {calculationResult.duration_months} Bulan
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Bunga:</span>
                          <span className="font-bold text-green-600">
                            {formatIDR(calculationResult.interest)}
                          </span>
                        </div>
                        <div className="flex justify-between font-bold border-t border-blue-200 pt-1 mt-1">
                          <span>Total Terima:</span>
                          <span className="text-blue-700">
                            {formatIDR(calculationResult.ending_balance)}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 italic text-center">
                          *Jumlah penarikan otomatis diisi dengan Total Terima.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* INPUT JUMLAH UANG */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    Jumlah{" "}
                    {transForm.type === "deposit" ? "Setoran" : "Penarikan"}
                  </label>
                  <input
                    type="number"
                    className="w-full border p-2 rounded font-bold text-lg"
                    placeholder="Rp 0"
                    value={transForm.amount}
                    onChange={(e) =>
                      setTransForm({ ...transForm, amount: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowTransModal(false)}
                  className="flex-1 border border-slate-300 p-2 rounded hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`flex-1 p-2 rounded text-white font-bold shadow-lg ${
                    transForm.type === "deposit"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-orange-600 hover:bg-orange-700"
                  }`}
                >
                  Konfirmasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Users, PlusCircle, Edit2, Trash2, Save, X } from "lucide-react";
import apiService from "../services/api";

export default function NasabahPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk Modal & Form
  const [showModal, setShowModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State untuk Edit Inline
  const [editingItem, setEditingItem] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiService.getDashboardData();
      setCustomers(res.data.customers);
    } catch (err) {
      console.error(err);
      alert("Gagal memuat data nasabah");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async () => {
    if (!newCustomer.trim()) return alert("Nama nasabah tidak boleh kosong!");

    setIsSubmitting(true);
    try {
      await apiService.createCustomer(newCustomer);
      setNewCustomer("");
      setShowModal(false);
      await fetchData();
    } catch (err) {
      alert(
        "Gagal tambah nasabah: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingItem.name.trim()) return alert("Nama tidak boleh kosong!");

    try {
      await apiService.updateCustomer(editingItem.id, editingItem.name);
      setEditingItem(null);
      fetchData();
    } catch (err) {
      alert("Gagal update data");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus nasabah ini?")) return;
    try {
      await apiService.deleteCustomer(id);
      fetchData();
    } catch (err) {
      alert("Gagal hapus. Nasabah mungkin masih memiliki rekening aktif.");
    }
  };

  // Fungsi agar bisa tekan ENTER saat input
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  const handleEditKeyDown = (e) => {
    if (e.key === "Enter") handleUpdate();
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
          <Users className="text-blue-600" /> Master Nasabah
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex gap-2 font-bold hover:bg-blue-700 transition-colors shadow-sm"
        >
          <PlusCircle size={20} /> Tambah Nasabah
        </button>
      </div>

      {/* TABLE CONTENT */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 animate-pulse">
            Memuat data nasabah...
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-slate-500 uppercase border-b bg-slate-100">
              <tr>
                {/* ID Tetap Kiri */}
                <th className="px-6 py-3 text-left w-20 font-bold">ID</th>

                {/* PERUBAHAN DISINI: Nama Lengkap jadi text-center (Tengah) */}
                <th className="px-6 py-3 text-center font-bold">
                  Nama Lengkap
                </th>

                {/* Aksi Tetap Kanan */}
                <th className="px-6 py-3 text-right w-40 font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center py-8 text-slate-400 italic"
                  >
                    Belum ada data nasabah. Silakan tambah baru.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-slate-400">
                      #{c.id}
                    </td>

                    {/* PERUBAHAN DISINI: Data Nama jadi text-center */}
                    <td className="px-6 py-4 font-medium text-lg text-slate-700 text-center">
                      {editingItem?.id === c.id ? (
                        /* Saat Edit Mode: Input tetap full tapi container di tengah */
                        <div className="flex gap-2 items-center justify-center">
                          <input
                            autoFocus
                            className="border border-blue-300 p-1 rounded w-full max-w-xs text-center focus:outline-none focus:ring-2 focus:ring-blue-200"
                            value={editingItem.name}
                            onChange={(e) =>
                              setEditingItem({
                                ...editingItem,
                                name: e.target.value,
                              })
                            }
                            onKeyDown={handleEditKeyDown}
                          />
                          <button
                            onClick={handleUpdate}
                            className="text-green-600 hover:bg-green-50 p-1 rounded"
                          >
                            <Save size={18} />
                          </button>
                          <button
                            onClick={() => setEditingItem(null)}
                            className="text-red-500 hover:bg-red-50 p-1 rounded"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        c.name
                      )}
                    </td>

                    <td className="px-6 py-4 text-right space-x-2">
                      {editingItem?.id !== c.id && (
                        <>
                          <button
                            onClick={() => setEditingItem(c)}
                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-1 rounded"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded"
                            title="Hapus"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL TAMBAH */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl w-96 shadow-2xl transform transition-all scale-100">
            <h3 className="font-bold mb-4 text-xl text-slate-800">
              Tambah Nasabah Baru
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Nama Lengkap
                </label>
                <input
                  autoFocus
                  className="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Budi Santoso"
                  value={newCustomer}
                  onChange={(e) => setNewCustomer(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-slate-300 p-2 rounded text-slate-600 hover:bg-slate-50 font-medium"
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button
                  onClick={handleAdd}
                  disabled={isSubmitting}
                  className={`flex-1 text-white p-2 rounded font-bold shadow-md transition-colors ${
                    isSubmitting
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

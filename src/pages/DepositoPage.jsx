import React, { useState, useEffect } from "react";
import { Percent, PlusCircle, Edit2, Trash2, Save, X } from "lucide-react";
import apiService from "../services/api";

export default function DepositoPage() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk Modal & Form
  const [showModal, setShowModal] = useState(false);
  const [newType, setNewType] = useState({ name: "", yearly_return: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiService.getDashboardData();
      setTypes(res.data.types);
    } catch (err) {
      console.error(err);
      alert("Error loading types");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async () => {
    if (!newType.name.trim() || !newType.yearly_return) {
      return alert("Nama dan Bunga wajib diisi");
    }

    setIsSubmitting(true);
    try {
      await apiService.createType(newType);
      setNewType({ name: "", yearly_return: "" });
      setShowModal(false);
      await fetchData();
    } catch (err) {
      alert("Gagal tambah tipe");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingItem.name.trim() || !editingItem.yearly_return) {
      return alert("Data tidak boleh kosong");
    }

    try {
      await apiService.updateType(editingItem.id, editingItem);
      setEditingItem(null);
      fetchData();
    } catch (err) {
      alert("Gagal update");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus tipe ini?")) {
      try {
        await apiService.deleteType(id);
        fetchData();
      } catch (err) {
        alert("Gagal hapus");
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  const handleEditKeyDown = (e) => {
    if (e.key === "Enter") handleUpdate();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
          <Percent className="text-orange-600" /> Master Tipe Deposito
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg flex gap-2 font-bold hover:bg-orange-700 shadow-sm"
        >
          <PlusCircle size={20} /> Tambah Tipe
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 animate-pulse">
            Memuat data tipe deposito...
          </div>
        ) : (
          <table className="w-full text-sm">
            {/* Header*/}
            <thead className="bg-slate-100 text-slate-500 uppercase border-b">
              <tr>
                <th className="px-6 py-3 text-left font-bold">Nama Paket</th>
                <th className="px-6 py-3 text-left font-bold">Bunga / Tahun</th>
                <th className="px-6 py-3 text-right font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {types.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center py-8 text-slate-400 italic"
                  >
                    Belum ada data tipe deposito.
                  </td>
                </tr>
              ) : (
                types.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium">
                      {editingItem?.id === t.id ? (
                        <input
                          autoFocus
                          className="border border-orange-300 p-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-orange-200"
                          value={editingItem.name}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              name: e.target.value,
                            })
                          }
                          onKeyDown={handleEditKeyDown}
                        />
                      ) : (
                        t.name
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingItem?.id === t.id ? (
                        <input
                          type="number"
                          className="border border-orange-300 p-1 rounded w-20 focus:outline-none focus:ring-2 focus:ring-orange-200"
                          value={editingItem.yearly_return}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              yearly_return: e.target.value,
                            })
                          }
                          onKeyDown={handleEditKeyDown}
                        />
                      ) : (
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded font-bold border border-orange-200">
                          {t.yearly_return}%
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {editingItem?.id === t.id ? (
                        <>
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
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingItem(t)}
                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-1 rounded"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded"
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

      {/* Modal Tambah*/}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl w-96 space-y-4 shadow-2xl">
            <h3 className="font-bold text-xl text-slate-800">
              Tambah Tipe Deposito
            </h3>

            <div>
              <input
                autoFocus
                className="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Nama Paket"
                value={newType.name}
                onChange={(e) =>
                  setNewType({ ...newType, name: e.target.value })
                }
                onKeyDown={handleKeyDown}
              />
            </div>

            <div>
              <input
                type="number"
                className="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Bunga %"
                value={newType.yearly_return}
                onChange={(e) =>
                  setNewType({ ...newType, yearly_return: e.target.value })
                }
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
                    : "bg-orange-600 hover:bg-orange-700"
                }`}
              >
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

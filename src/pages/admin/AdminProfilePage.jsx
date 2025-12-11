import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { eventService } from "../../services/eventServices";
import { userService } from "../../services/userService";
import { EventFormModal } from "../../components/features/EventFormModal";
import { UserFormModal } from "../../components/features/UserFormModal";
import { toast } from "react-hot-toast";

import {
  LayoutDashboard,
  Calendar,
  Users,
  LogOut,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Clock,
  Ticket,
  TrendingUp,
  Activity,
  Shield,
  Mail,
  AlertTriangle,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AdminProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  // --- STATE DATA ---
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- STATE MODAL FORM ---
  // Event Modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);

  // User Modal (BARU: Untuk Create/Edit User)
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  // --- STATE MODAL KONFIRMASI ---
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "danger",
    onConfirm: null,
  });

  // Pagination khusus untuk event
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Hitung total halaman
  const totalPages = Math.ceil(events.length / itemsPerPage);

  // Data event untuk halaman aktif
  const paginatedEvents = events.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // --- FETCHING LOGIC ---
  useEffect(() => {
    if (activeTab === "dashboard") {
      fetchEvents();
      fetchUsers();
    } else if (activeTab === "events") {
      fetchEvents();
    } else if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await eventService.getEvents({ limit: 100 });
      setEvents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // --- MODAL HANDLERS UTAMA ---

  const closeConfirmModal = () => {
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  // --- LOGIC EVENT (Create, Edit, Delete) ---
  const openCreateModal = () => {
    setEditingEventId(null);
    setIsFormOpen(true);
  };

  const openEditModal = (id) => {
    setEditingEventId(id);
    setIsFormOpen(true);
  };

  const openDeleteEventModal = (id, title) => {
    setConfirmModal({
      isOpen: true,
      title: "Hapus Event?",
      message: `Anda akan menghapus event "${title}". Data tiket dan transaksi terkait mungkin akan terpengaruh.`,
      type: "danger",
      onConfirm: () => processDeleteEvent(id),
    });
  };

  const processDeleteEvent = async (id) => {
    closeConfirmModal();
    const toastId = toast.loading("Menghapus event...");
    try {
      await eventService.deleteEvent(id);
      toast.success("Event berhasil dihapus", { id: toastId });
      fetchEvents();
    } catch (error) {
      toast.error("Gagal menghapus event", { id: toastId });
    }
  };

  // --- LOGIC USER (Create, Edit, Delete) - BARU ---

  // 1. Buka Modal Create User
  const openCreateUser = () => {
    setUserToEdit(null); // Reset data edit
    setIsUserFormOpen(true);
  };

  // 2. Buka Modal Edit User
  const openEditUser = (userData) => {
    setUserToEdit(userData); // Isi data user yang mau diedit
    setIsUserFormOpen(true);
  };

  // 3. Trigger Hapus User
  const openDeleteUserModal = (id, name) => {
    setConfirmModal({
      isOpen: true,
      title: "Hapus User?",
      message: `Anda yakin ingin menghapus user "${name}"? Tindakan ini tidak dapat dibatalkan.`,
      type: "danger",
      onConfirm: () => processDeleteUser(id),
    });
  };

  // 4. Proses Hapus User ke API
  const processDeleteUser = async (id) => {
    closeConfirmModal();
    const toastId = toast.loading("Menghapus user...");
    try {
      await userService.deleteUser(id);
      toast.success("User berhasil dihapus", { id: toastId });
      fetchUsers(); // Refresh list user
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus user", { id: toastId });
    }
  };

  // --- LOGIC UMUM (Logout, Format) ---

  const openLogoutModal = () => {
    setConfirmModal({
      isOpen: true,
      title: "Keluar Akun Admin",
      message:
        "Sesi Anda akan berakhir. Anda harus login ulang untuk mengakses panel ini.",
      type: "danger",
      onConfirm: processLogout,
    });
  };

  const processLogout = () => {
    closeConfirmModal();
    localStorage.clear();
    navigate("/login");
    toast.success("Berhasil keluar");
  };

  const formatRupiah = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-['Poppins']">
      <Navbar />

      <main className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* SIDEBAR (Sticky Desktop) */}
            <div className="w-full md:w-64 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 md:sticky md:top-28 h-fit shrink-0">
              <div className="text-center mb-6 pb-6 border-b border-gray-100">
                <div className="w-16 h-16 bg-[#026DA7] text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-xl border-4 border-[#E0F2FE]">
                  {user.full_name?.charAt(0) || "A"}
                </div>
                <h3 className="font-bold text-gray-800 truncate px-2">
                  {user.full_name || "Admin"}
                </h3>
                <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase tracking-wider mt-1 inline-block border border-gray-200">
                  Administrator
                </span>
              </div>

              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === "dashboard"
                      ? "bg-blue-50 text-[#026DA7] font-semibold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <LayoutDashboard size={18} /> Dashboard
                </button>
                <button
                  onClick={() => setActiveTab("events")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === "events"
                      ? "bg-blue-50 text-[#026DA7] font-semibold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Calendar size={18} /> Kelola Event
                </button>
                <button
                  onClick={() => setActiveTab("users")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === "users"
                      ? "bg-blue-50 text-[#026DA7] font-semibold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Users size={18} /> Kelola User
                </button>
                <div className="h-px bg-gray-100 my-2"></div>
                <button
                  onClick={openLogoutModal}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
                >
                  <LogOut size={18} /> Keluar
                </button>
              </nav>
            </div>

            {/* CONTENT AREA */}
            <div className="flex-1 w-full min-h-[500px]">
              {/* TAB 1: DASHBOARD */}
              {activeTab === "dashboard" && (
                <div className="space-y-8 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-[#1D3A6B]">
                        Dashboard Overview
                      </h2>
                      <p className="text-gray-500 text-sm">
                        Ringkasan aktivitas platform Tickify.
                      </p>
                    </div>
                  </div>

                  {/* Statistik */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
                        Event Aktif
                      </p>
                      <h3 className="text-3xl font-bold text-[#1D3A6B]">
                        {events.length}
                      </h3>
                      <div className="p-3 bg-blue-50 text-[#026DA7] rounded-xl absolute top-6 right-6">
                        <Calendar size={24} />
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-xs font-medium text-blue-600 bg-blue-50 w-fit px-2 py-1 rounded-lg">
                        <TrendingUp size={14} /> Update Realtime
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
                        Total User
                      </p>
                      <h3 className="text-3xl font-bold text-[#1D3A6B]">
                        {users.length}
                      </h3>
                      <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl absolute top-6 right-6">
                        <Users size={24} />
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-lg">
                        <Users size={14} /> Terdaftar
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
                        Total Transaksi
                      </p>
                      <h3 className="text-3xl font-bold text-[#1D3A6B]">452</h3>
                      <div className="p-3 bg-orange-50 text-orange-500 rounded-xl absolute top-6 right-6">
                        <Ticket size={24} />
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-xs font-medium text-orange-600 bg-orange-50 w-fit px-2 py-1 rounded-lg">
                        <Activity size={14} /> Estimasi Penjualan
                      </div>
                    </div>
                  </div>

                  {/* 5 Event Terbaru */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                      <h3 className="font-bold text-gray-800">
                        5 Event Terbaru
                      </h3>
                      <button
                        onClick={() => setActiveTab("events")}
                        className="text-xs font-bold text-[#026DA7] hover:underline"
                      >
                        Kelola Semua
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-bold tracking-wider">
                          <tr>
                            <th className="px-6 py-3">Nama Event</th>
                            <th className="px-6 py-3">Kategori</th>
                            <th className="px-6 py-3">Tanggal</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {events.slice(0, 5).map((ev) => (
                            <tr
                              key={ev.id}
                              className="hover:bg-gray-50/50 transition-colors"
                            >
                              <td className="px-6 py-4 font-medium text-gray-800">
                                {ev.title}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500 capitalize">
                                {ev.category || "-"}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {formatDate(ev.date)}
                              </td>
                            </tr>
                          ))}
                          {events.length === 0 && (
                            <tr>
                              <td
                                colSpan="3"
                                className="px-6 py-8 text-center text-gray-400 text-sm"
                              >
                                Belum ada data event.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MANAGE EVENTS */}
              {activeTab === "events" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h2 className="text-2xl font-bold text-[#1D3A6B] self-start sm:self-center">
                      Kelola Event
                    </h2>
                    <button
                      onClick={openCreateModal}
                      className="w-full sm:w-auto px-5 py-2.5 bg-[#026DA7] text-white font-bold rounded-xl hover:bg-[#025a8a] transition-all shadow-md flex items-center justify-center gap-2 text-sm"
                    >
                      <Plus size={18} /> Buat Event Baru
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-bold tracking-wider">
                            <th className="p-4 pl-6">Event Detail</th>
                            <th className="p-4">Jadwal</th>
                            <th className="p-4">Lokasi</th>
                            <th className="p-4 pr-6 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {paginatedEvents.map((ev) => (
                            <tr
                              key={ev.id}
                              className="hover:bg-gray-50/50 transition-colors group"
                            >
                              <td className="p-4 pl-6">
                                <div className="font-bold text-gray-800">
                                  {ev.title}
                                </div>
                                <div className="text-xs text-gray-400 capitalize mt-0.5">
                                  {ev.category} • {formatRupiah(ev.price || 0)}
                                </div>
                              </td>
                              <td className="p-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1.5">
                                  <Calendar
                                    size={14}
                                    className="text-[#026DA7]"
                                  />{" "}
                                  {ev.date}
                                </div>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <Clock size={14} className="text-[#026DA7]" />{" "}
                                  {ev.time}
                                </div>
                              </td>
                              <td className="p-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1.5">
                                  <MapPin size={14} className="text-gray-400" />{" "}
                                  {ev.location}
                                </div>
                              </td>
                              <td className="p-4 pr-6 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => openEditModal(ev.id)}
                                    className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                    title="Edit"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      openDeleteEventModal(ev.id, ev.title)
                                    }
                                    className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                    title="Hapus"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {events.length === 0 && (
                      <div className="p-12 text-center text-gray-400 flex flex-col items-center">
                        <Calendar size={48} className="mb-3 text-gray-300" />
                        <p>Belum ada event yang dibuat.</p>
                      </div>
                    )}
                  </div>
                  {/* PAGINATION (letakkan di SINI) */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-6 py-6">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                        className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                          currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        Previous
                      </button>

                      <span className="text-sm font-semibold text-gray-700">
                        Page {currentPage} of {totalPages}
                      </span>

                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                          currentPage === totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: MANAGE USERS (CRUD LENGKAP) */}
              {activeTab === "users" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-[#1D3A6B] self-start sm:self-center">
                        Kelola Pengguna
                      </h2>
                      <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {users.length} Users
                      </span>
                    </div>
                    {/* TOMBOL CREATE USER */}
                    <button
                      onClick={openCreateUser}
                      className="w-full sm:w-auto px-5 py-2.5 bg-[#026DA7] text-white font-bold rounded-xl hover:bg-[#025a8a] transition-all shadow-md flex items-center justify-center gap-2 text-sm"
                    >
                      <Plus size={18} /> Tambah User
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-bold tracking-wider">
                            <th className="p-4 pl-6">User</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Bergabung</th>
                            <th className="p-4 pr-6 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {users.map((usr) => (
                            <tr
                              key={usr.id}
                              className="hover:bg-gray-50/50 transition-colors group"
                            >
                              <td className="p-4 pl-6">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border border-white shadow-sm ${
                                      usr.role === "admin"
                                        ? "bg-[#026DA7] text-white"
                                        : "bg-gray-200 text-gray-600"
                                    }`}
                                  >
                                    {usr.full_name
                                      ? usr.full_name.charAt(0).toUpperCase()
                                      : "U"}
                                  </div>
                                  <div className="font-bold text-gray-800 text-sm">
                                    {usr.full_name}
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1.5">
                                  <Mail size={14} className="text-gray-400" />{" "}
                                  {usr.email}
                                </div>
                              </td>
                              <td className="p-4">
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                                    usr.role === "admin"
                                      ? "bg-blue-50 text-[#026DA7] border-blue-100"
                                      : "bg-gray-50 text-gray-600 border-gray-200"
                                  }`}
                                >
                                  {usr.role === "admin" && <Shield size={10} />}{" "}
                                  {usr.role}
                                </span>
                              </td>
                              <td className="p-4 text-sm text-gray-500">
                                {formatDate(usr.created_at)}
                              </td>
                              {/* KOLOM AKSI EDIT & DELETE */}
                              <td className="p-4 pr-6 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => openEditUser(usr)}
                                    className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                    title="Edit User"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  {usr.email !== user.email && (
                                    <button
                                      onClick={() =>
                                        openDeleteUserModal(
                                          usr.id,
                                          usr.full_name
                                        )
                                      }
                                      className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                      title="Hapus User"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {users.length === 0 && (
                      <div className="p-12 text-center text-gray-400">
                        Belum ada user terdaftar.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* MODAL FORM CREATE/EDIT EVENT */}
      {isFormOpen && (
        <EventFormModal
          eventId={editingEventId}
          onClose={() => setIsFormOpen(false)}
          onSuccess={fetchEvents}
        />
      )}

      {/* MODAL FORM CREATE/EDIT USER (BARU) */}
      {isUserFormOpen && (
        <UserFormModal
          userToEdit={userToEdit}
          onClose={() => setIsUserFormOpen(false)}
          onSuccess={fetchUsers}
        />
      )}

      {/* --- KOMPONEN MODAL KONFIRMASI (GLOBAL) --- */}
      {confirmModal.isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 animate-fade-in">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
              onClick={closeConfirmModal}
            ></div>

            {/* Modal Content */}
            <div className="bg-white rounded-2xl p-6 md:p-8 max-w-sm w-full relative z-10 shadow-2xl animate-scale-up border border-gray-100">
              <button
                onClick={closeConfirmModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
                    confirmModal.type === "danger"
                      ? "bg-red-50 text-red-500"
                      : "bg-blue-50 text-blue-500"
                  }`}
                >
                  {confirmModal.type === "danger" ? (
                    <AlertTriangle size={28} />
                  ) : (
                    <Ticket size={28} />
                  )}
                </div>

                <h3 className="font-['Poppins'] font-bold text-xl text-gray-800 mb-2">
                  {confirmModal.title}
                </h3>

                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                  {confirmModal.message}
                </p>

                <div className="flex gap-3 w-full">
                  <button
                    onClick={closeConfirmModal}
                    className="flex-1 py-3 px-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors text-sm"
                  >
                    Batal
                  </button>
                  <button
                    onClick={confirmModal.onConfirm}
                    className={`flex-1 py-3 px-4 text-white font-bold rounded-xl shadow-md transition-all text-sm ${
                      confirmModal.type === "danger"
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-[#026DA7] hover:bg-[#025a8a]"
                    }`}
                  >
                    Ya, Lanjutkan
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

import { History, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const OrderList = ({ orders, loading, onSelectOrder }) => {
  const navigate = useNavigate();

  // Helper Format
  const formatRupiah = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  // Helper Status Badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            Lunas
          </span>
        );
      case "pending":
        return (
          <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            Menunggu Pembayaran
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            Dibatalkan
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            {status}
          </span>
        );
    }
  };

  // Logic Klik Baris
  const handleItemClick = (order) => {
    if (order.status === "pending") {
      // Jika pending, lempar ke halaman pembayaran untuk Bayar/Cancel
      navigate(`/payment/${order.id}`);
    } else {
      // Jika status lain, buka modal detail untuk lihat history
      onSelectOrder(order.id);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 bg-gray-200 rounded-2xl animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
        <History size={32} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">Belum ada riwayat transaksi.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {orders.map((order) => (
        <div
          key={order.id}
          onClick={() => handleItemClick(order)}
          className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-sm transition-all flex flex-col md:flex-row justify-between gap-4 ${
            order.status === "pending"
              ? "cursor-pointer hover:border-blue-300 hover:shadow-md ring-1 ring-transparent hover:ring-blue-100"
              : "cursor-pointer hover:bg-gray-50"
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-1">
              <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                #{order.id.slice(0, 8).toUpperCase()}
              </span>
              <span className="text-xs text-gray-400">
                {formatDate(order.created_at)}
              </span>
            </div>

            <h3 className="font-bold text-gray-800">
              {order.items && order.items[0]
                ? order.items[0].event_title
                : "Tiket Event"}
              {order.items && order.items.length > 1 && (
                <span className="text-gray-400 font-normal text-sm ml-1">
                  +{order.items.length - 1} lainnya
                </span>
              )}
            </h3>

            <p className="text-sm text-gray-600 font-medium">
              Total:{" "}
              <span className="text-[#026DA7]">
                {formatRupiah(order.total_price)}
              </span>
            </p>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
            {getStatusBadge(order.status)}
            {order.status === "pending" && (
              <ChevronRight size={20} className="text-gray-300" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

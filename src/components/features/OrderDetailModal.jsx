import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { orderService } from "../../services/orderService";
import {
  X,
  Calendar,
  CreditCard,
  ChevronRight,
  Package,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

export const OrderDetailModal = ({ orderId, onClose }) => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper Formatter
  const formatRupiah = (num) => {
    const val = parseFloat(num);
    const finalPrice = val < 1000 ? val * 1000 : val;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(finalPrice);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fetch Detail Order
  useEffect(() => {
    if (!orderId) return;

    const fetchDetail = async () => {
      setLoading(true);
      try {
        // Kita pakai service yang sudah ada (getOrderById)
        const data = await orderService.getOrderById(orderId);
        setOrder(data);
      } catch (error) {
        console.error(error);
        toast.error("Gagal memuat detail transaksi");
        onClose();
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [orderId, onClose]);

  if (!orderId) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="bg-white rounded-2xl w-full max-w-lg relative z-10 shadow-2xl overflow-hidden animate-scale-up flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-800 text-lg">Detail Pesanan</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 bg-white p-1 rounded-full border border-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="w-8 h-8 border-4 border-[#026DA7] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : order ? (
            <div className="space-y-6">
              {/* Header Info: ID & Date */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                    Order ID
                  </p>
                  <p className="font-mono text-sm font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded inline-block">
                    #{order.id.slice(0, 13).toUpperCase()}
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    order.status === "paid"
                      ? "bg-green-50 text-green-600 border-green-200"
                      : order.status === "pending"
                      ? "bg-orange-50 text-orange-600 border-orange-200"
                      : "bg-red-50 text-red-600 border-red-200"
                  }`}
                >
                  {order.status}
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                  Tanggal Transaksi
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                  <Calendar size={16} className="text-[#026DA7]" />
                  {formatDate(order.created_at)}
                </div>
              </div>

              <div className="h-px bg-gray-100 border-t border-dashed border-gray-200"></div>

              {/* Items List (Table-like structure) */}
              <div>
                <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Package size={16} className="text-[#026DA7]" /> Tiket Pesanan
                </h4>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-4">
                  {order.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-start gap-4"
                    >
                      <div className="flex-1">
                        <p className="font-bold text-gray-800 text-sm">
                          {item.event_title || "Event Name"}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.category_name} Ticket
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatRupiah(item.price_each)} x {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold text-gray-800 text-sm">
                        {formatRupiah(
                          item.subtotal || item.price_each * item.quantity
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Amount */}
              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-600 font-medium">
                  Total Pembayaran
                </span>
                <span className="text-xl font-bold text-[#026DA7]">
                  {formatRupiah(order.total_price)}
                </span>
              </div>

              {/* Warning if Pending */}
              {order.status === "pending" && (
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex gap-3 items-start">
                  <AlertCircle
                    size={18}
                    className="text-blue-600 shrink-0 mt-0.5"
                  />
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Pesanan belum dibayar. Segera selesaikan pembayaran agar
                    tiket tidak hangus.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              Data tidak ditemukan
            </div>
          )}
        </div>

        {/* Footer Action */}
        {order && order.status === "pending" && (
          <div className="p-4 border-t border-gray-100 bg-white">
            <button
              onClick={() => navigate(`/payment/${order.id}`)}
              className="w-full py-3.5 bg-[#026DA7] text-white font-bold rounded-xl shadow-lg hover:bg-[#025a8a] transition-all flex items-center justify-center gap-2"
            >
              <CreditCard size={18} /> Bayar Sekarang <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

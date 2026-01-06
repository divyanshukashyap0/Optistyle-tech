import React, { useState } from "react";
import { CartItem, User } from "../types";
import {
  ShieldCheck,
  CheckCircle2,
  ShoppingBag,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { jsPDF } from "jspdf";

interface CheckoutProps {
  cart: CartItem[];
  clearCart: () => void;
  user: User;
}

const Checkout: React.FC<CheckoutProps> = ({ cart, clearCart, user }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderInfo, setOrderInfo] = useState<{
    id: string;
    invoiceNumber: string;
    invoiceUrl?: string;
  } | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const total = subtotal + (subtotal > 10000 ? 0 : 500);

  const generateAndDownloadLocalPDF = (
    invNumber: string,
    customerName: string,
    address: string
  ) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("OptiStyle Invoice", 20, 20);
    doc.setFontSize(12);
    doc.text(`Invoice No: ${invNumber}`, 20, 35);
    doc.text(`Customer: ${customerName}`, 20, 45);
    doc.text(`Address: ${address}`, 20, 55);
    doc.text(`Email: ${user.email}`, 20, 65);

    let y = 85;
    cart.forEach((item) => {
      doc.text(
        `${item.name} (${item.quantity} x ₹${item.price})`,
        20,
        y
      );
      y += 10;
    });

    doc.text(`Total: ₹${total.toLocaleString()}`, 20, y + 10);
    doc.save(`Invoice_${invNumber}.pdf`);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const customerName = formData.get("fullName") as string;
    const address = formData.get("address") as string;

    const payload = {
      userEmail: user.email,
      customerName,
      address,
      city: formData.get("city"),
      postalCode: formData.get("postalCode"),
      products: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        color: item.selectedColor,
      })),
      totalAmount: total,
      orderId: `OPT-${Date.now()}`,
    };

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();

      if (!response.ok) {
        throw new Error(text || "Order service failed");
      }

      const result = JSON.parse(text);

      if (result.success) {
        setOrderInfo({
          id: result.orderId,
          invoiceNumber: result.invoiceNumber,
          invoiceUrl: result.invoiceUrl,
        });

        generateAndDownloadLocalPDF(
          result.invoiceNumber,
          customerName,
          address
        );

        clearCart();
        setIsSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess && orderInfo) {
    return (
      <div className="max-w-xl mx-auto py-32 text-center">
        <CheckCircle2 size={80} className="mx-auto text-emerald-400 mb-6" />
        <h1 className="text-4xl text-white mb-4">Order Successful</h1>
        <p className="text-slate-400">
          Invoice Number:{" "}
          <span className="text-cyan-400 font-mono">
            {orderInfo.invoiceNumber}
          </span>
        </p>
        <button
          onClick={() => (window.location.hash = "/")}
          className="mt-10 px-8 py-4 bg-white text-black rounded-xl font-bold"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl text-white mb-10 flex items-center gap-3">
        <ShoppingBag /> Checkout
      </h1>

      <form
        onSubmit={handlePayment}
        className="grid grid-cols-1 lg:grid-cols-2 gap-16"
      >
        <div className="space-y-6">
          <input
            name="fullName"
            required
            placeholder="Full Name"
            className="w-full p-4 rounded-xl bg-slate-900 text-white"
          />
          <input
            name="address"
            required
            placeholder="Address"
            className="w-full p-4 rounded-xl bg-slate-900 text-white"
          />
          <input
            name="city"
            required
            placeholder="City"
            className="w-full p-4 rounded-xl bg-slate-900 text-white"
          />
          <input
            name="postalCode"
            required
            placeholder="Postal Code"
            className="w-full p-4 rounded-xl bg-slate-900 text-white"
          />
        </div>

        <div className="glass p-8 rounded-3xl space-y-6">
          <h3 className="text-2xl text-white">Order Summary</h3>

          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between text-white text-sm"
            >
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>
                ₹{(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}

          <div className="text-xl text-cyan-400 font-bold">
            Total: ₹{total.toLocaleString()}
          </div>

          {error && (
            <div className="bg-red-500/10 p-4 rounded-xl text-red-400 text-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-5 bg-cyan-600 text-white rounded-xl font-bold"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" /> Processing…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <ShieldCheck /> Place Order
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;

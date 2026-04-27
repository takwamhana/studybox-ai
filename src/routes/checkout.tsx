import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Lock, AlertCircle, CreditCard, Smartphone, Building2, Wallet } from "lucide-react";
import { useState } from "react";
import { Layout } from "@/components/site/Layout";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — StudyBox AI" },
      { name: "description", content: "Complete your StudyBox order" },
    ],
  }),
  component: CheckoutPage,
});

type OrderStatus = "form" | "processing" | "confirmed";
type PaymentMethod = "card" | "paypal" | "applepay" | "googlepay" | "bank";

function CheckoutPage() {
  const navigate = useNavigate();
  const cart = useCart();
  const [status, setStatus] = useState<OrderStatus>("form");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    address: "",
    city: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    paypalEmail: "",
    bankAccount: "",
    bankCode: "",
  });
  const [orderId, setOrderId] = useState<string>("");
  const [error, setError] = useState<string>("");

  if (cart.items.length === 0 && status === "form") {
    return (
      <Layout>
        <section className="px-6">
          <div className="mx-auto max-w-2xl py-24 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
            <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
            <Button asChild className="mt-6">
              <Link to="/marketplace">Continue shopping</Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  const tax = cart.total * 0.1;
  const shipping = cart.total > 50 ? 0 : 9.99;
  const finalTotal = cart.total + tax + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.fullName || !formData.address) {
      setError("Please fill in all required fields");
      return false;
    }

    if (paymentMethod === "card") {
      if (formData.cardNumber.replace(/\s/g, "").length !== 16) {
        setError("Card number must be 16 digits");
        return false;
      }
      if (formData.cvv.length !== 3) {
        setError("CVV must be 3 digits");
        return false;
      }
    } else if (paymentMethod === "paypal") {
      if (!formData.paypalEmail) {
        setError("Please enter PayPal email");
        return false;
      }
    } else if (paymentMethod === "bank") {
      if (!formData.bankAccount || !formData.bankCode) {
        setError("Please enter bank details");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setStatus("processing");

    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 2000));

    // Mock successful payment
    const newOrderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setOrderId(newOrderId);

    // Save to localStorage as mock order history
    const orders = JSON.parse(localStorage.getItem("studybox.orders") ?? "[]");
    orders.unshift({
      id: newOrderId,
      email: formData.email,
      paymentMethod,
      items: cart.items,
      total: finalTotal,
      date: new Date().toISOString(),
      status: "confirmed",
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    });
    localStorage.setItem("studybox.orders", JSON.stringify(orders));

    setStatus("confirmed");
    cart.clearCart();
    toast.success("Order confirmed! Check your email for details.");
  };

  const paymentOptions = [
    {
      id: "card" as PaymentMethod,
      name: "Credit/Debit Card",
      icon: CreditCard,
      desc: "Visa, Mastercard, American Express",
    },
    {
      id: "paypal" as PaymentMethod,
      name: "PayPal",
      icon: Wallet,
      desc: "Fast and secure",
    },
    {
      id: "applepay" as PaymentMethod,
      name: "Apple Pay",
      icon: Smartphone,
      desc: "Quick checkout with Face ID",
    },
    {
      id: "googlepay" as PaymentMethod,
      name: "Google Pay",
      icon: Smartphone,
      desc: "Fast checkout on Android",
    },
    {
      id: "bank" as PaymentMethod,
      name: "Bank Transfer",
      icon: Building2,
      desc: "Direct bank account payment",
    },
  ];

  return (
    <Layout>
      <section className="px-6">
        <div className="mx-auto max-w-6xl py-8">
          <Link
            to="/cart"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to cart
          </Link>

          {status === "form" && (
            <div className="mt-10 grid lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
                  <p className="mt-2 text-muted-foreground">Complete your purchase (demo mode - no real charges)</p>

                  <form onSubmit={handleSubmit} className="mt-8 space-y-8">
                    {/* Contact */}
                    <div className="rounded-2xl border border-border bg-surface p-6">
                      <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="student@university.edu"
                            className="w-full rounded-lg border border-border bg-surface-alt px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Full Name</label>
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            className="w-full rounded-lg border border-border bg-surface-alt px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Shipping */}
                    <div className="rounded-2xl border border-border bg-surface p-6">
                      <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Address</label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="123 Main St"
                            className="w-full rounded-lg border border-border bg-surface-alt px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">City</label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              placeholder="New York"
                              className="w-full rounded-lg border border-border bg-surface-alt px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">ZIP Code</label>
                            <input
                              type="text"
                              name="zipCode"
                              value={formData.zipCode}
                              onChange={handleInputChange}
                              placeholder="10001"
                              className="w-full rounded-lg border border-border bg-surface-alt px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method Selection */}
                    <div className="rounded-2xl border border-border bg-surface p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Payment Method</h2>
                        <Lock className="h-4 w-4 text-success" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {paymentOptions.map((option) => {
                          const Icon = option.icon;
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => setPaymentMethod(option.id)}
                              className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                                paymentMethod === option.id
                                  ? "border-primary bg-primary/5 shadow-soft-md"
                                  : "border-border bg-surface hover:border-primary/40"
                              }`}
                            >
                              <Icon className="h-6 w-6 text-primary mb-2" />
                              <p className="font-semibold text-sm">{option.name}</p>
                              <p className="text-xs text-muted-foreground mt-1">{option.desc}</p>
                              {paymentMethod === option.id && (
                                <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                                  <Check className="h-3 w-3 text-primary-foreground" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Conditional Payment Details */}
                    <div className="rounded-2xl border border-border bg-surface p-6">
                      <h2 className="text-lg font-semibold mb-4">
                        {paymentMethod === "card" && "Card Details"}
                        {paymentMethod === "paypal" && "PayPal Account"}
                        {paymentMethod === "applepay" && "Apple Pay"}
                        {paymentMethod === "googlepay" && "Google Pay"}
                        {paymentMethod === "bank" && "Bank Details"}
                      </h2>

                      {/* Credit Card */}
                      {paymentMethod === "card" && (
                        <div className="space-y-4">
                          <div className="bg-surface-alt rounded-xl p-4 mb-4 text-xs text-muted-foreground">
                            🔒 Demo card: 4111 1111 1111 1111
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Card Number</label>
                            <input
                              type="text"
                              name="cardNumber"
                              value={formData.cardNumber}
                              onChange={handleInputChange}
                              placeholder="4111 1111 1111 1111"
                              maxLength="19"
                              className="w-full rounded-lg border border-border bg-surface-alt px-4 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Expiry Date</label>
                              <input
                                type="text"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleInputChange}
                                placeholder="MM/YY"
                                className="w-full rounded-lg border border-border bg-surface-alt px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">CVV</label>
                              <input
                                type="text"
                                name="cvv"
                                value={formData.cvv}
                                onChange={handleInputChange}
                                placeholder="123"
                                maxLength="3"
                                className="w-full rounded-lg border border-border bg-surface-alt px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* PayPal */}
                      {paymentMethod === "paypal" && (
                        <div className="space-y-4">
                          <div className="bg-blue-500/10 rounded-xl p-4 mb-4 text-xs text-blue-600">
                            💙 You'll be redirected to PayPal to complete your purchase securely
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">PayPal Email</label>
                            <input
                              type="email"
                              name="paypalEmail"
                              value={formData.paypalEmail}
                              onChange={handleInputChange}
                              placeholder="your-paypal@email.com"
                              className="w-full rounded-lg border border-border bg-surface-alt px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                              required
                            />
                          </div>
                        </div>
                      )}

                      {/* Apple Pay */}
                      {paymentMethod === "applepay" && (
                        <div className="space-y-4">
                          <div className="bg-surface-alt rounded-xl p-8 text-center">
                            <Smartphone className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                            <p className="text-sm text-muted-foreground">Click "Complete Order" to authorize with Face ID or Touch ID</p>
                          </div>
                        </div>
                      )}

                      {/* Google Pay */}
                      {paymentMethod === "googlepay" && (
                        <div className="space-y-4">
                          <div className="bg-surface-alt rounded-xl p-8 text-center">
                            <Smartphone className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                            <p className="text-sm text-muted-foreground">Click "Complete Order" to authorize with Google Pay</p>
                          </div>
                        </div>
                      )}

                      {/* Bank Transfer */}
                      {paymentMethod === "bank" && (
                        <div className="space-y-4">
                          <div className="bg-amber-500/10 rounded-xl p-4 mb-4 text-xs text-amber-600">
                            🏦 Bank transfer details will be provided after order confirmation
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Bank Code (Optional)</label>
                            <input
                              type="text"
                              name="bankCode"
                              value={formData.bankCode}
                              onChange={handleInputChange}
                              placeholder="ROUTING or SWIFT code"
                              className="w-full rounded-lg border border-border bg-surface-alt px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Account Number</label>
                            <input
                              type="text"
                              name="bankAccount"
                              value={formData.bankAccount}
                              onChange={handleInputChange}
                              placeholder="Your bank account number"
                              className="w-full rounded-lg border border-border bg-surface-alt px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                              required
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {error && (
                      <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-4 text-sm text-destructive">
                        {error}
                      </div>
                    )}

                    <Button type="submit" size="lg" className="w-full shadow-soft-md hover:-translate-y-0.5 transition-transform">
                      Complete Order
                    </Button>
                  </form>
                </motion.div>
              </div>

              {/* Order Summary */}
              <Reveal delay={0.1}>
                <div className="lg:sticky lg:top-8">
                  <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft-md">
                    <h2 className="font-semibold mb-6">Order Summary</h2>

                    <div className="space-y-4 mb-6 pb-6 border-b border-border max-h-96 overflow-y-auto">
                      {cart.items.map((item) => (
                        <div key={item.product.id} className="flex items-start justify-between gap-3 text-sm">
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-semibold tabular-nums flex-shrink-0">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">${cart.total.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-medium">{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Tax (10%)</span>
                        <span className="font-medium">${tax.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-border">
                      <div className="flex items-center justify-between mb-6">
                        <span className="font-semibold">Total</span>
                        <span className="text-2xl font-bold">${finalTotal.toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>✓ Demo mode - no charges</p>
                        <p>✓ 30-day money-back</p>
                        <p>✓ Free returns</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          )}

          {status === "processing" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-16 text-center"
            >
              <div className="inline-flex flex-col items-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-6"
                >
                  <Lock className="h-8 w-8 text-primary animate-pulse" />
                </motion.div>
                <h1 className="text-3xl font-bold">Processing Payment…</h1>
                <p className="mt-2 text-muted-foreground">
                  {paymentMethod === "paypal" && "Redirecting to PayPal..."}
                  {paymentMethod === "applepay" && "Authorizing with Face ID..."}
                  {paymentMethod === "googlepay" && "Authorizing with Google Pay..."}
                  {paymentMethod === "bank" && "Processing bank transfer..."}
                  {paymentMethod === "card" && "We're securely processing your order"}
                </p>

                <div className="mt-8 w-64 h-1 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {status === "confirmed" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-10"
            >
              <div className="rounded-2xl border border-border bg-surface p-8 md:p-12 shadow-soft-lg text-center max-w-2xl mx-auto">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/20 mb-6"
                >
                  <Check className="h-9 w-9 text-success" />
                </motion.div>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Order Confirmed!</h1>
                <p className="mt-3 text-muted-foreground">Thank you for your purchase</p>

                <div className="mt-8 p-4 rounded-lg bg-surface-alt border border-border">
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="text-xl font-mono font-semibold mt-1">{orderId}</p>
                </div>

                <div className="mt-8 grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-2">Email</p>
                    <p className="font-medium text-sm">{formData.email}</p>
                  </div>
                  <div className="p-4 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-2">Total</p>
                    <p className="font-medium text-sm">${finalTotal.toFixed(2)}</p>
                  </div>
                  <div className="p-4 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-2">Est. Delivery</p>
                    <p className="font-medium text-sm">In 3-5 days</p>
                  </div>
                </div>

                <div className="mt-8 p-4 rounded-lg bg-success/10 border border-success/30">
                  <p className="text-sm text-foreground">
                    ✓ This is a demo order. Check your orders in the dashboard or navigate back home.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-3 justify-center">
                  <Button asChild size="lg" className="shadow-soft-md">
                    <Link to="/">Back to Home</Link>
                  </Button>
                  <Button asChild variant="secondary" size="lg">
                    <Link to="/orders">View Orders</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
}

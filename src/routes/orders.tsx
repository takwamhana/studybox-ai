import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowLeft, Package, Truck, DollarSign, Calendar, X, MapPin, Clock, CheckCircle } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "My Orders — StudyBox AI" },
      { name: "description", content: "View your order history" },
    ],
  }),
  component: OrdersPage,
});

interface OrderItem {
  product: { id: string; name: string; price: number };
  quantity: number;
}

interface Order {
  id: string;
  email: string;
  items: OrderItem[];
  total: number;
  date: string;
  status: "confirmed" | "shipped" | "delivered";
  estimatedDelivery: string;
  paymentMethod?: string;
}

function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("studybox.orders");
    if (stored) {
      setOrders(JSON.parse(stored));
    }
  }, []);

  const downloadInvoice = (order: Order) => {
    // Create invoice HTML
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice ${order.id}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: #fff;
          }
          .invoice {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            border: 1px solid #ddd;
          }
          .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
          }
          .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #6366f1;
          }
          .invoice-title {
            font-size: 20px;
            font-weight: bold;
            text-align: right;
          }
          .invoice-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 40px;
          }
          .detail-section h3 {
            margin: 0 0 10px 0;
            font-size: 14px;
            color: #666;
            text-transform: uppercase;
          }
          .detail-section p {
            margin: 5px 0;
            color: #333;
          }
          .items-table {
            width: 100%;
            margin-bottom: 40px;
            border-collapse: collapse;
          }
          .items-table th {
            background: #f5f5f5;
            padding: 12px;
            text-align: left;
            border-bottom: 2px solid #333;
            font-weight: bold;
          }
          .items-table td {
            padding: 12px;
            border-bottom: 1px solid #ddd;
          }
          .items-table tr:last-child td {
            border-bottom: 2px solid #333;
          }
          .totals {
            display: grid;
            grid-template-columns: 200px 100px;
            gap: 20px;
            justify-content: end;
            margin-bottom: 40px;
          }
          .total-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            padding: 8px 0;
            border-bottom: 1px solid #ddd;
          }
          .total-row.final {
            border-bottom: 2px solid #333;
            font-weight: bold;
            font-size: 16px;
            padding: 16px 0;
          }
          .footer {
            text-align: center;
            color: #666;
            font-size: 12px;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
          }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="header">
            <div class="company-name">📚 StudyBox AI</div>
            <div>
              <div class="invoice-title">INVOICE</div>
              <p style="margin: 5px 0 0 0; text-align: right; color: #666;">
                ${new Date(order.date).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div class="invoice-details">
            <div class="detail-section">
              <h3>Bill To</h3>
              <p>${order.email}</p>
              <p style="margin-top: 15px; color: #999; font-size: 12px;">Order #${order.id}</p>
            </div>
            <div class="detail-section">
              <h3>Order Details</h3>
              <p><strong>Status:</strong> ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
              <p><strong>Est. Delivery:</strong> ${order.estimatedDelivery}</p>
              <p><strong>Payment:</strong> ${order.paymentMethod || "Credit Card"}</p>
            </div>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th style="text-align: right;">Quantity</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.product.name}</td>
                  <td style="text-align: right;">${item.quantity}</td>
                  <td style="text-align: right;">$${item.product.price.toFixed(2)}</td>
                  <td style="text-align: right;">$${(item.product.price * item.quantity).toFixed(2)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div class="totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span style="text-align: right;">$${(order.total / 1.1).toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>Tax (10%):</span>
              <span style="text-align: right;">$${((order.total / 1.1) * 0.1).toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>Shipping:</span>
              <span style="text-align: right;">$0.00</span>
            </div>
            <div class="total-row final">
              <span>Total:</span>
              <span style="text-align: right;">$${order.total.toFixed(2)}</span>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for your purchase! For support, contact: support@studybox-ai.com</p>
            <p>© 2024 StudyBox AI. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Create blob and download
    const element = document.createElement("a");
    const file = new Blob([invoiceHTML], { type: "text/html" });
    element.href = URL.createObjectURL(file);
    element.download = `invoice-${order.id}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Invoice downloaded!");
  };

  const getTrackingSteps = (status: string, date: string, estimatedDelivery: string) => {
    const orderDate = new Date(date);

    const steps = [
      {
        title: "Order Confirmed",
        date: orderDate.toLocaleDateString(),
        completed: true,
        icon: CheckCircle,
      },
      {
        title: "Processing",
        date: new Date(orderDate.getTime() + 24 * 60 * 60 * 1000).toLocaleDateString(),
        completed: status !== "confirmed",
        icon: Package,
      },
      {
        title: "Shipped",
        date: new Date(orderDate.getTime() + 48 * 60 * 60 * 1000).toLocaleDateString(),
        completed: status === "shipped" || status === "delivered",
        icon: Truck,
      },
      {
        title: "Delivered",
        date: estimatedDelivery,
        completed: status === "delivered",
        icon: MapPin,
      },
    ];

    return steps;
  };

  if (orders.length === 0) {
    return (
      <Layout>
        <section className="px-6">
          <div className="mx-auto max-w-6xl py-8">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition"
            >
              <ArrowLeft className="mr-1 h-4 w-4" /> Back home
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-10 text-center max-w-md mx-auto"
            >
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <h1 className="mt-6 text-3xl font-bold tracking-tight">No orders yet</h1>
              <p className="mt-2 text-muted-foreground">Start building your studying kit today!</p>
              <Button asChild size="lg" className="mt-8">
                <Link to="/generator">Generate my StudyBox</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="px-6">
        <div className="mx-auto max-w-6xl py-8">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-10"
          >
            <h1 className="text-4xl font-bold tracking-tight">My Orders</h1>
            <p className="mt-2 text-muted-foreground">{orders.length} order(s) found</p>
          </motion.div>

          <div className="mt-10 space-y-6">
            {orders.map((order, i) => (
              <Reveal key={order.id} delay={i * 0.05}>
                <motion.div
                  layout
                  className="rounded-2xl border border-border bg-surface p-6 shadow-soft-sm hover:shadow-soft-md transition-shadow"
                >
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-6 pb-6 border-b border-border">
                    <div>
                      <p className="text-sm text-muted-foreground">Order ID</p>
                      <p className="font-mono font-semibold text-lg mt-1">{order.id}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(order.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Truck className="h-4 w-4" />
                          Est. {order.estimatedDelivery}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-2xl font-bold mt-1">${order.total.toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-3 justify-end">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 text-success px-3 py-1 text-xs font-medium">
                          ✓ {order.status === "confirmed" ? "Confirmed" : order.status === "shipped" ? "Shipped" : "Delivered"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-3 mb-6">
                    <p className="text-sm font-semibold mb-4">Items ({order.items.length})</p>
                    {order.items.map((item) => (
                      <div key={item.product.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-alt">
                        <div>
                          <p className="font-medium text-sm">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-sm tabular-nums">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTrackingOrder(order)}
                      className="flex-1"
                    >
                      <Truck className="mr-2 h-4 w-4" /> Track Order
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadInvoice(order)}
                      className="flex-1"
                    >
                      <DollarSign className="mr-2 h-4 w-4" /> Download Invoice
                    </Button>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3} className="mt-12 text-center">
            <Button asChild variant="ghost">
              <Link to="/generator">Create another StudyBox</Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Tracking Modal */}
      {trackingOrder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setTrackingOrder(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-surface rounded-2xl border border-border p-6 w-full max-w-2xl shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Order Tracking</h2>
              <button
                onClick={() => setTrackingOrder(null)}
                className="p-2 hover:bg-surface-alt rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6 p-4 rounded-lg bg-surface-alt">
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-mono font-semibold">{trackingOrder.id}</p>
            </div>

            {/* Timeline */}
            <div className="space-y-6">
              {getTrackingSteps(trackingOrder.status, trackingOrder.date, trackingOrder.estimatedDelivery).map(
                (step, idx, arr) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.title} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`p-3 rounded-full ${
                            step.completed
                              ? "bg-success/20 text-success"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        {idx !== arr.length - 1 && (
                          <div
                            className={`w-1 h-12 mt-2 ${
                              step.completed ? "bg-success/30" : "bg-secondary"
                            }`}
                          />
                        )}
                      </div>
                      <div className="pt-1">
                        <p className="font-semibold">{step.title}</p>
                        <p className="text-sm text-muted-foreground">{step.date}</p>
                        {step.completed && (
                          <p className="text-xs text-success mt-1">✓ Completed</p>
                        )}
                        {!step.completed && (
                          <p className="text-xs text-muted-foreground mt-1">Pending</p>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            <div className="mt-8 p-4 rounded-lg bg-primary/10 border border-primary/30">
              <p className="text-sm text-foreground">
                📍 Tracking updates will be sent to {trackingOrder.email}
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                onClick={() => setTrackingOrder(null)}
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </Layout>
  );
}

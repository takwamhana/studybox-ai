import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, Home } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Shopping Cart — StudyBox AI" },
      { name: "description", content: "Review your cart and proceed to checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const cart = useCart();

  if (cart.items.length === 0) {
    return (
      <Layout>
        <section className="px-6">
          <div className="mx-auto max-w-2xl py-24 text-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
              <h1 className="mt-6 text-3xl font-bold tracking-tight">Your cart is empty</h1>
              <p className="mt-2 text-muted-foreground">Time to add some study essentials!</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg">
                  <Link to="/marketplace">Continue shopping</Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link to="/generator">Generate my StudyBox</Link>
                </Button>
              </div>
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
            className="mt-6"
          >
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Shopping Cart</h1>
            <p className="mt-2 text-muted-foreground">{cart.items.length} items in your cart</p>
          </motion.div>

          <div className="mt-10 grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item, i) => (
                <Reveal key={item.product.id} delay={i * 0.05}>
                  <motion.div
                    layout
                    className="rounded-2xl border border-border bg-surface p-5 shadow-soft-sm hover:shadow-soft-md transition-shadow"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="relative h-24 w-24 rounded-xl overflow-hidden bg-surface-alt flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Link
                              to="/product/$id"
                              params={{ id: item.product.id }}
                              className="text-sm font-semibold tracking-tight hover:text-primary transition truncate"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-xs text-muted-foreground mt-0.5">{item.product.tagline}</p>
                            <div className="mt-2 inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                              {item.product.category}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-sm font-semibold tabular-nums">${item.product.price}</div>
                            <div className="text-xs text-muted-foreground mt-1">Total: ${item.product.price * item.quantity}</div>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="mt-4 flex items-center gap-2">
                          <div className="flex items-center rounded-lg border border-border bg-surface-alt">
                            <button
                              onClick={() =>
                                cart.updateQuantity(item.product.id, item.quantity - 1)
                              }
                              className="p-2 hover:bg-surface transition text-muted-foreground hover:text-foreground"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="px-4 py-2 text-sm font-medium min-w-[40px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                cart.updateQuantity(item.product.id, item.quantity + 1)
                              }
                              className="p-2 hover:bg-surface transition text-muted-foreground hover:text-foreground"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <button
                            onClick={() => cart.removeItem(item.product.id)}
                            className="p-2 hover:bg-surface transition text-destructive hover:bg-destructive/10 rounded-lg ml-auto"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>

            {/* Order Summary */}
            <Reveal delay={0.2}>
              <div className="lg:sticky lg:top-8">
                <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft-md">
                  <h2 className="text-lg font-semibold tracking-tight">Order Summary</h2>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium tabular-nums">${cart.total.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium text-success">FREE</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tax (estimated)</span>
                      <span className="font-medium tabular-nums">${(cart.total * 0.1).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold">Total</span>
                      <span className="text-2xl font-bold tabular-nums">${(cart.total * 1.1).toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    asChild
                    size="lg"
                    className="w-full mt-6 shadow-soft-md hover:-translate-y-0.5 transition-transform"
                  >
                    <Link to="/checkout">Proceed to Checkout</Link>
                  </Button>

                  <Button
                    asChild
                    variant="ghost"
                    size="lg"
                    className="w-full mt-3"
                  >
                    <Link to="/marketplace">Continue shopping</Link>
                  </Button>

                  {cart.items.length > 0 && (
                    <>
                      <hr className="my-6 border-border" />
                      <button
                        onClick={() => cart.clearCart()}
                        className="w-full text-xs text-destructive hover:text-destructive/80 transition font-medium"
                      >
                        Clear cart
                      </button>
                    </>
                  )}
                </div>

                {/* Info Box */}
                <div className="mt-6 rounded-2xl border border-border bg-surface-alt p-4">
                  <div className="text-xs space-y-2 text-muted-foreground">
                    <p>✓ Free shipping on orders over $50</p>
                    <p>✓ 30-day money-back guarantee</p>
                    <p>✓ Support for students worldwide</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </Layout>
  );
}

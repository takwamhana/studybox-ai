import { Link } from "@tanstack/react-router";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { Moon, Sun, Sparkles, Menu, X, ShoppingBag } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/generator", label: "Generator" },
  { to: "/marketplace", label: "Marketplace" },
  { to: "/orders", label: "Orders" },
] as const;

export function Header() {
  const { theme, toggle } = useTheme();
  const { scrollY } = useScroll();
  const cart = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 16));

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-2" : "py-4",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 transition-all duration-300",
          scrolled
            ? "glass-panel border border-border/60 shadow-soft-md py-2"
            : "border border-transparent py-3",
        )}
      >
        <Link to="/" className="flex items-center gap-2 group">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-soft-md">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </span>
          <span className="text-base font-semibold tracking-tight">
            StudyBox<span className="text-primary"> AI</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="px-3 py-1.5 text-sm font-medium text-muted-foreground rounded-lg transition-colors hover:text-foreground hover:bg-secondary/60 data-[status=active]:text-foreground data-[status=active]:bg-secondary"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link
            to="/cart"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition group"
          >
            <ShoppingBag className="h-4 w-4" />
            {cart.items.length > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                {cart.items.length}
              </span>
            )}
          </Link>
          <Button asChild size="sm" className="hidden sm:inline-flex shadow-soft-md hover:-translate-y-0.5 transition-transform">
            <Link to="/generator">Generate my box</Link>
          </Button>
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden h-9 w-9 inline-flex items-center justify-center rounded-lg hover:bg-secondary/60"
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden mx-auto mt-2 max-w-6xl glass-panel border border-border/60 rounded-2xl p-3 shadow-soft-md">
          <div className="flex flex-col">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2 text-sm rounded-lg hover:bg-secondary/60 data-[status=active]:bg-secondary"
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/cart"
              onClick={() => setOpen(false)}
              className="px-3 py-2 text-sm rounded-lg hover:bg-secondary/60 flex items-center gap-2"
            >
              <ShoppingBag className="h-4 w-4" />
              Cart {cart.items.length > 0 && `(${cart.items.length})`}
            </Link>
            <button
              onClick={() => {
                toggle();
                setOpen(false);
              }}
              className="px-3 py-2 text-sm rounded-lg hover:bg-secondary/60 text-left"
            >
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
            <Button asChild size="sm" className="mt-2">
              <Link to="/generator" onClick={() => setOpen(false)}>
                Generate my box
              </Link>
            </Button>
          </div>
        </div>
      )}
    </motion.header>
  );
}

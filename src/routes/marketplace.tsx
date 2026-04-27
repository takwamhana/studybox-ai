import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { Reveal } from "@/components/site/Reveal";
import { ProductCard } from "@/components/site/ProductCard";
import { Input } from "@/components/ui/input";
import { PRODUCTS, type Category } from "@/lib/products";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace — StudyBox AI" },
      { name: "description", content: "Explore curated study tools — notebooks, planners, focus gear and more." },
      { property: "og:title", content: "Marketplace — StudyBox AI" },
      { property: "og:description", content: "Curated study tools for university students." },
    ],
  }),
  component: MarketplacePage,
});

const CATEGORIES: ("All" | Category)[] = ["All", "Stationery", "Planning", "Focus", "Tech", "Wellness"];

function MarketplacePage() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [q, setQ] = useState("");
  const [maxPrice, setMaxPrice] = useState(150);

  const list = useMemo(() => {
    return PRODUCTS.filter((p) => (cat === "All" ? true : p.category === cat))
      .filter((p) => p.price <= maxPrice)
      .filter((p) =>
        q.trim() === ""
          ? true
          : (p.name + p.tagline + p.description).toLowerCase().includes(q.toLowerCase()),
      );
  }, [cat, q, maxPrice]);

  return (
    <Layout>
      <section className="px-6">
        <div className="mx-auto max-w-6xl py-8">
          <Reveal>
            <div className="max-w-2xl">
              <span className="text-xs font-semibold tracking-wide uppercase text-primary">Marketplace</span>
              <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
                Curated study tools.
              </h1>
              <p className="mt-3 text-muted-foreground">
                Hand-picked products to match every study style, from minimalist to maximalist.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.05} className="mt-8">
            <div className="rounded-2xl border border-border bg-surface p-4 md:p-5 shadow-soft-sm flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search products…"
                  className="pl-9 h-10"
                />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Max</span>
                <span className="font-semibold tabular-nums w-16 text-right">${maxPrice}</span>
                <input
                  type="range"
                  min={10}
                  max={150}
                  step={5}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-32 accent-[var(--primary)]"
                />
              </div>
            </div>
          </Reveal>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-medium border transition",
                  cat === c
                    ? "bg-primary text-primary-foreground border-primary shadow-soft-sm"
                    : "bg-surface border-border text-muted-foreground hover:text-foreground hover:border-primary/30",
                )}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {list.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.04}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>

          {list.length === 0 && (
            <div className="mt-16 text-center text-sm text-muted-foreground">
              No products match these filters.
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

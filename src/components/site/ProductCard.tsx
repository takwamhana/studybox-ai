import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { Product } from "@/lib/products";

export function ProductCard({ product, badge }: { product: Product; badge?: string }) {
  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className="group block"
    >
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-soft-sm hover:shadow-soft-lg transition-shadow"
      >
        <div className="relative aspect-square overflow-hidden bg-surface-alt">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={800}
            height={800}
            className="h-full w-full object-cover transition-[filter,opacity] duration-300 group-hover:brightness-90"
          />
          {badge && (
            <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-primary/95 text-primary-foreground text-[10px] font-semibold px-2.5 py-1 backdrop-blur">
              {badge}
            </span>
          )}
          <div className="pointer-events-none absolute inset-0 flex items-end justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="rounded-full bg-foreground/90 text-background text-xs font-medium px-3 py-1.5 backdrop-blur">
              View product
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold tracking-tight truncate">{product.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{product.tagline}</p>
            </div>
            <div className="text-sm font-semibold tabular-nums">${product.price}</div>
          </div>
          <div className="mt-3 inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
            {product.category}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

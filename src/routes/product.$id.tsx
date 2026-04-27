import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, ShoppingBag, Sparkles } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { Reveal } from "@/components/site/Reveal";
import { ProductCard } from "@/components/site/ProductCard";
import { Button } from "@/components/ui/button";
import { PRODUCTS, FIELDS } from "@/lib/products";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = PRODUCTS.find((p) => p.id === params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — StudyBox AI` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: `${loaderData.product.name} — StudyBox AI` },
          { property: "og:description", content: loaderData.product.description },
          { property: "og:image", content: loaderData.product.image },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <Layout>
      <div className="px-6 py-24 text-center">
        <h1 className="text-3xl font-bold">Product not found</h1>
        <Button asChild className="mt-6">
          <Link to="/marketplace">Back to marketplace</Link>
        </Button>
      </div>
    </Layout>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const recommended = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);
  const fieldLabels = product.fields
    .map((f) => FIELDS.find((x) => x.value === f)?.label)
    .filter(Boolean);

  return (
    <Layout>
      <section className="px-6">
        <div className="mx-auto max-w-6xl py-8">
          <Link
            to="/marketplace"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to marketplace
          </Link>

          <div className="mt-6 grid lg:grid-cols-2 gap-10 items-start">
            <Reveal>
              <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-surface-alt shadow-soft-md">
                <img
                  src={product.image}
                  alt={product.name}
                  width={1024}
                  height={1024}
                  className="h-full w-full object-cover"
                />
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <div>
                <div className="inline-flex items-center rounded-full bg-secondary text-secondary-foreground px-2.5 py-1 text-xs font-medium">
                  {product.category}
                </div>
                <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">{product.name}</h1>
                <p className="mt-2 text-lg text-muted-foreground">{product.tagline}</p>

                <div className="mt-6 flex items-baseline gap-3">
                  <div className="text-3xl font-bold tabular-nums">${product.price}</div>
                  <div className="text-sm text-muted-foreground">free shipping over $50</div>
                </div>

                <p className="mt-6 text-sm leading-relaxed text-foreground/80">{product.description}</p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button size="lg" className="shadow-soft-md hover:-translate-y-0.5 transition-transform">
                    <ShoppingBag className="mr-1.5 h-4 w-4" /> Add to cart
                  </Button>
                  <Button asChild variant="secondary" size="lg">
                    <Link to="/generator">
                      <Sparkles className="mr-1.5 h-4 w-4" /> Generate matching box
                    </Link>
                  </Button>
                </div>

                <div className="mt-10 rounded-2xl border border-border bg-surface p-5">
                  <div className="text-xs font-semibold tracking-wide uppercase text-primary">Recommended for</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {fieldLabels.map((l) => (
                      <span key={l} className="inline-flex items-center gap-1.5 rounded-full bg-secondary text-secondary-foreground px-3 py-1 text-xs font-medium">
                        <Check className="h-3 w-3 text-primary" /> {l}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Recommended */}
          <div className="mt-24">
            <Reveal>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">You might also like</h2>
            </Reveal>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-5">
              {recommended.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.05}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { ArrowRight, Check, Save, Share2, Sparkles } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { FIELDS, generateBox, saveBox, type Profile } from "@/lib/products";
import { toast } from "sonner";

type SearchParams = Partial<Profile>;

export const Route = createFileRoute("/box")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    field: typeof search.field === "string" ? search.field : undefined,
    level: typeof search.level === "string" ? search.level : undefined,
    goal: typeof search.goal === "string" ? search.goal : undefined,
    style: typeof search.style === "string" ? search.style : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Your StudyBox — StudyBox AI" },
      { name: "description", content: "Your AI-generated study kit, ready to focus." },
    ],
  }),
  component: BoxPage,
});

function BoxPage() {
  const search = useSearch({ from: "/box" });

  const profile: Profile = {
    field: search.field ?? "computer-science",
    level: search.level ?? "L3",
    goal: search.goal ?? "exams",
    style: search.style ?? "organized",
  };

  const { products, rationale } = useMemo(() => generateBox(profile), [profile.field, profile.level, profile.goal, profile.style]);

  const total = products.reduce((acc, p) => acc + p.price, 0);
  const fieldLabel = FIELDS.find((f) => f.value === profile.field)?.label ?? profile.field;

  useEffect(() => {
    // smooth scroll to top on entry
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSave = () => {
    saveBox({
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      profile,
      productIds: products.map((p) => p.id),
    });
    toast.success("StudyBox saved to your dashboard.");
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Share link copied to clipboard.");
    } catch {
      toast.error("Could not copy link.");
    }
  };

  return (
    <Layout>
      <section className="px-6">
        <div className="mx-auto max-w-6xl py-8">
          <motion.div
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-success/10 text-success px-3 py-1 text-xs font-medium">
              <Check className="h-3.5 w-3.5" /> StudyBox ready
            </div>
            <h1 className="mt-5 text-4xl md:text-6xl font-bold tracking-tight">
              Your <span className="gradient-text">StudyBox</span> is ready.
            </h1>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Curated for {fieldLabel} · {profile.level} · {profile.goal} · {profile.style}.
            </p>
          </motion.div>

          {/* SUMMARY BAR */}
          <Reveal delay={0.1} className="mt-10">
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft-md flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-soft-md">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">{products.length} items in your box</div>
                  <div className="text-2xl font-bold tabular-nums">${total}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={handleShare}>
                  <Share2 className="mr-1 h-4 w-4" /> Share
                </Button>
                <Button variant="secondary" onClick={handleSave}>
                  <Save className="mr-1 h-4 w-4" /> Save box
                </Button>
                <Button className="shadow-soft-md hover:-translate-y-0.5 transition-transform">
                  Add all to cart <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Reveal>

          {/* PRODUCTS */}
          <div className="mt-10 grid lg:grid-cols-3 gap-5">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={0.15 + i * 0.06}>
                <div className="group h-full rounded-2xl border border-border bg-surface overflow-hidden shadow-soft-sm hover:shadow-soft-lg transition-shadow">
                  <Link to="/product/$id" params={{ id: p.id }} className="block relative aspect-[4/3] overflow-hidden bg-surface-alt">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      width={800}
                      height={600}
                      className="h-full w-full object-cover transition-[filter] duration-300 group-hover:brightness-90"
                    />
                  </Link>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold tracking-tight">{p.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{p.tagline}</p>
                      </div>
                      <div className="text-sm font-semibold tabular-nums">${p.price}</div>
                    </div>
                    <div className="mt-4 rounded-lg bg-primary/5 border border-primary/10 px-3 py-2 text-xs text-foreground/80">
                      <span className="font-semibold text-primary">Why:</span> {rationale[p.id]}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.4} className="mt-12 text-center">
            <Button asChild variant="ghost">
              <Link to="/generator">Refine my preferences</Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}

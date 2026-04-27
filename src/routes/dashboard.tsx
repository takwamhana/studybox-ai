import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Award, Calendar, Package, Plus, Sparkles, Trophy, Zap } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { listSaved, PRODUCTS, FIELDS, type SavedBox } from "@/lib/products";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — StudyBox AI" },
      { name: "description", content: "Your saved StudyBoxes, recommendations, and progress." },
    ],
  }),
  component: DashboardPage,
});

const BADGES = [
  { icon: Sparkles, label: "First box", desc: "Generated your first kit", earned: true },
  { icon: Zap, label: "Quick start", desc: "Generated in under 60s", earned: true },
  { icon: Trophy, label: "Curator", desc: "Saved 3 boxes", earned: false },
  { icon: Award, label: "All-rounder", desc: "Tried 4 study styles", earned: false },
];

function DashboardPage() {
  const [boxes, setBoxes] = useState<SavedBox[]>([]);

  useEffect(() => {
    setBoxes(listSaved());
  }, []);

  return (
    <Layout>
      <section className="px-6">
        <div className="mx-auto max-w-6xl py-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="text-xs font-semibold tracking-wide uppercase text-primary">Dashboard</span>
                <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">Welcome back.</h1>
                <p className="mt-3 text-muted-foreground">Your saved StudyBoxes and progress.</p>
              </div>
              <Button asChild className="shadow-soft-md hover:-translate-y-0.5 transition-transform">
                <Link to="/generator">
                  <Plus className="mr-1 h-4 w-4" /> New StudyBox
                </Link>
              </Button>
            </div>
          </Reveal>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Package, label: "Saved boxes", value: boxes.length },
              { icon: Calendar, label: "Days active", value: 12 },
              { icon: Sparkles, label: "Recommendations", value: boxes.length * 5 },
              { icon: Trophy, label: "Badges", value: BADGES.filter((b) => b.earned).length },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 0.04}>
                <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft-sm">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                    <s.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="mt-3 text-3xl font-bold tabular-nums">{s.value}</div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 grid lg:grid-cols-3 gap-5">
            {/* Saved boxes */}
            <div className="lg:col-span-2">
              <Reveal>
                <h2 className="text-xl font-semibold tracking-tight">Saved StudyBoxes</h2>
              </Reveal>

              {boxes.length === 0 ? (
                <Reveal delay={0.05}>
                  <div className="mt-4 rounded-2xl border border-dashed border-border bg-surface/40 p-10 text-center">
                    <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary">
                      <Package className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-semibold">No boxes yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Your saved StudyBoxes will live here. Generate your first one to get started.
                    </p>
                    <Button asChild className="mt-5">
                      <Link to="/generator">Generate my first box</Link>
                    </Button>
                  </div>
                </Reveal>
              ) : (
                <div className="mt-4 space-y-3">
                  {boxes.map((b, i) => {
                    const items = b.productIds
                      .map((id) => PRODUCTS.find((p) => p.id === id))
                      .filter(Boolean) as typeof PRODUCTS;
                    const total = items.reduce((acc, p) => acc + p.price, 0);
                    const fieldLabel =
                      FIELDS.find((f) => f.value === b.profile.field)?.label ?? b.profile.field;
                    return (
                      <Reveal key={b.id} delay={i * 0.04}>
                        <Link
                          to="/box"
                          search={b.profile as never}
                          className="group block rounded-2xl border border-border bg-surface p-5 shadow-soft-sm hover:shadow-soft-md transition-shadow"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="min-w-0">
                              <div className="text-xs text-muted-foreground">
                                {new Date(b.createdAt).toLocaleDateString()}
                              </div>
                              <div className="mt-1 font-semibold tracking-tight truncate">
                                {fieldLabel} · {b.profile.level} · {b.profile.goal}
                              </div>
                              <div className="mt-1 text-xs text-muted-foreground capitalize">
                                {b.profile.style} learner
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="hidden sm:flex -space-x-2">
                                {items.slice(0, 4).map((p) => (
                                  <div
                                    key={p.id}
                                    className="h-9 w-9 rounded-lg border-2 border-surface overflow-hidden bg-surface-alt"
                                  >
                                    <img
                                      src={p.image}
                                      alt={p.name}
                                      loading="lazy"
                                      width={64}
                                      height={64}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                ))}
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-muted-foreground">{items.length} items</div>
                                <div className="font-semibold tabular-nums">${total}</div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </Reveal>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Badges */}
            <div>
              <Reveal>
                <h2 className="text-xl font-semibold tracking-tight">Badges</h2>
              </Reveal>
              <Reveal delay={0.05}>
                <div className="mt-4 rounded-2xl border border-border bg-surface p-5 shadow-soft-sm">
                  <div className="space-y-3">
                    {BADGES.map((b) => (
                      <div
                        key={b.label}
                        className={`flex items-start gap-3 rounded-xl p-3 ${
                          b.earned ? "bg-primary/5 border border-primary/15" : "bg-surface-alt opacity-60"
                        }`}
                      >
                        <div
                          className={`h-9 w-9 shrink-0 inline-flex items-center justify-center rounded-lg ${
                            b.earned
                              ? "bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-soft-sm"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          <b.icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold">{b.label}</div>
                          <div className="text-xs text-muted-foreground">{b.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

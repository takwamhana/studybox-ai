import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Brain, Target, Zap, Check, BookOpen, Coffee, Headphones } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { Reveal } from "@/components/site/Reveal";
import { ProductCard } from "@/components/site/ProductCard";
import { Button } from "@/components/ui/button";
import { PRODUCTS } from "@/lib/products";
import heroCube from "@/assets/hero-cube.jpg";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const HEADLINE_WORDS = ["Your", "personalized", "study", "kit,", "powered", "by", "AI."];

function HomePage() {
  return (
    <Layout>
      {/* HERO */}
      <section className="relative px-6">
        <div className="mx-auto max-w-6xl grid lg:grid-cols-2 gap-12 lg:gap-8 items-center pt-8 lg:pt-16 pb-24">
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 backdrop-blur px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              Built for university students
            </motion.div>

            <h1 className="mt-6 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
              {HEADLINE_WORDS.map((w, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.7,
                    delay: 0.4 + i * 0.05,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  className="inline-block mr-[0.25em]"
                >
                  {i === 5 ? <span className="gradient-text">{w}</span> : w}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="mt-6 text-lg text-muted-foreground max-w-md"
            >
              Tell us your field, level and study style. We curate the perfect kit — notebooks, tools and gear — to help you focus.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.05 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Button asChild size="lg" className="shadow-soft-lg hover:-translate-y-0.5 transition-transform group">
                <Link to="/generator">
                  Generate my StudyBox
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link to="/marketplace">Browse marketplace</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="mt-10 flex items-center gap-6 text-xs text-muted-foreground"
            >
              <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-success" /> No subscription</div>
              <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-success" /> Curated by AI</div>
              <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-success" /> Ships next day</div>
            </motion.div>
          </div>

          {/* HERO VISUAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="relative"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 grid-pattern opacity-50" />
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative h-full w-full"
              >
                <img
                  src={heroCube}
                  alt="StudyBox AI cube containing study tools"
                  width={1024}
                  height={1024}
                  className="h-full w-full object-contain drop-shadow-2xl"
                />
              </motion.div>

              {/* Floating chips */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                className="absolute top-8 -left-4 md:-left-8 glass-panel rounded-xl border border-border/60 shadow-soft-md px-3 py-2 flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium">Notebook</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.25, duration: 0.6 }}
                className="absolute bottom-16 -right-2 md:-right-6 glass-panel rounded-xl border border-border/60 shadow-soft-md px-3 py-2 flex items-center gap-2"
              >
                <Headphones className="h-4 w-4 text-accent" />
                <span className="text-xs font-medium">Focus gear</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                className="absolute -bottom-2 left-12 glass-panel rounded-xl border border-border/60 shadow-soft-md px-3 py-2 flex items-center gap-2"
              >
                <Coffee className="h-4 w-4 text-warning" />
                <span className="text-xs font-medium">Wellness</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* LOGOS / TRUST */}
      <Reveal className="px-6">
        <div className="mx-auto max-w-6xl border-y border-border/60 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { k: "12k+", v: "kits curated" },
            { k: "98%", v: "match accuracy" },
            { k: "30s", v: "avg generation" },
            { k: "4.9★", v: "student rating" },
          ].map((s) => (
            <div key={s.v}>
              <div className="text-2xl font-bold tabular-nums">{s.k}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.v}</div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* HOW IT WORKS */}
      <section className="px-6 mt-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="max-w-2xl">
              <span className="text-xs font-semibold tracking-wide uppercase text-primary">How it works</span>
              <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
                Three steps to a focused semester.
              </h2>
            </div>
          </Reveal>

          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Brain,
                title: "Tell us about you",
                desc: "Field, level, goal, study style. Two minutes, no signup needed.",
              },
              {
                icon: Sparkles,
                title: "AI curates your kit",
                desc: "We match you with the right products from our marketplace, instantly.",
              },
              {
                icon: Target,
                title: "Stay focused",
                desc: "Save your kit, share it, or refine it whenever your goals change.",
              },
            ].map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <div className="relative h-full rounded-2xl border border-border bg-surface p-6 shadow-soft-sm hover:shadow-soft-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary">
                      <s.icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-semibold tabular-nums text-muted-foreground">0{i + 1}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="px-6 mt-32">
        <div className="mx-auto max-w-6xl">
          <Reveal className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <span className="text-xs font-semibold tracking-wide uppercase text-primary">Marketplace</span>
              <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
                Tools chosen for clarity.
              </h2>
            </div>
            <Button asChild variant="ghost">
              <Link to="/marketplace">
                See all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {PRODUCTS.slice(0, 4).map((p, i) => (
              <Reveal key={p.id} delay={i * 0.05}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* AI FEATURE BLOCK */}
      <section className="px-6 mt-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface via-surface to-surface-alt p-8 md:p-14 shadow-soft-lg">
              <div className="absolute -top-32 -right-24 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
              <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />

              <div className="relative grid lg:grid-cols-2 gap-10 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
                    <Zap className="h-3.5 w-3.5" /> AI Engine v2
                  </div>
                  <h2 className="mt-5 text-3xl md:text-4xl font-bold tracking-tight">
                    Curation that actually understands your field.
                  </h2>
                  <p className="mt-4 text-muted-foreground max-w-md">
                    Our model maps your study style and goals against thousands of student outcomes — so every recommendation has a reason.
                  </p>
                  <ul className="mt-6 space-y-3">
                    {[
                      "Field-specific recommendations (Med, Law, CS, Eng…)",
                      "Adapts to last-minute or organized styles",
                      "Refine, save and re-generate anytime",
                    ].map((t) => (
                      <li key={t} className="flex items-start gap-3 text-sm">
                        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                          <Check className="h-3 w-3" />
                        </span>
                        {t}
                      </li>
                    ))}
                  </ul>
                  <Button asChild size="lg" className="mt-8 shadow-soft-md hover:-translate-y-0.5 transition-transform">
                    <Link to="/generator">Try the generator</Link>
                  </Button>
                </div>

                {/* Mock generator card */}
                <div className="relative">
                  <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft-lg">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="inline-flex h-2 w-2 rounded-full bg-success" />
                      Generating your StudyBox…
                    </div>
                    <div className="mt-4 space-y-2.5">
                      {[
                        { l: "Field of study", v: "Computer Science" },
                        { l: "Level", v: "L3" },
                        { l: "Goal", v: "Final exams" },
                        { l: "Style", v: "Visual learner" },
                      ].map((r) => (
                        <div key={r.l} className="flex items-center justify-between text-sm rounded-lg bg-surface-alt px-3 py-2">
                          <span className="text-muted-foreground">{r.l}</span>
                          <span className="font-medium">{r.v}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-secondary">
                      <motion.div
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="h-full w-1/2 bg-gradient-to-r from-primary to-accent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}

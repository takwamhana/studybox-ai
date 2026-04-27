import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { FIELDS, LEVELS, GOALS, STYLES, BUDGETS, type Profile } from "@/lib/products";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/generator")({
  head: () => ({
    meta: [
      { title: "Generator — StudyBox AI" },
      { name: "description", content: "Tell us your field, level and study style. We'll generate a personalized study kit in seconds." },
      { property: "og:title", content: "Generator — StudyBox AI" },
      { property: "og:description", content: "AI-curated study kits in seconds." },
    ],
  }),
  component: GeneratorPage,
});

const STEPS = ["Field", "Level", "Goal", "Style", "Budget"] as const;

const LOADING_LINES = [
  "Analyzing your profile…",
  "Selecting optimal tools…",
  "Curating your kit…",
  "Almost ready…",
];

function GeneratorPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(false);
  const [loadingLine, setLoadingLine] = useState(0);

  const canNext =
    (step === 0 && profile.field) ||
    (step === 1 && profile.level) ||
    (step === 2 && profile.goal) ||
    (step === 3 && profile.style) ||
    (step === 4 && profile.budget);

  const select = (key: keyof Profile, val: string | number) => {
    setProfile((p) => ({ ...p, [key]: val }));
  };

  const submit = async () => {
    setLoading(true);
    for (let i = 0; i < LOADING_LINES.length; i++) {
      await new Promise((r) => setTimeout(r, 800));
      setLoadingLine(i);
    }
    const params = new URLSearchParams({
      field: profile.field as string,
      level: profile.level as string,
      goal: profile.goal as string,
      style: profile.style as string,
      budget: String(profile.budget ?? 150),
    });
    navigate({ to: "/box", search: Object.fromEntries(params) as never });
  };

  return (
    <Layout>
      <section className="px-6">
        <div className="mx-auto max-w-2xl py-12">
          {!loading && (
            <>
              <div className="text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 backdrop-blur px-3 py-1 text-xs font-medium text-muted-foreground">
                  <Sparkles className="h-3 w-3 text-primary" /> Step {step + 1} of {STEPS.length}
                </div>
                <h1 className="mt-5 text-4xl md:text-5xl font-bold tracking-tight">
                  Let's build your <span className="gradient-text">StudyBox</span>
                </h1>
                <p className="mt-3 text-muted-foreground">A few questions and we'll curate the rest.</p>
              </div>

              {/* Progress */}
              <div className="mt-10 flex items-center gap-2">
                {STEPS.map((s, i) => (
                  <div key={s} className="flex-1">
                    <div
                      className={cn(
                        "h-1 rounded-full transition-colors",
                        i <= step ? "bg-primary" : "bg-secondary",
                      )}
                    />
                    <div className={cn("mt-2 text-xs font-medium", i === step ? "text-foreground" : "text-muted-foreground")}>
                      {s}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 rounded-3xl border border-border bg-surface p-6 md:p-8 shadow-soft-lg">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  >
                    {step === 0 && (
                      <Grid>
                        {FIELDS.map((f) => (
                          <OptionCard
                            key={f.value}
                            label={f.label}
                            selected={profile.field === f.value}
                            onClick={() => select("field", f.value)}
                          />
                        ))}
                      </Grid>
                    )}
                    {step === 1 && (
                      <div className="space-y-3">
                        <div>
                          <h2 className="text-2xl font-bold tracking-tight">What's your level?</h2>
                          <p className="mt-1 text-sm text-muted-foreground">Choose your current academic level</p>
                        </div>
                        <div className="flex flex-col gap-3 pt-2">
                          {LEVELS.map((f) => (
                            <OptionCard
                              key={f.value}
                              label={f.label}
                              desc={f.desc}
                              selected={profile.level === f.value}
                              onClick={() => select("level", f.value)}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    {step === 2 && (
                      <Grid>
                        {GOALS.map((f) => (
                          <OptionCard
                            key={f.value}
                            label={f.label}
                            desc={f.desc}
                            selected={profile.goal === f.value}
                            onClick={() => select("goal", f.value)}
                          />
                        ))}
                      </Grid>
                    )}
                    {step === 3 && (
                      <Grid>
                        {STYLES.map((f) => (
                          <OptionCard
                            key={f.value}
                            label={f.label}
                            desc={f.desc}
                            selected={profile.style === f.value}
                            onClick={() => select("style", f.value)}
                          />
                        ))}
                      </Grid>
                    )}
                    {step === 4 && (
                      <div className="space-y-3">
                        <div>
                          <h2 className="text-2xl font-bold tracking-tight">What's your budget?</h2>
                          <p className="mt-1 text-sm text-muted-foreground">We'll recommend products within your budget</p>
                        </div>
                        <div className="flex flex-col gap-3 pt-2">
                          {BUDGETS.map((b) => (
                            <OptionCard
                              key={b.value}
                              label={b.label}
                              desc={b.desc}
                              selected={profile.budget === b.value}
                              onClick={() => select("budget", b.value)}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="mt-8 flex items-center justify-between">
                  <Button
                    variant="ghost"
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    disabled={step === 0}
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" /> Back
                  </Button>
                  {step < STEPS.length - 1 ? (
                    <Button
                      onClick={() => setStep((s) => s + 1)}
                      disabled={!canNext}
                      className="shadow-soft-md hover:-translate-y-0.5 transition-transform"
                    >
                      Continue <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={submit}
                      disabled={!canNext}
                      className="shadow-soft-md hover:-translate-y-0.5 transition-transform"
                    >
                      <Sparkles className="mr-1 h-4 w-4" /> Generate my box
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-10 rounded-3xl border border-border bg-surface p-12 shadow-soft-lg text-center"
            >
              {/* Animated cube loader */}
              <div className="relative mx-auto h-32 w-32">
                <motion.div
                  animate={{ rotateY: 360, rotateX: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-glow"
                  style={{ transformStyle: "preserve-3d" }}
                />
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-2xl bg-primary/30 blur-2xl"
                />
              </div>

              <h2 className="mt-10 text-2xl md:text-3xl font-bold tracking-tight">Building your StudyBox…</h2>

              <div className="mt-3 h-6 relative">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={loadingLine}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-x-0 text-sm text-muted-foreground"
                  >
                    {LOADING_LINES[loadingLine]}
                  </motion.p>
                </AnimatePresence>
              </div>

              <div className="mt-8 mx-auto max-w-xs h-1.5 overflow-hidden rounded-full bg-secondary">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: LOADING_LINES.length * 0.8, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-primary to-accent"
                />
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>;
}

function OptionCard({
  label,
  desc,
  selected,
  onClick,
}: {
  label: string;
  desc?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative text-left rounded-xl border p-4 transition-all",
        selected
          ? "border-primary bg-primary/5 shadow-soft-md"
          : "border-border bg-surface hover:border-primary/40 hover:bg-surface-alt",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold tracking-tight">{label}</div>
          {desc && <div className="mt-1 text-xs text-muted-foreground">{desc}</div>}
        </div>
        <span
          className={cn(
            "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition",
            selected ? "border-primary bg-primary text-primary-foreground" : "border-border",
          )}
        >
          {selected && <Check className="h-3 w-3" />}
        </span>
      </div>
    </button>
  );
}

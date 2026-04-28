import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FIELDS, LEVELS, GOALS, STYLES, type Profile } from "@/lib/products";
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
  const [customBudget, setCustomBudget] = useState("150");

  const canNext =
    (step === 0 && profile.field) ||
    (step === 1 && profile.level) ||
    (step === 2 && profile.goal) ||
    (step === 3 && profile.style) ||
    (step === 4 && customBudget && parseInt(customBudget) >= 20 && parseInt(customBudget) <= 500);

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
      budget: customBudget,
    });
    navigate({ to: "/box", search: Object.fromEntries(params) as never });
  };

  const fieldLabel = FIELDS.find((f) => f.value === profile.field)?.label;
  const levelLabel = LEVELS.find((l) => l.value === profile.level)?.label;
  const goalLabel = GOALS.find((g) => g.value === profile.goal)?.label;
  const styleLabel = STYLES.find((s) => s.value === profile.style)?.label;

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
                    {/* Field Selection - Dropdown */}
                    {step === 0 && (
                      <div className="space-y-4">
                        <div>
                          <h2 className="text-2xl font-bold tracking-tight">What's your field of study?</h2>
                          <p className="mt-1 text-sm text-muted-foreground">Select your primary academic field</p>
                        </div>
                        <Select value={profile.field || ""} onValueChange={(val) => select("field", val)}>
                          <SelectTrigger className="w-full h-12">
                            <SelectValue placeholder="Select your field..." />
                          </SelectTrigger>
                          <SelectContent>
                            {FIELDS.map((f) => (
                              <SelectItem key={f.value} value={f.value}>
                                {f.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldLabel && (
                          <div className="rounded-lg bg-primary/5 border border-primary/10 px-4 py-3 text-sm text-foreground">
                            <span className="font-semibold text-primary">Selected:</span> {fieldLabel}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Level Selection - Dropdown */}
                    {step === 1 && (
                      <div className="space-y-4">
                        <div>
                          <h2 className="text-2xl font-bold tracking-tight">What's your level?</h2>
                          <p className="mt-1 text-sm text-muted-foreground">Choose your current academic level</p>
                        </div>
                        <Select value={profile.level || ""} onValueChange={(val) => select("level", val)}>
                          <SelectTrigger className="w-full h-12">
                            <SelectValue placeholder="Select your level..." />
                          </SelectTrigger>
                          <SelectContent>
                            {LEVELS.map((l) => (
                              <SelectItem key={l.value} value={l.value}>
                                {l.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {levelLabel && (
                          <div className="rounded-lg bg-primary/5 border border-primary/10 px-4 py-3 text-sm text-foreground">
                            <span className="font-semibold text-primary">Selected:</span> {levelLabel}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Goal Selection - Dropdown */}
                    {step === 2 && (
                      <div className="space-y-4">
                        <div>
                          <h2 className="text-2xl font-bold tracking-tight">What's your study goal?</h2>
                          <p className="mt-1 text-sm text-muted-foreground">Select your primary study objective</p>
                        </div>
                        <Select value={profile.goal || ""} onValueChange={(val) => select("goal", val)}>
                          <SelectTrigger className="w-full h-12">
                            <SelectValue placeholder="Select your goal..." />
                          </SelectTrigger>
                          <SelectContent>
                            {GOALS.map((g) => (
                              <SelectItem key={g.value} value={g.value}>
                                {g.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {goalLabel && (
                          <div className="rounded-lg bg-primary/5 border border-primary/10 px-4 py-3 text-sm text-foreground">
                            <span className="font-semibold text-primary">Selected:</span> {goalLabel}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Style Selection - Dropdown */}
                    {step === 3 && (
                      <div className="space-y-4">
                        <div>
                          <h2 className="text-2xl font-bold tracking-tight">What's your study style?</h2>
                          <p className="mt-1 text-sm text-muted-foreground">Choose how you prefer to learn</p>
                        </div>
                        <Select value={profile.style || ""} onValueChange={(val) => select("style", val)}>
                          <SelectTrigger className="w-full h-12">
                            <SelectValue placeholder="Select your style..." />
                          </SelectTrigger>
                          <SelectContent>
                            {STYLES.map((s) => (
                              <SelectItem key={s.value} value={s.value}>
                                {s.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {styleLabel && (
                          <div className="rounded-lg bg-primary/5 border border-primary/10 px-4 py-3 text-sm text-foreground">
                            <span className="font-semibold text-primary">Selected:</span> {styleLabel}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Budget Input - Custom */}
                    {step === 4 && (
                      <div className="space-y-4">
                        <div>
                          <h2 className="text-2xl font-bold tracking-tight">What's your budget?</h2>
                          <p className="mt-1 text-sm text-muted-foreground">Enter your budget in DT. We'll curate products within your range.</p>
                        </div>
                        <div className="space-y-3 pt-2">
                          <input
                            type="number"
                            min="20"
                            max="500"
                            value={customBudget}
                            onChange={(e) => setCustomBudget(e.target.value)}
                            placeholder="Enter budget (20-500 DT)"
                            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Range: 20 - 500 DT</span>
                            {customBudget && (
                              <span className="font-semibold text-primary">{customBudget} DT</span>
                            )}
                          </div>
                        </div>
                        {customBudget && parseInt(customBudget) >= 20 && parseInt(customBudget) <= 500 && (
                          <div className="rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-700 dark:text-green-400">
                            ✓ Budget valid. Ready to generate!
                          </div>
                        )}
                        {customBudget && (parseInt(customBudget) < 20 || parseInt(customBudget) > 500) && (
                          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                            ✗ Budget must be between 20 and 500 DT
                          </div>
                        )}
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

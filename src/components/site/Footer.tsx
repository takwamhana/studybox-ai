import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t border-border/60 mt-32">
      <div className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
          Ready to <span className="gradient-text">focus</span>?
        </h2>
        <p className="mt-4 text-muted-foreground max-w-md mx-auto">
          Generate your personalized study kit in under 30 seconds.
        </p>
        <Button asChild size="lg" className="mt-8 shadow-soft-lg hover:-translate-y-0.5 transition-transform">
          <Link to="/generator">Generate my StudyBox</Link>
        </Button>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-primary to-accent">
              <Sparkles className="h-3 w-3 text-primary-foreground" />
            </span>
            <span>© {new Date().getFullYear()} StudyBox AI</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-foreground transition">About</a>
            <a href="#" className="hover:text-foreground transition">Contact</a>
            <a href="#" className="hover:text-foreground transition">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { User, PackageOpen, Trophy, BarChart3, Edit, LogOut, Zap, TrendingUp, Flame } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/user";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — StudyBox AI" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  return <ProtectedRoute><DashboardContent /></ProtectedRoute>;
}

function DashboardContent() {
  const { user, logout, updateProfile, error } = useUser();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [isSaving, setIsSaving] = useState(false);

  if (!user) return null;

  const stats = user.statistics || { totalBoxes: 0, totalOrders: 0, totalSpent: 0, favoriteFields: [], xp: 0, level: 1 };

  // Gamification calculations
  const xpPerLevel = 500;
  const currentLevelXp = stats.xp % xpPerLevel;
  const xpToNextLevel = xpPerLevel - currentLevelXp;
  const levelProgress = (currentLevelXp / xpPerLevel) * 100;
  const totalBadges = user.badges?.length || 0;

  const handleSaveProfile = async () => {
    if (!editName.trim()) { toast.error("Name cannot be empty"); return; }
    try { setIsSaving(true); await updateProfile({ name: editName }); toast.success("Profile updated"); setIsEditingProfile(false); }
    catch { toast.error(error); }
    finally { setIsSaving(false); }
  };

  return (
    <Layout>
      <section className="px-6">
        <div className="mx-auto max-w-6xl py-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center justify-between mb-10">
              <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
              <Button variant="outline" onClick={logout} className="text-destructive"><LogOut className="mr-2 h-4 w-4" /> Logout</Button>
            </div>

            {/* XP & Level Section */}
            <Reveal delay={0}>
              <motion.div className="rounded-2xl border border-border bg-gradient-to-r from-primary/5 to-accent/5 p-6 shadow-soft-sm mb-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-soft-md">
                      <Zap className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Level</p>
                      <p className="text-3xl font-bold">{stats.level}</p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground">Progress to Level {stats.level + 1}</span>
                      <span className="text-xs font-bold text-primary">{currentLevelXp} / {xpPerLevel} XP</span>
                    </div>
                    <div className="h-3 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${levelProgress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-primary to-accent"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-1 space-y-6">
                <Reveal delay={0}>
                  <motion.div className="rounded-2xl border border-border bg-surface p-6 shadow-soft-sm">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><User className="h-5 w-5" /> Profile</h2>
                    {isEditingProfile ? (
                      <div className="space-y-4">
                        <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border" />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSaveProfile} disabled={isSaving} className="flex-1">{isSaving ? "Saving..." : "Save"}</Button>
                          <Button size="sm" variant="outline" onClick={() => { setIsEditingProfile(false); setEditName(user.name); }} className="flex-1">Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3 mb-4">
                          <div><p className="text-xs text-muted-foreground">Name</p><p className="font-semibold">{user.name}</p></div>
                          <div><p className="text-xs text-muted-foreground">Email</p><p className="font-semibold break-all">{user.email}</p></div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(true)} className="w-full"><Edit className="mr-2 h-4 w-4" /> Edit</Button>
                      </>
                    )}
                  </motion.div>
                </Reveal>

                <Reveal delay={0.1}>
                  <motion.div className="rounded-2xl border border-border bg-surface p-6 shadow-soft-sm">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Trophy className="h-5 w-5 text-orange-500" /> Recent Badges</h2>
                    {user.badges?.length > 0 ? user.badges.slice(0, 3).map((b) => (
                      <div key={b.id} className="flex gap-3 p-3 rounded-lg bg-secondary/50 mb-2">
                        <Trophy className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-sm font-medium block">{b.name}</span>
                          <span className="text-xs text-muted-foreground">{b.description || "Achievement unlocked!"}</span>
                        </div>
                      </div>
                    )) : <p className="text-sm text-muted-foreground">No badges yet. Generate study boxes to unlock achievements!</p>}
                  </motion.div>
                </Reveal>
              </div>

              <div className="md:col-span-2 space-y-6">
                <Reveal delay={0.2}>
                  <motion.div className="rounded-2xl border border-border bg-surface p-6 shadow-soft-sm">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Your Achievements</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="text-center rounded-lg bg-primary/5 p-4 border border-primary/10">
                        <p className="text-3xl font-bold text-primary">{stats.xp || 0}</p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1"><Zap className="h-3 w-3" /> Total XP</p>
                      </div>
                      <div className="text-center rounded-lg bg-accent/5 p-4 border border-accent/10">
                        <p className="text-3xl font-bold text-accent">{stats.level || 1}</p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1"><TrendingUp className="h-3 w-3" /> Level</p>
                      </div>
                      <div className="text-center rounded-lg bg-orange-500/5 p-4 border border-orange-500/10">
                        <p className="text-3xl font-bold text-orange-500">{stats.totalBoxes || 0}</p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1"><Flame className="h-3 w-3" /> Boxes</p>
                      </div>
                      <div className="text-center rounded-lg bg-green-500/5 p-4 border border-green-500/10">
                        <p className="text-3xl font-bold text-green-500">{totalBadges}</p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1"><Trophy className="h-3 w-3" /> Badges</p>
                      </div>
                    </div>
                  </motion.div>
                </Reveal>

                <Reveal delay={0.3}>
                  <motion.div className="rounded-2xl border border-border bg-surface p-6 shadow-soft-sm">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Statistics</h2>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center"><p className="text-3xl font-bold text-primary">{stats.totalBoxes}</p><p className="text-xs text-muted-foreground mt-1">Boxes</p></div>
                      <div className="text-center"><p className="text-3xl font-bold text-primary">{stats.totalOrders}</p><p className="text-xs text-muted-foreground mt-1">Orders</p></div>
                      <div className="text-center"><p className="text-3xl font-bold text-primary">{stats.totalSpent.toFixed(0)}</p><p className="text-xs text-muted-foreground mt-1">DT Spent</p></div>
                    </div>
                  </motion.div>
                </Reveal>

                <Reveal delay={0.35}>
                  <motion.div className="rounded-2xl border border-border bg-surface p-6 shadow-soft-sm">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><PackageOpen className="h-5 w-5" /> Saved Boxes</h2>
                    <div className="text-center py-8"><PackageOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" /> <p className="text-muted-foreground text-sm">No saved boxes yet</p></div>
                  </motion.div>
                </Reveal>
              </div>
            </div>

            <Reveal delay={0.4}>
              <motion.div className="mt-6 rounded-2xl border border-border bg-surface p-6 shadow-soft-sm">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2"><Trophy className="h-5 w-5 text-orange-500" /> All Badges ({totalBadges})</h2>
                {user.badges?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {user.badges.map((b) => (
                      <motion.div
                        key={b.id}
                        whileHover={{ y: -4 }}
                        className="rounded-lg border border-border/60 bg-surface-alt p-4 text-center hover:shadow-soft-md transition-shadow"
                      >
                        <Trophy className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                        <p className="font-semibold text-sm">{b.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{b.description || "Achievement"}</p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground">Start generating study boxes to unlock achievements!</p>
                    <p className="text-xs text-muted-foreground mt-2">+10 XP per box generated · Unlock levels and badges</p>
                  </div>
                )}
              </motion.div>
            </Reveal>

            {/* Level Progression Path */}
            <Reveal delay={0.45}>
              <motion.div className="mt-6 rounded-2xl border border-border bg-surface p-6 shadow-soft-sm">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /> Path to Mastery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <motion.div
                      key={level}
                      whileHover={stats.level >= level ? { scale: 1.05 } : {}}
                      className={cn(
                        "rounded-lg p-4 text-center border-2 transition-all",
                        stats.level >= level
                          ? "border-primary bg-primary/10"
                          : "border-border bg-surface-alt opacity-50"
                      )}
                    >
                      <p className="text-2xl font-bold">{level}</p>
                      <p className="text-xs text-muted-foreground mt-1">{level * 500} XP</p>
                      {stats.level === level && (
                        <div className="mt-2 inline-block px-2 py-1 rounded bg-primary text-primary-foreground text-xs font-medium">Current</div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </Reveal>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

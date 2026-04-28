import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { User, Mail, Lock, AlertCircle, Loader, Check } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/user";
import {
  validateSignup,
  getPasswordStrength,
  getPasswordStrengthLabel,
} from "@/lib/validation";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up — StudyBox AI" },
      { name: "description", content: "Create your StudyBox account" },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { user, signup, isLoading, error, clearError } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  // Use useEffect to handle redirect (not during render)
  useEffect(() => {
    if (user) {
      navigate({ to: "/dashboard" });
    }
  }, [user, navigate]);

  const passwordStrength = getPasswordStrength(password);
  const strengthLabel = getPasswordStrengthLabel(passwordStrength);
  const strengthColors = [
    "bg-destructive",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-success",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setErrors({});

    if (!agreeToTerms) {
      setErrors({ terms: "You must agree to the terms" });
      return;
    }

    const validationErrors = validateSignup(
      email,
      password,
      passwordConfirm,
      name
    );
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await signup(email, password, name);
      toast.success("Account created successfully!");
      navigate({ to: "/dashboard" });
    } catch (err) {
      // Error already set in context
      toast.error(error || "Signup failed");
    }
  };

  return (
    <Layout>
      <section className="px-6 py-12">
        <div className="mx-auto max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight">
                Create account
              </h1>
              <p className="mt-2 text-muted-foreground">
                Join StudyBox and start building your study kits
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex items-center gap-3 rounded-lg bg-destructive/10 border border-destructive/30 p-4"
              >
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors({ ...errors, name: "" });
                    }}
                    placeholder="John Doe"
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                      errors.name
                        ? "border-destructive bg-destructive/5"
                        : "border-border bg-surface"
                    } focus:outline-none focus:ring-2 focus:ring-primary/50 transition`}
                    disabled={isLoading}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-destructive mt-1.5">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    placeholder="you@example.com"
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                      errors.email
                        ? "border-destructive bg-destructive/5"
                        : "border-border bg-surface"
                    } focus:outline-none focus:ring-2 focus:ring-primary/50 transition`}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive mt-1.5">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: "" });
                    }}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
                      errors.password
                        ? "border-destructive bg-destructive/5"
                        : "border-border bg-surface"
                    } focus:outline-none focus:ring-2 focus:ring-primary/50 transition`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition text-xs"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {password && (
                  <div className="mt-2 space-y-2">
                    <div className="flex gap-1">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full ${
                            i < passwordStrength
                              ? strengthColors[passwordStrength]
                              : "bg-secondary"
                          }`}
                        />
                      ))}
                    </div>
                    <p
                      className={`text-xs font-medium ${
                        passwordStrength < 2 ? "text-orange-500" : "text-success"
                      }`}
                    >
                      Strength: {strengthLabel}
                    </p>
                  </div>
                )}

                {errors.password && (
                  <p className="text-xs text-destructive mt-1.5">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordConfirm}
                    onChange={(e) => {
                      setPasswordConfirm(e.target.value);
                      if (errors.passwordConfirm)
                        setErrors({ ...errors, passwordConfirm: "" });
                    }}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
                      errors.passwordConfirm
                        ? "border-destructive bg-destructive/5"
                        : password && passwordConfirm === password
                        ? "border-success/50 bg-success/5"
                        : "border-border bg-surface"
                    } focus:outline-none focus:ring-2 focus:ring-primary/50 transition`}
                    disabled={isLoading}
                  />
                  {password &&
                    passwordConfirm &&
                    passwordConfirm === password && (
                      <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-success" />
                    )}
                </div>
                {errors.passwordConfirm && (
                  <p className="text-xs text-destructive mt-1.5">
                    {errors.passwordConfirm}
                  </p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => {
                    setAgreeToTerms(e.target.checked);
                    if (errors.terms) setErrors({ ...errors, terms: "" });
                  }}
                  className="mt-1 rounded"
                  disabled={isLoading}
                />
                <label className="text-xs text-muted-foreground">
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </div>
              {errors.terms && (
                <p className="text-xs text-destructive">{errors.terms}</p>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

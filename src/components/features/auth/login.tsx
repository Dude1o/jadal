import { useState } from "react";
import { AlertCircle, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, getTranslation } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { ModeToggle } from "@/components/common/mode-toggle";
import { LangToggle } from "@/components/common/lang-toggle";

import logo from "@/assets/new-logo.png";

interface LoginProps {
  onSubmit?: (
    email: string,
    password: string,
    remember: boolean,
  ) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

/**
 * A filled field whose label floats to the top-inside and turns orange on
 * focus (§16.3). That orange label is a small, cheap brand touchpoint on a
 * screen that otherwise has only one.
 */
function Field({
  id,
  label,
  icon: Icon,
  trailing,
  invalid,
  isRTL,
  ...props
}: {
  id: string;
  label: string;
  icon: React.ElementType;
  trailing?: React.ReactNode;
  invalid?: boolean;
  isRTL?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false);
  const floated = focused || !!props.value;

  return (
    <div className="relative">
      <Icon
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-1/2 size-5 -translate-y-1/2 transition-colors duration-150",
          focused ? "text-accent" : "text-muted-foreground",
          isRTL ? "right-4" : "left-4",
        )}
      />

      <label
        htmlFor={id}
        className={cn(
          "pointer-events-none absolute z-10 font-bold transition-all duration-150 ease-out",
          isRTL ? "right-12" : "left-12",
          floated
            ? "top-2 text-[length:var(--text-small)]"
            : "top-1/2 -translate-y-1/2 text-[length:var(--text-body)]",
          focused ? "text-accent" : "text-muted-foreground",
        )}
      >
        {label}
      </label>

      <Input
        id={id}
        aria-invalid={invalid || undefined}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          // Light keeps the default inset; dark lifts the field above the
          // card so it is visible at all (§24.2).
          "h-16 pt-6 pb-1 dark:bg-[#1B3050] dark:text-[#F0F4FA] dark:focus-visible:bg-[#20375C]",
          isRTL ? "pr-12" : "pl-12",
          trailing && (isRTL ? "pl-14" : "pr-14"),
        )}
        {...props}
      />

      {trailing && (
        <span
          className={cn(
            "absolute top-1/2 -translate-y-1/2",
            isRTL ? "left-3" : "right-3",
          )}
        >
          {trailing}
        </span>
      )}
    </div>
  );
}

/**
 * Login v2 (§18): a single centred card floating on the app wash. Not a
 * split-screen hero layout — the reference is a floating card and that is the
 * right answer for an admin sign-in.
 */
export default function Login({ onSubmit, isLoading, error }: LoginProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit?.(email, password, remember);
  };

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center px-5 py-12"
      dir={i18n.dir()}
    >
      {/* Toggles sit outside the card, pinned to the viewport corner. */}
      <div className="absolute top-5 end-5 z-10 flex items-center gap-1.5">
        <LangToggle />
        <ModeToggle />
      </div>

      {/* §24.1 One surface split internally. No divider between the panels —
          the brand side carries the wash, the form side is the card surface,
          and the tonal step is the boundary. */}
      <div className="animate-fade-up flex w-full max-w-[1120px] overflow-hidden rounded-[36px] shadow-[var(--shadow-modal)] max-lg:max-w-[460px]">
        {/* Brand panel — real product facts, no illustration, no stock art. */}
        <aside className="relative hidden w-[44%] shrink-0 flex-col justify-between p-12 lg:flex">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ backgroundImage: "var(--app-wash)" }}
          />

          <div className="relative flex items-center gap-3">
            <span className="flex size-[88px] items-center justify-center rounded-[28px] bg-card shadow-[var(--shadow-card)]">
              <img
                src={logo}
                alt=""
                aria-hidden
                className="size-14 object-contain"
              />
            </span>
          </div>

          <div className="relative">
            <p className="text-[length:var(--text-display)] font-extrabold text-foreground">
              {getTranslation(t, "auth.login.brand")}
            </p>
            <p className="mt-2 max-w-[22ch] text-[length:var(--text-headline)] leading-snug font-semibold text-muted-foreground">
              {getTranslation(t, "auth.hero.slogan")}
            </p>
          </div>

          <ul className="relative space-y-2 text-[length:var(--text-caption)] font-semibold text-muted-foreground">
            <li>{getTranslation(t, "auth.login.statDebates")}</li>
            <li>{getTranslation(t, "auth.login.statTeams")}</li>
          </ul>
        </aside>

        {/* Form panel */}
        <div className="flex flex-1 flex-col justify-center bg-white px-8 py-12 sm:px-12 dark:bg-[rgba(14,29,51,.94)] dark:backdrop-blur-[20px]">
          {/* Compact lockup below lg, where the brand panel is hidden */}
          <div className="mb-8 flex flex-col items-center lg:hidden">
            <span className="flex size-[88px] items-center justify-center rounded-[28px] bg-background dark:bg-white/[0.06]">
              <img
                src={logo}
                alt=""
                aria-hidden
                className="size-14 object-contain"
              />
            </span>
            <span className="mt-3 text-[length:var(--text-display)] font-extrabold text-foreground">
              {getTranslation(t, "auth.login.brand")}
            </span>
            <p className="mt-1 text-center text-[length:var(--text-caption)] font-semibold text-muted-foreground">
              {getTranslation(t, "auth.hero.slogan")}
            </p>
          </div>

          <div className="mx-auto w-full max-w-[400px]">
            {/* Heading */}
            <div className="text-center lg:text-start">
              <h1 className="text-[length:var(--text-headline)] font-extrabold text-foreground">
                {getTranslation(t, "auth.session.welcomeBack")}
              </h1>
              <p className="mt-1.5 text-[length:var(--text-body)] font-semibold text-muted-foreground">
                {getTranslation(t, "auth.login.subtitle")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <Field
                id="email"
                label={getTranslation(t, "auth.login.email")}
                icon={Mail}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isRTL={isRTL}
                autoComplete="email"
                required
              />

              <Field
                id="password"
                label={getTranslation(t, "auth.login.password")}
                icon={Lock}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isRTL={isRTL}
                invalid={!!error}
                autoComplete="current-password"
                trailing={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="flex size-10 cursor-pointer items-center justify-center rounded-[12px] text-muted-foreground transition-colors duration-150 ease-in-out hover:bg-primary/[0.08] hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="size-[18px]" />
                    ) : (
                      <Eye className="size-[18px]" />
                    )}
                    <span className="sr-only">
                      {getTranslation(t, "auth.login.password")}
                    </span>
                  </button>
                }
                required
              />

              <div className="flex items-center justify-between gap-3">
                <label className="flex cursor-pointer items-center gap-2 text-[length:var(--text-caption)] font-semibold text-muted-foreground select-none">
                  <Checkbox
                    checked={remember}
                    onCheckedChange={(v) => setRemember(!!v)}
                  />
                  {getTranslation(t, "auth.login.rememberMe")}
                </label>
                <Link
                  to="/forgot-password"
                  className="rounded-full px-1 text-[length:var(--text-caption)] font-bold text-accent hover:underline"
                >
                  {getTranslation(t, "auth.login.forgotPassword")}
                </Link>
              </div>

              {/* Auth failures summarise above the CTA, never as a card outline */}
              {error && (
                <p className="flex items-start gap-2 rounded-[18px] bg-[var(--chip-red-bg)] px-4 py-3 text-[length:var(--text-caption)] font-bold text-[var(--chip-red-fg)]">
                  <AlertCircle className="mt-px size-4 shrink-0" />
                  <span>{error}</span>
                </p>
              )}

              <Button
                disabled={isLoading}
                variant="default"
                size="cta"
                className="mt-2"
              >
                {isLoading
                  ? getTranslation(t, "auth.login.signingIn")
                  : getTranslation(t, "auth.login.signIn")}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-[length:var(--text-small)] font-semibold text-muted-foreground/60">
        {getTranslation(t, "auth.login.brand")} &middot;{" "}
        {getTranslation(t, "auth.login.tagline")}
      </p>
    </div>
  );
}

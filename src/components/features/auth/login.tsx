import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, getTranslation } from "@/lib/utils";
import { useTranslation } from "react-i18next";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LoginProps {
  onSubmit?: (
    email: string,
    password: string,
    remember: boolean,
  ) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

// ─── Left panel ───────────────────────────────────────────────────────────────

function LeftPanel() {
  const { t } = useTranslation();
  return (
    <div className="hidden lg:flex w-[42%] bg-[#0f1623] relative overflow-hidden flex-col justify-end p-12">
      {/* Ambient orbs */}
      <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-indigo-500 opacity-[0.07] animate-[orb_6s_ease-in-out_infinite]" />
      <div className="absolute bottom-16 -left-16 w-44 h-44 rounded-full bg-violet-500 opacity-[0.05] animate-[orb2_8s_ease-in-out_infinite]" />

      {/* Grid lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 250 560"
        preserveAspectRatio="xMidYMid slice"
      >
        {[140, 280, 420].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="250"
            y2={y}
            stroke="white"
            strokeOpacity=".04"
            strokeWidth=".5"
          />
        ))}
        {[83, 166].map((x) => (
          <line
            key={x}
            x1={x}
            y1="0"
            x2={x}
            y2="560"
            stroke="white"
            strokeOpacity=".03"
            strokeWidth=".5"
          />
        ))}
        <rect
          x="18"
          y="190"
          width="52"
          height="52"
          rx="6"
          stroke="white"
          strokeOpacity=".06"
          fill="none"
        />
        <rect
          x="140"
          y="290"
          width="34"
          height="34"
          rx="4"
          stroke="white"
          strokeOpacity=".1"
          fill="none"
        />
        <circle cx="210" cy="170" r="4" fill="white" fillOpacity=".08" />
      </svg>

      {/* Scan line */}
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent animate-[scanLine_4s_linear_infinite]" />

      {/* Content */}
      <div className="relative z-10">
        <h1 className="font-['Instrument_Serif'] text-[32px] text-white leading-[1.2] mb-3">
          <span className="block animate-fade-up [animation-delay:.15s]">
            {getTranslation(t, "auth.hero.title1")}
          </span>
          <span className="block animate-fade-up [animation-delay:.3s] italic text-white/50">
            {getTranslation(t, "auth.hero.titleEm")}
          </span>
          <span className="block animate-fade-up [animation-delay:.4s]">
            {getTranslation(t, "auth.hero.title2")}
          </span>
        </h1>
        <p className="animate-fade-up [animation-delay:.5s] text-xs text-white/40 leading-relaxed font-light max-w-[220px] mb-5">
          {getTranslation(t, "auth.hero.subtitle")}
        </p>
        <div className="flex gap-1.5 animate-fade-in [animation-delay:.8s] opacity-0">
          <div className="w-5 h-[5px] rounded-full bg-indigo-500" />
          <div className="w-[5px] h-[5px] rounded-full bg-white/15" />
          <div className="w-[5px] h-[5px] rounded-full bg-white/15" />
        </div>
      </div>
    </div>
  );
}

// ─── Field wrapper ─────────────────────────────────────────────────────────────

function InputField({
  id,
  label,
  icon: Icon,
  trailingIcon,
  error,
  isRTL,
  className,
  ...props
}: {
  id: string;
  label: string;
  icon: React.ElementType;
  trailingIcon?: React.ReactNode;
  error?: string;
  isRTL?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={id}
        className="text-[11px] font-medium text-muted-foreground"
      >
        {label}
      </Label>
      <div className="relative">
        <Icon
          className={cn(
            "absolute top-1/2 -translate-y-1/2 h-[14px] w-[14px] text-muted-foreground/60",
            isRTL ? "right-3" : "left-3",
          )}
        />
        <Input
          id={id}
          className={cn(
            "h-10 bg-secondary/50 border-border/50 transition-all focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400",
            isRTL ? "pr-9" : "pl-9",
            trailingIcon && (isRTL ? "pl-9" : "pr-9"),
            error && "border-destructive focus-visible:ring-destructive/20",
            className,
          )}
          {...props}
        />
        {trailingIcon && (
          <span
            className={cn(
              "absolute top-1/2 -translate-y-1/2",
              isRTL ? "left-3" : "right-3",
            )}
          >
            {trailingIcon}
          </span>
        )}
      </div>
      {error && (
        <p className="text-[10px] text-destructive font-medium">{error}</p>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

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
      className="min-h-screen flex font-['DM_Sans'] bg-background"
      dir={i18n.dir()}
    >
      <LeftPanel />

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-[300px] space-y-0">
          {/* Logo */}
          <div className="animate-fade-up [animation-delay:.1s] w-9 h-9 rounded-[10px] bg-[#0f1623] flex items-center justify-center mb-6">
            <span className="text-white font-semibold text-sm">{getTranslation(t, "auth.login.brand")}</span>
          </div>

          {/* Status badge */}
          <div className="animate-fade-up [animation-delay:.22s] inline-flex items-center gap-1.5 bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 rounded-full text-[10px] font-semibold px-3 py-1 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            {getTranslation(t, "auth.session.secureLogin")}
          </div>

          {/* Heading */}
          <div className="animate-fade-up [animation-delay:.34s] mb-6">
            <p className="text-[10px] tracking-[0.14em] uppercase text-muted-foreground font-semibold mb-1">
              {getTranslation(t, "auth.session.welcomeBack")}
            </p>
            <h2 className="font-['Instrument_Serif'] text-[22px] text-foreground leading-tight mb-1">
              {getTranslation(t, "auth.login.title")}
            </h2>
            <p className="text-xs text-muted-foreground">
              {getTranslation(t, "auth.login.subtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="animate-fade-up [animation-delay:.46s]">
              <InputField
                id="email"
                label={getTranslation(t, "auth.login.email")}
                icon={Mail}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={getTranslation(t, "auth.login.emailPlaceholder")}
                isRTL={isRTL}
                required
              />
            </div>

            <div className="animate-fade-up [animation-delay:.56s]">
              <InputField
                id="password"
                label={getTranslation(t, "auth.login.password")}
                icon={Lock}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isRTL={isRTL}
                error={error}
                trailingIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                }
                required
              />
            </div>

            <div className="animate-fade-up [animation-delay:.64s] flex items-center justify-between">
              <label className="flex items-center gap-2 text-[11px] text-muted-foreground cursor-pointer select-none">
                <Checkbox
                  checked={remember}
                  onCheckedChange={(v) => setRemember(!!v)}
                  className="w-3.5 h-3.5"
                />
                {getTranslation(t, "auth.login.rememberMe")}
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] text-indigo-500 font-medium hover:underline"
              >
                {getTranslation(t, "auth.login.forgotPassword")}
              </Link>
            </div>

            <Button
              disabled={isLoading}
              className="animate-fade-up [animation-delay:.72s] relative overflow-hidden w-full h-10 bg-[#0f1623] text-white text-sm font-medium rounded-lg hover:opacity-90 hover:-translate-y-px active:scale-[.98] transition-all"
            >
              {/* Shimmer */}
              <span className="absolute inset-y-0 w-3/5 bg-gradient-to-r from-transparent via-white/[.06] to-transparent animate-[shimmer_2.4s_linear_infinite]" />
              {isLoading
                ? getTranslation(t, "auth.login.signingIn")
                : getTranslation(t, "auth.login.signIn")}
              {!isLoading && <ArrowRight className="ml-2 h-3.5 w-3.5" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

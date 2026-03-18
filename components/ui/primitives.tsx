import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-zuretta-bg px-4 py-6 font-body text-ink-900">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-phone flex-col overflow-hidden rounded-[36px] border border-cream-300/70 bg-zuretta-bg shadow-card">
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[28rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,206,58,0.28)_0%,rgba(255,206,58,0)_70%)] blur-3xl" />
        <div className="relative flex-1 overflow-hidden">{children}</div>
      </div>
    </main>
  );
}

export function ScreenContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "flex h-full flex-col gap-6 overflow-y-auto px-6 pb-8 pt-14 animate-floatIn",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function ScreenHeading({
  title,
  subtitle,
  center = false,
}: {
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={cn("space-y-1", center && "text-center")}>
      <h1 className="bg-gradient-to-r from-amberglow-600 via-amberglow-700 to-amberglow-500 bg-clip-text font-display text-[30px] font-extrabold leading-tight text-transparent">
        {title}
      </h1>
      {subtitle ? (
        <p className="text-sm font-medium text-amberglow-600">{subtitle}</p>
      ) : null}
    </div>
  );
}

export function LogoMark() {
  return (
    <div className="relative h-14 w-[74px]">
      <div className="absolute left-8 top-0 h-3.5 w-14 rounded-lg bg-gradient-to-r from-amberglow-400 to-amberglow-500" />
      <div className="absolute left-0 top-5 h-3.5 w-[72px] rounded-lg bg-gradient-to-r from-amberglow-500 to-amberglow-600" />
      <div className="absolute left-[18px] top-10 h-3.5 w-14 rounded-lg bg-gradient-to-r from-amberglow-600 to-amberglow-700" />
    </div>
  );
}

export function Badge({
  children,
  icon,
}: {
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-amberglow-400/70 bg-gradient-to-b from-cream-50 to-cream-100 px-4 py-2 text-sm font-semibold text-amberglow-600 shadow-[0_2px_8px_rgba(255,184,0,0.1)]">
      {icon}
      {children}
    </span>
  );
}

export function SectionCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-cream-300 bg-[linear-gradient(180deg,#FFFFFF_0%,#FFFBEB_100%)] p-5 shadow-card",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ChoiceChip({
  active,
  onClick,
  children,
  className,
}: {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-2xl border px-4 py-3 text-sm font-bold transition-transform duration-150 active:scale-[0.98]",
        active
          ? "border-transparent bg-cta-gradient text-white shadow-button"
          : "border-cream-300 bg-[linear-gradient(180deg,#FFFFFF_0%,#FFFBEB_100%)] text-ink-500",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex min-h-16 w-full items-center justify-center rounded-[28px] bg-cta-gradient px-6 text-center font-display text-xl font-extrabold text-white shadow-button transition duration-150 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
  disabled,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex min-h-14 w-full items-center justify-center rounded-[28px] border border-cream-300 bg-[linear-gradient(180deg,#FFFFFF_0%,#FFFBEB_100%)] px-6 text-center text-base font-bold text-amberglow-700 shadow-soft transition duration-150 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function PlayerDot({
  color,
  label,
}: {
  color: string;
  label: ReactNode;
}) {
  return (
    <div
      className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-extrabold text-white shadow-soft"
      style={{ background: color }}
    >
      {label}
    </div>
  );
}

export function ProgressDots({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={`progress-${index}`}
          className={cn(
            "h-3 w-3 rounded-full",
            index < current
              ? "bg-cta-gradient shadow-[0_1px_4px_rgba(255,184,0,0.35)]"
              : "bg-ink-300",
          )}
        />
      ))}
    </div>
  );
}

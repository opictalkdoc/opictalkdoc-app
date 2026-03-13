import type { LucideIcon } from "lucide-react";

interface AdminStatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sub?: string;
}

export function AdminStatCard({ icon: Icon, label, value, sub }: AdminStatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
          <Icon size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-foreground-secondary">{label}</p>
          <p className="text-xl font-bold text-foreground">{value}</p>
          {sub && <p className="text-xs text-foreground-muted">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

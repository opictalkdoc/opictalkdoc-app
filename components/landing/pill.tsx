interface PillProps {
  children: React.ReactNode;
  variant?: "default" | "dark";
}

export default function Pill({ children, variant = "default" }: PillProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.7rem] font-bold tracking-wide sm:px-[18px] sm:py-2 sm:text-[0.85rem] ${
        variant === "dark"
          ? "bg-white/10 text-white/80"
          : "bg-[#D4835E]/[0.1] text-[#D4835E]"
      }`}
    >
      {children}
    </span>
  );
}

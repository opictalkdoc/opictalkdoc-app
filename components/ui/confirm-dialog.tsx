"use client";

import { useCallback, useEffect, useRef } from "react";
import { AlertTriangle, Trash2, type LucideIcon } from "lucide-react";

/* ── 타입 ── */

interface ConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** "danger" = 빨간 강조, "warning" = 주황 강조 */
  variant?: "danger" | "warning";
  icon?: LucideIcon;
  isLoading?: boolean;
}

/* ── 컴포넌트 ── */

export function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  title,
  description,
  confirmLabel = "확인",
  cancelLabel = "취소",
  variant = "danger",
  icon,
  isLoading = false,
}: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  // 열릴 때 확인 버튼에 포커스
  useEffect(() => {
    if (open) confirmRef.current?.focus();
  }, [open]);

  // ESC 키로 닫기
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) onCancel();
    },
    [onCancel, isLoading]
  );

  if (!open) return null;

  const Icon = icon || (variant === "danger" ? Trash2 : AlertTriangle);

  const iconColors =
    variant === "danger"
      ? "bg-red-50 text-red-500"
      : "bg-amber-50 text-amber-500";

  const confirmColors =
    variant === "danger"
      ? "bg-red-500 hover:bg-red-600 text-white"
      : "bg-amber-500 hover:bg-amber-600 text-white";

  return (
    // 백드롭
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/40 backdrop-blur-[2px]"
      onClick={isLoading ? undefined : onCancel}
      onKeyDown={handleKeyDown}
    >
      {/* 다이얼로그 */}
      <div
        className="mx-4 w-full max-w-sm animate-in fade-in zoom-in-95 rounded-[var(--radius-xl)] border border-border bg-surface p-5 shadow-lg sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 아이콘 */}
        <div className="flex justify-center">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${iconColors}`}
          >
            <Icon size={22} />
          </div>
        </div>

        {/* 텍스트 */}
        <div className="mt-4 text-center">
          <p className="text-sm font-semibold text-foreground sm:text-base">
            {title}
          </p>
          {description && (
            <p className="mt-1.5 text-xs text-foreground-secondary sm:text-sm">
              {description}
            </p>
          )}
        </div>

        {/* 버튼 */}
        <div className="mt-5 flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex h-10 flex-1 items-center justify-center rounded-[var(--radius-lg)] border border-border text-sm font-medium text-foreground-secondary transition-colors hover:bg-surface-secondary disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex h-10 flex-1 items-center justify-center rounded-[var(--radius-lg)] text-sm font-medium transition-colors disabled:opacity-50 ${confirmColors}`}
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

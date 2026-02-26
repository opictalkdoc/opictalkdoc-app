"use client";

import {
  Headphones,
  MessageSquare,
  BookOpen,
  Radio,
} from "lucide-react";
import type { ShadowingStep } from "@/lib/types/scripts";
import { SHADOWING_STEP_LABELS } from "@/lib/types/scripts";

const STEP_ICONS: Record<ShadowingStep, React.ElementType> = {
  listen: Headphones,
  shadow: MessageSquare,
  recite: BookOpen,
  speak: Radio,
};

const STEPS: ShadowingStep[] = ["listen", "shadow", "recite", "speak"];

interface ShadowingStepNavProps {
  currentStep: ShadowingStep;
  onStepChange: (step: ShadowingStep) => void;
}

export function ShadowingStepNav({
  currentStep,
  onStepChange,
}: ShadowingStepNavProps) {
  const currentIndex = STEPS.indexOf(currentStep);

  return (
    <div className="flex items-center justify-center gap-1 overflow-x-auto px-2 sm:gap-2">
      {STEPS.map((step, i) => {
        const Icon = STEP_ICONS[step];
        const isActive = step === currentStep;
        const isPast = i < currentIndex;

        return (
          <button
            key={step}
            onClick={() => onStepChange(step)}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors sm:gap-1.5 sm:px-3 sm:py-2 sm:text-sm ${
              isActive
                ? "bg-primary-500 text-white"
                : isPast
                  ? "bg-primary-50 text-primary-600 hover:bg-primary-100"
                  : "bg-surface-secondary text-foreground-muted hover:bg-surface-secondary/80"
            }`}
          >
            <Icon size={14} />
            <span className="hidden sm:inline">
              {SHADOWING_STEP_LABELS[step]}
            </span>
            <span className="sm:hidden">{i + 1}</span>
          </button>
        );
      })}
    </div>
  );
}

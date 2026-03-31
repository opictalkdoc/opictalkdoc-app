"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Save, RotateCcw, Loader2 } from "lucide-react";
import { getEvalSettings, updateEvalSettings } from "@/lib/actions/admin/content";
import type { MockTestEvalSettings } from "@/lib/types/mock-exam";

// ── 안전한 숫자 변환 (NaN 방지) ──
function safeNumber(value: unknown, fallback: number): number {
  if (value == null) return fallback;
  const n = Number(value);
  return Number.isNaN(n) ? fallback : n;
}

// ── 평가엔진 기본값 ──
const RE_DEFAULTS: Record<string, number> = {
  re_checkbox_pass_threshold: 0.80,
  re_floor_nh: 0.45,
  re_floor_il: 0.65,
  re_floor_im1: 0.75,
  re_floor_im2: 0.95,
  re_ceiling_broke_down: 0.70,
  re_ceiling_respond: 0.90,
  re_sympathetic_low: 50,
  re_sympathetic_mid: 70,
  re_sympathetic_at_times: 85,
  re_sympathetic_pron_weight: 0.60,
  re_al_pass_threshold: 0.70,
  re_q12_gatekeeper_threshold: 0.50,
};

// ── GPT 모델 기본값 ──
const GPT_DEFAULTS: Record<string, string | number> = {
  judge_model: "gpt-4.1",
  judge_temperature: 0.20,
  judge_max_tokens: 8000,
  coach_model: "gpt-4.1",
  coach_temperature: 0.30,
  coach_max_tokens: 4000,
  report_model: "gpt-4.1",
  report_temperature: 0.30,
  report_max_tokens: 4000,
};

const MODEL_OPTIONS = ["gpt-4.1", "gpt-4.1-mini", "gpt-4o-mini"];

// ============================================================
// 메인 컴포넌트
// ============================================================

export function EvalSettingsTab() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ["admin-eval-settings"],
    queryFn: () => getEvalSettings() as Promise<MockTestEvalSettings>,
    staleTime: 5 * 60 * 1000,
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-eval-settings"] });
  };

  if (settingsLoading || !settings) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-primary-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RuleEngineSection settings={settings} onSaved={invalidateAll} />
      <GptModelSection settings={settings} onSaved={invalidateAll} />
    </div>
  );
}

// ============================================================
// 섹션 A: 평가엔진 Threshold
// ============================================================

function RuleEngineSection({
  settings,
  onSaved,
}: {
  settings: MockTestEvalSettings;
  onSaved: () => void;
}) {
  const [values, setValues] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const v: Record<string, number> = {};
    for (const key of Object.keys(RE_DEFAULTS)) {
      v[key] = safeNumber((settings as unknown as Record<string, unknown>)[key], RE_DEFAULTS[key]);
    }
    setValues(v);
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateEvalSettings(values);
      if (result.success) {
        toast.success("평가엔진 설정 저장 완료");
        onSaved();
      } else {
        toast.error(result.error || "저장 실패");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setValues({ ...RE_DEFAULTS });
  };

  const groups = [
    {
      title: "Floor (최소 기준)",
      items: [
        { key: "re_floor_nh", label: "NH Floor", desc: "INT pass_rate < 이 값 → NH", step: 0.05 },
        { key: "re_floor_il", label: "IL Floor", desc: "INT pass_rate < 이 값 → IL", step: 0.05 },
        { key: "re_floor_im1", label: "IM1 Floor", desc: "INT pass_rate < 이 값 → IM1", step: 0.05 },
        { key: "re_floor_im2", label: "IM2 Floor", desc: "INT pass_rate ≥ 이 값 → IM2+", step: 0.05 },
      ],
    },
    {
      title: "Ceiling (상한 제한)",
      items: [
        { key: "re_ceiling_broke_down", label: "Broke Down", desc: "ADV pass_rate < 이 값 → IM2 상한", step: 0.05 },
        { key: "re_ceiling_respond", label: "Respond", desc: "ADV pass_rate ≥ 이 값 → IH 가능", step: 0.05 },
      ],
    },
    {
      title: "Sympathetic Listener (발음 보정)",
      items: [
        { key: "re_sympathetic_low", label: "Low 기준", desc: "발음 < 이 값 → 1등급 하락", step: 5 },
        { key: "re_sympathetic_mid", label: "Mid 기준", desc: "발음 < 이 값 → 제한적 상향 불가", step: 5 },
        { key: "re_sympathetic_at_times", label: "At Times", desc: "발음 < 이 값 → IH 제한", step: 5 },
        { key: "re_sympathetic_pron_weight", label: "발음 가중치", desc: "accuracy×이 값 + prosody×나머지", step: 0.05 },
      ],
    },
    {
      title: "기타",
      items: [
        { key: "re_checkbox_pass_threshold", label: "체크박스 Pass", desc: "체크박스 통과 기준", step: 0.05 },
        { key: "re_al_pass_threshold", label: "AL Pass", desc: "AL 체크박스 통과 기준", step: 0.05 },
        { key: "re_q12_gatekeeper_threshold", label: "Q12 Gatekeeper", desc: "Q12 게이트키퍼 기준", step: 0.05 },
      ],
    },
  ];

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">평가엔진 Threshold</h3>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-foreground-secondary transition-colors hover:bg-surface-secondary"
          >
            <RotateCcw size={12} />
            기본값 복원
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1 rounded-lg bg-primary-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
          >
            {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            저장
          </button>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {groups.map((group) => (
          <div key={group.title} className="space-y-2.5">
            <h4 className="text-xs font-semibold text-foreground-secondary">{group.title}</h4>
            {group.items.map((item) => (
              <div key={item.key} className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-medium text-foreground">{item.label}</span>
                  <span className="ml-2 text-[10px] text-foreground-muted">{item.desc}</span>
                </div>
                <input
                  type="number"
                  step={item.step}
                  value={values[item.key] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [item.key]: Number(e.target.value) }))}
                  className="w-20 rounded-md border border-border bg-background px-2 py-1 text-right text-xs tabular-nums text-foreground focus:border-primary-400 focus:outline-none"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// 섹션 B: GPT 모델 설정
// ============================================================

function GptModelSection({
  settings,
  onSaved,
}: {
  settings: MockTestEvalSettings;
  onSaved: () => void;
}) {
  const [values, setValues] = useState<Record<string, string | number>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const v: Record<string, string | number> = {};
    for (const [key, def] of Object.entries(GPT_DEFAULTS)) {
      const raw = (settings as unknown as Record<string, unknown>)[key];
      v[key] = raw != null ? (raw as string | number) : def;
    }
    setValues(v);
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateEvalSettings(values);
      if (result.success) {
        toast.success("GPT 모델 설정 저장 완료");
        onSaved();
      } else {
        toast.error(result.error || "저장 실패");
      }
    } finally {
      setSaving(false);
    }
  };

  const cards = [
    { prefix: "judge", label: "Judge (체크박스 평가)", desc: "gpt-4.1 기본" },
    { prefix: "coach", label: "Coach (소견 생성)", desc: "gpt-4.1 기본" },
    { prefix: "report", label: "Report (종합 리포트)", desc: "gpt-4.1 기본" },
  ];

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">GPT 모델 설정</h3>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1 rounded-lg bg-primary-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
        >
          {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
          저장
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <div key={card.prefix} className="rounded-lg border border-border/50 bg-background p-3">
            <div className="mb-2">
              <span className="text-xs font-semibold text-foreground">{card.label}</span>
              <span className="ml-2 text-[10px] text-foreground-muted">{card.desc}</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="w-14 text-[10px] text-foreground-secondary">모델</label>
                <select
                  value={(values[`${card.prefix}_model`] as string) || ""}
                  onChange={(e) => setValues((v) => ({ ...v, [`${card.prefix}_model`]: e.target.value }))}
                  className="flex-1 rounded-md border border-border bg-surface px-2 py-1 text-xs text-foreground focus:border-primary-400 focus:outline-none"
                >
                  {MODEL_OPTIONS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="w-14 text-[10px] text-foreground-secondary">온도</label>
                <input
                  type="number"
                  step={0.05}
                  min={0}
                  max={2}
                  value={values[`${card.prefix}_temperature`] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [`${card.prefix}_temperature`]: Number(e.target.value) }))}
                  className="flex-1 rounded-md border border-border bg-surface px-2 py-1 text-xs tabular-nums text-foreground focus:border-primary-400 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="w-14 text-[10px] text-foreground-secondary">토큰</label>
                <input
                  type="number"
                  step={500}
                  min={1000}
                  max={30000}
                  value={values[`${card.prefix}_max_tokens`] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [`${card.prefix}_max_tokens`]: Number(e.target.value) }))}
                  className="flex-1 rounded-md border border-border bg-surface px-2 py-1 text-xs tabular-nums text-foreground focus:border-primary-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


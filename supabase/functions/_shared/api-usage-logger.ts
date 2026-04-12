// API 사용량 로깅 + 비용 계산 유틸
// 모든 Edge Function에서 import하여 사용
// 비용 단가: 2026-04 기준 (정기적으로 업데이트 필요)

import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

// ============================================================
// API 단가표 (USD)
// ============================================================
export const API_PRICING = {
  // OpenAI Chat Completions — 토큰당 비용
  openai_chat: {
    "gpt-4.1": {
      input: 2.0 / 1_000_000,   // $2.00 / 1M tokens
      output: 8.0 / 1_000_000,  // $8.00 / 1M tokens
    },
    "gpt-4.1-mini": {
      input: 0.4 / 1_000_000,   // $0.40 / 1M tokens
      output: 1.6 / 1_000_000,  // $1.60 / 1M tokens
    },
  },
  // OpenAI Whisper — 분당 비용
  openai_whisper: {
    "whisper-1": {
      per_minute: 0.006,         // $0.006 / minute
    },
  },
  // Google Gemini TTS — 토큰당 비용
  gemini_tts: {
    "gemini-2.5-pro-preview-tts": {
      input: 1.0 / 1_000_000,   // $1.00 / 1M input tokens (text)
      output: 20.0 / 1_000_000, // $20.00 / 1M output tokens (audio)
    },
  },
  // Azure Speech Pronunciation Assessment — 초당 비용
  azure_speech: {
    "azure-pronunciation": {
      per_second: 0.000367,      // $1.32 / hour ≈ $0.000367 / second
    },
  },
} as const;

// ============================================================
// 비용 계산
// ============================================================
export function calculateCost(params: {
  service: string;
  model: string;
  tokens_in?: number;
  tokens_out?: number;
  audio_duration_sec?: number;
}): number {
  const { service, model, tokens_in = 0, tokens_out = 0, audio_duration_sec = 0 } = params;

  switch (service) {
    case "openai_chat": {
      const pricing = API_PRICING.openai_chat[model as keyof typeof API_PRICING.openai_chat];
      if (!pricing) return 0;
      return tokens_in * pricing.input + tokens_out * pricing.output;
    }
    case "openai_whisper": {
      const minutes = audio_duration_sec / 60;
      return minutes * API_PRICING.openai_whisper["whisper-1"].per_minute;
    }
    case "gemini_tts": {
      const pricing = API_PRICING.gemini_tts["gemini-2.5-pro-preview-tts"];
      return tokens_in * pricing.input + tokens_out * pricing.output;
    }
    case "azure_speech": {
      return audio_duration_sec * API_PRICING.azure_speech["azure-pronunciation"].per_second;
    }
    default:
      return 0;
  }
}

// ============================================================
// 사용량 로그 기록
// ============================================================
export interface UsageLogParams {
  user_id: string;
  session_type: "mock_exam" | "script" | "tutoring" | "shadowing";
  session_id?: string;
  feature: string;
  service: "openai_chat" | "openai_whisper" | "gemini_tts" | "azure_speech";
  model: string;
  ef_name: string;
  tokens_in?: number;
  tokens_out?: number;
  audio_duration_sec?: number;
  text_length?: number;
  processing_time_ms?: number;
}

export async function logApiUsage(
  supabase: SupabaseClient,
  params: UsageLogParams
): Promise<{ cost_usd: number }> {
  const cost_usd = calculateCost({
    service: params.service,
    model: params.model,
    tokens_in: params.tokens_in,
    tokens_out: params.tokens_out,
    audio_duration_sec: params.audio_duration_sec,
  });

  const { error } = await supabase.from("api_usage_logs").insert({
    user_id: params.user_id,
    session_type: params.session_type,
    session_id: params.session_id ?? null,
    feature: params.feature,
    service: params.service,
    model: params.model,
    ef_name: params.ef_name,
    tokens_in: params.tokens_in ?? null,
    tokens_out: params.tokens_out ?? null,
    audio_duration_sec: params.audio_duration_sec ?? null,
    text_length: params.text_length ?? null,
    cost_usd,
    processing_time_ms: params.processing_time_ms ?? null,
  });

  if (error) {
    // 로깅 실패가 메인 로직을 중단시키면 안 됨
    console.error("[api-usage-logger] INSERT 실패:", error.message);
  }

  return { cost_usd };
}

// ============================================================
// OpenAI Chat 응답에서 usage 추출 헬퍼
// ============================================================
export function extractChatUsage(json: Record<string, unknown>): {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
} {
  const usage = json.usage as Record<string, number> | undefined;
  return {
    prompt_tokens: usage?.prompt_tokens ?? 0,
    completion_tokens: usage?.completion_tokens ?? 0,
    total_tokens: usage?.total_tokens ?? 0,
  };
}

// ============================================================
// Gemini TTS 응답에서 usageMetadata 추출 ���퍼
// ============================================================
export function extractGeminiUsage(json: Record<string, unknown>): {
  prompt_tokens: number;
  candidates_tokens: number;
  total_tokens: number;
} {
  const metadata = json.usageMetadata as Record<string, number> | undefined;
  return {
    prompt_tokens: metadata?.promptTokenCount ?? 0,
    candidates_tokens: metadata?.candidatesTokenCount ?? 0,
    total_tokens: metadata?.totalTokenCount ?? 0,
  };
}

// ============================================================
// Whisper verbose_json 응답에서 duration 추출 헬퍼
// ============================================================
export function extractWhisperDuration(json: Record<string, unknown>): number {
  // verbose_json 포맷: { duration: 8.47, text: "...", words: [...] }
  return (json.duration as number) ?? 0;
}

// ============================================================
// 오디오 Blob 크기로 duration 추정 (Whisper 기본 포맷용)
// WebM Opus: ~6KB/sec, WAV 16kHz mono: ~32KB/sec
// ============================================================
export function estimateAudioDuration(blobSizeBytes: number, format: "webm" | "wav" = "webm"): number {
  const bytesPerSecond = format === "webm" ? 6000 : 32000;
  return blobSizeBytes / bytesPerSecond;
}

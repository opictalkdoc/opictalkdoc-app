import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TimestampItem, ShadowingStep, ShadowingEvaluation } from "@/lib/types/scripts";

// 텍스트 힌트 레벨 (Step 2 따라읽기 토글)
export type TextHintLevel = "full" | "first-word" | "hidden";

// 표시 모드 (Step 1)
export type DisplayMode = "both" | "english" | "korean";

export interface ShadowingState {
  // === 데이터 (패키지에서 로드) ===
  packageId: string | null;
  scriptId: string | null;
  sentences: TimestampItem[];
  audioUrl: string | null;
  questionText: string | null;
  questionKorean: string | null;
  keyExpressions: string[];

  // === 현재 단계 ===
  currentStep: ShadowingStep;

  // === Step 1: 듣기 ===
  isPlaying: boolean;
  currentTime: number;
  playbackRate: number;
  displayMode: DisplayMode;

  // === Step 2: 따라읽기 ===
  shadowIndex: number;
  shadowHintLevel: TextHintLevel;
  shadowCompleted: number[];

  // === Step 3: 혼자 말하기 ===
  reciteTimer: number;
  recitePeekCount: number;
  reciteShowPeek: boolean;

  // === Step 4: 실전 ===
  speakTimer: number;
  speakResult: ShadowingEvaluation | null;

  // === 공통 녹음 ===
  isRecording: boolean;
  recordingDuration: number;

  // === Actions ===
  init: (data: {
    packageId: string;
    scriptId: string;
    sentences: TimestampItem[];
    audioUrl: string;
    questionText: string | null;
    questionKorean: string | null;
    keyExpressions: string[];
  }) => void;
  setStep: (step: ShadowingStep) => void;
  setPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setPlaybackRate: (rate: number) => void;
  setDisplayMode: (mode: DisplayMode) => void;

  // Step 2: 따라읽기
  setShadowIndex: (index: number) => void;
  setShadowHintLevel: (level: TextHintLevel) => void;
  markShadowCompleted: (index: number) => void;

  // Step 3: 혼자 말하기
  setReciteTimer: (time: number) => void;
  incrementPeekCount: () => void;
  togglePeek: () => void;

  // Step 4: 실전
  setSpeakTimer: (time: number) => void;
  setSpeakResult: (result: ShadowingEvaluation | null) => void;

  // 공통
  setRecording: (recording: boolean) => void;
  setRecordingDuration: (duration: number) => void;
  reset: () => void;
}

const initialState = {
  packageId: null,
  scriptId: null,
  sentences: [],
  audioUrl: null,
  questionText: null,
  questionKorean: null,
  keyExpressions: [],
  currentStep: "listen" as ShadowingStep,
  isPlaying: false,
  currentTime: 0,
  playbackRate: 1.0,
  displayMode: "both" as DisplayMode,
  shadowIndex: 0,
  shadowHintLevel: "full" as TextHintLevel,
  shadowCompleted: [],
  reciteTimer: 0,
  recitePeekCount: 0,
  reciteShowPeek: false,
  speakTimer: 0,
  speakResult: null,
  isRecording: false,
  recordingDuration: 0,
};

export const useShadowingStore = create<ShadowingState>()(
  persist(
    (set) => ({
      ...initialState,

      init: (data) =>
        set({
          ...initialState,
          packageId: data.packageId,
          scriptId: data.scriptId,
          sentences: data.sentences,
          audioUrl: data.audioUrl,
          questionText: data.questionText,
          questionKorean: data.questionKorean,
          keyExpressions: data.keyExpressions,
        }),

      setStep: (step) =>
        set({
          currentStep: step,
          isPlaying: false,
          isRecording: false,
          recordingDuration: 0,
        }),

      setPlaying: (playing) => set({ isPlaying: playing }),
      setCurrentTime: (time) => set({ currentTime: time }),
      setPlaybackRate: (rate) => set({ playbackRate: rate }),
      setDisplayMode: (mode) => set({ displayMode: mode }),

      // Step 2: 따라읽기
      setShadowIndex: (index) => set({ shadowIndex: index }),
      setShadowHintLevel: (level) => set({ shadowHintLevel: level }),
      markShadowCompleted: (index) =>
        set((state) => ({
          shadowCompleted: state.shadowCompleted.includes(index)
            ? state.shadowCompleted
            : [...state.shadowCompleted, index],
        })),

      // Step 3: 혼자 말하기
      setReciteTimer: (time) => set({ reciteTimer: time }),
      incrementPeekCount: () =>
        set((state) => ({ recitePeekCount: state.recitePeekCount + 1 })),
      togglePeek: () =>
        set((state) => ({ reciteShowPeek: !state.reciteShowPeek })),

      // Step 4: 실전
      setSpeakTimer: (time) => set({ speakTimer: time }),
      setSpeakResult: (result) => set({ speakResult: result }),

      // 공통
      setRecording: (recording) => set({ isRecording: recording }),
      setRecordingDuration: (duration) => set({ recordingDuration: duration }),
      reset: () => set(initialState),
    }),
    {
      name: "shadowing-progress",
      // 진도 관련 데이터만 persist
      partialize: (state) => ({
        packageId: state.packageId,
        scriptId: state.scriptId,
        currentStep: state.currentStep,
        shadowCompleted: state.shadowCompleted,
        shadowHintLevel: state.shadowHintLevel,
      }),
    }
  )
);

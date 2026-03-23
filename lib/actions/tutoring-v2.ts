'use server';

import { createServerSupabaseClient } from '@/lib/supabase-server';
import {
  GRADE_TO_TIER,
  TIER_CONFIGS,
  generateTutoringId,
  type TutoringTier,
  type TierConfig,
  type BottleneckResult,
  type TutoringSessionV2,
  type TutoringPrescriptionV2,
  type TutoringTrainingV2,
  type TutoringAttemptV2,
  type DrillDefinition,
} from '@/lib/types/tutoring-v2';
import {
  analyzeBottlenecks,
  gradeToTier,
  type QuestionEvalForBottleneck,
} from '@/lib/tutoring-v2/bottleneck-engine';
import { matchDrills } from '@/lib/tutoring-v2/drill-matcher';

// ═══════════════════════════════════════════════════
// 공통 타입
// ═══════════════════════════════════════════════════

type ActionResult<T = null> = {
  error?: string;
  data?: T;
};

// ═══════════════════════════════════════════════════
// 헬퍼: 현재 로그인 유저 ID
// ═══════════════════════════════════════════════════

async function requireUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('로그인이 필요합니다');
  return { supabase, userId: user.id };
}

// ═══════════════════════════════════════════════════
// 1. getDiagnosisV2() — 진단 데이터 조회 + 병목 엔진 실행
// ═══════════════════════════════════════════════════

export interface DiagnosisV2Result {
  tier: TutoringTier;
  tierConfig: TierConfig;
  currentGrade: string;
  targetGrade: string | null;
  bottlenecks: BottleneckResult[];
  latestSessionId: string;
  latestSessionDate: string;
  latestSessionMode: string;
  hasActiveSession: boolean;
  activeSessionId: string | null;
}

export async function getDiagnosisV2(): Promise<ActionResult<DiagnosisV2Result>> {
  try {
    const { supabase, userId } = await requireUser();

    // 1. 활성 튜터링 세션 확인
    const { data: activeSessions } = await supabase
      .from('tutoring_sessions_v2')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'active')
      .limit(1);

    const hasActiveSession = (activeSessions?.length ?? 0) > 0;
    const activeSessionId = hasActiveSession ? activeSessions![0].id : null;

    // 2. 가장 최근 completed 모의고사 세션 조회
    const { data: latestSession, error: sessionErr } = await supabase
      .from('mock_test_sessions')
      .select('session_id, mode, started_at, submission_id')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .order('started_at', { ascending: false })
      .limit(1)
      .single();

    if (sessionErr || !latestSession) {
      return { error: '완료된 모의고사가 없습니다. 모의고사를 먼저 응시해주세요.' };
    }

    // 3. mock_test_reports에서 final_level, target_grade 조회
    const { data: report, error: reportErr } = await supabase
      .from('mock_test_reports')
      .select('final_level, target_grade')
      .eq('session_id', latestSession.session_id)
      .single();

    if (reportErr || !report) {
      return { error: '모의고사 평가 결과가 없습니다. 평가가 완료된 후 이용해주세요.' };
    }

    const currentGrade = report.final_level ?? 'IM2';
    const targetGrade = report.target_grade ?? null;

    // 4. mock_test_consults에서 15문항 weak_points 조회
    const { data: consults, error: consultsErr } = await supabase
      .from('mock_test_consults')
      .select('question_number, fulfillment, weak_points')
      .eq('session_id', latestSession.session_id)
      .order('question_number', { ascending: true });

    if (consultsErr || !consults || consults.length === 0) {
      return { error: '모의고사 평가 상세 데이터가 없습니다.' };
    }

    // 5. 입력 데이터 변환
    const evaluations: QuestionEvalForBottleneck[] = consults.map(c => ({
      question_number: c.question_number,
      fulfillment: c.fulfillment ?? 'fulfilled',
      weak_points: Array.isArray(c.weak_points) ? c.weak_points : [],
    }));

    // 6. 병목 엔진 실행
    const rawBottlenecks = analyzeBottlenecks(evaluations, currentGrade);

    // 7. 드릴 매칭 (DB 카탈로그 검증)
    // DB에서 드릴 카탈로그 조회 시도 (테이블이 없을 수도 있으므로 에러 무시)
    let drillCatalog = undefined;
    try {
      const { data: drills } = await supabase
        .from('tutoring_drill_catalog')
        .select('*');
      if (drills && drills.length > 0) {
        drillCatalog = drills;
      }
    } catch {
      // 테이블 미존재 시 무시 — 인메모리 폴백 사용
    }

    const bottlenecks = matchDrills(rawBottlenecks, drillCatalog);

    // 8. 티어 결정
    const tier = gradeToTier(currentGrade);
    const tierConfig = TIER_CONFIGS.find(tc => tc.tier === tier) ?? TIER_CONFIGS[2]; // 기본 Tier 3

    return {
      data: {
        tier,
        tierConfig,
        currentGrade,
        targetGrade,
        bottlenecks,
        latestSessionId: latestSession.session_id,
        latestSessionDate: latestSession.started_at,
        latestSessionMode: latestSession.mode,
        hasActiveSession,
        activeSessionId,
      },
    };
  } catch (err) {
    console.error('getDiagnosisV2 에러:', err);
    return { error: err instanceof Error ? err.message : '진단 조회 중 오류가 발생했습니다' };
  }
}

// ═══════════════════════════════════════════════════
// 2. checkTutoringCreditV2() — 크레딧 확인
// ═══════════════════════════════════════════════════

export interface TutoringCreditResult {
  planCredits: number;
  addonCredits: number;
  totalCredits: number;
}

export async function checkTutoringCreditV2(): Promise<ActionResult<TutoringCreditResult>> {
  try {
    const { supabase, userId } = await requireUser();

    const { data: credits, error: creditsErr } = await supabase
      .from('user_credits')
      .select('plan_tutoring_credits, tutoring_credits')
      .eq('user_id', userId)
      .single();

    if (creditsErr || !credits) {
      return { error: '크레딧 정보를 조회할 수 없습니다' };
    }

    const planCredits = credits.plan_tutoring_credits ?? 0;
    const addonCredits = credits.tutoring_credits ?? 0;

    return {
      data: {
        planCredits,
        addonCredits,
        totalCredits: planCredits + addonCredits,
      },
    };
  } catch (err) {
    console.error('checkTutoringCreditV2 에러:', err);
    return { error: err instanceof Error ? err.message : '크레딧 조회 중 오류가 발생했습니다' };
  }
}

// ═══════════════════════════════════════════════════
// 3. startTutoringV2() — 세션 시작
// ═══════════════════════════════════════════════════

export interface StartTutoringResult {
  sessionId: string;
}

export async function startTutoringV2(
  mockSessionId: string,
): Promise<ActionResult<StartTutoringResult>> {
  try {
    const { supabase, userId } = await requireUser();

    // 1. 기존 활성 세션 확인
    const { data: activeSessions } = await supabase
      .from('tutoring_sessions_v2')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'active')
      .limit(1);

    if (activeSessions && activeSessions.length > 0) {
      return { error: '이미 진행 중인 튜터링 세션이 있습니다' };
    }

    // 2. 크레딧 차감
    const { data: creditOk, error: creditErr } = await supabase.rpc(
      'consume_tutoring_credit',
      { p_user_id: userId },
    );

    if (creditErr || !creditOk) {
      return { error: '튜터링 크레딧이 부족합니다' };
    }

    // 3. 모의고사 리포트에서 현재 등급/목표 등급 조회
    const { data: report, error: reportErr } = await supabase
      .from('mock_test_reports')
      .select('final_level, target_grade')
      .eq('session_id', mockSessionId)
      .single();

    if (reportErr || !report) {
      // 크레딧 환불
      await supabase.rpc('refund_tutoring_credit', { p_user_id: userId });
      return { error: '모의고사 평가 결과를 조회할 수 없습니다' };
    }

    const currentGrade = report.final_level ?? 'IM2';
    const targetGrade = report.target_grade ?? null;
    const tier = gradeToTier(currentGrade);

    // 4. 병목 분석 실행
    const { data: consults } = await supabase
      .from('mock_test_consults')
      .select('question_number, fulfillment, weak_points')
      .eq('session_id', mockSessionId)
      .order('question_number', { ascending: true });

    if (!consults || consults.length === 0) {
      // 크레딧 환불
      await supabase.rpc('refund_tutoring_credit', { p_user_id: userId });
      return { error: '모의고사 평가 상세 데이터가 없습니다' };
    }

    const evaluations: QuestionEvalForBottleneck[] = consults.map(c => ({
      question_number: c.question_number,
      fulfillment: c.fulfillment ?? 'fulfilled',
      weak_points: Array.isArray(c.weak_points) ? c.weak_points : [],
    }));

    const bottlenecks = analyzeBottlenecks(evaluations, currentGrade);

    // 5. 세션 생성
    const sessionId = generateTutoringId('ts');

    const { error: insertErr } = await supabase
      .from('tutoring_sessions_v2')
      .insert({
        id: sessionId,
        user_id: userId,
        mock_session_id: mockSessionId,
        current_tier: tier,
        current_grade: currentGrade,
        target_grade: targetGrade,
        bottleneck_results: bottlenecks,
        status: 'active',
      });

    if (insertErr) {
      // 크레딧 환불
      await supabase.rpc('refund_tutoring_credit', { p_user_id: userId });
      console.error('튜터링 세션 생성 실패:', insertErr);
      return { error: '튜터링 세션 생성에 실패했습니다' };
    }

    // 6. 처방 생성 (병목별)
    const prescriptions = bottlenecks.map((bn, idx) => ({
      id: generateTutoringId('tp'),
      session_id: sessionId,
      priority: idx + 1,
      wp_code: bn.wp_code,
      drill_code: bn.drill_code,
      status: idx === 0 ? 'in_progress' : 'pending',
    }));

    if (prescriptions.length > 0) {
      const { error: prescErr } = await supabase
        .from('tutoring_prescriptions_v2')
        .insert(prescriptions);

      if (prescErr) {
        console.error('처방 생성 실패:', prescErr);
      }
    }

    // 7. GPT 콘텐츠 생성 EF 호출 (진단 → 처방 순차)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    // 진단 EF — 한줄 진단 + 티어 설명 생성 → sessions.diagnosis_text 저장
    try {
      const diagnoseRes = await fetch(`${supabaseUrl}/functions/v1/tutoring-v2-diagnose`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serviceKey}`,
        },
        body: JSON.stringify({ session_id: sessionId }),
      });
      if (!diagnoseRes.ok) {
        console.error('진단 EF 실패:', await diagnoseRes.text());
      }
    } catch (e) {
      console.error('진단 EF 호출 에러:', e);
    }

    // 처방 EF — 병목별 GPT 맞춤 콘텐츠 생성 → prescriptions.gpt_result 저장
    try {
      const prescribeRes = await fetch(`${supabaseUrl}/functions/v1/tutoring-v2-prescribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serviceKey}`,
        },
        body: JSON.stringify({ session_id: sessionId }),
      });
      if (!prescribeRes.ok) {
        console.error('처방 EF 실패:', await prescribeRes.text());
      }
    } catch (e) {
      console.error('처방 EF 호출 에러:', e);
    }

    return { data: { sessionId } };
  } catch (err) {
    console.error('startTutoringV2 에러:', err);
    return { error: err instanceof Error ? err.message : '튜터링 시작 중 오류가 발생했습니다' };
  }
}

// ═══════════════════════════════════════════════════
// 4. getPrescriptionsV2() — 처방 조회
// ═══════════════════════════════════════════════════

export async function getPrescriptionsV2(
  sessionId: string,
): Promise<ActionResult<TutoringPrescriptionV2[]>> {
  try {
    const { supabase, userId } = await requireUser();

    // 세션 소유권 확인
    const { data: session, error: sessionErr } = await supabase
      .from('tutoring_sessions_v2')
      .select('id, user_id')
      .eq('id', sessionId)
      .single();

    if (sessionErr || !session) {
      return { error: '튜터링 세션을 찾을 수 없습니다' };
    }

    if (session.user_id !== userId) {
      return { error: '접근 권한이 없습니다' };
    }

    // 처방 조회
    const { data: prescriptions, error: prescErr } = await supabase
      .from('tutoring_prescriptions_v2')
      .select('*')
      .eq('session_id', sessionId)
      .order('priority', { ascending: true });

    if (prescErr) {
      return { error: '처방 조회에 실패했습니다' };
    }

    return { data: prescriptions ?? [] };
  } catch (err) {
    console.error('getPrescriptionsV2 에러:', err);
    return { error: err instanceof Error ? err.message : '처방 조회 중 오류가 발생했습니다' };
  }
}

// ═══════════════════════════════════════════════════
// 5. getSessionV2() — 세션 상세 조회
// ═══════════════════════════════════════════════════

export interface SessionV2Detail {
  session: TutoringSessionV2;
  prescriptions: TutoringPrescriptionV2[];
}

export async function getSessionV2(
  sessionId: string,
): Promise<ActionResult<SessionV2Detail>> {
  try {
    const { supabase, userId } = await requireUser();

    // 세션 조회
    const { data: session, error: sessionErr } = await supabase
      .from('tutoring_sessions_v2')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionErr || !session) {
      return { error: '튜터링 세션을 찾을 수 없습니다' };
    }

    if (session.user_id !== userId) {
      return { error: '접근 권한이 없습니다' };
    }

    // 처방 조회
    const { data: prescriptions, error: prescErr } = await supabase
      .from('tutoring_prescriptions_v2')
      .select('*')
      .eq('session_id', sessionId)
      .order('priority', { ascending: true });

    if (prescErr) {
      return { error: '처방 조회에 실패했습니다' };
    }

    return {
      data: {
        session: session as TutoringSessionV2,
        prescriptions: (prescriptions ?? []) as TutoringPrescriptionV2[],
      },
    };
  } catch (err) {
    console.error('getSessionV2 에러:', err);
    return { error: err instanceof Error ? err.message : '세션 조회 중 오류가 발생했습니다' };
  }
}

// ═══════════════════════════════════════════════════
// 6. startTrainingV2() — 훈련 세션 생성
// ═══════════════════════════════════════════════════

// startTrainingV2는 TrainingForPrescriptionResult를 직접 반환 (재조회 불필요)

export async function startTrainingV2(
  prescriptionId: string,
): Promise<ActionResult<TrainingForPrescriptionResult>> {
  try {
    const { supabase, userId } = await requireUser();

    // 1. 처방 조회
    const { data: prescription, error: prescErr } = await supabase
      .from('tutoring_prescriptions_v2')
      .select('*, tutoring_sessions_v2:session_id(*)')
      .eq('id', prescriptionId)
      .single();

    if (prescErr || !prescription) {
      return { error: '처방을 찾을 수 없습니다' };
    }

    // 소유권 검증
    const session = prescription.tutoring_sessions_v2 as TutoringSessionV2 | null;
    if (!session || session.user_id !== userId) {
      return { error: '접근 권한이 없습니다' };
    }

    // 이미 진행 중인 훈련이 있는지 확인
    const { data: existingTraining } = await supabase
      .from('tutoring_training_v2')
      .select('id')
      .eq('prescription_id', prescriptionId)
      .is('completed_at', null)
      .limit(1);

    if (existingTraining && existingTraining.length > 0) {
      // 기존 훈련 세션 — getTrainingForPrescriptionV2로 위임
      const existing = await getTrainingForPrescriptionV2(prescriptionId);
      return existing;
    }

    // 2. 드릴 카탈로그에서 훈련 정보 조회
    const { data: drill, error: drillErr } = await supabase
      .from('tutoring_drill_catalog')
      .select('*')
      .eq('code', prescription.drill_code)
      .single();

    if (drillErr || !drill) {
      return { error: '드릴 정보를 찾을 수 없습니다' };
    }

    const maxRounds = drill.training_method?.rounds ?? 3;
    const approach = drill.approach ?? 'frame_install';

    // 3. 연습 질문 선정 — 모의고사에서 해당 약점이 발견된 문항의 질문 사용
    let trainingQuestions: Array<{ id: string; text: string; topic: string }> = [];
    try {
      // 병목 결과에서 해당 wp_code의 evidence_questions 가져오기
      const bottlenecks = (session.bottleneck_results ?? []) as Array<{
        wp_code: string;
        evidence_questions: number[];
      }>;
      const targetBottleneck = bottlenecks.find(
        (b) => b.wp_code === prescription.wp_code,
      );
      const evidenceQNums = targetBottleneck?.evidence_questions ?? [];

      if (evidenceQNums.length > 0 && session.mock_session_id) {
        // 모의고사 답변에서 question_id 가져오기
        const { data: answers } = await supabase
          .from('mock_test_answers')
          .select('question_number, question_id')
          .eq('session_id', session.mock_session_id)
          .in('question_number', evidenceQNums);

        const questionIds = (answers ?? [])
          .map((a) => a.question_id)
          .filter(Boolean);

        if (questionIds.length > 0) {
          // questions 테이블에서 질문 텍스트 가져오기
          const { data: questions } = await supabase
            .from('questions')
            .select('id, question_english, question_korean, topic')
            .in('id', questionIds)
            .limit(maxRounds);

          trainingQuestions = (questions ?? []).map((q) => ({
            id: q.id,
            text: q.question_english ?? q.question_korean ?? '',
            topic: q.topic ?? '',
          }));
        }
      }

      // 질문이 부족하면 같은 카테고리에서 랜덤 보충
      if (trainingQuestions.length < maxRounds) {
        const existingIds = trainingQuestions.map((q) => q.id);
        const { data: extraQuestions } = await supabase
          .from('questions')
          .select('id, question_english, question_korean, topic')
          .not('id', 'in', `(${existingIds.length > 0 ? existingIds.join(',') : '00000'})`)
          .limit(maxRounds - trainingQuestions.length);

        if (extraQuestions) {
          trainingQuestions.push(
            ...extraQuestions.map((q) => ({
              id: q.id,
              text: q.question_english ?? q.question_korean ?? '',
              topic: q.topic ?? '',
            })),
          );
        }
      }
    } catch (e) {
      console.error('질문 선정 실패 (무시하고 계속):', e);
    }

    // 4. 훈련 세션 생성
    const trainingId = generateTutoringId('tt');

    const { error: insertErr } = await supabase
      .from('tutoring_training_v2')
      .insert({
        id: trainingId,
        prescription_id: prescriptionId,
        approach,
        current_screen: 0,
        rounds_completed: 0,
        max_rounds: maxRounds,
        passed: false,
        question_ids: trainingQuestions,
      });

    if (insertErr) {
      console.error('훈련 세션 생성 실패:', insertErr);
      return { error: '훈련 세션 생성에 실패했습니다' };
    }

    // 4. 처방 상태 업데이트
    await supabase
      .from('tutoring_prescriptions_v2')
      .update({ status: 'in_progress' })
      .eq('id', prescriptionId);

    // 5. 생성된 훈련을 포함한 전체 데이터 반환 (재조회 불필요)
    const createdTraining: TutoringTrainingV2 = {
      id: trainingId,
      prescription_id: prescriptionId,
      approach,
      current_screen: 0,
      rounds_completed: 0,
      max_rounds: maxRounds,
      passed: false,
      started_at: new Date().toISOString(),
      completed_at: null,
      question_ids: trainingQuestions,
    };

    return {
      data: {
        training: createdTraining,
        prescription: prescription as TutoringPrescriptionV2,
        drill: drill as DrillDefinition,
        attempts: [],
        session: session as unknown as TutoringSessionV2,
      },
    };
  } catch (err) {
    console.error('startTrainingV2 에러:', err);
    return { error: err instanceof Error ? err.message : '훈련 시작 중 오류가 발생했습니다' };
  }
}

// ═══════════════════════════════════════════════════
// 7. completeTrainingV2() — 훈련 완료 처리
// ═══════════════════════════════════════════════════

export async function completeTrainingV2(
  trainingId: string,
): Promise<ActionResult> {
  try {
    const { supabase, userId } = await requireUser();

    // 훈련 세션 조회
    const { data: training, error: trainingErr } = await supabase
      .from('tutoring_training_v2')
      .select('id, prescription_id, passed')
      .eq('id', trainingId)
      .single();

    if (trainingErr || !training) {
      return { error: '훈련 세션을 찾을 수 없습니다' };
    }

    // 처방 → 세션 소유권 검증
    const { data: prescription } = await supabase
      .from('tutoring_prescriptions_v2')
      .select('session_id')
      .eq('id', training.prescription_id)
      .single();

    if (!prescription) {
      return { error: '처방을 찾을 수 없습니다' };
    }

    const { data: session } = await supabase
      .from('tutoring_sessions_v2')
      .select('id, user_id')
      .eq('id', prescription.session_id)
      .single();

    if (!session || session.user_id !== userId) {
      return { error: '접근 권한이 없습니다' };
    }

    // 훈련 완료 처리
    await supabase
      .from('tutoring_training_v2')
      .update({ completed_at: new Date().toISOString() })
      .eq('id', trainingId);

    // 전체 세션 완료 체크 (모든 처방 completed → session.status = 'completed')
    const { data: allPrescriptions } = await supabase
      .from('tutoring_prescriptions_v2')
      .select('id, status')
      .eq('session_id', prescription.session_id);

    const allCompleted = allPrescriptions?.every(p => p.status === 'completed') ?? false;

    if (allCompleted) {
      await supabase
        .from('tutoring_sessions_v2')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', prescription.session_id);
    }

    return { data: null };
  } catch (err) {
    console.error('completeTrainingV2 에러:', err);
    return { error: err instanceof Error ? err.message : '훈련 완료 처리 중 오류가 발생했습니다' };
  }
}

// ═══════════════════════════════════════════════════
// 8. getTrainingDetailV2() — 훈련 상세 (attempts 포함)
// ═══════════════════════════════════════════════════

export interface TrainingDetailResult {
  training: TutoringTrainingV2;
  prescription: TutoringPrescriptionV2;
  drill: DrillDefinition;
  attempts: TutoringAttemptV2[];
}

export async function getTrainingDetailV2(
  trainingId: string,
): Promise<ActionResult<TrainingDetailResult>> {
  try {
    const { supabase, userId } = await requireUser();

    // 훈련 세션 조회
    const { data: training, error: trainingErr } = await supabase
      .from('tutoring_training_v2')
      .select('*')
      .eq('id', trainingId)
      .single();

    if (trainingErr || !training) {
      return { error: '훈련 세션을 찾을 수 없습니다' };
    }

    // 처방 + 세션 소유권 검증
    const { data: prescription, error: prescErr } = await supabase
      .from('tutoring_prescriptions_v2')
      .select('*')
      .eq('id', training.prescription_id)
      .single();

    if (prescErr || !prescription) {
      return { error: '처방을 찾을 수 없습니다' };
    }

    const { data: session } = await supabase
      .from('tutoring_sessions_v2')
      .select('id, user_id')
      .eq('id', prescription.session_id)
      .single();

    if (!session || session.user_id !== userId) {
      return { error: '접근 권한이 없습니다' };
    }

    // 드릴 카탈로그
    const { data: drill } = await supabase
      .from('tutoring_drill_catalog')
      .select('*')
      .eq('code', prescription.drill_code)
      .single();

    // 시도 목록
    const { data: attempts } = await supabase
      .from('tutoring_attempts_v2')
      .select('*')
      .eq('training_id', trainingId)
      .order('round_number', { ascending: true });

    return {
      data: {
        training: training as TutoringTrainingV2,
        prescription: prescription as TutoringPrescriptionV2,
        drill: drill as DrillDefinition,
        attempts: (attempts ?? []) as TutoringAttemptV2[],
      },
    };
  } catch (err) {
    console.error('getTrainingDetailV2 에러:', err);
    return { error: err instanceof Error ? err.message : '훈련 상세 조회 중 오류가 발생했습니다' };
  }
}

// ═══════════════════════════════════════════════════
// 9. getHistoryV2() — 전체 이력 조회
// ═══════════════════════════════════════════════════

export interface HistorySessionItem {
  session: TutoringSessionV2;
  prescriptions: Array<TutoringPrescriptionV2 & {
    trainings: TutoringTrainingV2[];
  }>;
}

export async function getHistoryV2(): Promise<ActionResult<HistorySessionItem[]>> {
  try {
    const { supabase, userId } = await requireUser();

    // 모든 세션 조회
    const { data: sessions, error: sessionsErr } = await supabase
      .from('tutoring_sessions_v2')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (sessionsErr) {
      return { error: '이력 조회에 실패했습니다' };
    }

    if (!sessions || sessions.length === 0) {
      return { data: [] };
    }

    const sessionIds = sessions.map(s => s.id);

    // 처방 조회
    const { data: prescriptions } = await supabase
      .from('tutoring_prescriptions_v2')
      .select('*')
      .in('session_id', sessionIds)
      .order('priority', { ascending: true });

    const prescriptionIds = (prescriptions ?? []).map(p => p.id);

    // 훈련 세션 조회
    const { data: trainings } = await supabase
      .from('tutoring_training_v2')
      .select('*')
      .in('prescription_id', prescriptionIds)
      .order('started_at', { ascending: true });

    // 데이터 조합
    const result: HistorySessionItem[] = sessions.map(session => {
      const sessionPrescriptions = (prescriptions ?? [])
        .filter(p => p.session_id === session.id)
        .map(p => ({
          ...p,
          trainings: (trainings ?? []).filter(t => t.prescription_id === p.id) as TutoringTrainingV2[],
        }));

      return {
        session: session as TutoringSessionV2,
        prescriptions: sessionPrescriptions as Array<TutoringPrescriptionV2 & { trainings: TutoringTrainingV2[] }>,
      };
    });

    return { data: result };
  } catch (err) {
    console.error('getHistoryV2 에러:', err);
    return { error: err instanceof Error ? err.message : '이력 조회 중 오류가 발생했습니다' };
  }
}

// ═══════════════════════════════════════════════════
// 10. getTrainingForPrescriptionV2() — 처방 ID로 훈련 데이터 조회
// ═══════════════════════════════════════════════════

export interface TrainingForPrescriptionResult {
  training: TutoringTrainingV2 | null;
  prescription: TutoringPrescriptionV2;
  drill: DrillDefinition;
  attempts: TutoringAttemptV2[];
  session: TutoringSessionV2;
}

export async function getTrainingForPrescriptionV2(
  prescriptionId: string,
): Promise<ActionResult<TrainingForPrescriptionResult>> {
  try {
    const { supabase, userId } = await requireUser();

    // 처방 조회
    const { data: prescription, error: prescErr } = await supabase
      .from('tutoring_prescriptions_v2')
      .select('*')
      .eq('id', prescriptionId)
      .single();

    if (prescErr || !prescription) {
      return { error: '처방을 찾을 수 없습니다' };
    }

    // 세션 소유권 검증
    const { data: session, error: sessionErr } = await supabase
      .from('tutoring_sessions_v2')
      .select('*')
      .eq('id', prescription.session_id)
      .single();

    if (sessionErr || !session || session.user_id !== userId) {
      return { error: '접근 권한이 없습니다' };
    }

    // 드릴 카탈로그
    const { data: drill, error: drillErr } = await supabase
      .from('tutoring_drill_catalog')
      .select('*')
      .eq('code', prescription.drill_code)
      .single();

    if (drillErr || !drill) {
      return { error: '드릴 정보를 찾을 수 없습니다' };
    }

    // 기존 훈련 세션 조회
    const { data: trainings } = await supabase
      .from('tutoring_training_v2')
      .select('*')
      .eq('prescription_id', prescriptionId)
      .order('started_at', { ascending: false })
      .limit(1);

    const training = trainings && trainings.length > 0 ? trainings[0] as TutoringTrainingV2 : null;

    // 시도 조회
    let attempts: TutoringAttemptV2[] = [];
    if (training) {
      const { data: attemptData } = await supabase
        .from('tutoring_attempts_v2')
        .select('*')
        .eq('training_id', training.id)
        .order('round_number', { ascending: true });
      attempts = (attemptData ?? []) as TutoringAttemptV2[];
    }

    return {
      data: {
        training,
        prescription: prescription as TutoringPrescriptionV2,
        drill: drill as DrillDefinition,
        attempts,
        session: session as TutoringSessionV2,
      },
    };
  } catch (err) {
    console.error('getTrainingForPrescriptionV2 에러:', err);
    return { error: err instanceof Error ? err.message : '훈련 데이터 조회 중 오류가 발생했습니다' };
  }
}

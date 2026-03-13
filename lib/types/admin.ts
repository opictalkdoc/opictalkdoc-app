// 관리자 시스템 타입 정의

// ── 대시보드 ──

export interface AdminDashboardStats {
  totalUsers: number;
  dauToday: number;
  totalRevenue: number;
  pendingEvals: number;
}

export interface RecentActivity {
  id: string;
  type: "signup" | "order" | "mock_exam" | "review";
  description: string;
  created_at: string;
}

// ── 사용자 관리 ──

export interface AdminUser {
  id: string;
  email: string;
  display_name: string | null;
  current_grade: string | null;
  target_grade: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  // user_credits 조인
  plan_mock_exam_credits: number;
  plan_script_credits: number;
  mock_exam_credits: number;
  script_credits: number;
  current_plan: string;
}

export interface CreditAdjustParams {
  userId: string;
  creditType: "mock_exam_credits" | "script_credits" | "plan_mock_exam_credits" | "plan_script_credits";
  amount: number; // +/- 값
  reason: string;
}

// ── 결제 관리 ──

export interface AdminOrder {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string | null;
  product_name: string;
  amount: number;
  status: string;
  payment_id: string | null;
  created_at: string;
}

// ── 감사 로그 ──

export interface AuditLogEntry {
  id: number;
  admin_id: string;
  admin_email?: string;
  action: string;
  target_type: string | null;
  target_id: string | null;
  details: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
}

// ── 콘텐츠 관리 ──

export interface AdminPromptTemplate {
  id: string;
  name: string;
  content: string;
  updated_at: string;
}

// ── 모의고사 모니터링 ──

export interface AdminMockSession {
  id: string;
  user_id: string;
  user_email: string;
  mode: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  eval_progress: string; // 'pending' | 'processing' | ... | 'complete'
  predicted_grade: string | null;
}

export interface MockExamStats {
  totalSessions: number;
  completedSessions: number;
  pendingEvals: number;
  failedEvals: number;
  avgGrade: string | null;
}

// ── 공통 ──

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AdminListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  filter?: string;
}

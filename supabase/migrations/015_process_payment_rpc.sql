-- ============================================================
-- 015_process_payment_rpc.sql
-- 결제 보안 강화: 원자적 결제 처리 RPC
-- - 주문 기록(INSERT) + 크레딧 지급(UPDATE) 단일 트랜잭션
-- - ON CONFLICT로 중복 결제 race condition 제거
-- 생성일: 2026-03-09
-- ============================================================

CREATE OR REPLACE FUNCTION process_payment(
  p_user_id UUID,
  p_payment_id TEXT,
  p_product_id TEXT,
  p_order_name TEXT,
  p_amount INTEGER,
  p_pg_provider TEXT DEFAULT NULL,
  p_pg_tx_id TEXT DEFAULT NULL,
  p_pay_method TEXT DEFAULT NULL,
  p_paid_at TIMESTAMPTZ DEFAULT NULL,
  p_receipt_url TEXT DEFAULT NULL,
  p_is_plan BOOLEAN DEFAULT FALSE,
  p_plan TEXT DEFAULT 'free',
  p_plan_months INTEGER DEFAULT 0,
  p_mock_exam_credits INTEGER DEFAULT 0,
  p_script_credits INTEGER DEFAULT 0
) RETURNS JSONB AS $$
DECLARE
  v_order_id UUID;
  v_expires_at TIMESTAMPTZ;
BEGIN
  -- 원자적 INSERT (UNIQUE INDEX idx_orders_payment_id로 중복 방지)
  INSERT INTO orders (
    user_id, product_id, order_name, amount, status,
    payment_id, pg_provider, pg_tx_id, pay_method, paid_at, receipt_url
  ) VALUES (
    p_user_id, p_product_id, p_order_name, p_amount, 'paid',
    p_payment_id, p_pg_provider, p_pg_tx_id, p_pay_method,
    COALESCE(p_paid_at, NOW()), p_receipt_url
  )
  ON CONFLICT (payment_id) DO NOTHING
  RETURNING id INTO v_order_id;

  -- 이미 처리된 결제면 크레딧 지급 건너뛰기 (멱등성)
  IF v_order_id IS NULL THEN
    RETURN jsonb_build_object('success', true, 'duplicate', true);
  END IF;

  -- 크레딧 지급
  IF p_is_plan THEN
    -- 플랜 상품: 플랜 크레딧 설정 + 만료일 설정
    v_expires_at := NOW() + (p_plan_months || ' months')::INTERVAL;
    UPDATE user_credits SET
      current_plan = p_plan,
      plan_mock_exam_credits = p_mock_exam_credits,
      plan_script_credits = p_script_credits,
      plan_expires_at = v_expires_at,
      updated_at = NOW()
    WHERE user_id = p_user_id;
  ELSE
    -- 횟수권: 영구 크레딧 누적
    UPDATE user_credits SET
      mock_exam_credits = mock_exam_credits + p_mock_exam_credits,
      script_credits = script_credits + p_script_credits,
      updated_at = NOW()
    WHERE user_id = p_user_id;
  END IF;

  RETURN jsonb_build_object('success', true, 'order_id', v_order_id::text);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

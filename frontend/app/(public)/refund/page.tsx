import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "환불 규정 | OPIcTalkDoc",
  description: "OPIcTalkDoc 환불 규정 안내",
};

export default function RefundPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold">환불 규정</h1>
      <p className="mt-2 text-sm text-foreground-muted">
        시행일: 2026년 2월 18일
      </p>

      <div className="mt-10 space-y-10 text-sm leading-relaxed text-foreground-secondary">
        {/* 제1조 */}
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            제1조 (목적)
          </h2>
          <p className="mt-2">
            이 규정은 스투스 OPIc(이하 &quot;회사&quot;)이 제공하는 OPIcTalkDoc
            유료서비스에 대한 환불 기준과 절차를 규정합니다.
            전자상거래 등에서의 소비자보호에 관한 법률에 따릅니다.
          </p>
        </section>

        {/* 제2조 */}
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            제2조 (청약철회 및 환불)
          </h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>
              회원은 유료서비스 결제일로부터 7일 이내에 청약철회를 요청할 수
              있습니다.
            </li>
            <li>
              청약철회 시 서비스를 이용하지 않은 경우 결제 금액 전액을
              환불합니다.
            </li>
            <li>
              서비스를 일부 이용한 경우 이용일수에 해당하는 금액을 차감 후
              환불합니다.
            </li>
          </ol>
        </section>

        {/* 제3조 */}
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            제3조 (환불 금액 산정)
          </h2>
          <p className="mt-2">
            월간 구독 서비스의 환불 금액은 다음과 같이 산정합니다.
          </p>
          <div className="mt-3 overflow-x-auto rounded-[var(--radius-lg)] border border-border">
            <table className="w-full text-left">
              <thead className="bg-surface-secondary">
                <tr>
                  <th className="px-4 py-3 font-semibold text-foreground">
                    이용 기간
                  </th>
                  <th className="px-4 py-3 font-semibold text-foreground">
                    환불 비율
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-3">결제 후 7일 이내 (미이용)</td>
                  <td className="px-4 py-3">전액 환불</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">결제 후 7일 이내 (이용)</td>
                  <td className="px-4 py-3">
                    결제금액 - (일할 이용금액 x 이용일수)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">결제 후 7일 초과</td>
                  <td className="px-4 py-3">환불 불가 (잔여기간 서비스 이용)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 제4조 */}
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            제4조 (환불이 불가능한 경우)
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>결제일로부터 7일이 초과한 경우</li>
            <li>
              회원의 귀책사유로 서비스 이용이 불가능해진 경우 (계정 정지 등)
            </li>
            <li>
              이벤트, 프로모션 등 무료로 제공된 서비스
            </li>
          </ul>
        </section>

        {/* 제5조 */}
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            제5조 (환불 절차)
          </h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>
              환불 요청은 이메일(opictalkdoc@gmail.com)로 접수합니다.
            </li>
            <li>
              접수 후 3영업일 이내에 환불 가능 여부를 안내합니다.
            </li>
            <li>
              환불 승인 후 5~7영업일 이내에 결제 수단으로 환불 처리됩니다.
            </li>
            <li>
              카드 결제의 경우 카드사 사정에 따라 추가 시간이 소요될 수
              있습니다.
            </li>
          </ol>
        </section>

        {/* 제6조 */}
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            제6조 (구독 해지)
          </h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>
              회원은 언제든지 구독을 해지할 수 있습니다.
            </li>
            <li>
              구독 해지 시 잔여 기간 동안 서비스를 계속 이용할 수 있으며,
              다음 결제일부터 요금이 청구되지 않습니다.
            </li>
            <li>
              구독 해지 후 재구독은 언제든지 가능합니다.
            </li>
          </ol>
        </section>

        {/* 제7조 */}
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            제7조 (회사 귀책사유에 의한 환불)
          </h2>
          <p className="mt-2">
            회사의 귀책사유로 서비스를 정상적으로 제공하지 못한 경우,
            이용일수 기준으로 일할 계산하여 환불합니다.
            24시간 이상 연속 서비스 장애 발생 시 해당 기간만큼 이용기간을
            연장하거나 환불합니다.
          </p>
        </section>

        {/* 문의 */}
        <section className="rounded-[var(--radius-lg)] border border-border bg-surface-secondary p-5">
          <p className="font-medium text-foreground">환불 문의</p>
          <ul className="mt-2 space-y-0.5">
            <li>이메일: opictalkdoc@gmail.com</li>
            <li>상호: 스투스 OPIc</li>
            <li>대표자: 전다영</li>
            <li>사업자등록번호: 757-18-02318</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

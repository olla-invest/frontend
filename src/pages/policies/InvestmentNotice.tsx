import PoliciesHeader from "./components/PoliciesHeader";
export default function InvestmentNotice() {
  return (
    <div className="policiesWrap h-[calc(100vh-120px)] overflow-y-auto">
      <PoliciesHeader useSelect={false} title="투자 유의사항" />
      <div className="text-sm text-slate-700 pt-6 flex flex-col gap-6">
        <div className="policiesBox">
          <span className="text-muted-foreground">투자하시기 전에 아래 내용을 꼭 확인해 주시기 바랍니다.</span>
        </div>
        <div>
          <span>1. 서비스 성격</span>
          올라인베스트(ollainvest)는 투자 관련 데이터와 정보를 제공하는 서비스입니다. 올라인베스트에서 제공하는 모든 정보는 참고용이며, 특정 금융상품의 매수·매도를 권유하거나 종목을 추천하기 위한
          목적이 아닙니다.
        </div>
        <div>올라인베스트는 직접적인 금융투자 거래를 중개하거나 실행하지 않으며, 자산 보관·운용·관리 등의 금융서비스를 제공하지 않습니다.</div>
        <div>
          <span>2. 투자 결정 및 책임</span>
          모든 투자의 결정 및 최종 책임은 투자자 본인에게 있습니다. 올라인베스트에서 제공하는 정보는 투자자의 투자 결과에 대한 법적 자료로 사용될 수 없습니다.
        </div>
        <div>
          <span>3. 정보의 정확성</span>
          올라인베스트에서 제공하는 시세, 지표, 통계 등의 데이터는 외부 데이터 제공업체로부터 수신되며, 실시간 전송 과정에서 지연이나 오류가 발생할 수 있습니다.
          <br />
          올라인베스트는 데이터의 정확성·완전성·적시성을 보장하지 않으며, 이로 인해 발생한 손해에 대해 책임을 지지 않습니다.
        </div>
      </div>
    </div>
  );
}

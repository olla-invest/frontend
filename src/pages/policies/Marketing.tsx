import PoliciesHeader from "./components/PoliciesHeader";
export default function Marketing() {
  return (
    <div className="policiesWrap">
      <PoliciesHeader useSelect={false} title="마케팅 정보 수신 동의 " />
      <div className="text-sm text-slate-700 pt-6 flex flex-col gap-6">
        <div className="policiesBox">
          <span>1. 수집·이용 목적</span>
          <p>회사는 다음 목적을 위해 이용자의 개인정보를 이용합니다.</p>
          <ul className="pl-1 innerList">
            <li>신규 기능 및 서비스 업데이트 안내</li>
            <li>이벤트, 프로모션, 혜택 정보 안내</li>
            <li>플랜 변경, 할인, 유료 전환 관련 안내</li>
            <li>서비스 만족도 조사 및 마케팅 분석</li>
          </ul>
        </div>

        <div className="policiesBox">
          <span>2. 수집 항목</span>
          <ul className="pl-1 innerList">
            <li>이메일 주소</li>
            <li>휴대전화번호</li>
          </ul>
        </div>

        <div className="policiesBox">
          <span>3. 보유 및 이용 기간</span>
          <ul className="pl-1 innerList">
            <li>회원 탈퇴 또는 동의 철회 시까지</li>
            <li>동의 철회 요청 시 지체 없이 파기합니다.</li>
          </ul>
        </div>

        <div className="policiesBox">
          <span>4. 동의 거부 권리</span>
          <p>
            이용자는 마케팅 정보 수신에 동의하지 않을 권리가 있습니다.
            <br />
            동의하지 않더라도 OLLA 기본 서비스 이용에는 제한이 없습니다.
          </p>
        </div>

        <div className="policiesBox">
          <span>5. 수신 방법</span>
          <ul className="pl-1 innerList">
            <li>이메일</li>
            <li>SMS 또는 앱 푸시 알림</li>
          </ul>
          <p>(수신 방법은 이용자가 설정에서 변경하거나 철회할 수 있습니다.)</p>
        </div>
      </div>
    </div>
  );
}

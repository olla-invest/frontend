import PoliciesHeader from "./components/PoliciesHeader";
export default function Privacy() {
  return (
    <div className="policiesWrap">
      <PoliciesHeader lastUpdate="yyyy.mm.dd" useSelect={true} title="개인정보 처리방침" />
      <div className="text-sm text-slate-700 pt-6 flex flex-col gap-6">
        <p className="text-muted-foreground">
          주식회사 OLLA(이하 “회사”)**는 「개인정보 보호법」 등 관련 법령을 준수하여 이용자의 개인정보를 안전하게 보호하기 위해 다음과 같이 처리방침을 수립·공개합니다
        </p>
        <div className="policiesBox">
          <span>1. 개인정보 처리 목적</span>
          <p>회사는 아래 목적을 위해 개인정보를 수집·이용합니다. 처리 목적이 변경될 경우에는 사전에 고지합니다.</p>
          <ol className="pl-1">
            <li>
              서비스 제공 및 회원관리
              <ul className="innerList">
                <li>회원가입, 본인 식별·인증</li>
                <li>계정 관리, 서비스 이용 이력 관리</li>
                <li>서비스 이용 통계 및 맞춤 분석 제공</li>
              </ul>
            </li>
            <li>
              고객 지원 및 공지 안내
              <ul className="innerList">
                <li>문의 응답, 공지 발송</li>
                <li>서비스 개선 및 만족도 조사</li>
              </ul>
            </li>
            <li>
              법령 준수 및 안전한 서비스 운영
              <ul className="innerList">
                <li>부정 이용 방지</li>
                <li>보안과 안정성 확보</li>
              </ul>
            </li>
          </ol>
          <p>※ 개인정보는 이용 목적 외로 사용되지 않습니다.</p>
        </div>

        <div className="policiesBox">
          <span>2. 수집하는 개인정보 항목</span>
          <p>회사는 서비스 제공에 필요한 최소한의 개인정보만 수집합니다.</p>
          <ul className="pl-1">
            <li>
              ① 필수 수집 항목
              <ul className="pl-3 innerList">
                <li>이름, 로그인 ID, 비밀번호, 이메일 주소</li>
                <li>휴대전화번호, 서비스 이용 기록</li>
              </ul>
            </li>
            <li>
              ② 자동수집 정보{" "}
              <ul className="pl-3 innerList">
                <li>접속 로그, IP 주소, 쿠키, 기기 정보</li>
                <li>이용 형태 정보</li>
              </ul>
            </li>
          </ul>
          <p>※ 서비스 특성에 따라 추가 정보가 필요한 경우 별도 안내 및 동의를 받습니다.</p>
        </div>

        <div className="policiesBox">
          <span>3. 개인정보의 보유 및 이용 기간</span>
          <p>
            회사는 개인정보를 처리 목적 달성 시까지 보유합니다.
            <br />
            다만, 관련 법령에 따라 일정 기간 보관해야 하는 경우 법정 기간 동안 보관합니다.
          </p>
          <ul className="pl-3 innerList">
            <li>계약·청약철회 기록: 5년</li>
            <li>소비자 불만·분쟁 기록: 3년</li>
            <li>웹사이트 접속 기록: 3개월</li>
          </ul>
          <p className="pl-3">(관련 법령에 따른 보존기간 적용)</p>
        </div>

        <div className="policiesBox">
          <span>4. 개인정보의 파기 절차 및 방법</span>
          <ol className="pl-1">
            <li>서비스 이용을 위해 회원가입이 필요합니다.</li>
            <li>보유 기간이 경과하거나 처리 목적이 달성되면 즉시 파기합니다.</li>
            <li>전자 파일은 복구 불가능한 방식으로 삭제하며, 종이 문서는 분쇄 또는 소각합니다.</li>
          </ol>
        </div>

        <div className="policiesBox">
          <span>5. 개인정보의 제3자 제공</span>
          <p>
            회사는 개인정보를 원칙적으로 외부에 제공하지 않습니다.
            <br />
            다만 아래 경우는 예외로 합니다
          </p>
          <ul className="pl-3 innerList">
            <li>이용자가 사전에 동의한 경우</li>
            <li>법령에 근거한 제공 요청이 있을 경우</li>
          </ul>
          <p>※ 제3자 제공 시 제공 목적, 항목, 보유 기간을 명확히 고지합니다.</p>
        </div>

        <div className="policiesBox">
          <span>6. 개인정보 처리 위탁</span>
          <p>
            회사는 서비스 제공을 위해 일부 업무를 외부 전문 업체에 위탁할 수 있습니다.
            <br />
            위탁 시에는 적절한 보호조치 및 감독을 수행합니다.
          </p>
        </div>

        <div className="policiesBox">
          <span>7. 이용자 및 법정대리인의 권리와 행사 방법</span>
          <p>이용자는 언제든 아래 권리를 행사할 수 있습니다:</p>
          <ul className="pl-3 innerList">
            <li>개인정보 열람 요청</li>
            <li>정정·삭제 요청</li>
            <li>처리 정지 요청</li>
            <li>동의 철회 요청</li>
          </ul>
          <p>권리 행사는 고객센터 또는 이메일 등을 통해 요청할 수 있으며, 회사는 지체 없이 조치합니다.</p>
        </div>

        <div className="policiesBox">
          <span>8. 개인정보 자동 수집 장치의 설치·운영 및 거부</span>
          <p>
            회사는 이용자의 편의를 위해 쿠키(cookie) 등을 사용할 수 있습니다. <br />
            이용자는 웹 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다. <br />단 일부 서비스 이용에 제한이 있을 수 있습니다.
          </p>
        </div>

        <div className="policiesBox">
          <span>9. 개인정보 보호를 위한 조치</span>
          <p>회사는 개인정보 보호를 위해 아래와 같은 조치를 시행합니다.</p>
          <ul className="pl-3 innerList">
            <li>암호화 및 접근 통제</li>
            <li>침입 차단 시스템 적용</li>
            <li>정기적인 보안 점검 및 유지 관리</li>
          </ul>
        </div>

        <div className="policiesBox">
          <span>10. 책임자 및 문의처</span>
          <p>회사는 개인정보 보호책임자를 지정하고 있습니다.</p>
          <ul className="pl-3 innerList">
            <li>개인정보 보호책임자: olla 개인정보 책임자</li>
            <li>이메일: privacy@olla-invest.com</li>
            <li>문의: 고객센터</li>
          </ul>
          <p>※ 개인정보 침해 및 피해 구제에 대한 상세 문의는 개인정보침해신고센터(118) 또는 분쟁조정위원회 등을 통해 상담할 수 있습니다.</p>
        </div>

        <div className="policiesBox">
          <span>11. 방침 변경에 관한 고지</span>
          <p>본 방침은 법령 또는 회사 정책에 따라 변경될 수 있으며, 변경 시 서비스 공지 또는 개별 안내를 통해 알려드립니다.</p>
        </div>
      </div>
    </div>
  );
}

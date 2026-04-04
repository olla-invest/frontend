import PoliciesHeader from "./components/PoliciesHeader";

export default function Terms() {
  return (
    <div className="policiesWrap">
      <PoliciesHeader lastUpdate="yyyy.mm.dd" useSelect={true} title="서비스 이용약관" />
      <div className="text-sm text-slate-700 pt-6 flex flex-col gap-6">
        <p className="text-muted-foreground">주식회사 OLLA(이하 “회사”)가 제공하는 OLLA 서비스(이하 “서비스”)의 이용과 관련하여 회사와 이용자 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.</p>
        {/* 1조 */}
        <div>
          <span>제1조 (목적)</span>
          <p>본 약관은 회사가 제공하는 데이터 기반 투자 분석 서비스의 이용 조건 및 절차, 회사와 이용자의 권리·의무 및 책임사항을 규정합니다.</p>
        </div>

        {/* 2조 */}
        <div className="policiesBox">
          <span>제2조 (서비스의 내용)</span>
          <ol className="pl-1">
            <li>
              회사는 다음과 같은 서비스를 제공합니다.
              <ul className="pl-3 innerList">
                <li>종목 및 테마 데이터 제공</li>
                <li>시장 분석 지표 제공</li>
                <li>사용자 설정 기반 필터링 및 전략 관리 기능</li>
                <li>기타 회사가 정하는 데이터 분석 서비스</li>
              </ul>
            </li>
            <li>본 서비스는 투자 판단에 참고할 수 있는 데이터 및 정보 제공 서비스입니다.</li>
            <li>회사는 특정 종목의 매수·매도 또는 투자를 권유하거나 추천하지 않습니다.</li>
          </ol>
        </div>

        {/* 3조 */}
        <div className="policiesBox">
          <span>제3조 (투자 판단 및 책임)</span>
          <ol className="pl-1">
            <li>
              서비스에서 제공하는 모든 정보는 참고 자료일 뿐이며,
              <br />
              특정 금융상품에 대한 투자 권유 또는 투자 자문에 해당하지 않습니다.
            </li>
            <li>최종적인 투자 판단 및 그에 따른 책임은 전적으로 이용자 본인에게 있습니다.</li>
            <li>
              이용자가 서비스를 기반으로 투자 결정을 하여 발생한 손실 또는 이익에 대하여
              <br />
              회사는 고의 또는 중대한 과실이 없는 한 책임을 부담하지 않습니다.
            </li>
            <li>회사는 시장 상황, 데이터 오류, 시스템 장애 등으로 인해 발생할 수 있는 투자 결과에 대해 보증하지 않습니다.</li>
          </ol>
        </div>

        {/* 4조 */}
        <div className="policiesBox">
          <span>제4조 (회원가입 및 계정관리)</span>
          <ol className="pl-1">
            <li>서비스 이용을 위해 회원가입이 필요합니다.</li>
            <li>이용자는 정확한 정보를 제공해야 하며, 허위 정보 제공으로 인한 불이익은 이용자 본인의 책임입니다.</li>
            <li>계정 관리 책임은 이용자에게 있으며, 계정 도용 등으로 발생하는 문제에 대해 회사는 고의 또는 중과실이 없는 한 책임을 지지 않습니다.</li>
          </ol>
        </div>

        {/* 5조 */}
        <div className="policiesBox">
          <span>제5조 (플랜 및 이용요금)</span>
          <ol className="pl-1">
            <li>서비스는 무료 플랜과 유료 플랜으로 구분될 수 있습니다.</li>
            <li>각 플랜의 기능, 이용요금, 제공 범위는 서비스 화면에 별도로 안내합니다.</li>
            <li>유료 플랜 이용 시 이용자는 정해진 요금을 납부해야 합니다.</li>
            <li>요금, 제공 기능, 정책은 회사의 운영 정책에 따라 변경될 수 있습니다.</li>
          </ol>
        </div>

        {/* 6조 */}
        <div className="policiesBox">
          <span>제6조 (서비스 이용 제한)</span>
          <p>이용자는 다음 행위를 해서는 안 됩니다.</p>
          <ol className="pl-1">
            <li>서비스를 통해 제공되는 데이터를 무단 복제, 수정, 가공, 판매, 재배포하는 행위</li>
            <li>회사의 사전 동의 없이 제3자에게 서비스를 공유하거나 계정을 양도하는 행위</li>
            <li>자동화 프로그램, 크롤링 등을 통한 데이터 수집 행위</li>
            <li>서비스의 정상적인 운영을 방해하는 행위</li>
          </ol>
          <p>
            특히, 유료 또는 무료 여부와 관계없이 서비스 내 데이터·지표·분석 결과를 제3자에게 상업적으로 제공하거나 배포하는 행위는 금지됩니다.
            <br />
            위반 시 회사는 계정 정지 또는 법적 조치를 취할 수 있습니다.
          </p>
        </div>

        {/* 7조 */}
        <div className="policiesBox">
          <span>제7조 (지식재산권)</span>
          <ol className="pl-1">
            <li>서비스에 포함된 데이터 가공 방식, 알고리즘, UI, 콘텐츠 등의 저작권 및 지식재산권은 회사에 귀속됩니다.</li>
            <li>이용자는 개인적 이용 범위 내에서만 서비스를 사용할 수 있습니다.</li>
          </ol>
        </div>

        {/* 8조 */}
        <div className="policiesBox">
          <span>제8조 (서비스 변경 및 중단)</span>
          <ol className="pl-1">
            <li>회사는 운영상 또는 기술상의 필요에 따라 서비스 내용을 변경할 수 있습니다.</li>
            <li>불가피한 사유가 있는 경우 서비스 제공을 일시적으로 중단할 수 있습니다.</li>
            <li>회사는 서비스 변경 또는 중단으로 인해 발생하는 손해에 대해 고의 또는 중과실이 없는 한 책임을 부담하지 않습니다.</li>
          </ol>
        </div>

        {/* 9조 */}
        <div className="policiesBox">
          <span>제9조 (계약 해지 및 이용 제한)</span>
          <ol className="pl-1">
            <li>이용자는 언제든지 회원 탈퇴를 요청할 수 있습니다.</li>
            <li>이용자가 본 약관을 위반한 경우 회사는 사전 통지 없이 이용을 제한하거나 계약을 해지할 수 있습니다.</li>
          </ol>
        </div>

        {/* 10조 */}
        <div className="policiesBox">
          <span>제10조 (면책 조항)</span>
          <ol className="pl-1">
            <li>회사는 천재지변, 전쟁, 통신 장애 등 불가항력 사유로 인한 서비스 장애에 대해 책임을 지지 않습니다.</li>
            <li>회사는 제휴 기관 또는 외부 데이터 제공자의 오류로 인한 정보 부정확성에 대해 책임을 지지 않습니다.</li>
            <li>회사는 이용자의 귀책사유로 인한 손해에 대해 책임을 부담하지 않습니다.</li>
          </ol>
        </div>

        {/* 11조 */}
        <div className="policiesBox">
          <span>제11조 (분쟁 해결 및 관할)</span>
          <ol className="pl-1">
            <li>본 약관과 관련하여 발생한 분쟁은 대한민국 법령에 따릅니다.</li>
            <li>분쟁 발생 시 회사 본점 소재지를 관할하는 법원을 전속 관할 법원으로 합니다.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

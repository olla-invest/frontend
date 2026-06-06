import it_tech from "@/assets/icons/theme/it_tech.png";
import construction from "@/assets/icons/theme/construction.png";
import game from "@/assets/icons/theme/game.png";
import metal from "@/assets/icons/theme/metal.png";
import finance from "@/assets/icons/theme/finance.png";
import machinery from "@/assets/icons/theme/machinery.png";
import etc from "@/assets/icons/theme/etc.png";
import display from "@/assets/icons/theme/display.png";
import robot from "@/assets/icons/theme/robot.png";
import mobile from "@/assets/icons/theme/mobile.png";
import logistics from "@/assets/icons/theme/logistics.png";
import bio from "@/assets/icons/theme/bio.png";
import semiconductor from "@/assets/icons/theme/semiconductor.png";
import defense from "@/assets/icons/theme/defense.png";
import battery from "@/assets/icons/theme/battery.png";
import vaccine from "@/assets/icons/theme/vaccine.png";
import security from "@/assets/icons/theme/security.png";
import real_estate from "@/assets/icons/theme/real_estate.png";
import textile from "@/assets/icons/theme/textile.png";
import film from "@/assets/icons/theme/film.png";
import space from "@/assets/icons/theme/space.png";
import transport from "@/assets/icons/theme/transport.png";
import transport_equipment from "@/assets/icons/theme/transport_equipment.png";
import nuclear from "@/assets/icons/theme/nuclear.png";
import distribution from "@/assets/icons/theme/distribution.png";
import retail from "@/assets/icons/theme/retail.png";
import food from "@/assets/icons/theme/food.png";
import medical from "@/assets/icons/theme/medical.png";
import automobile from "@/assets/icons/theme/automobile.png";
import pharma from "@/assets/icons/theme/pharma.png";
import oil_gas from "@/assets/icons/theme/oil_gas.png";
import securities from "@/assets/icons/theme/securities.png";
import eco from "@/assets/icons/theme/eco.png";
import character from "@/assets/icons/theme/character.png";
import solar from "@/assets/icons/theme/solar.png";
import telecom from "@/assets/icons/theme/telecom.png";
import platform_content from "@/assets/icons/theme/platform_content.png";
import aviation from "@/assets/icons/theme/aviation.png";
import cosmetics from "@/assets/icons/theme/cosmetics.png";
import defaultIcon from "@/assets/icons/theme/etc.png";

export function getThemeIcon(themeCode: number | undefined): string {
  if (!themeCode) return defaultIcon;

  const themeIconMap: Record<string, string> = {
    // IT/기술
    "100302": it_tech,
    "100529": it_tech,
    "100545": it_tech,
    "100576": it_tech,
    "100543": it_tech,
    "100049": it_tech,
    "100173": it_tech,
    "100385": it_tech,
    "100507": it_tech,
    "100276": it_tech,
    "100435": it_tech,
    "100017": it_tech,
    "100480": it_tech,
    "100289": it_tech,
    "100352": it_tech,
    "100426": it_tech,
    "100387": it_tech,
    "100229": it_tech,
    "100104": it_tech,

    // 건설
    "100322": construction,
    "100402": construction,
    "100044": construction,
    "100154": construction,
    "100378": construction,
    "100520": construction,
    "100213": construction,

    // 게임
    "100265": game,
    "100042": game,

    // 금속
    "100523": metal,
    "100511": metal,
    "100079": metal,
    "100178": metal,
    "100223": metal,

    // 금융
    "100331": finance,
    "100482": finance,
    "100492": finance,
    "100531": finance,
    "100582": finance,
    "100165": finance,
    "100272": finance,
    "100343": finance,
    "100521": finance,
    "100489": finance,
    "100342": finance,
    "100348": finance,
    "100119": finance,
    "100497": finance,
    "100008": finance,

    // 기계/장비
    "100560": machinery,
    "100123": machinery,
    "100094": machinery,
    "100030": machinery,

    // 기타
    "100537": etc,
    "100242": etc,
    "100415": etc,

    // 디스플레이
    "100009": display,
    "100382": display,
    "100269": display,
    "100033": display,
    "100390": display,

    // 로봇
    "100099": robot,
    "100587": robot,
    "100349": robot,
    "100505": robot,

    // 모바일
    "100388": mobile,
    "100288": mobile,
    "100279": mobile,
    "100041": mobile,
    "100599": mobile,
    "100404": mobile,
    "100393": mobile,
    "100321": mobile,

    // 물류
    "100141": logistics,
    "100464": logistics,

    // 바이오
    "100066": bio,
    "100597": bio,
    "100493": bio,
    "100470": bio,
    "100376": bio,
    "100124": bio,

    // 반도체
    "100155": semiconductor,
    "100533": semiconductor,
    "100547": semiconductor,
    "100307": semiconductor,
    "100536": semiconductor,
    "100556": semiconductor,
    "100405": semiconductor,
    "100608": semiconductor,
    "100534": semiconductor,
    "100287": semiconductor,
    "100557": semiconductor,
    "100012": semiconductor,
    "100014": semiconductor,

    // 방산
    "100517": defense,
    "100144": defense,

    // 배터리
    "100449": battery,
    "100579": battery,
    "100472": battery,
    "100446": battery,
    "100500": battery,
    "100503": battery,
    "100064": battery,
    "100564": battery,
    "100445": battery,
    "100329": battery,

    // 백신
    "100448": vaccine,
    "100285": vaccine,
    "100436": vaccine,
    "100468": vaccine,
    "100447": vaccine,
    "100108": vaccine,
    "100452": vaccine,
    "100467": vaccine,

    // 보험/보안
    "100234": security,
    "100566": security,
    "100055": security,
    "100106": security,
    "100028": security,
    "100283": security,
    "100164": security,

    // 부동산
    "100310": real_estate,
    "100013": real_estate,
    "100592": real_estate,
    "100524": real_estate,
    "100591": real_estate,

    // 섬유/의류
    "100032": textile,
    "100319": textile,

    // 영화
    "100048": film,

    // 우주
    "100584": space,
    "100200": space,

    // 운송/창고
    "100036": transport,

    // 운송장비
    "100237": transport_equipment,
    "100250": transport_equipment,

    // 원자력
    "100187": nuclear,
    "100401": nuclear,
    "100205": nuclear,

    // 유통
    "100325": distribution,

    // 유통/소매
    "100384": retail,

    // 음식료
    "100086": food,
    "100113": food,
    "100585": food,

    // 의료/정밀기기
    "100175": medical,
    "100149": medical,

    // 자동차
    "100501": automobile,
    "100227": automobile,
    "100332": automobile,
    "100362": automobile,
    "100514": automobile,
    "100159": automobile,
    "100167": automobile,
    "100504": automobile,
    "100027": automobile,

    // 제약
    "100172": pharma,
    "100241": pharma,
    "100546": pharma,
    "100540": pharma,
    "100389": pharma,
    "100377": pharma,
    "100563": pharma,
    "100506": pharma,
    "100174": pharma,
    "100408": pharma,
    "100487": pharma,

    // 주유소/오일
    "100600": oil_gas,
    "100185": oil_gas,
    "100177": oil_gas,
    "100176": oil_gas,
    "100323": oil_gas,
    "100381": oil_gas,

    // 증권
    "100151": securities,

    // 친환경
    "100386": eco,
    "100559": eco,
    "100197": eco,
    "100400": eco,
    "100581": eco,
    "100152": eco,

    // 캐릭터
    "100045": character,
    "100128": character,

    // 태양광
    "100191": solar,
    "100188": solar,
    "100595": solar,

    // 통신
    "100126": telecom,
    "100056": telecom,
    "100580": telecom,
    "100373": telecom,
    "100092": telecom,
    "100586": telecom,

    // 플랫폼/콘텐츠
    "100270": platform_content,
    "100232": platform_content,
    "100317": platform_content,
    "100488": platform_content,
    "100059": platform_content,
    "100127": platform_content,
    "100098": platform_content,

    // 항공
    "100166": aviation,
    "100462": aviation,
    "100379": aviation,

    // 화장품
    "100397": cosmetics,
    "100110": cosmetics,
    "100513": cosmetics,
  };

  return themeIconMap[String(themeCode)] || defaultIcon;
}

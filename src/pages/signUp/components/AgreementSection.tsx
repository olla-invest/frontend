// AgreementSection.tsx
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronRight } from "lucide-react";

interface Props {
  agreeService: boolean;
  agreePrivacy: boolean;
  agreeMarketing: boolean;
  error?: string;

  onAllChange: (checked: boolean) => void;
  onChange: (key: "agreeService" | "agreePrivacy" | "agreeMarketing", checked: boolean) => void;
}

export default function AgreementSection({ agreeService, agreePrivacy, agreeMarketing, error, onAllChange, onChange }: Props) {
  const allChecked = agreeService && agreePrivacy && agreeMarketing;
  const baseURL = window.location.origin;

  return (
    <div className="mt-2">
      <div className={`${error && "border-red-500 ring-3 ring-red-100"} p-3 border rounded-md`}>
        {/* 전체 선택 */}
        <div className="pb-2.5 mb-2.5 border-b">
          <div className="flex gap-2">
            <Checkbox id="allAgreed" checked={allChecked} onCheckedChange={(checked) => onAllChange(!!checked)} />
            <Label htmlFor="allAgreed" className="text-sm font-medium">
              약관에 모두 동의
            </Label>
          </div>
        </div>

        {/* 개별 */}
        <div className="flex flex-col gap-2.5">
          <div className="flex gap-2 text-sm items-center">
            <Checkbox id="termsOfServiceAgreed" checked={agreeService} onCheckedChange={(checked) => onChange("agreeService", !!checked)} />
            <Label htmlFor="termsOfServiceAgreed" className="font-normal">
              (필수) 서비스 이용약관 동의
            </Label>
            <ChevronRight strokeWidth={1} className="ml-auto cursor-pointer" onClick={() => window.open(`${baseURL}/policies/terms`)} />
          </div>

          <div className="flex gap-2 text-sm items-center">
            <Checkbox id="privacyPolicyAgreed" checked={agreePrivacy} onCheckedChange={(checked) => onChange("agreePrivacy", !!checked)} />
            <Label htmlFor="privacyPolicyAgreed" className="font-normal">
              (필수) 개인정보 수집·이용 동의
            </Label>
            <ChevronRight strokeWidth={1} className="ml-auto cursor-pointer" onClick={() => window.open(`${baseURL}/policies/privacy`)} />
          </div>

          <div className="flex gap-2 text-sm items-center">
            <Checkbox id="marketingConsentAgreed" checked={agreeMarketing} onCheckedChange={(checked) => onChange("agreeMarketing", !!checked)} />
            <Label htmlFor="marketingConsentAgreed" className="font-normal">
              (선택) 마케팅 정보 수신 동의
            </Label>
            <ChevronRight strokeWidth={1} className="ml-auto cursor-pointer" onClick={() => window.open(`${baseURL}/policies/marketing`)} />
          </div>
        </div>
      </div>

      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}

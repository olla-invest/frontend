import CheckCircle from "@/assets/images/check-circle.png";
import { useNavigate } from "react-router-dom";
export default function SignUpComplete() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4 items-center justify-center">
        <img className="size-16" src={CheckCircle} alt="" />
        <p className="text-center text-sm text-black">
          회원가입이 완료됐어요.
          <br />
          이제 olla와 함께 시작해요!
        </p>
      </div>

      <button type="button" className="bg-[#1E1B4B] text-white text-sm w-full h-10 rounded-md" onClick={() => navigate("/login")}>
        로그인 하러 가기
      </button>
    </div>
  );
}

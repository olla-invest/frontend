import React, { useState } from "react";

import LogoImg from "@/assets/images/olla-logo.svg";
import { useNavigate } from "react-router-dom";
import SignUpStep1 from "./components/SignUpStep1";
import SignUpStep2 from "./components/SignUpStep2";
import SignUpComplete from "./components/SignUpComplete";

const SignUp: React.FC = () => {
  const [signUpStep, setSignUpStep] = useState(1);
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-[320px] mx-auto my-0">
      <div className="py-14">
        {signUpStep !== 3 && (
          <div className="flex justify-center mb-10 cursor-pointer">
            <img
              src={LogoImg}
              alt="olla"
              className="w-22 aspect-auto"
              onClick={() => {
                navigate("/login");
              }}
            />
          </div>
        )}

        {signUpStep === 1 && <SignUpStep1 setSignUpStep={setSignUpStep} />}
        {signUpStep === 2 && <SignUpStep2 setSignUpStep={setSignUpStep} />}
        {signUpStep === 3 && <SignUpComplete />}
      </div>
      {/* 로그인 구현 후 삭제 하기 */}
      <div className="bg-gray-100 rounded-md p-3">
        <span className="block mb-2 text-xs text-muted-foreground">*임시 버튼(기능 추가 후 삭제 예정)</span>
        <button className="bg-gray-600 text-white w-full rounded-sm" onClick={() => navigate("/home")}>
          홈이동
        </button>
      </div>
    </div>
  );
};
export default SignUp;

import React, { useState } from "react";

import LogoImg from "@/assets/images/olla-logo.svg";
import { useNavigate } from "react-router-dom";
import SignUpStep1 from "./components/SignUpStep1";
import SignUpStep2 from "./components/SignUpStep2";
import SignUpComplete from "./components/SignUpComplete";
import type { SignUpParams } from "@/api/auth";

export type ErrorField = "username" | "password" | "email" | "name" | "phone" | "agreeService" | "agreePrivacy";

const SignUp: React.FC = () => {
  const [signUpStep, setSignUpStep] = useState(1);
  const [userData, setUserData] = useState<SignUpParams>({
    username: "",
    password: "",
    email: "",
    name: "",
    phone: "",
    agreeService: false,
    agreePrivacy: false,
    agreeMarketing: false,
  });

  const [errors, setErrors] = useState<Partial<Record<ErrorField, string>>>({});

  const handleUserData = <K extends keyof SignUpParams>(key: K, value: SignUpParams[K]) => {
    setUserData((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[key as ErrorField];
      return newErrors;
    });
  };

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

        {signUpStep === 1 && <SignUpStep1 setSignUpStep={setSignUpStep} userData={userData} handleUserData={handleUserData} errors={errors} setErrors={setErrors} />}
        {signUpStep === 2 && <SignUpStep2 setSignUpStep={setSignUpStep} userData={userData} handleUserData={handleUserData} errors={errors} setErrors={setErrors} />}
        {signUpStep === 3 && <SignUpComplete />}
      </div>
    </div>
  );
};
export default SignUp;

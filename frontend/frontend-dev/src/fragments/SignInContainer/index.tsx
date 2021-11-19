import React from "react";
import { useTranslation } from "react-i18next";
import logo from "../../assets/img/insper.png";

interface ISignInContainerProps {
  children: React.ReactNode;
}

const SignInContainer = ({ children }: ISignInContainerProps) => {
  const { t } = useTranslation();

  return (
    <div className="w-full min-h-screen grid grid-cols-3 bg-gray-100 md:bg-transparent">
      <div className="hidden mb-8 md:col-span-2 md:flex justify-center items-center bg-gray-100 h-full">
        <div className="max-w-2xl p-4">
          <h1 className="text-8xl text-primary mb-4">Developer Life</h1>
          <img src={logo} className="h-16" alt="Insper Logo" />
        </div>
      </div>
      <div className="max-w-xs mx-auto flex flex-col justify-center col-span-3 md:col-span-1">
        <div className="rounded shadow md:shadow-none">
          <h2 className="text-3xl uppercase px-6 py-4 bg-primary text-white rounded-t text-center md:hidden">
            {t("Developer Life")}
          </h2>
          <div className="bg-white px-4 py-4 md:px-6 md:py-6 rounded">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInContainer;

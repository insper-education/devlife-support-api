import React from "react";
import { useTranslation } from "react-i18next";

interface ISignInContainerProps {
  children: React.ReactNode;
}

const SignInContainer = ({ children }: ISignInContainerProps) => {
  const { t } = useTranslation();

  return (
    <div className="w-full min-h-screen px-2 flex flex-col lg:flex-row justify-center lg:justify-around items-center bg-gray-100">
      <div className="hidden md:block mb-8 lg:pr-24">
        <h1 className="text-8xl text-primary mb-4">Developer Life</h1>
        <img
          src="/static/static/img/insper.png"
          className="h-16"
          alt="Insper Logo"
        />
      </div>
      <div className="max-w-xs rounded shadow">
        <h2 className="text-3xl uppercase px-6 py-4 bg-primary text-white rounded-t text-center md:hidden">
          {t("Developer Life")}
        </h2>
        <div className="bg-white px-4 py-4 md:px-6 md:py-6 rounded">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SignInContainer;

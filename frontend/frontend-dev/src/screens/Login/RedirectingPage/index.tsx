import React from "react";
import { useTranslation } from "react-i18next";

interface ReidrectingPageProps {
  redirectTo: string;
}

const RedirectingPage = ({ redirectTo }: ReidrectingPageProps) => {
  const { t } = useTranslation();
  let title = t("Please wait");
  let text = t("we are redirecting you to the requested page");
  if (redirectTo?.indexOf("vscode://") >= 0) {
    title = t("Redirecting");
    text = t('click "Open Visual Studio Code" on the dialog to continue');
  }
  return (
    <div className="flex flex-col justify-center items-center h-screen w-full p-8">
      <h1 className="text-primary text-5xl mb-4">{title}...</h1>
      {text}
    </div>
  );
};

export default RedirectingPage;

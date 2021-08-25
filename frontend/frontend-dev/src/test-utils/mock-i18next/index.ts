import "react-i18next";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (text: string) => text }),
}));

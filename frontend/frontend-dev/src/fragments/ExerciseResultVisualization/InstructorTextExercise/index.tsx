import { useTranslation } from "react-i18next";
import { Table } from "../../../components/Table";
import { IAnswer } from "../../../models/Answer";

interface ITextAnswersProps {
  textAnswers: IAnswer[];
}

export function TextAnswersResults({ textAnswers }: ITextAnswersProps) {
  const { t } = useTranslation();
  return (
    <>
      <p>
        <b>{t("Text answers")}:</b> {textAnswers.length}
      </p>
      <Table
        className="mt-4"
        header={{
          submission_date: t("Submission time"),
          user: t("User"),
          test_results: t("Answer"),
        }}
        data={textAnswers.map((item) => ({
          test_results: item.test_results.text,
          user: item.user,
          submission_date: new Date(item.submission_date).toLocaleString(),
        }))}
      />
    </>
  );
}

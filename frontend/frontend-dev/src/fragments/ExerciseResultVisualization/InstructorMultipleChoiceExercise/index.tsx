import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Doughnut } from "../../../components/Charts";
import { Table } from "../../../components/Table";
import { IAnswer } from "../../../models/Answer";

interface IMultipleChoiceAnswers {
  testsAnswers: IAnswer["test_results"][];
}

export function MultipleChoiceAnswers({
  testsAnswers,
}: IMultipleChoiceAnswers) {
  const { t } = useTranslation();
  const optionsAmount = useMemo(() => {
    let optionsAmount;
    optionsAmount = testsAnswers[0]?.test_results?.num_choices || 0;
    return optionsAmount;
  }, [testsAnswers]);

  // options: A, B, C...
  const [options, selectedOptionsCount] = useMemo(() => {
    const options = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
    options.length = optionsAmount;

    const choices = testsAnswers.map((answer) => {
      return options[answer?.test_results?.choice || 0];
    });

    const selectedOptionsCount: Record<string, number> = {};

    options.forEach((option) => {
      selectedOptionsCount[option] = choices.filter(
        (choice) => choice === option,
      ).length;
    });

    return [options, Object.values(selectedOptionsCount)];
  }, [testsAnswers, optionsAmount]);

  if (!testsAnswers.length) {
    return null;
  }
  return (
    <>
      <p>
        <b>{t("Test answers")}:</b> {testsAnswers.length}
      </p>
      <div className="flex flex-col w-full sm:flex-row">
        <Doughnut options={options} numSelectedOptions={selectedOptionsCount} />
        <Table
          className="mt-4"
          data={testsAnswers.map((answer) => ({
            timestamp: new Date(answer.submission_date).toLocaleString(),
            user: answer.user,
            choice: options[answer.test_results.choice],
          }))}
        />
      </div>
    </>
  );
}

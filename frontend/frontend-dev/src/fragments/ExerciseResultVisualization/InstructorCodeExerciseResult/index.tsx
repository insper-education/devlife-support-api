import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Table } from "../../../components/Table";
import Button from "../../../components/Button";
import { IAnswer } from "../../../models/Answer";
import { CodeVisualizer } from "../../../components/CodeVisualizer";

interface ICode {
  pk: number;
  text: string;
}

interface ICodeResultProps {
  codeAnswers: IAnswer[];
}

export function CodeExerciseResult({ codeAnswers }: ICodeResultProps) {
  const { t } = useTranslation();
  const [code, setCode] = useState<ICode | undefined>();

  function toggleCode(pk: number, text: string) {
    setCode((currentValue) =>
      pk === currentValue?.pk ? undefined : { pk, text },
    );
  }

  return (
    <>
      <p>
        <b>{t("Test answers")}:</b> {codeAnswers.length}
      </p>
      <div className="flex flex-col w-full lg:flex-row py-4">
        {!!codeAnswers.length && (
          <Table
            header={{
              timestamp: t("Submission time"),
              user: t("User"),
              test_results: t("Tests passing"),
              viewCode: "",
            }}
            data={codeAnswers.map((item) => {
              const itemIsSelected = code?.pk === item.pk;
              return {
                ...item,
                test_results: item.test_results.passed,
                timestamp: new Date(item.submission_date).toLocaleString(),
                viewCode: (
                  <Button
                    variant={itemIsSelected ? "secondary" : "primary"}
                    onClick={() => {
                      toggleCode(item.pk, item.student_input.code);
                    }}>
                    {itemIsSelected ? t("Hide code") : t("View code")}
                  </Button>
                ),
              };
            })}
          />
        )}
        {!!codeAnswers.length && !!code && (
          <CodeVisualizer className="flex-1 mt-2 lg:ml-4 lg:mt-0">
            {code.text}
          </CodeVisualizer>
        )}
      </div>
    </>
  );
}

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Table } from "../../../components/Table";
import Button from "../../../components/Button";
import { IAnswer } from "../../../models/Answer";
import { CodeVisualizer } from "../../../components/CodeVisualizer";
import { CodeDiff } from "../../../components/CodeDiff";

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
  const [comparing, setComparing] = useState<ICode[]>([]);

  function toggleCode(pk: number, text: string) {
    setCode((currentValue) =>
      pk === currentValue?.pk ? undefined : { pk, text },
    );
  }

  function selectToCompare(pk: number, text: string) {
    const comparingPks = comparing.map((codePiece) => codePiece.pk);
    if (comparingPks.includes(pk)) {
      return setComparing((prev) =>
        prev.filter((codePiece) => codePiece.pk !== pk),
      );
    }
    setComparing((prev) => {
      if (prev.length == 2) {
        const oldValue = prev[1];
        return [oldValue, { pk, text }];
      }
      return [...prev, { pk, text }];
    });
  }

  return (
    <>
      <p>
        <b>{t("Code answers")}:</b> {codeAnswers.length}
      </p>
      <div className="flex flex-col w-full lg:flex-row py-4">
        {!!codeAnswers.length && (
          <Table
            header={{
              compare: "",
              timestamp: t("Submission time"),
              user: t("User"),
              test_results: t("Tests passing"),
              viewCode: "",
            }}
            data={codeAnswers.map((item) => {
              const itemIsSelected = code?.pk === item.pk;
              const codeText = item.student_input.code;
              const codePk = item.pk;
              const itemIsComparing = comparing
                .map((item) => item.pk)
                .includes(codePk);
              return {
                ...item,
                test_results: item.test_results.passed,
                timestamp: new Date(item.submission_date).toLocaleString(),
                viewCode: (
                  <Button
                    variant={itemIsSelected ? "secondary" : "primary"}
                    onClick={() => {
                      toggleCode(codePk, codeText);
                    }}>
                    {itemIsSelected ? t("Hide code") : t("View code")}
                  </Button>
                ),
                compare: (
                  <label className="cursor-pointer p-3">
                    <input
                      type="checkbox"
                      name="selectedToCompare"
                      className="m-0 p-0 mx-1 align-middle"
                      value={codePk}
                      checked={itemIsComparing}
                      onChange={() => {
                        selectToCompare(codePk, codeText);
                      }}
                    />
                  </label>
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
      {comparing.length == 2 && (
        <CodeDiff
          left={comparing[0].text}
          right={comparing[1].text}
          language="python"
        />
      )}
    </>
  );
}

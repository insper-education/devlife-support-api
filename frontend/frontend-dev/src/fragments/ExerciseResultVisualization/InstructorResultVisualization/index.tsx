import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import Container from "../../../components/Container";
import { dynamicPathname } from "../../../helpers";
import { api } from "../../../services/api";
import { LIST_EXERCISE_ANSWERS } from "../../../services/routes";
import { IAnswer } from "../../../models/Answer";
import { useExerciseContext } from "../../../hooks/useExerciseContext";
import { useCleanupEffect } from "../../../hooks/useCleanupEffect";
import Title from "../../../components/Title";
import { MultipleChoiceAnswers } from "../InstructorMultipleChoiceExercise";
import { CodeExerciseResult } from "../InstructorCodeExerciseResult";
import { TextAnswersResults } from "../InstructorTextExercise";
import { getName, IExercise } from "../../../models/Exercise";

interface IExerciseAnswersParams {
  offering: number;
}

interface ISummary {
  choice: number;
  num_choices: number;
}

function UnmemoizedInstructorResultColumn({
  offering,
}: IExerciseAnswersParams) {
  const { t } = useTranslation();
  const { selectedData } = useExerciseContext();
  const currentExerciseType = selectedData?.type;

  const slug = selectedData?.slug as string | undefined;

  const [answers, setAnswers] = useState<IAnswer[]>([]);

  // should be mutual exclusive?
  const isCode = currentExerciseType === "CODE";
  const isQuiz = currentExerciseType === "QUIZ";
  const isText = currentExerciseType === "TEXT";

  useCleanupEffect(
    (state) => {
      if (offering !== undefined && slug !== undefined) {
        api
          .get<IAnswer[]>(
            dynamicPathname(LIST_EXERCISE_ANSWERS, { offering, slug }),
          )
          .then((res) => {
            if (state.isMounted) {
              setAnswers(res.data || []);
            }
          });
      }
    },
    [slug],
  );

  return (
    <Container>
      <div className="mt-4 fit-content">
        <Title variant={5}>{getName(selectedData as IExercise)}</Title>
      </div>

      <section className="flex flex-col w-full">
        <Title variant={5} className="mb-2">
          {t("Results")}
        </Title>

        {isQuiz && <MultipleChoiceAnswers testsAnswers={answers} />}
        {isCode && <CodeExerciseResult codeAnswers={answers} />}
        {isText && <TextAnswersResults textAnswers={answers} />}
      </section>
    </Container>
  );
}

export const InstructorResultColumn = memo(UnmemoizedInstructorResultColumn);

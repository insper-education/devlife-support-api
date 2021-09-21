import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import Container from "../../components/Container";
import { Table } from "../../components/Table";
import { Bars, Doughnut } from "../../components/Charts";
import Header from "../../fragments/Header";
import { dynamicPathname } from "../../helpers";
import { routes } from "../../routes";
import { api } from "../../services/api";
import { LIST_EXERCISE_ANSWERS } from "../../services/routes";
import Button from "../../components/Button";

interface IExerciseAnswersParams {
  offering: string;
  slug: string;
}

interface ISummary {
  choice: number;
  num_choices: number;
}
interface IAnswer {
  pk: number;
  user: number;
  exercise: number;
  points: number;
  submission_date: string;
  summary?: ISummary;
  long_answer?: string;
}

function ExerciseAnswers() {
  const { t } = useTranslation();
  const { offering, slug } = useParams<IExerciseAnswersParams>();
  const [answers, setAnswers] = useState<IAnswer[]>([]);

  const textAnswers = useMemo(() => {
    return answers
      .filter((answer) => typeof answer.long_answer === "string")
      .map((answer) => ({
        timestamp: answer.submission_date,
        summary: answer.summary,
        long: answer.long_answer,
      }));
  }, [answers]);

  const testsAnswers = useMemo(() => {
    return answers
      .filter((answer) => !!(typeof answer.summary !== "string"))
      .map((answer) => answer.summary);
  }, [answers]);

  useEffect(() => {
    let isMounted = true; // prevent memory leak

    api
      .get<IAnswer[]>(
        dynamicPathname(LIST_EXERCISE_ANSWERS, { offering, slug })
      )
      .then((res) => {
        if (isMounted) {
          setAnswers(res.data || []);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const optionsAmount = useMemo(() => {
    let optionsAmount;
    optionsAmount = testsAnswers[0]?.num_choices || 0;
    return optionsAmount;
  }, [testsAnswers]);

  // options: A, B, C...
  const [options, selectedOptionsCount] = useMemo(() => {
    const options = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
    options.length = optionsAmount;

    const choices = testsAnswers.map((answer) => options[answer?.choice || 0]);

    const selectedOptionsCount: Record<string, number> = {};
    options.forEach((option) => {
      selectedOptionsCount[option] = choices.filter(
        (choice) => choice === option
      ).length;
    });
    return [options, Object.values(selectedOptionsCount)];
  }, [testsAnswers, optionsAmount]);

  return (
    <Container>
      <Header />

      <Link
        to={routes.INSTRUCTOR_HOME}
        className="bg-gray-100 text-blue-500 px-4 py-2">
        <b>{t("Go back")}</b>
      </Link>

      <div className="my-4 p-4 fit-content">
        <p className="mr-4">
          <b>{t("Offering")}:</b> {offering}
        </p>
        <p className="mr-4">
          <b>{t("Exercise slug")}:</b> {slug}
        </p>
        <p>
          <b>{t("Multiple choices answers")}:</b> {testsAnswers.length}
        </p>
        <p>
          <b>{t("Text answers")}:</b> {textAnswers.length}
        </p>
      </div>

      {!!testsAnswers.length && (
        <Doughnut options={options} numSelectedOptions={selectedOptionsCount} />
      )}

      {!!textAnswers.length && (
        <Table
          data={textAnswers.map((answer) => ({
            [t("Submission time")]: new Date(answer.timestamp).toLocaleString(),
            [t("Summary")]: answer.summary,
            [t("Long answer")]: (
              <Button
                variant="primary"
                onClick={() => {
                  console.log(answer.long);
                }}>
                click me
              </Button>
            ),
          }))}
        />
      )}
    </Container>
  );
}

export default ExerciseAnswers;

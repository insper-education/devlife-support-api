import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import Container from "../../components/Container";
import { AnswersChart } from "../../fragments/AnswersChart";
import Header from "../../fragments/Header";
import { dynamicPathname } from "../../helpers";
import { routes } from "../../routes";
import { api } from "../../services/api";
import { LIST_EXERCISE_ANSWERS } from "../../services/routes";

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
        long: answer.long_answer
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
        <Container className="bg-gray-100 py-3 rounded flex flex align-center justify-center">
          <AnswersChart
            options={options}
            selectedOptionsCount={selectedOptionsCount}
          />
        </Container>
      )}

      {!!textAnswers.length && (
        <Container>
          <table className="bg-gray-100 table-auto border-separate text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-3">{t("Submission time")}</th>
                <th className="border p-3">{t("Answer")}</th>
                <th className="border p-3">{t("Long answer")}</th>
              </tr>
            </thead>

            <tbody className="striped">
              {textAnswers.map((answer, index) => (
                <tr
                  key={"textAnswers__" + index}
                  style={{
                    backgroundColor:
                      index % 2
                        ? "rgba(209, 213, 219, var(--tw-bg-opacity)"
                        : "transparent"
                  }}>
                  <td className="border p-3">
                    {new Date(answer.timestamp).toLocaleString()}
                  </td>
                  <td className="border p-3">{String(answer.summary)}</td>
                  <td className="border p-3">{String(answer.long)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Container>
      )}
    </Container>
  );
}

export default ExerciseAnswers;

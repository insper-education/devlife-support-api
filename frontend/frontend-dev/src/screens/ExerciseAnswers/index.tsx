import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import Container from "../../components/Container";
import { useUser } from "../../contexts/user-context";
import Header from "../../fragments/Header";
import { dynamicPathname } from "../../helpers";
import { routes } from "../../routes";

interface IExerciseAnswersParams {
  off_id: string;
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
  long_answer?: any;
}

function ExerciseAnswers() {
  const { t } = useTranslation();
  const { off_id: offering, slug } = useParams<IExerciseAnswersParams>();
  const [answers, setAnswers] = useState<IAnswer[]>([]);
  const { user } = useUser();

  useEffect(() => {
    let isMounted = true; // prevent memory leak

    if (user?.token) {
      const answersEndpoint =
        "/api/offerings/:offering/exercises/:slug/answers/";
      const endpoint = dynamicPathname(answersEndpoint, { offering, slug });

      axios
        .get<IAnswer[]>(endpoint, {
          headers: { Authorization: `Token ${user.token}` }
        })
        .then((res) => {
          if (isMounted) {
            setAnswers(res.data || []);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const [answersAmount, optionsAmount] = useMemo(() => {
    let optionsAmount;
    optionsAmount = answers[0]?.summary?.num_choices || 0;
    return [answers.length, optionsAmount];
  }, [answers]);

  const [options, choicesAmount] = useMemo(() => {
    const alfa = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const options: string[] = [];
    for (let i = 0; i < optionsAmount; i++) {
      options.push(alfa[i]);
    }
    const choices = answers.map(
      (answer) => options[answer.summary?.choice || 0]
    );
    const choicesAmount: Record<string, number> = {};
    options.forEach((option) => {
      choicesAmount[option] = choices.filter(
        (choice) => choice === option
      ).length;
    });
    console.log(choicesAmount);
    return [options, Object.values(choicesAmount)];
  }, [answers, optionsAmount]);

  const randomColor = useCallback((lowOpacity = false) => {
    let color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    if (lowOpacity) {
      color += Math.floor(Math.random() * 255).toString(16);
    }
    return color;
  }, []);

  const data = {
    labels: options,
    datasets: [
      {
        label: "# of answers",
        data: choicesAmount,
        backgroundColor: [
          "#ff638433",
          "#36a2eb33",
          "#ffce5633"
        ],
        borderColor: [
          "#ff6384",
          "#36a2eb",
          "#ffce56"
        ],
        borderWidth: 2
      }
    ]
  };
  return (
    <Container>
      <Header />

      <Link
        to={routes.INSTRUCTOR_HOME}
        className="bg-gray-100 text-blue-500 px-4 py-2"
      >
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
          <b>{t("Multiple choices answers")}:</b> {answers.length}
        </p>
      </div>

      <div style={{ height: 300, width: 300 }}>
        <Doughnut data={data} />
      </div>
    </Container>
  );
}

export default ExerciseAnswers;

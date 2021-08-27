import axios from "axios";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../components/Button";
import Container from "../../components/Container";
import { useUser } from "../../contexts/user-context";
import { Answer } from "../../models/Answer";
import { getExerciseAnswerList } from "../../services/exercises";

interface ExerciseDetailsProps {
  offering: number;
  slug: string;
}

const ExerciseDetails = ({ offering, slug }: ExerciseDetailsProps) => {
  const [numSubmissions, setNumSubmissions] = useState<number>(0);
  const [lastRefresh, setLastRefresh] = useState<Date>();
  const { t } = useTranslation();
  const { user } = useUser();
  const token = user?.token || "";

  const handleDetails = () => {
    getExerciseAnswerList(offering, slug, token).then((answerList) => {
      setNumSubmissions(answerList.length);
    });
    setLastRefresh(new Date());
  };

  return (
    <Container className="bg-gray-100 p-4 m-4 flex">
      <div className="flex-grow">
        <p> {slug} </p>
        {!!lastRefresh && (
          <p>
            {" "}
            {numSubmissions} {t("were sent before")}{" "}
            {lastRefresh?.toLocaleString()}{" "}
          </p>
        )}
      </div>
      <Button onClick={handleDetails}>{t("Reload")}</Button>
    </Container>
  );
};

export default ExerciseDetails;

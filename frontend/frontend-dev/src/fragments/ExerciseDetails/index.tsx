import axios from "axios";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../components/Button";
import Container from "../../components/Container";
import { useUser } from "../../contexts/user-context";
import { Answer } from "../../models/Answer";
import { getAnswerSummaryList } from "../../services/exercises";

interface ExerciseDetailsProps {
  offering: number;
  slug: string;
}

const ExerciseDetails = ({ offering, slug }: ExerciseDetailsProps) => {
  const [numSubmissions, setNumSubmissions] = useState<number>(0);
  const [numUniqueUsers, setNumUniqueUsers] = useState<number>(0);
  const [lastRefresh, setLastRefresh] = useState<Date>();
  const { t } = useTranslation();
  const { user } = useUser();
  const token = user?.token || "";

  const handleDetails = () => {
    getAnswerSummaryList(offering, slug, token).then((answerSummariesList) => {
      setNumUniqueUsers(answerSummariesList.length);
      setNumSubmissions(
        answerSummariesList
          .map((answerSummary) => answerSummary.answer_count)
          .reduce((a, b) => a + b, 0),
      );
    });
    setLastRefresh(new Date());
  };

  return (
    <Container className="bg-gray-100 p-4 my-4 flex">
      <div className="flex-grow">
        <p> {slug} </p>
        {!!lastRefresh && (
          <p>
            {t("submissions sent before", {
              total: numSubmissions,
              users: numUniqueUsers,
              lastUpdate: lastRefresh?.toLocaleString(),
            })}
          </p>
        )}
      </div>
      <Button onClick={handleDetails}>{t("Reload")}</Button>
    </Container>
  );
};

export default ExerciseDetails;

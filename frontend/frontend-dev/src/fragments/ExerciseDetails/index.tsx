import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../components/Button";
import Container from "../../components/Container";
import { useUser } from "../../contexts/user-context";
import { useSummaryListForExercise } from "../../services/exercises";

interface ExerciseDetailsProps {
  offering: number;
  slug: string;
}

const ExerciseDetails = ({ offering, slug }: ExerciseDetailsProps) => {
  const { user } = useUser();
  const token = user?.token || "";
  const {
    summaryList,
    loading,
    refresh: refreshSummaryList,
  } = useSummaryListForExercise(offering, slug, token);

  const { t } = useTranslation();

  const [numSubmissions, setNumSubmissions] = useState<number>(0);
  const [numUniqueUsers, setNumUniqueUsers] = useState<number>(0);
  const [lastRefresh, setLastRefresh] = useState<Date>();
  useEffect(() => {
    if (loading) return;
    setNumUniqueUsers(summaryList.length);
    setNumSubmissions(
      summaryList
        .map((answerSummary) => answerSummary.answer_count)
        .reduce((a, b) => a + b, 0),
    );
    setLastRefresh(new Date());
  }, [loading, summaryList]);

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
      <Button onClick={refreshSummaryList}>{t("Reload")}</Button>
    </Container>
  );
};

export default ExerciseDetails;

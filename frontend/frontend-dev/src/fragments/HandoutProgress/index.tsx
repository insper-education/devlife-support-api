import React from "react";
import { Exercise } from "../../models/Exercise";
import { User } from "../../models/User";
import {
  conclusionPercent,
  useAnswerSummaries,
} from "./HandoutProgress.services";

interface HandoutProgressProps {
  offering: number;
  user: User;
  url: string;
  exercises: Exercise[];
}

const HandoutProgress = ({
  offering,
  user,
  url,
  exercises,
}: HandoutProgressProps) => {
  const { summaries } = useAnswerSummaries(offering, user, exercises);
  return (
    <div className="flex justify-between max-w-lg">
      <span>{url}</span>
      <span>{conclusionPercent(summaries, exercises.length)}%</span>
    </div>
  );
};

export default HandoutProgress;

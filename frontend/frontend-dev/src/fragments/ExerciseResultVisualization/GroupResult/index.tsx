import React from "react";
import ProgressCheck from "../../../components/ProgressCheck";
import Title from "../../../components/Title";
import { IExerciseGroups } from "../../../models/Exercise";
import { ICompletionRates } from "../service";

interface IGroupResultProps {
  group: IExerciseGroups;
  completionRates: ICompletionRates;
}

const GroupResult = ({ group, completionRates }: IGroupResultProps) => {
  const groupName = Object.keys(group)[0];
  return (
    <>
      <Title variant={5} className="px-4 mt-2">
        {groupName}
      </Title>
      <div className="px-4 mt-4">
        <ProgressCheck progress={completionRates[groupName] || 0} />
      </div>
    </>
  );
};

export default GroupResult;

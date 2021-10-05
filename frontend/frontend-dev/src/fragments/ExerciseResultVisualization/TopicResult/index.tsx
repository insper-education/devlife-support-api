import React from "react";
import ProgressCheck from "../../../components/ProgressCheck";
import Title from "../../../components/Title";
import { ITopicContentExercises } from "../../../models/Exercise";
import { ICompletionRates } from "../service";

interface ITopicResultProps {
  topic: ITopicContentExercises;
  completionRates: ICompletionRates;
}

const TopicResult = ({ topic, completionRates }: ITopicResultProps) => {
  const topicName = Object.keys(topic)[0];
  return (
    <>
      <Title variant={5} className="px-4 mt-2">
        {topicName}
      </Title>
      <div className="px-4 mt-4">
        <ProgressCheck progress={completionRates[topicName] || 0} />
      </div>
    </>
  );
};

export default TopicResult;

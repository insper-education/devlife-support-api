import React from "react";
import ProgressCheck from "../../../components/ProgressCheck";
import Title from "../../../components/Title";
import { ICompletionRates } from "../service";

interface IColumnProps {
  title: string;
  options: string[];
  completionRates: ICompletionRates;
  selectedRow: number;
  onSelect?: (option: string, index: number) => void;
}

const Column = ({
  options,
  onSelect,
  title,
  completionRates,
  selectedRow,
}: IColumnProps) => {
  const handleClick = (idx: number) => {
    onSelect && onSelect(options[idx], idx);
  };

  return (
    <div className="border border-gray-200 py-2 overflow-hidden">
      <Title variant={5} className="px-4 mt-2">
        {title}
      </Title>
      <ul className="mt-4">
        {options.map((option, idx) => (
          <li
            key={`option-${option}-${idx}`}
            onClick={() => handleClick(idx)}
            className={`flex items-center cursor-pointer px-4 py-1 ${
              idx === selectedRow ? "bg-primary-50" : ""
            }`}>
            <div className="min-w-min mr-2">
              <ProgressCheck
                className="w-6 h-6"
                progress={completionRates[option]}
              />
            </div>
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Column;

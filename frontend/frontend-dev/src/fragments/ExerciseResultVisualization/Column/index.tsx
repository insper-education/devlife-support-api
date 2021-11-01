import React, { memo } from "react";
import ProgressCheck from "../../../components/ProgressCheck";
import Title from "../../../components/Title";
import { ICompletionRates } from "../service";

interface IColumnProps {
  title: string;
  options: string[];
  className?: string;
  completionRates: ICompletionRates;
  selectedRow: number;
  onSelect?: (option: string, index: number) => void;
}

const UnmemoizedColumn = ({
  options,
  onSelect,
  title,
  className,
  completionRates,
  selectedRow,
}: IColumnProps) => {
  const handleClick = (idx: number) => {
    onSelect && onSelect(options[idx], idx);
  };

  return (
    <div
      className={`flex flex-col border border-gray-200 py-2 pb-0 overflow-hidden h-full compact-scrollbar box-border ${
        className ?? ""
      }`}>
      <Title variant={5} className="px-4 mt-2">
        {title}
      </Title>
      <div className="flex flex-1 overflow-auto w-full ">
        <ul className="flex flex-col py-4 w-full min-w-max">
          {options.map((option, idx) => (
            <li
              key={`option-${option}-${idx}`}
              onClick={() => handleClick(idx)}
              className={`flex items-center cursor-pointer px-4 py-1 w-auto ${
                idx === selectedRow ? "bg-primary-50" : ""
              }`}>
              <div className="min-w-min mr-2">
                <ProgressCheck
                  className="w-6 h-6"
                  progress={completionRates[option]}
                />
              </div>
              <span className="whitespace-nowrap">{option}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default memo(UnmemoizedColumn);

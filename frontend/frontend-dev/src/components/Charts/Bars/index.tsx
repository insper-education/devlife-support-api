import { memo } from "react";
import { Bar as BarChartJS } from "react-chartjs-2";

interface IProps {
  title?: string;
  options: string[];
  numSelectedOptions: number[];
}

function UnmemoizedBarChart({ options, numSelectedOptions, title }: IProps) {
  const data = {
    labels: options,
    datasets: [
      {
        label: title ?? "Histogram of answers",
        data: numSelectedOptions,
        backgroundColor: [
          "#ff638433",
          "#76f25d33",
          "#36a2eb33",
          "#ffce5633",
          "#765df233",
          "#21fcf233",
          "#ff9f4033",
        ],
        borderColor: [
          "#ff6384",
          "#76f25d",
          "#36a2eb",
          "#ffce56",
          "#765df2",
          "#21fcf2",
          "#ff9f40",
        ],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="min-h-full max-w-1/3">
      <BarChartJS data={data} options={{ maintainAspectRatio: false }} />
    </div>
  );
}

export const Bars = memo(UnmemoizedBarChart);

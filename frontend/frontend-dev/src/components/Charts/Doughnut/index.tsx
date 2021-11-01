import { memo } from "react";
import { Doughnut as DoughnutChartJS } from "react-chartjs-2";

interface IProps {
  options: string[];
  numSelectedOptions: number[];
}

function UnmemoizedDoughnutChart({ options, numSelectedOptions }: IProps) {
  const data = {
    labels: options,
    datasets: [
      {
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
    <div className="w-64">
      <DoughnutChartJS data={data} options={{ maintainAspectRatio: true }} />
    </div>
  );
}

export const Doughnut = memo(UnmemoizedDoughnutChart);

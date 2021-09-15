import { memo, useMemo } from "react";
import { Bar, Doughnut } from "react-chartjs-2";

interface IAnswersChartProps {
  title?: string;
  options: string[];
  selectedOptionsCount: number[];
}

// docs for customisation: https://github.com/reactchartjs/react-chartjs-2
function UnmemoizedAnswersChart({
  title,
  options,
  selectedOptionsCount
}: IAnswersChartProps) {
  const data = useMemo(() => {
    return {
      labels: options,
      datasets: [
        {
          label: "# of answers",
          data: selectedOptionsCount,
          backgroundColor: [
            "#ff638433",
            "#76f25d33",
            "#36a2eb33",
            "#ffce5633",
            "#765df233",
            "#21fcf233",
            "#ff9f4033"
          ],
          borderColor: [
            "#ff6384",
            "#76f25d",
            "#36a2eb",
            "#ffce56",
            "#765df2",
            "#21fcf2",
            "#ff9f40"
          ],
          borderWidth: 2
        }
      ]
    };
  }, [options, selectedOptionsCount]);

  return (
    <div className="flex flex-cols align-center justify-center">
      <div style={{ maxHeight: 300 }}>
        <Doughnut data={data} />
      </div>

      <div style={{ width: 500 }}>
        <Bar data={data} options={{ maintainAspectRatio: false }} />
      </div>
    </div>
  );
}

export const AnswersChart = memo(UnmemoizedAnswersChart);

import { Line } from "react-chartjs-2";
import { Bot, ActiveMessage } from "../../../utils/types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  lineChartDate: number;
  datas: ActiveMessage[];
  botNames: Bot[];
}

interface DataSet {
  [key: string]: number[];
}

const LineChart = (props: LineChartProps) => {
  const { lineChartDate, datas, botNames } = props;

  const generateDateLabels = (): string[] => {
    const labels: string[] = [];
    const today = new Date();
    for (let i = lineChartDate; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      labels.push(date.toLocaleDateString());
    }
    return labels;
  };

  const processData = (): DataSet => {
    const labels = generateDateLabels();
    const data: DataSet = {};

    if (Array.isArray(botNames) && botNames.length > 0) {
      botNames.forEach(bot => {
        data[bot.name] = Array.from({ length: labels.length }, () => 0);
      });

      datas.forEach(entry => {
        const timestamp = new Date(entry.timestamp);
        const dateIndex = labels.findIndex(label => label === timestamp.toLocaleDateString());
        if (dateIndex !== -1) {
          const bot = botNames.find(bot => bot.id === entry.bot as unknown as number);
          if (bot && !data[bot.name][dateIndex]) {
            data[bot.name][dateIndex]++;
          }
        }
      });
    }
    return data;
  };

  const generateRandomColor = (): string => {
    const r = Math.floor(Math.random() * 150) + 100;
    const g = Math.floor(Math.random() * 150) + 100;
    const b = Math.floor(Math.random() * 150) + 100;
    return `rgb(${r}, ${g}, ${b})`;
  };

  const data = {
    labels: generateDateLabels(),
    datasets: Array.isArray(botNames) && botNames.length > 0 ? botNames.map(bot => ({
      label: bot.name,
      backgroundColor: generateRandomColor(),
      data: processData()[bot.name],
    })) : [],
  };

  return (
    <div>
      <Line style={{ marginTop: "10px", width: '50vw' }} data={data} />
    </div>
  );
};

export default LineChart;
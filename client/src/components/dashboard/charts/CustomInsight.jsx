import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const CustomerInsightsChart = ({ data }) => {
  return <Pie data={data} />;
};

export default CustomerInsightsChart;

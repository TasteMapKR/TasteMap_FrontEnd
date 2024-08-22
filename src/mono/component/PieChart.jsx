import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement, // Ensure ArcElement is imported
  Tooltip,
  Legend,
} from 'chart.js';

// Register the necessary components with Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ feedbackData }) => {
  if (!feedbackData || (feedbackData.positive === 0 && feedbackData.negative === 0)) {
    return <p>피드백이 없습니다.</p>;
  }

  const data = {
    labels: ['긍정적', '부정적'],
    datasets: [
      {
        label: '피드백',
        data: [feedbackData.positive, feedbackData.negative],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.label + ': ' + tooltipItem.raw;
          },
        },
      },
    },
  };

  return (
    <div className="pie-chart-stats-container">
      <div className="pie-chart-box">
        <h3>피드백 비율</h3>
        <div className="pie-chart">
          <Pie data={data} options={options} />
        </div>
      </div>
      <div className="feedback-stats">
        <p className="positive">긍정적: {feedbackData.positive}</p>
        <p className="negative">부정적: {feedbackData.negative}</p>
      </div>
    </div>
  );
};

export default PieChart;



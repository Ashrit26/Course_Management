import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CoursePlanAheadGraph = ({ data }) => {
  const chartData = {
    labels: [],
    datasets: [{
      label: 'Plan Ahead',
      data: [],
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    }]
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Plan Ahead Days'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Plan Ahead Days by Course, Instructor, and Semester'
      },
    },
    responsive: true,
    maintainAspectRatio: false
  };

  data.forEach(item => {
    // Construct the label using Course, Instructor, Semester, and Year
    const label = `${item.Course} (${item.Instructor}, ${item.Semester})`;
  
    // Check if 'Plan Ahead' exists and is a number; if not, default to 0
    const planAheadValue = typeof item['Plan Ahead'] === 'number' ? item['Plan Ahead'] : 0;
  
    // Push the label and corresponding Plan Ahead value into the chart data
    chartData.labels.push(label);
    chartData.datasets[0].data.push(planAheadValue);
  });

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default CoursePlanAheadGraph;

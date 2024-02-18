import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const aggregateDataByInstructor = (data) => {
  const instructorData = {};

  data.forEach((item) => {
    const instructor = item.Instructor;
    // Ensure the 'Plan Ahead' value is correctly extracted and is a number; if not, default to 0
    const planAheadValue = typeof item['Plan Ahead'] === 'number' ? item['Plan Ahead'] : 0;

    if (instructorData[instructor]) {
      instructorData[instructor].totalPlanAhead += planAheadValue;
      instructorData[instructor].count += 1;
    } else {
      instructorData[instructor] = {
        totalPlanAhead: planAheadValue,
        count: 1,
      };
    }
  });

  return Object.keys(instructorData).map((instructor) => ({
    instructor,
    averagePlanAhead: instructorData[instructor].totalPlanAhead / instructorData[instructor].count,
  }));
};

const InstructorPopularityGraph = ({ data }) => {
  const processedData = aggregateDataByInstructor(data);

  const chartData = {
    labels: processedData.map(item => item.instructor),
    datasets: [{
      label: 'Average Plan Ahead Days',
      data: processedData.map(item => item.averagePlanAhead),
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    }]
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Average Plan Ahead Days'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Professor Popularity by Average Plan Ahead Days'
      },
    },
    responsive: true,
    maintainAspectRatio: false
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default InstructorPopularityGraph;

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import Papa from 'papaparse';

const MyGraph = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    fetch('/Combined.csv')
      .then(response => response.text())
      .then(csvString => {
        const result = Papa.parse(csvString, {
          header: true,
          skipEmptyLines: true,
        });

        const aggregatedData = result.data.reduce((acc, row) => {
            const semester = row.Semester;
            if (row['Seats Remaining']) { 
              const seatsInfo = row['Seats Remaining'].split(' of ');
              const filled = parseInt(seatsInfo[0]);
              const total = parseInt(seatsInfo[1].split(' ')[0]);
          
              if (!acc[semester]) {
                acc[semester] = { filledSeats: 0, totalSeats: 0 };
              }
          
              acc[semester].filledSeats += filled;
              acc[semester].totalSeats += total;
            }
          
            return acc;
          }, {});

        const labels = Object.keys(aggregatedData);
        const filledSeatsData = labels.map(label => aggregatedData[label].filledSeats);
        const totalSeatsData = labels.map(label => aggregatedData[label].totalSeats - aggregatedData[label].filledSeats);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Seats Filled',
              data: filledSeatsData,
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
              label: 'Seats Available',
              data: totalSeatsData,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
            }
          ],
        });
      });
  }, []);

  const options = {
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      }
    }
  };

  return (
    <div>
      <h2>Seats Distribution by Semester</h2>
      {chartData.datasets ? <Bar data={chartData} options={options} /> : <p>Loading data...</p>}
    </div>
  );
  
};

export default MyGraph;

import { Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { getWeatherData } from '../Backend/Graphql_helper';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the scales
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


export default function RainGraph() {
  const [weatherData, setWeatherData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await getWeatherData();
      setWeatherData(response.data.weather_data);
    } catch (err) {
      console.error('Failed to fetch weather data', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const chart = new ChartJS('myChart', {
      type: 'bar',
      data: data,
      options: options
    });
  
    return () => {
      chart.destroy();
    };
  }, []);

  const convertUnixToCST = unixTimestamp => {
    const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
    const options = {
      timeZone: 'America/Chicago',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return date.toLocaleString('en-US', options);
  };
  

  const data = {
    labels: weatherData.map((dataPoint) => convertUnixToCST(dataPoint.ts)),
    datasets: [
      {
        label: 'Rainfall',
        data: weatherData.map((dataPoint) => dataPoint.rain_15_min_inches),
        backgroundColor: '#00008B',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Bar Chart',
      },
    },
  };

  return <Bar options={options} data={data} />;
}

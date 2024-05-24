import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getWeatherData } from '../Backend/Graphql_helper';
import { theme } from '@chakra-ui/react';

// Register the necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

// Function to create gradient for the chart
function createGradient(ctx, area) {
  const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
  gradient.addColorStop(0, 'red');
  gradient.addColorStop(0.33, 'orange');
  gradient.addColorStop(0.66, 'yellow');
  gradient.addColorStop(1, 'green');
  return gradient;
}

export default function HumidityGraph() {
  const [weatherData, setWeatherData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});

  // Function to fetch weather data
  const fetchData = async () => {
    try {
      const response = await getWeatherData();
      setWeatherData(response.data.weather_data);
    } catch (err) {
      console.error('Failed to fetch weather data', err);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Function to convert UNIX timestamp to CST
  const convertUnixToCST = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
    const options = {
      timeZone: 'America/Chicago',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return date.toLocaleString('en-US', options);
  };

  // Update chart data and options when weather data changes
  useEffect(() => {
    if (weatherData.length === 0) {
      return;
    }

    // Create a temporary canvas to get the gradient context
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    const area = { top: 0, bottom: 1 }; // Dummy area to create the gradient

    const humidityData = weatherData.map((dataPoint) => dataPoint.percent_humidity);
    const maxHumidity = Math.max(...humidityData);
    const minHumidity = Math.min(...humidityData);

    const newData = {
      labels: weatherData.map((dataPoint) => convertUnixToCST(dataPoint.ts)),
      datasets: [
        {
          label: 'Humidity',
          data: humidityData,
          borderColor: createGradient(ctx, area),
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          fill: true,
          tension: .1,
          pointRadius: 0,
        },
      ],
    };

    const newOptions = {
      responsive: true,
      scales: {
        y: {
          min: minHumidity - 1,
          max: maxHumidity + 1,
        },
      },
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Humidity Over Time',
        },
      },
    };

    setChartData(newData);
    setChartOptions(newOptions);
  }, [weatherData]);

  // Ensure chartData and chartOptions are defined before rendering the chart
  if (!chartData || !chartOptions) {
    return <div>Loading...</div>;
  }

  return <Line data={chartData} options={chartOptions} />;
}

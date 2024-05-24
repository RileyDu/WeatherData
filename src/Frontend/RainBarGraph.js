import { Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { getWeatherData } from '../Backend/Graphql_helper';
import { theme } from '@chakra-ui/react';

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
  
  const getBackgroundColor = (value) => {
    if (value > 0.05) {
      return theme.colors.blue[900];
    } else if (value > 0.04) {
      return theme.colors.blue[800];
    } else if (value > 0.03) {
      return theme.colors.blue[700];
    } else if (value > 0.02) {
      return theme.colors.blue[600];
    } else if (value > 0.01) {
      return theme.colors.blue[500];
    } else if (value > 0.5) {
      return theme.colors.blue[400];
    } else {
      return theme.colors.blue[300];
    }
  };

  const rainfallData = weatherData.map((dataPoint) => dataPoint.rain_15_min_inches);
  const maxRainfall = Math.max(...rainfallData);
  const minRainfall = Math.min(...rainfallData);

  const data = {
    labels: weatherData.map((dataPoint) => convertUnixToCST(dataPoint.ts)),
    datasets: [
      {
        label: 'Rainfall',
        data: weatherData.map((dataPoint) => dataPoint.rain_15_min_inches),
        backgroundColor: weatherData.map((dataPoint) => getBackgroundColor(dataPoint.rain_15_min_inches)),
      },
    ],
  };
  const options = {
    responsive: true,
    scales: {
      y: {
        min: minRainfall,
        max: maxRainfall + 0.01,
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Rainfall Over The Past Hour',
      },
    },
  };

  return <Bar options={options} data={data} />;
}

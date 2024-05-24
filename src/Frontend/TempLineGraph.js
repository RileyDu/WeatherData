import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { getWeatherData } from '../Backend/Graphql_helper';
import { theme } from '@chakra-ui/react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register the scales and elements
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function TemperatureGraph() {
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

  const convertUnixToCST = unixTimestamp => {
    const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
    const options = {
      timeZone: 'America/Chicago',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return date.toLocaleString('en-US', options);
  };

  const getBackgroundColor = (temperature) => {
    if (temperature >= 30) {
      return "red"; // Hot temperatures
    } else if (temperature >= 25) {
      return "orange"; // Warm temperatures
    } else if (temperature >= 20) {
      return "yellow"; // Mild temperatures
    } else if (temperature >= 15) {
      return "yellowgreen"; // Cool temperatures
    } else {
      return "green"; // Cold temperatures
    }
  };

  const temperatureData = weatherData.map((dataPoint) => dataPoint.temperature);
  const maxTemp = Math.max(...temperatureData);
  const minTemp = Math.min(...temperatureData);

  const data = {
    labels: weatherData.map((dataPoint) => convertUnixToCST(dataPoint.ts)),
    datasets: [
      {
        label: 'Temperature',
        data: weatherData.map((dataPoint) => dataPoint.temperature),
        borderColor: weatherData.map((dataPoint) => getBackgroundColor(dataPoint.temperature)),
        backgroundColor: weatherData.map((dataPoint) => getBackgroundColor(dataPoint.temperature)),
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        min: minTemp - .1,
        max: maxTemp + .1,
        title: {
          display: true,
          text: 'Temperature (°C)',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Temperature Over The Past Hour',
      },
    },
  };

  return <Line options={options} data={data} />;
}


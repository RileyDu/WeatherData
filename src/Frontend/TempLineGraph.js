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
  
    if (temperature >= 95) {
      return theme.colors.red[800]; 
    } else if (temperature >= 89.6) {
      return theme.colors.orange[800];
    } else if (temperature >= 86) {
      return theme.colors.orange[400];
    } else if (temperature >= 80.6) {
      return theme.colors.yellow[300];
    } else if (temperature >= 75.2) {
      return theme.colors.yellow[400];
    } else if (temperature >= 69.8) {
      return theme.colors.green[300]
    } else if (temperature >= 64.4) {
      return theme.colors.green[400];
    } else if (temperature >= 59) {
      return theme.colors.blue[800];
    } else {
      return "blue.400";
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
          text: 'Temperature (°F)',
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


import { Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { getWeatherData } from '../Backend/Graphql_helper';
import { theme } from '@chakra-ui/react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function TempBarGraph() {
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

  const convertUnixToCST = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000);
    const options = {
      timeZone: 'America/Chicago',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return date.toLocaleString('en-US', options);
  };

  const getBackgroundColor = (temperature) => {
    if (temperature >= 95) return theme.colors.red[800];
    if (temperature >= 89.6) return theme.colors.red[500];
    if (temperature >= 86) return theme.colors.orange[500];
    if (temperature >= 80.6) return theme.colors.yellow[500];
    if (temperature >= 75.2) return theme.colors.yellow[200];
    if (temperature >= 69.8) return theme.colors.green[300];
    if (temperature >= 64.4) return theme.colors.green[600];
    if (temperature >= 59) return theme.colors.green[900];
    if (temperature >= 53.6) return theme.colors.teal[500];
    if (temperature >= 48.2) return theme.colors.blue[300];
    if (temperature >= 42.8) return theme.colors.blue[500];
    if (temperature >= 37.4) return theme.colors.blue[700];
    if (temperature >= 32) return theme.colors.blue[900];
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
        backgroundColor: weatherData.map((dataPoint) => getBackgroundColor(dataPoint.temperature)),
        borderColor: 'black',
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        min: minTemp - 5,
        max: maxTemp + 5,
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Temperature (Fahrenheit)',
      },
    },
  };

  return <Bar data={data} options={options} />;
}

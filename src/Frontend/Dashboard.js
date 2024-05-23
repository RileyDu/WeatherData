// Libraries import
import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Button, useDisclosure, Grid, GridItem, Divider } from '@chakra-ui/react';

// Files import
import { getWeatherData, editWeatherData } from '../Backend/Graphql_helper';
import WeatherEditModal from './WeatherEditModal';


const Dashboard = () => {
  // Creating an empty state for Data from Devii
  const [weatherData, setWeatherData] = useState([]);
  const [selectedWeather, setSelectedWeather] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Utility function to convert Unix timestamp to CST
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

  // Fetching data
  const fetchData = async () => {
    try {
      const response = await getWeatherData();
      setWeatherData(response.data.weather_data);
    } catch (err) {
      console.error('Failed to fetch weather data', err);
    }
  };

  // Runs fetchData on load
  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = weather => {
    setSelectedWeather(weather);
    onOpen();
  };

  const handleSave = async () => {
    try {
      await editWeatherData(selectedWeather);
      fetchData();
      onClose();
    } catch (err) {
      console.error('Failed to edit weather data', err);
    }
  };

  return (
<Box p={4}>
      <Heading as="h1" mb={4}>
        Weather Data
      </Heading>
      {weatherData.length === 0 ? (
        <Text>Loading...</Text>
      ) : (
        <Grid templateColumns="repeat(5, 1fr)" gap={4}>
          {weatherData.map((weather, index) => (
            <GridItem key={index}>
              <Box p={4} shadow="md" borderWidth="1px">
                <Heading as="h2" size="md">
                  {weather.station.name}
                </Heading>
                <Text>
                  <strong>Timestamp:</strong> {convertUnixToCST(weather.ts)}
                </Text>
                <Text>
                  <strong>Temperature:</strong> {weather.temperature}°C
                </Text>
                <Text>
                  <strong>Humidity:</strong> {weather.percent_humidity}%
                </Text>
                <Text>
                  <strong>Wind Speed:</strong> {weather.wind_speed} m/s
                </Text>
                <Text>
                  <strong>Wind Direction:</strong> {weather.wind_direction}°
                </Text>
                <Text>
                  <strong>Rain:</strong> {weather.rain_15_min_inches} inches
                </Text>
                <Text>
                  <strong>Pressure:</strong> {weather.barometric_pressure} hPa
                </Text>
                <Divider mt={2} mb={2} />
                <Button mt={2} onClick={() => handleEditClick(weather)}>
                  Edit
                </Button>
                <Button mt={2} ml={2} colorScheme="red" onClick={() => handleEditClick(weather)}>
                  Delete
                </Button>
              </Box>
            </GridItem>
          ))}
        </Grid>
      )}
      {selectedWeather && (
        <WeatherEditModal
          isOpen={Boolean(selectedWeather)}
          onClose={() => setSelectedWeather(null)}
          weather={selectedWeather}
          dataid={selectedWeather.dataid}
          fetchData={fetchData}
        />
      )}
    </Box>
  );
};

export default Dashboard;

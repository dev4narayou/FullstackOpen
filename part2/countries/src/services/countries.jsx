import axios from "axios";

const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api";
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

// fetch all countries
const getAll = () => {
  return axios
    .get(`${baseUrl}/all`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching countries:", error);
      throw error; // optionally rethrow the error if needed
    });
};

// fetch weather data for a city
const getWeather = (city) => {
  return axios
    .get(`${weatherUrl}${city}&units=metric&APPID=${API_KEY}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error(`Error fetching weather for ${city}:`, error);
      throw error;
    });
};

export default { getAll, getWeather };

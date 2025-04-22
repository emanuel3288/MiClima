// src/services/weatherService.ts
import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY; // Debe estar en tu .env

export const getCurrentWeather = async (city: string) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error; // Relanzamos el error para manejarlo en el componente
  }
};

// Opcional: Función para obtener ciudad desde coordenadas
export const getCityFromCoords = async (lat: number, lon: number) => {
  const response = await axios.get(
    `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
  );
  return response.data?.[0];
};
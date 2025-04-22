import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const fetchWeatherData = async (endpoint: string, params: Record<string, any>) => {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
};

export const getCurrentWeather = async (city: string) => {
  const params = {
    q: city,
    appid: API_KEY,
    units: 'metric',
    lang: 'es'
  };
  return await fetchWeatherData('/weather', params);
};

export const getForecast = async (city: string) => {
  const params = {
    q: city,
    appid: API_KEY,
    units: 'metric',
    lang: 'es'
  };
  const data = await fetchWeatherData('/forecast', params);

  // Agrupamos por día y encontramos min/max
  const dailyData = data.list.reduce((acc: any, item: any) => {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = {
        dt: item.dt,
        temp_min: item.main.temp,
        temp_max: item.main.temp,
        weather: item.weather,
        main: item.main,
        wind: {
          speed: item.wind.speed,
          deg: item.wind.deg,
          gust: item.wind.gust
        }
      };
    } else {
      acc[date].temp_min = Math.min(acc[date].temp_min, item.main.temp);
      acc[date].temp_max = Math.max(acc[date].temp_max, item.main.temp);
      // Actualizamos las ráfagas de viento si son mayores
      if (item.wind.gust && (!acc[date].wind.gust || item.wind.gust > acc[date].wind.gust)) {
        acc[date].wind.gust = item.wind.gust;
      }
      // Actualizamos la velocidad del viento si es mayor
      if (item.wind.speed > acc[date].wind.speed) {
        acc[date].wind.speed = item.wind.speed;
        acc[date].wind.deg = item.wind.deg;
      }
    }
    return acc;
  }, {});

  // Convertimos el objeto en array
  const dailyList = Object.values(dailyData).map((day: any) => ({
    dt: day.dt,
    main: {
      ...day.main,
      temp_min: day.temp_min,
      temp_max: day.temp_max
    },
    weather: day.weather,
    wind: day.wind
  }));

  return {
    list: dailyList
  };
};

export const getTodayForecast = async (city: string) => {
  const params = {
    q: city,
    appid: API_KEY,
    units: 'metric',
    lang: 'es'
  };
  const data = await fetchWeatherData('/forecast', params);

  const today = new Date();
  const todayDateString = today.toISOString().split('T')[0];

  const todayData = data.list.filter((item: any) => {
    const date = new Date(item.dt * 1000);
    const dateString = date.toISOString().split('T')[0];
    return dateString === todayDateString;
  });

  console.log('Datos del día actual:', todayData);

  if (todayData.length === 0) {
    console.warn('No se encontraron datos para el día actual.');
    return { tempMax: null, tempMin: null };
  }

  const tempMax = Math.max(...todayData.map((item: any) => item.main.temp_max));
  const tempMin = Math.min(...todayData.map((item: any) => item.main.temp_min));

  return {
    tempMax,
    tempMin
  };
};

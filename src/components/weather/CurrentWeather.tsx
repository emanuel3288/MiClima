import { useState, useEffect } from 'react';
import moment from 'moment';
import { getCurrentWeather } from '../currentWeather/services/WeatherService';
import WeatherCard from '../currentWeather/WeatherCard';
import { Typography, Box, CircularProgress } from '@mui/material';
import { WeatherData } from '../currentWeather/types/weather';

moment.locale('es');

interface Props {
  city: string;
  lat: number;
  lon: number;
}

const CurrentWeather = ({ city }: Props) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState(moment());

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await getCurrentWeather(city);
        setWeather(data);
      } catch (error: any) {
        console.error('Error fetching weather:', error);
        setError(error.response?.data?.message || 'Error al cargar los datos del clima');
        setWeather(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    
    const timer = setInterval(() => {
      setCurrentTime(moment());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [city]);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '300px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '20px'
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Cargando datos del clima...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '300px',
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        borderRadius: '20px',
        p: 3
      }}>
        <Typography color="error" variant="h6" align="center">
          {error}
          <Typography variant="body1" sx={{ mt: 1 }}>
            Mostrando datos de Buenos Aires por defecto...
          </Typography>
        </Typography>
      </Box>
    );
  }

  if (!weather) {
    // Fallback a Buenos Aires si no hay datos
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '300px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '20px'
      }}>
        <Typography variant="h6" align="center">
          No se pudieron cargar los datos del clima.
          <Typography variant="body1" sx={{ mt: 1 }}>
            Mostrando datos de Buenos Aires por defecto...
          </Typography>
        </Typography>
      </Box>
    );
  }

  const windSpeedKmh = Math.round(weather.wind.speed * 3.6);
  const roundedWindSpeed = Math.round(windSpeedKmh / 5) * 5;
  const gustSpeedKmh = weather.wind.gust ? Math.round(weather.wind.gust * 3.6) : undefined;
  const humidity = weather.main.humidity !== undefined ? weather.main.humidity : 'No disponible';


  return (
    <WeatherCard
      weather={weather}
      currentTime={currentTime.format('LLLL')}
      windSpeed={roundedWindSpeed}
      gustSpeed={gustSpeedKmh}
      humidity={humidity}
    />
  );
};

export default CurrentWeather;

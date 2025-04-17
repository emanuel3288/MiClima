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
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(moment());

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        const data = await getCurrentWeather(city);
        setWeather(data);
        setError(null);
      } catch (err: any) {
        console.error('Error al obtener el clima:', err);
        setError(err.response?.data?.message || 'Error al cargar los datos del clima');
        setWeather(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();

    const timer = setInterval(() => setCurrentTime(moment()), 1000);
    return () => clearInterval(timer);
  }, [city]);

  const renderStatusBox = (message: string, isError = false) => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: 300,
        textAlign: 'center',
        borderRadius: 4,
        backgroundColor: isError ? 'rgba(255, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
        p: 3
      }}
    >
      <Typography variant="h6" color={isError ? 'error' : 'textPrimary'}>
        {message}
      </Typography>
      <Typography variant="body1" sx={{ mt: 1 }}>
        Mostrando datos de Buenos Aires por defecto...
      </Typography>
    </Box>
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 300,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 4
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Cargando datos del clima...
        </Typography>
      </Box>
    );
  }

  if (error) return renderStatusBox(error, true);
  if (!weather) return renderStatusBox('No se pudieron cargar los datos del clima.');

  const {
    wind: { speed, gust },
    main: { humidity }
  } = weather;

  const windSpeedKmh = Math.round(speed * 3.6);
  const roundedWindSpeed = Math.round(windSpeedKmh / 5) * 5;
  const gustSpeedKmh = gust ? Math.round(gust * 3.6) : undefined;

  return (
    <WeatherCard
      weather={weather}
      currentTime={currentTime.format('LLLL')}
      windSpeed={roundedWindSpeed}
      gustSpeed={gustSpeedKmh}
      humidity={humidity ?? 'No disponible'}
    />
  );
};

export default CurrentWeather;

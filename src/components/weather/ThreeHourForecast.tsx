import { useEffect, useState } from 'react';
import { Box, Grid, CircularProgress, Alert } from '@mui/material';
import ForecastTittle from '../threeHourForecast/ForecastTittle';
import ForecastCard from '../threeHourForecast/ForecastCard';
import { ForecastItem } from '../threeHourForecast/types/weather';

interface ThreeHourForecastProps {
  city?: string;
  lat: number;
  lon: number;
}

const ThreeHourForecast = ({ lat, lon }: ThreeHourForecastProps) => {
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCity, setCurrentCity] = useState('Cargando ciudad...');

  useEffect(() => {
    const fetchForecast = async () => {
      const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`
        );

        if (!res.ok) throw new Error('Error al obtener los datos del pronóstico');

        const data = await res.json();

        setForecast(data.list.slice(0, 8));
        setCurrentCity(data.city?.name ? `${data.city.name}, ${data.city.country}` : 'Ciudad desconocida');

      } catch (err) {
        console.error(err);
        setError('No se pudo cargar el pronóstico del clima.');
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [lat, lon]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress size={50} thickness={4} color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ width: '100%', px: 2 }}>
      <ForecastTittle city={currentCity} />

      <Grid container spacing={2}>
        {forecast.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.dt}>
            <ForecastCard item={item} isCurrent={index === 0} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ThreeHourForecast;

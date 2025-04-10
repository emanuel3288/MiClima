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

const ThreeHourForecast = ({ city, lat, lon }: ThreeHourForecastProps) => {
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCity, setCurrentCity] = useState<string>(''); // Iniciar como un string vacío

  useEffect(() => {
    const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`
        );
        const data = await response.json();
        setForecast(data.list.slice(0, 8));
        
        // Asegúrate de que `currentCity` siempre tenga un valor de tipo string
        if (data.city && data.city.name) {
          setCurrentCity(`${data.city.name}, ${data.city.country}`);
        } else {
          setCurrentCity('Ciudad desconocida'); // Valor por defecto si no hay nombre de ciudad
        }
      } catch (err) {
        setError('Error al cargar el pronóstico');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [city, lat, lon]);

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
            <ForecastCard 
              item={item} 
              isCurrent={index === 0} 
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ThreeHourForecast;

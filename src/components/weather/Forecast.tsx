import { useState, useEffect } from 'react';
import { Typography, Grid,Box } from '@mui/material';
import { getForecast } from '../../services/weatherService';
import ForecastContainer from '../container/ForecastContainer';
import  WeatherCard  from '../forecast/WeatherCard';
import moment from 'moment';

interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
      feels_like: number;
    };
    weather: Array<{
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
      gust?: number;
      deg: number;
    };
  }>;
}

interface Props {
  city: string;
}

const Forecast = ({ city }: Props) => {
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        console.log('Fetching forecast for:', city);
        const data = await getForecast(city);
        console.log('Forecast data received:', data);
        

        if (!data || !data.list) {
          throw new Error('Datos de pronóstico no válidos');
        }

        // Filtrar pronósticos para obtener uno por día, excluyendo el día actual
        const uniqueDayForecasts = data.list.reduce((acc: any[], curr: any) => {
          const today = moment().startOf('day');
          const forecastDate = moment.unix(curr.dt).startOf('day');
          
          if (forecastDate.isAfter(today)) {
            const existingDay = acc.find(item => 
              moment.unix(item.dt).format('YYYY-MM-DD') === forecastDate.format('YYYY-MM-DD')
            );
            
            if (!existingDay && acc.length < 4) {
              acc.push(curr);
            }
          }
          return acc;
        }, []);

        console.log('Datos del día actual:', data.list.filter((item: any) => {
          const today = moment().startOf('day');
          const forecastDate = moment.unix(item.dt).startOf('day');
          return forecastDate.isSame(today);
        }));

        setForecast({ ...data, list: uniqueDayForecasts });
        setError(null);
      } catch (error: any) {
        console.error('Error fetching forecast:', error.response || error);
        setError(error.response?.data?.message || 'Error al cargar el pronóstico');
        setForecast(null);
      }
    };

    if (city) {
      fetchForecast();
    }
  }, [city]);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!forecast) return <Typography>Cargando...</Typography>;

  return (
    <ForecastContainer title="Pronóstico para los próximos días">
  <Box sx={{ 
    display: 'flex',
    justifyContent: 'center',
    width: '100%'
  }}>
    <Grid 
      container 
      spacing={3}
      sx={{
        width: 'auto', // Permite que el grid se expanda según su contenido
        maxWidth: '100%', // No exceder el ancho del contenedor padre
        justifyContent: 'center' // Centra las columnas
      }}
    >
      {forecast.list.map((data) => {
        const windSpeedKmh = Math.round(data.wind.speed * 3.6);
        const gustSpeedKmh = data.wind.gust ? Math.round(data.wind.gust * 3.6) : undefined;

        return (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={3} 
            key={data.dt}
            sx={{
              minWidth: 250, // Ancho mínimo para cada card
              maxWidth: 300, // Ancho máximo opcional
              width: '100%' // Ocupa todo el espacio disponible
            }}
          >
            <WeatherCard
              dt={data.dt}
              temp={data.main.temp}
              temp_min={data.main.temp_min}
              temp_max={data.main.temp_max}
              description={data.weather[0].description}
              icon={data.weather[0].icon}
              windSpeed={windSpeedKmh}
              windDeg={data.wind.deg}
              windGust={gustSpeedKmh}
              
            />
          </Grid>
        );
      })}
    </Grid>
  </Box>
</ForecastContainer>
  );
};

export default Forecast;

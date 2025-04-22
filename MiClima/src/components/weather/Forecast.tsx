import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Typography, Grid, Box, Button, Modal, Card, IconButton } from '@mui/material';
import { getForecast } from '../../services/weatherService';
import ForecastContainer from '../container/ForecastContainer';
import WeatherCard from '../forecast/WeatherCard';
import moment from 'moment';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import CloseIcon from '@mui/icons-material/Close';

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

const Forecast: React.FC<Props> = ({ city }) => {
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openChart, setOpenChart] = useState(false);

  const fetchForecast = useCallback(async () => {
    try {
      const data = await getForecast(city);
      if (!data?.list) throw new Error('Datos de pronóstico no válidos');

      const uniqueDayForecasts = data.list.reduce((acc: any[], curr: any) => {
        const today = moment().startOf('day');
        const forecastDate = moment.unix(curr.dt).startOf('day');

        if (forecastDate.isAfter(today)) {
          const exists = acc.some(item => moment.unix(item.dt).isSame(forecastDate, 'day'));
          if (!exists && acc.length < 4) acc.push(curr);
        }
        return acc;
      }, []);

      setForecast({ ...data, list: uniqueDayForecasts });
      setError(null);
    } catch (error: any) {
      console.error('Error fetching forecast:', error);
      setError(error.message || 'Error al cargar el pronóstico');
      setForecast(null);
    }
  }, [city]);

  useEffect(() => {
    if (city) fetchForecast();
  }, [city, fetchForecast]);

  const chartData = useMemo(() =>
    forecast?.list.map(item => ({
      date: moment.unix(item.dt).format('DD/MM'),
      maxTemp: Math.round(item.main.temp_max),
      minTemp: Math.round(item.main.temp_min)
    })) || [],
    [forecast]
  );

  const calculateDomain = () => {
    const allTemps = chartData.flatMap(d => [d.maxTemp, d.minTemp]);
    const minTemp = Math.min(...allTemps);
    const maxTemp = Math.max(...allTemps);
    const padding = Math.ceil((maxTemp - minTemp) * 0.2);
    return [Math.floor(minTemp) - padding, Math.ceil(maxTemp) + padding];
  };

  if (error) return <Typography color="error">{error}</Typography>;
  if (!forecast) return <Typography>Cargando...</Typography>;

  return (
    <ForecastContainer title={`Pronóstico para ${city}`}>
      <Box sx={{ position: 'relative', width: '100%', pb: 10 }}>
        <Grid container spacing={2} sx={{ width: '100%', margin: 0, flexWrap: 'nowrap', overflowX: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' }, py: 1 }}>
          {forecast.list.map((data) => {
            const windSpeedKmh = Math.round(data.wind.speed * 3.6);
            const gustSpeedKmh = data.wind.gust ? Math.round(data.wind.gust * 3.6) : undefined;

            return (
              <Grid item key={data.dt} sx={{ minWidth: 250, flex: '1 0 auto', px: 1 }}>
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
        <Box sx={{ position: 'absolute', bottom: 16, right: 16, zIndex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            onClick={() => setOpenChart(true)}
            variant="outlined"
            size="medium"
            startIcon={<EqualizerIcon sx={{ color: 'primary.main', transition: 'transform 0.3s ease' }} />}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(25, 118, 210, 0.3)',
              borderRadius: '24px',
              padding: '8px 20px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
              color: 'text.primary',
              textTransform: 'none',
              fontSize: '0.875rem',
              letterSpacing: '0.5px',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
                borderColor: 'primary.main',
                boxShadow: '0 4px 16px rgba(25, 118, 210, 0.2)',
                '& .MuiSvgIcon-root': {
                  transform: 'scale(1.1)'
                }
              }
            }}
          >
            Ver Evolución
          </Button>
        </Box>
      </Box>

      <Modal open={openChart} onClose={() => setOpenChart(false)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}>
        <Card sx={{ width: '90%', maxWidth: '800px', p: 4, position: 'relative', border: 'none', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)', borderRadius: '16px', backgroundColor: 'background.paper' }}>
          <IconButton aria-label="close" onClick={() => setOpenChart(false)} sx={{ position: 'absolute', right: 16, top: 16, color: 'text.secondary', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}>
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" component="h2" sx={{ mb: 3, textAlign: 'center', fontWeight: 600, color: 'text.primary' }}>
            Evolución de Temperaturas en {city}
          </Typography>

          <Box sx={{ height: '400px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fill: '#666', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} tickMargin={10} />
                <YAxis domain={calculateDomain()} tick={{ fill: '#666', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} width={40} tickFormatter={(value) => `${value}°`} />
                <Tooltip formatter={(value: number) => [`${value} °C`]} labelFormatter={(label) => `Día: ${label}`} contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: 'none', fontWeight: 500 }} itemStyle={{ color: '#333', fontWeight: 500 }} />
                <Legend verticalAlign="top" height={40} formatter={(value) => (<span style={{ color: value === 'maxTemp' ? '#ff4444' : '#4488ff', fontWeight: 500, fontSize: '0.85rem' }}>{value === 'maxTemp' ? 'Máxima' : 'Mínima'}</span>)} />
                <Line name="maxTemp" dataKey="maxTemp" stroke="#ff4444" strokeWidth={3} dot={{ r: 6, strokeWidth: 2, fill: '#fff', stroke: '#ff4444' }} activeDot={{ r: 8, strokeWidth: 0, fill: '#ff4444' }} />
                <Line name="minTemp" dataKey="minTemp" stroke="#4488ff" strokeWidth={3} dot={{ r: 6, strokeWidth: 2, fill: '#fff', stroke: '#4488ff' }} activeDot={{ r: 8, strokeWidth: 0, fill: '#4488ff' }} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Card>
      </Modal>
    </ForecastContainer>
  );
};

export default Forecast;
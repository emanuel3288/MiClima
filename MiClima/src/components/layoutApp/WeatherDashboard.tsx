import { Box, CircularProgress, Card, CardContent, Typography, Grid } from '@mui/material';
import CurrentWeather from '../weather/CurrentWeather';
import Forecast from '../weather/Forecast';
import ThreeHourForecast from '../weather/ThreeHourForecast';
import MeteoBlue from '../weather/ImageSatellite';
import { ThermalCalculator } from '../UniversalFeelsLikeCalculator';
import WeatherChat from '../WeatherChat';

interface WeatherDashboardProps {
  city: string;
  coordinates: { lat: number; lon: number };
  mapData: { city: string; coordinates: { lat: number; lon: number } };
  isLoading: boolean;
  currentWeather?: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    windDirection?: string;
    sunrise?: string;
    sunset?: string;
  };
}

const WeatherDashboard = ({
  city,
  coordinates,
  mapData,
  isLoading,
  currentWeather = { temperature: 25, humidity: 50, windSpeed: 10, windDirection: 'N', sunrise: '06:30', sunset: '18:45' },
}: WeatherDashboardProps) => {
  if (isLoading && !city) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={80} sx={{ color: 'white' }} />
          <Typography variant="h6" sx={{ color: 'white', mt: 2 }}>
            Cargando datos meteorológicos...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!city || !coordinates) return null;

  return (
    <Box component="main" sx={{ mt: 4, mb: 4, flex: 1, display: 'flex', flexDirection: 'column', gap: 3, position: 'relative', pb: 10 }}>
      {/* Sección de información meteorológica actual */}
      <CurrentWeather city={city} lat={coordinates.lat} lon={coordinates.lon} />
      
      {/* Pronóstico extendido */}
      <Forecast city={city} />

      {/* Pronóstico cada 3 horas */}
      <ThreeHourForecast city={city} lat={coordinates.lat} lon={coordinates.lon} />

      {/* Sección de mapas */}
      {mapData && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={cardStyles}>
              <CardContent sx={{ minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" component="div" gutterBottom sx={headerStyles}>
                  Mapas Meteorológicos
                </Typography>
                <Box sx={{ flex: 1, width: '100%', height: '100%' }}>
                  <MeteoBlue lat={mapData.coordinates.lat} lon={mapData.coordinates.lon} city={mapData.city} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Calculadora térmica flotante */}
      <ThermalCalculator
        defaultTemperature={currentWeather.temperature.toString()}
        defaultHumidity={currentWeather.humidity.toString()}
        defaultWindSpeed={currentWeather.windSpeed.toString()}
      />
      
      {/* Chat del clima */}
      <WeatherChat />
    </Box>
  );
};

// Estilos optimizados
const cardStyles = {
  background: 'linear-gradient(160deg, rgba(0, 0, 0, 0.34), rgba(0, 49, 94, 0.34))',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
};

const headerStyles = {
  mb: 1,
  color: '#ffffff',
  fontWeight: 'bold',
  textAlign: 'center',
};

export default WeatherDashboard;

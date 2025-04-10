import { Card, CardContent, Divider, Box, Typography, Grid } from '@mui/material';
import { 
  WiDaySunny, 
  WiCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
  WiStrongWind, 
  WiHumidity, 
  WiBarometer,
  WiThermometer,
  WiSunrise,
  WiSunset
} from 'react-icons/wi';
import { FiWind } from 'react-icons/fi';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    pressure: number;
    humidity?: number;
  };
  weather: Array<{
    description: string;
    icon: string;
    main: string;
  }>;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  sys: {
    sunrise?: number;
    sunset?: number;
  };
}

interface WeatherCardProps {
  weather: WeatherData;
  currentTime: string;
  windSpeed: number;
  gustSpeed?: number;
  humidity: string | number;
  children?: React.ReactNode;
}

const getWeatherIcon = (main: string) => {
  switch (main) {
    case 'Clear':
      return <WiDaySunny size={80} style={{ color: '#FFD700' }} />;
    case 'Clouds':
      return <WiCloudy size={80} style={{ color: '#B0C4DE' }} />;
    case 'Rain':
      return <WiRain size={80} style={{ color: '#1E90FF' }} />;
    case 'Snow':
      return <WiSnow size={80} style={{ color: '#FFFFFF' }} />;
    case 'Thunderstorm':
      return <WiThunderstorm size={80} style={{ color: '#8B0000' }} />;
    case 'Fog':
    case 'Mist':
      return <WiFog size={80} style={{ color: '#A9A9A9' }} />;
    default:
      return <WiDaySunny size={80} style={{ color: '#FFD700' }} />;
  }
};

const getWindDirection = (deg: number) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
};

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const WeatherCard = ({ weather, currentTime, windSpeed, gustSpeed, humidity, children }: WeatherCardProps) => {
  return (
    <Card sx={{
      width: '100%',
      background: 'rgba(0, 51, 102, 0.6)',
      backdropFilter: 'blur(15px)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      color: 'white',
      p: 3,
      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-5px) scale(1.03)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)'
      }
    }}>
      <CardContent>
        <Box textAlign="center" mb={2}>
          <Typography variant="h4" fontWeight="600">{weather.name}</Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>{currentTime}</Typography>
        </Box>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={4} textAlign="center">
            {getWeatherIcon(weather.weather[0]?.main)}
            <Typography variant="h3">{Math.round(weather.main.temp)}°C</Typography>
            <Typography variant="h6">{weather.weather[0]?.description || ''}</Typography>
            <Typography variant="h6"><WiThermometer style={{ color: '#FFD700' }} /> Sensación térmica: {Math.round(weather.main.feels_like)}°C</Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2, backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={4} textAlign="center">
            <Typography variant="h6">Presión & Humedad</Typography>
            <Typography><WiBarometer style={{ color: '#DC143C' }} /> Presión: {weather.main.pressure} hPa</Typography>
            <Typography><WiHumidity style={{ color: '#00BFFF' }} /> Humedad: {humidity}%</Typography>
          </Grid>
          <Grid item xs={12} sm={4} textAlign="center">
            <Typography variant="h6">Viento</Typography>
            <Typography>
              <WiStrongWind style={{ color: '#00CED1' }} /> Viento: {getWindDirection(weather.wind.deg)} a {windSpeed} km/h
            </Typography>
            <Typography><FiWind style={{ color: '#4682B4' }} /> Ráfagas: {gustSpeed ? `${gustSpeed} km/h` : 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} sm={4} textAlign="center">
            <Typography variant="h6">Amanecer & Atardecer</Typography>
            <Typography><WiSunrise style={{ color: '#FFA500' }} /> Amanecer: {weather.sys.sunrise ? formatTime(weather.sys.sunrise) : 'N/A'}</Typography>
            <Typography><WiSunset style={{ color: '#FF4500' }} /> Atardecer: {weather.sys.sunset ? formatTime(weather.sys.sunset) : 'N/A'}</Typography>
          </Grid>
        </Grid>
        {children}
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
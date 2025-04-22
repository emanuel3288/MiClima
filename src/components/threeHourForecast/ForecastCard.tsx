// components/ForecastCard.tsx
import { Card, CardContent, Typography, Box, Divider, Chip } from '@mui/material';
import WeatherIcon, { WeatherWindIcon, WeatherHumidityIcon, WeatherSunnyIcon } from './WeatherIcon';
import { ForecastItem } from '../threeHourForecast/types/weather';

interface ForecastCardProps {
  item: ForecastItem;
  isCurrent?: boolean;
}

const ForecastCard = ({ item, isCurrent = false }: ForecastCardProps) => {
  const date = new Date(item.dt * 1000);
  const timeString = date.toLocaleTimeString('es-ES', {
    hour: '2-digit', 
    minute: '2-digit'
  });
  const dateString = date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short'
  });
  const windSpeed = Math.round(item.wind.speed * 3.6);

  return (
    <Card sx={{
      height: '100%',
      borderRadius: '12px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.08)',
      borderLeft: `4px solid ${isCurrent ? '#3f51b5' : '#e0e0e0'}`,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: '0 6px 16px rgba(247, 132, 1, 0.84)'
      }
    }}>
      <CardContent sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="subtitle2" sx={{ color: '#616161', fontSize: '0.8rem' }}>
              {dateString}
            </Typography>
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 'bold',
              color: isCurrent ? '#3f51b5' : 'text.primary',
              display: 'flex',
              alignItems: 'center'
            }}>
              {timeString}
              {isCurrent && (
                <Chip 
                  label="Próximo" 
                  size="small" 
                  color="primary"
                  sx={{ 
                    ml: 1, 
                    height: 22,
                    fontWeight: 'bold',
                    fontSize: '0.7rem'
                  }}
                />
              )}
            </Typography>
            <Typography variant="body2" sx={{
              color: 'text.secondary',
              textTransform: 'capitalize',
              fontStyle: 'italic',
              fontSize: '0.9rem'
            }}>
              {item.weather[0].description}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h5" sx={{
              fontWeight: 'bold',
              color: 'text.primary',
              minWidth: '50px'
            }}>
              {Math.round(item.main.temp)}°C
            </Typography>
            <WeatherIcon weatherId={item.weather[0].id} />
          </Box>
        </Box>

        <Divider sx={{ 
          my: 1.5, 
          borderColor: 'rgba(0, 0, 0, 0.05)',
          borderWidth: '1px'
        }} />

        <Box display="flex" justifyContent="space-around" textAlign="center">
          <Box>
            <WeatherWindIcon sx={{ color: '#00bcd4' }} />
            <Typography variant="caption" display="block" sx={{ 
              color: '#616161',
              fontSize: '0.75rem'
            }}>
              {windSpeed} km/h
            </Typography>
          </Box>
          <Box>
            <WeatherHumidityIcon sx={{ color: '#2196f3' }} />
            <Typography variant="caption" display="block" sx={{ 
              color: '#616161',
              fontSize: '0.75rem'
            }}>
              {item.main.humidity}%
            </Typography>
          </Box>
          <Box>
            <WeatherSunnyIcon sx={{ color: '#ff9800' }} />
            <Typography variant="caption" display="block" sx={{ 
              color: '#616161',
              fontSize: '0.75rem'
            }}>
              {Math.round(item.main.feels_like)}°
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ForecastCard;
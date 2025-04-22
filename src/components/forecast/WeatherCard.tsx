// components/WeatherCard.tsx
import { Card, CardContent, Typography, Box } from '@mui/material';
import { ArrowUpward, ArrowDownward, Air, AirlineStops } from '@mui/icons-material';
import moment from 'moment';

const weatherBackgroundsByDescription: { [key: string]: string } = {
  'cielo claro': 'https://images.pexels.com/photos/912364/pexels-photo-912364.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  'algo de nubes': 'https://images.pexels.com/photos/2114014/pexels-photo-2114014.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  'nubes dispersas': 'https://images.pexels.com/photos/3742711/pexels-photo-3742711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  'muy nuboso': 'https://images.pexels.com/photos/1154510/pexels-photo-1154510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  'nubes': 'https://images.pexels.com/photos/1154510/pexels-photo-1154510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  'lluvia ligera': 'https://images.pexels.com/photos/1755702/pexels-photo-1755702.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  'lluvia moderada': 'https://images.pexels.com/photos/1530423/pexels-photo-1530423.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  'lluvia intensa': 'https://images.pexels.com/photos/1530423/pexels-photo-1530423.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  'tormenta': 'https://images.pexels.com/photos/1162251/pexels-photo-1162251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  'nieve': 'https://images.pexels.com/photos/688660/pexels-photo-688660.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  'niebla': 'https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'
};

const defaultBackgroundImage = 'https://images.pexels.com/photos/912364/pexels-photo-912364.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750';

interface WeatherCardProps {
  dt: number;
  temp: number;
  temp_min: number;
  temp_max: number;
  description: string;
  icon: string;
  windSpeed: number;
  windDeg: number;
  windGust?: number;
}

const formatDay = (timestamp: number) => {
  return moment.unix(timestamp).locale('es').format('dddd').replace(/^\w/, (c) => c.toUpperCase());
};

const formatDate = (timestamp: number) => {
  return moment.unix(timestamp).locale('es').format('D [de] MMMM');
};

const getWindDirectionStyle = (degrees: number) => ({
  transform: `rotate(${degrees}deg)`,
  display: 'inline-block',
  marginRight: '8px'
});

const WeatherCard = ({
  dt,
  temp,
  temp_min,
  temp_max,
  description,
  icon,
  windSpeed,
  windDeg,
  windGust
}: WeatherCardProps) => {
  const weatherDescription = description ? description.toLowerCase() : ''; 
  const backgroundImage = weatherBackgroundsByDescription[weatherDescription] || defaultBackgroundImage;
  const roundedWindSpeed = Math.round(windSpeed);
  const roundedGustSpeed = windGust ? Math.round(windGust) : null;

  return (
    <Card 
      sx={{
        height: '100%',
        minHeight: '500px',
        background: `linear-gradient(rgba(8, 29, 218, 0.4), rgba(219, 219, 223, 0.6)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backdropFilter: 'blur(5px)',
        borderRadius: '20px',
        transition: 'all 0.3s ease',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        overflow: 'hidden',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 20px rgba(0,0,0,0.2)',
          '&::before': {
            opacity: 0.4,
          }
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.65)',
          transition: 'opacity 0.3s ease',
          zIndex: 1
        }
      }}
    >
      <CardContent sx={{ 
        position: 'relative',
        zIndex: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            textTransform: 'capitalize',
            color: '#1976d2',
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 1
          }}
        >
          {formatDay(dt)}
        </Typography>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            color: '#546e7a',
            textAlign: 'center',
            mb: 2
          }}
        >
          {formatDate(dt)}
        </Typography>
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'center',
          mb: 2
        }}>
          <Box
            component="img"
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            alt={description}
            sx={{ width: 100, height: 100 }}
          />
        </Box>
        <Typography 
          variant="h4" 
          sx={{ 
            textAlign: 'center',
            color: '#1976d2',
            fontWeight: 'bold',
            mb: 1
          }}
        >
          {Math.round(temp)}°C
        </Typography>
        <Typography 
          sx={{ 
            textAlign: 'center',
            color: '#546e7a',
            textTransform: 'capitalize',
            mb: 2
          }}
        >
          {description}
        </Typography>
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          mb: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ArrowUpward sx={{ color: '#f44336', mr: 1 }} />
            <Typography color="#f44336">
              {Math.round(temp_max)}°C
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ArrowDownward sx={{ color: '#2196f3', mr: 1 }} />
            <Typography color="#2196f3">
              {Math.round(temp_min)}°C
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 'auto' }}>
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1
          }}>
            <Box sx={getWindDirectionStyle(windDeg)}>
              <Air sx={{ color: '#546e7a' }} />
            </Box>
            <Typography color="#546e7a">
              {roundedWindSpeed} km/h
            </Typography>
          </Box>
          {roundedGustSpeed && (
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AirlineStops sx={{ color: '#546e7a', mr: 1 }} />
              <Typography color="#546e7a">
                {roundedGustSpeed} km/h
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
import { Box } from '@mui/material';
import WeatherDetailItem from '../currentWeather/ WeatherDetailItem';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import AirIcon from '@mui/icons-material/Air';
import AirlineStopsIcon from '@mui/icons-material/AirlineStops';
import CompressIcon from '@mui/icons-material/Compress';
import { WeatherData } from '../currentWeather/types/weather';

interface WeatherDetailsProps {
  weather: WeatherData;
  windSpeed: number;
  gustSpeed?: number;
}

const WeatherDetails = ({ weather, windSpeed, gustSpeed }: WeatherDetailsProps) => {
  const getWindDirectionStyle = (degrees: number) => ({
    transform: `rotate(${degrees}deg)`,
    display: 'inline-block',
    marginRight: '8px'
  });

  return (
    <Box sx={{ 
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '15px',
      p: 3
    }}>
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: '40px 1fr',
        gap: 2,
        '& > *:not(:last-child)': {
          mb: 2
        }
      }}>
        <WeatherDetailItem
          icon={<ThermostatIcon sx={{ color: 'white', fontSize: 30 }} />}
          label="Sensación térmica"
          value={Math.round(weather.main.feels_like)}
          unit="°C"
        />

        <Box sx={getWindDirectionStyle(weather.wind.deg)}>
          <AirIcon sx={{ color: 'white', fontSize: 30 }} />
        </Box>
        <WeatherDetailItem
          icon={<div />}
          label="Viento"
          value={windSpeed}
          unit="km/h"
        />

        {gustSpeed && (
          <WeatherDetailItem
            icon={<AirlineStopsIcon sx={{ color: 'white', fontSize: 30 }} />}
            label="Ráfagas"
            value={gustSpeed}
            unit="km/h"
          />
        )}

        <WeatherDetailItem
          icon={<CompressIcon sx={{ color: 'white', fontSize: 30 }} />}
          label="Presión"
          value={weather.main.pressure}
          unit="hPa"
        />
      </Box>
    </Box>
  );
};

export default WeatherDetails;
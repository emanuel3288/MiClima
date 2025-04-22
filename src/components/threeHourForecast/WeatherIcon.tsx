// components/WeatherIcon.tsx
import {
    WbSunny as SunnyIcon,
    Opacity as HumidityIcon,
    Air as WindIcon,
    Cloud as CloudIcon,
    Thunderstorm as StormIcon,
    AcUnit as SnowIcon,
    Water as RainIcon,
    WbTwilight as FogIcon,
  } from '@mui/icons-material';
  import { SxProps } from '@mui/material';
  
  // Exportamos los iconos como componentes personalizados
  export const WeatherWindIcon = (props: { sx?: SxProps }) => (
    <WindIcon fontSize="small" {...props} />
  );
  
  export const WeatherHumidityIcon = (props: { sx?: SxProps }) => (
    <HumidityIcon fontSize="small" {...props} />
  );
  
  export const WeatherSunnyIcon = (props: { sx?: SxProps }) => (
    <SunnyIcon fontSize="small" {...props} />
  );
  
  // Componente principal WeatherIcon
  interface WeatherIconProps {
    weatherId: number;
    size?: 'small' | 'medium' | 'large';
    sx?: SxProps;
  }
  
  const WeatherIcon = ({ weatherId, size = 'medium', sx = {} }: WeatherIconProps) => {
    const iconStyle = { 
      fontSize: size === 'small' ? '20px' : size === 'large' ? '36px' : '28px',
      ...sx
    };
    
    const colors = {
      storm: '#9c27b0',
      rain: '#2196f3',
      snow: '#00bcd4',
      sun: '#ff9800',
      cloud: '#607d8b',
      fog: '#9e9e9e'
    };
  
    if (weatherId >= 200 && weatherId < 300) return <StormIcon sx={{...iconStyle, color: colors.storm}} />;
    if (weatherId >= 300 && weatherId < 600) return <RainIcon sx={{...iconStyle, color: colors.rain}} />;
    if (weatherId >= 600 && weatherId < 700) return <SnowIcon sx={{...iconStyle, color: colors.snow}} />;
    if (weatherId === 800) return <SunnyIcon sx={{...iconStyle, color: colors.sun}} />;
    if (weatherId >= 700 && weatherId < 800) return <FogIcon sx={{...iconStyle, color: colors.fog}} />;
    return <CloudIcon sx={{...iconStyle, color: colors.cloud}} />;
  };
  
  export default WeatherIcon;
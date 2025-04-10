import { Box, Typography } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface TemperatureRangeProps {
  min: number;
  max: number;
}

const TemperatureRange = ({ min, max }: TemperatureRangeProps) => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'space-around',
    mb: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '15px',
    p: 2
  }}>
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <ArrowUpwardIcon sx={{ color: '#ff4444', fontSize: 30 }} />
      <Typography variant="h6" sx={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
        {Math.round(max)}°C
      </Typography>
      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
        Máxima
      </Typography>
    </Box>
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <ArrowDownwardIcon sx={{ color: '#4444ff', fontSize: 30 }} />
      <Typography variant="h6" sx={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
        {Math.round(min)}°C
      </Typography>
      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
        Mínima
      </Typography>
    </Box>
  </Box>
);

export default TemperatureRange;
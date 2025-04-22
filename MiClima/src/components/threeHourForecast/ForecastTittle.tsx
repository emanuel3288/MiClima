import { Box, Typography } from '@mui/material';
import { LocationOn as LocationIcon } from '@mui/icons-material';

interface ForecastHeaderProps {
  city: string;
}

const ForecastHeader = ({ city }: ForecastHeaderProps) => (
  <Box sx={{ 
    background: 'linear-gradient(135deg, #3f51b5, #2196f3)',
    color: 'white',
    p: 2,
    borderRadius: '12px',
    mb: 2,
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  }}>
    <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
      <LocationIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
      Pronóstico cada 3h en {city}
    </Typography>
  </Box>
);

export default ForecastHeader;
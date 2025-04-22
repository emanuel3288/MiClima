import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface WeatherDetailItemProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  unit?: string;
}

const WeatherDetailItem = ({ icon, label, value, unit }: WeatherDetailItemProps) => (
  <>
    {icon}
    <Box>
      <Typography variant="body1" sx={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
        {label}
      </Typography>
      <Typography variant="h6" sx={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
        {value} {unit}
      </Typography>
    </Box>
  </>
);

export default WeatherDetailItem;
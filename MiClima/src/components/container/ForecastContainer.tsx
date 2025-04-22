// components/ForecastContainer.tsx
import { Card, CardContent, Typography, Grid } from '@mui/material';

interface ForecastContainerProps {
  title: string;
  children: React.ReactNode;
}

const ForecastContainer = ({ title, children }: ForecastContainerProps) => {
  return (
    <Card 
      sx={{ 
        minWidth: 275,
        background: 'linear-gradient(to bottom,rgba(18, 18, 18, 0.05) 0%,rgba(95, 134, 207, 0.4) 100%)', // Reducido a 0.3 para mayor transparencia
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backdropFilter: 'blur(20px)',
          zIndex: 0
        }
      }}
    >
      <CardContent sx={{ position: 'relative', zIndex: 1 }}>
        <Typography 
          variant="h5" 
          component="div" 
          gutterBottom 
          sx={{ 
            mb: 4,
            color: '#ffffff',
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          {title}
        </Typography>
        <Grid 
          container 
          spacing={3} 
          sx={{ 
            justifyContent: 'center',
            alignItems: 'stretch'
          }}
        >
          {children}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ForecastContainer;

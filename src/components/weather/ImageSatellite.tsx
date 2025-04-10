import { useState, useEffect } from 'react';
import { Box,Typography, CircularProgress } from '@mui/material';

interface MeteoBlueProps {
  lat: number;
  lon: number;
  city: string;
}



const MeteoBlue = ({ lat, lon, city }: MeteoBlueProps) => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Puedes realizar alguna acción aquí si necesitas obtener datos adicionales
    setLoading(false);
  }, [lat, lon]);

  // Función para generar la URL de MeteoBlue con coordenadas geográficas
  const getIframeUrl = () => {
    const baseUrl = `https://www.meteoblue.com/es/tiempo/maps/widget`;
    const params = `?geoloc=fixed&lat=${lat}&lon=${lon}&zoom=4&tempunit=C&windunit=km%252Fh&lengthunit=metric&autowidth=auto`;
    const fullUrl = `${baseUrl}${params}`;
    return fullUrl;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
      <Box sx={{
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 1000,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '8px 16px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <Typography variant="subtitle1" fontWeight="bold">
          {city}
        </Typography>
        <Typography variant="body2">
          Lat: {lat.toFixed(4)}, Lon: {lon.toFixed(4)}
        </Typography>
      </Box>

      <iframe
        src={getIframeUrl()}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          borderRadius: "8px",
          minHeight: "700px",
        }}
        loading="lazy"
        title={`Mapa meteorológico de ${city}`}
      />

      <Box sx={{
        position: 'absolute',
        bottom: 16,
        right: 16,
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
        borderRadius: '6px',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
      }}>
      </Box>
    </Box>
  );
};

export default MeteoBlue;

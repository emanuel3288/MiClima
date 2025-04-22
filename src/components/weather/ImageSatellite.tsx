import { Box, Typography } from '@mui/material';

interface MeteoBlueProps {
  lat: number;
  lon: number;
  city: string;
}

const MeteoBlue = ({ lat, lon, city }: MeteoBlueProps) => {
  const iframeUrl = `https://www.meteoblue.com/es/tiempo/maps/widget?geoloc=fixed&lat=${lat}&lon=${lon}&zoom=4&tempunit=C&windunit=km%2Fh&lengthunit=metric&autowidth=auto`;

  return (
    <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Información de la ciudad */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 1000,
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          px: 2,
          py: 1,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          {city}
        </Typography>
        <Typography variant="body2">
          Lat: {lat.toFixed(4)}, Lon: {lon.toFixed(4)}
        </Typography>
      </Box>

      {/* Mapa de MeteoBlue */}
      <iframe
        src={iframeUrl}
        title={`Mapa meteorológico de ${city}`}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          borderRadius: "8px",
          minHeight: "700px", // ¡No tocado!
        }}
        loading="lazy"
      />

      {/* Placeholder de controles futuros */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          zIndex: 1000,
          backdropFilter: 'blur(4px)',
          borderRadius: 1.5,
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          p: 1,
        }}
      />
    </Box>
  );
};

export default MeteoBlue;

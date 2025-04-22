import { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalculateIcon from '@mui/icons-material/Calculate';

interface ThermalCalculatorProps {
  onCalculate?: (result: number | null) => void;
  onClose?: () => void;
  defaultTemperature?: string;
  defaultHumidity?: string;
  defaultWindSpeed?: string;
}

export const ThermalCalculator = ({ 
  onCalculate, 
  defaultTemperature = "",
  defaultHumidity = "",
  defaultWindSpeed = ""
}: ThermalCalculatorProps) => {
  const [temperature, setTemperature] = useState(defaultTemperature);
  const [humidity, setHumidity] = useState(defaultHumidity);
  const [windSpeed, setWindSpeed] = useState(defaultWindSpeed);
  const [result, setResult] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCalculate = () => {
    const temp = parseFloat(temperature);
    const hum = parseFloat(humidity);
    const wind = parseFloat(windSpeed);

    if (isNaN(temp)) {
      setResult(null);
      onCalculate?.(null);
      return;
    }

    let calculatedResult = temp;

    // Case 1: Wind Chill for cold temperatures (below 10°C) with wind (≥ 4.8 km/h)
    if (temp < 10 && !isNaN(wind) && wind >= 4.8) {
      // Canadian wind chill formula (for °C and km/h)
      calculatedResult = 13.12 + (0.6215 * temp) - 
                       (11.37 * Math.pow(wind, 0.16)) + 
                       (0.3965 * temp * Math.pow(wind, 0.16));
    } 
    // Case 2: Heat index for hot temperatures (above 26°C) with humidity (≥ 40%)
    else if (temp >= 27 && !isNaN(hum) && hum >= 40) {
      // Rothfusz regression for heat index (simplified for °C)
      const c1 = -8.78469475556;
      const c2 = 1.61139411;
      const c3 = 2.33854883889;
      const c4 = -0.14611605;
      const c5 = -0.012308094;
      const c6 = -0.0164248277778;
      const c7 = 0.002211732;
      const c8 = 0.00072546;
      const c9 = -0.000003582;
      
      calculatedResult = c1 + c2 * temp + c3 * hum + c4 * temp * hum +
                        c5 * temp * temp + c6 * hum * hum +
                        c7 * temp * temp * hum + c8 * temp * hum * hum +
                        c9 * temp * temp * hum * hum;
    }

    setResult(calculatedResult);
    onCalculate?.(calculatedResult);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const currentTemp = parseFloat(temperature);
  const currentWind = parseFloat(windSpeed);
  const currentHum = parseFloat(humidity);

  return (
    <Box sx={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      zIndex: 1000,
      transition: 'all 0.3s ease',
      width: isExpanded ? '350px' : 'auto'
    }}>
      {isExpanded ? (
        <Card sx={{ 
          background: 'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)',
          color: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Calculadora de sensación térmica</Typography>
              <IconButton onClick={toggleExpand} sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </Box>

            <TextField
              fullWidth
              label="Temperatura (°C)"
              type="number"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              margin="normal"
              InputProps={{ 
                style: { color: 'white' },
                inputProps: { min: -50, max: 50 } 
              }}
              sx={{
                '& .MuiInputBase-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                },
                '& .MuiInputLabel-root': {
                  color: 'white',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                }
              }}
            />

            <TextField
              fullWidth
              label="Humedad (%)"
              type="number"
              value={humidity}
              onChange={(e) => setHumidity(e.target.value)}
              margin="normal"
              InputProps={{ 
                style: { color: 'white' },
                inputProps: { min: 0, max: 100 } 
              }}
              sx={{
                '& .MuiInputBase-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                },
                '& .MuiInputLabel-root': {
                  color: 'white',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                }
              }}
              disabled={temperature === "" || currentTemp <= 10}
            />

            <TextField
              fullWidth
              label="Velocidad del Viento (km/h)"
              type="number"
              value={windSpeed}
              onChange={(e) => setWindSpeed(e.target.value)}
              margin="normal"
              InputProps={{ 
                style: { color: 'white' },
                inputProps: { min: 0 } 
              }}
              sx={{
                '& .MuiInputBase-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                },
                '& .MuiInputLabel-root': {
                  color: 'white',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                }
              }}
              disabled={temperature === "" || currentTemp >= 27}
            />

            <Button
              fullWidth
              variant="contained"
              startIcon={<CalculateIcon />}
              sx={{ 
                mt: 2,
                backgroundColor: "#ff9800", 
                color: "white",
                '&:hover': {
                  backgroundColor: "#f57c00",
                }
              }}
              onClick={handleCalculate}
              disabled={temperature === ""}
            >
              Calcular
            </Button>

            {result !== null && (
              <Box sx={{ 
                mt: 2,
                p: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <Typography variant="body1">Sensación Térmica:</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {result.toFixed(1)}°C
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                  {currentTemp <= 10 && !isNaN(currentWind) && currentWind >= 4.8 ? 
                    "(Índice de enfriamiento por viento)" : 
                   currentTemp >= 27 && !isNaN(currentHum) && currentHum >= 40 ? 
                    "(Índice de calor)" : 
                    "(Temperatura real)"}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      ) : (
        <IconButton
          onClick={toggleExpand}
          sx={{
            backgroundColor: '#1E3C72',
            color: 'white',
            width: 56,
            height: 56,
            '&:hover': {
              backgroundColor: '#2A5298',
            }
          }}
        >
          <CalculateIcon />
        </IconButton>
      )}
    </Box>
  );
};
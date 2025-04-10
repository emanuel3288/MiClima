// Nuevo componente SolarHours que obtiene los datos de OpenWeather
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";

interface SolarHoursProps {
  city: string;
}

const SolarHours = ({ city }: SolarHoursProps) => {
  const [sunrise, setSunrise] = useState<number | null>(null);
  const [sunset, setSunset] = useState<number | null>(null);

  useEffect(() => {
    const fetchSolarData = async () => {
      try {
        const apiKey = "79031f62f6f0b781003cb9532a437ad7";
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();
        setSunrise(data.sys.sunrise);
        setSunset(data.sys.sunset);
      } catch (error) {
        console.error("Error obteniendo datos de luz solar:", error);
      }
    };

    fetchSolarData();
  }, [city]);

  const calcularHorasLuz = (sunrise: number, sunset: number) => {
    const segundosLuz = sunset - sunrise;
    const horas = Math.floor(segundosLuz / 3600);
    const minutos = Math.floor((segundosLuz % 3600) / 60);
    return `${horas}h ${minutos}m`;
  };

  if (sunrise === null || sunset === null) {
    return <Typography variant="body1" sx={{ color: "yellow", fontWeight: "bold" }}>Cargando...</Typography>;
  }

  const horasLuz = calcularHorasLuz(sunrise, sunset);
  return (
    <Typography variant="body1" sx={{ color: "yellow", fontWeight: "bold" }}>
      ☀️ {horasLuz} de luz solar diaria
    </Typography>
  );
};

export default SolarHours;

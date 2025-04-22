import { useEffect, useState } from "react";
import { Typography } from "@mui/material";

interface SolarHoursProps {
  city: string;
}

const SolarHours = ({ city }: SolarHoursProps) => {
  const [solarData, setSolarData] = useState<{ sunrise: number; sunset: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSolarData = async () => {
      try {
        const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) throw new Error("No se pudo obtener la información solar");

        const data = await response.json();
        setSolarData({ sunrise: data.sys.sunrise, sunset: data.sys.sunset });
        setError(null);
      } catch (err) {
        console.error("Error obteniendo datos de luz solar:", err);
        setSolarData(null);
        setError("No se pudo cargar la información solar.");
      }
    };

    fetchSolarData();
  }, [city]);

  const calcularHorasLuz = (sunrise: number, sunset: number) => {
    const segundos = sunset - sunrise;
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    return `${horas}h ${minutos}m`;
  };

  if (error) {
    return (
      <Typography variant="body1" color="error">
        {error}
      </Typography>
    );
  }

  if (!solarData) {
    return (
      <Typography variant="body1" sx={{ color: "yellow", fontWeight: "bold" }}>
        Cargando...
      </Typography>
    );
  }

  const horasLuz = calcularHorasLuz(solarData.sunrise, solarData.sunset);

  return (
    <Typography variant="body1" sx={{ color: "yellow", fontWeight: "bold" }}>
      ☀️ {horasLuz} de luz solar diaria
    </Typography>
  );
};

export default SolarHours;

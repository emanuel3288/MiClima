import { useState, useEffect, useCallback } from 'react';

interface Coordinates {
  lat: number;
  lon: number;
}

const DEFAULT_COORDS: Coordinates = { lat: -34.61315, lon: -58.37723 };
const DEFAULT_CITY = 'Buenos Aires';

const useGeolocation = () => {
  const [coordinates, setCoordinates] = useState<Coordinates>(DEFAULT_COORDS);
  const [city, setCity] = useState(DEFAULT_CITY);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCityFromCoords = useCallback(async (lat: number, lon: number): Promise<string | null> => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Error al obtener datos de geolocalización');
      }

      const data = await response.json();
      if (data.length > 0) {
        const cityData = data[0];
        return `${cityData.name}${cityData.state ? `, ${cityData.state}` : ''}, ${cityData.country}`;
      }
      return null;
    } catch (error) {
      console.error('Error fetching city from coordinates:', error);
      return null;
    }
  }, []);

  const handleGeolocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocalización no soportada');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      const cityName = await fetchCityFromCoords(latitude, longitude);
      
      if (cityName) {
        setCity(cityName);
        setCoordinates({ lat: latitude, lon: longitude });
      } else {
        throw new Error('No se pudo determinar la ciudad');
      }
    } catch (err) {
      console.error('Error en geolocalización:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setCity(DEFAULT_CITY);
      setCoordinates(DEFAULT_COORDS);
    } finally {
      setIsLoading(false);
    }
  }, [fetchCityFromCoords]);

  useEffect(() => {
    handleGeolocation();
  }, [handleGeolocation]);

  return {
    coordinates,
    city,
    isLoading,
    error
  };
};

export default useGeolocation;
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCityFromCoords = useCallback(async (lat: number, lon: number): Promise<string | null> => {
    try {
      const cacheKey = `city-${lat.toFixed(2)}-${lon.toFixed(2)}`;
      const cachedCity = sessionStorage.getItem(cacheKey);
      if (cachedCity) return cachedCity;

      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
      );

      if (!res.ok) throw new Error('Error al obtener la ciudad');

      const data = await res.json();
      if (data.length > 0) {
        const cityName = `${data[0].name}${data[0].state ? `, ${data[0].state}` : ''}, ${data[0].country}`;
        sessionStorage.setItem(cacheKey, cityName);
        return cityName;
      }

      return null;
    } catch (err) {
      console.error('fetchCityFromCoords:', err);
      return null;
    }
  }, []);

  const handleGeolocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocalización no soportada');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 60000,
        });
      });

      const { latitude, longitude } = position.coords;
      const cityName = await fetchCityFromCoords(latitude, longitude);

      if (cityName) {
        setCity(cityName);
        setCoordinates({ lat: latitude, lon: longitude });
      }
    } catch (err) {
      console.error('handleGeolocation:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, [fetchCityFromCoords]);

  useEffect(() => {
    // Esperamos al "idle" para no interferir con LCP
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(handleGeolocation);
    } else {
      setTimeout(handleGeolocation, 300); // Fallback
    }
  }, [handleGeolocation]);

  return { coordinates, city, isLoading, error };
};

export default useGeolocation;

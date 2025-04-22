import { useState, useCallback } from 'react';

interface CitySuggestion {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
  countryCode?: string;
}

interface SearchData {
  city: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  sunrise: number;
  sunset: number;
}

const useCitySearch = (
  setBackgroundImage: (url: string) => void,
  inputValue: string,
  setInputValue: (value: string) => void
) => {
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchData, setSearchData] = useState<SearchData | null>(null);

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unknown error occurred';
  };

  const fetchCityImage = useCallback(async (cityName: string) => {
    // Verificar si la imagen está en cache
    const cachedImage = localStorage.getItem(cityName);
    if (cachedImage) {
      setBackgroundImage(cachedImage);
      return;
    }

    try {
      const response = await fetch(`https://api.pexels.com/v1/search?query=${cityName} city landmarks&per_page=1`, {
        headers: {
          Authorization: import.meta.env.VITE_PEXELS_API_KEY
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.photos?.length > 0) {
        const imageUrl = data.photos[0].src.large2x;
        localStorage.setItem(cityName, imageUrl); // Guardar la imagen en cache
        setBackgroundImage(imageUrl);
      } else {
        const fallbackResponse = await fetch('https://api.pexels.com/v1/search?query=city skyline&per_page=1', {
          headers: {
            Authorization: import.meta.env.VITE_PEXELS_API_KEY
          }
        });
        
        if (!fallbackResponse.ok) {
          throw new Error(`Fallback HTTP error! status: ${fallbackResponse.status}`);
        }
        
        const fallbackData = await fallbackResponse.json();
        if (fallbackData.photos?.length > 0) {
          const fallbackImageUrl = fallbackData.photos[0].src.large2x;
          localStorage.setItem(cityName, fallbackImageUrl); // Guardar la imagen en cache
          setBackgroundImage(fallbackImageUrl);
        }
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      console.error('Error fetching city image:', errorMessage);
      setError('No se pudo cargar la imagen de fondo para esta ciudad');
    }
  }, [setBackgroundImage]);

  const fetchCityCoordinates = useCallback(async (cityName: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon, name, country, state } = data[0];
        const fullCityName = `${name}${state ? `, ${state}` : ''}, ${country}`;
        
        console.log('📍 City Data:', {
          input: cityName,
          normalized: fullCityName,
          coordinates: { lat, lon },
          details: { name, state, country },
          source: 'OpenWeather Geo API v1.0'
        });

        await fetchCityImage(fullCityName);
        
        const newSearchData = {
          city: fullCityName,
          coordinates: { lat, lon },
          sunrise: 0,
          sunset: 0
        };
        
        setSearchData(newSearchData);
        return newSearchData;
      }
      throw new Error('City not found in API response');
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      console.error('Error fetching city coordinates:', {
        error: errorMessage,
        input: cityName
      });
      setError('No se pudo encontrar la ciudad especificada');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchCityImage]);

  const fetchCitySuggestions = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('🔍 Suggestions:', {
        query,
        results: data.map((item: CitySuggestion) => ({
          name: item.name,
          country: item.country,
          coordinates: { lat: item.lat, lon: item.lon }
        })),
        count: data.length
      });
      
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      console.error('Error fetching city suggestions:', {
        error: errorMessage,
        query
      });
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    fetchCitySuggestions(value);
  }, [fetchCitySuggestions, setInputValue]);

  const handleCitySearch = useCallback(async () => {
    if (!inputValue.trim()) {
      setError('Por favor ingrese una ciudad');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchCityCoordinates(inputValue);
      if (!result) {
        setError('No se pudieron obtener los datos de la ciudad');
      } else {
        setInputValue(''); // Limpiar input después de búsqueda exitosa
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      console.error('Error in city search:', {
        error: errorMessage,
        input: inputValue
      });
      setError('Error al buscar la ciudad');
    } finally {
      setIsLoading(false);
      setShowSuggestions(false);
    }
  }, [inputValue, fetchCityCoordinates, setInputValue]);

  const handleSuggestionClick = useCallback(async (suggestion: CitySuggestion) => {
    const cityName = `${suggestion.name}${suggestion.state ? `, ${suggestion.state}` : ''}, ${suggestion.country}`;
    
    console.log('👉 Selected Suggestion:', {
      selected: cityName,
      coordinates: { lat: suggestion.lat, lon: suggestion.lon },
      source: 'User click from dropdown'
    });

    setInputValue(cityName);
    setShowSuggestions(false);
    setIsLoading(true);
    try {
      await fetchCityCoordinates(cityName);
      setInputValue(''); // Limpiar input después de selección exitosa
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      console.error('Error loading city data:', {
        error: errorMessage,
        city: cityName
      });
    } finally {
      setIsLoading(false);
    }
  }, [fetchCityCoordinates, setInputValue]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      console.log('⌨️ Search triggered by Enter key');
      handleCitySearch();
    }
  }, [handleCitySearch]);

  return {
    suggestions,
    showSuggestions,
    isLoading,
    error,
    handleInputChange,
    handleCitySearch,
    handleSuggestionClick,
    handleKeyDown,
    searchData
  };
};

export default useCitySearch;

import { useState, useEffect } from "react";
import { Box, Container, Snackbar, Alert } from "@mui/material";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import CitySearch from "../layoutApp/CitySearch";
import WeatherDashboard from "../layoutApp/WeatherDashboard";
import useGeolocation from "../layoutApp/useGeolocation";
import useCitySearch from "../layoutApp/useCitySearch";

// Función para convertir Unix timestamp a hora y minutos
const convertUnixToTime = (timestamp: number) => {
  const date = new Date(timestamp * 1000); // Convertimos de segundos a milisegundos
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
};

interface ErrorSnackbarProps {
  error: string | null;
  onClose: () => void;
}

const ErrorSnackbar = ({ error, onClose }: ErrorSnackbarProps) => {
  const [open, setOpen] = useState<boolean>(!!error);

  useEffect(() => {
    setOpen(!!error);
  }, [error]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  if (!error) return null;

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={handleClose} severity="warning" sx={{ width: "100%" }}>
        {error}
      </Alert>
    </Snackbar>
  );
};

const AppLayout = () => {
  const [backgroundImage, setBackgroundImage] = useState<string>(
    "https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=1920"
  );
  const [currentError, setCurrentError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

  const [weatherData, setWeatherData] = useState({
    city: "Buenos Aires",
    coordinates: { lat: -34.61315, lon: -58.37723 },
    sunrise: 0,
    sunset: 0,
  });

  const [mapData, setMapData] = useState({
    city: "buenos-aires",
    coordinates: { lat: -34.61315, lon: -58.37723 },
  });

  const [recentCities, setRecentCities] = useState<
    { name: string; coordinates: { lat: number; lon: number } }[]
  >([]);

  const { coordinates: geoCoords, city: geoCity, isLoading: geoLoading, error: geoError } = useGeolocation();
  const {
    suggestions,
    showSuggestions,
    isLoading: searchLoading,
    error: searchError,
    handleInputChange,
    handleCitySearch,
    handleSuggestionClick,
    handleKeyDown,
    searchData,
  } = useCitySearch(setBackgroundImage, inputValue, setInputValue);

  const formatCityForUrl = (cityName: string) => {
    return cityName.split(",")[0].trim().toLowerCase().replace(/\s+/g, "-");
  };

  useEffect(() => {
    if (searchData) {
      const formattedCity = formatCityForUrl(searchData.city);

      setWeatherData({
        city: searchData.city,
        coordinates: searchData.coordinates,
        sunrise: searchData.sunrise,
        sunset: searchData.sunset,
      });

      setMapData({
        city: formattedCity,
        coordinates: searchData.coordinates,
      });

      setRecentCities((prev) => {
        const newCities = [
          { name: searchData.city, coordinates: searchData.coordinates },
          ...prev,
        ];
        return newCities.slice(0, 5);
      });
    } else if (geoCity && geoCoords) {
      const formattedCity = formatCityForUrl(geoCity);

      setWeatherData({
        city: geoCity,
        coordinates: geoCoords,
        sunrise: 0,
        sunset: 0,
      });

      setMapData({
        city: formattedCity,
        coordinates: geoCoords,
      });

      setInputValue(geoCity);
    }
  }, [searchData, geoCity, geoCoords]);

  const isLoading = geoLoading || searchLoading;
  const error = geoError || searchError;

  useEffect(() => {
    if (error) {
      setCurrentError(error);
    }
  }, [error]);

  const handleErrorClose = () => {
    setCurrentError(null);
  };

  const handleCitySelect = (city: string) => {
    const cityData = recentCities.find((cityObj) => cityObj.name === city);

    if (cityData) {
      setWeatherData({
        city: cityData.name,
        coordinates: cityData.coordinates,
        sunrise: 0,
        sunset: 0,
      });

      const formattedCity = formatCityForUrl(city);
      setMapData({
        city: formattedCity,
        coordinates: cityData.coordinates,
      });
    }
  };

  const handleRemoveCity = (cityToRemove: string) => {
    setRecentCities(prevCities => 
      prevCities.filter(cityObj => cityObj.name !== cityToRemove)
    );
  };

  useEffect(() => {
    console.log("Últimas 3 ciudades visitadas:", recentCities);
  }, [recentCities]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url("${backgroundImage}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        transition: "background-image 0.5s ease-in-out",
      }}
    >
      <Header
        city={weatherData.city}
        recentCities={recentCities.map((cityObj) => cityObj.name)}
        sunrise={weatherData.sunrise}  // Ahora pasamos el número directamente
        sunset={weatherData.sunset}    // Ahora pasamos el número directamente
        onCitySelect={handleCitySelect}
        onRemoveCity={handleRemoveCity}
      />

      <Container
        maxWidth="lg"
        sx={{
          mt: 4,
          mb: 4,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          position: "relative",
          px: { xs: 2, sm: 3 },
        }}
      >
        <CitySearch
          inputValue={inputValue}
          isLoading={isLoading}
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          onInputChange={handleInputChange}
          onCitySearch={handleCitySearch}
          onSuggestionClick={handleSuggestionClick}
          onKeyDown={handleKeyDown}
        />

        <WeatherDashboard
          city={weatherData.city}
          coordinates={weatherData.coordinates}
          mapData={mapData}
          isLoading={isLoading}
        />
      </Container>

      <Footer />

      <ErrorSnackbar error={currentError} onClose={handleErrorClose} />
    </Box>
  );
};

export default AppLayout;
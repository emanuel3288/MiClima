import { useState, useEffect, lazy, Suspense, useCallback } from "react";
import { Box, Container, Snackbar, Alert, CircularProgress } from "@mui/material";

const Header = lazy(() => import("../layout/Header"));
const Footer = lazy(() => import("../layout/Footer"));
const CitySearch = lazy(() => import("../layoutApp/CitySearch"));
const WeatherDashboard = lazy(() => import("../layoutApp/WeatherDashboard"));

import useGeolocation from "../layoutApp/useGeolocation";
import useCitySearch from "../layoutApp/useCitySearch";

const defaultCity = "Buenos Aires";
const defaultCoords = { lat: -34.61315, lon: -58.37723 };

const ErrorSnackbar = ({ error, onClose }: { error: string | null; onClose: () => void }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(!!error);
  }, [error]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return error ? (
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
  ) : null;
};

const AppLayout = () => {
  const [backgroundImage, setBackgroundImage] = useState(
    "https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=1920"
  );
  const [currentError, setCurrentError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [recentCities, setRecentCities] = useState<{ name: string; coordinates: { lat: number; lon: number } }[]>([]);

  const [weatherData, setWeatherData] = useState({
    city: defaultCity,
    coordinates: defaultCoords,
    sunrise: 0,
    sunset: 0,
  });

  const [mapData, setMapData] = useState({
    city: "buenos-aires",
    coordinates: defaultCoords,
  });

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

  const formatCityForUrl = useCallback((cityName: string) => cityName.split(",")[0].trim().toLowerCase().replace(/\s+/g, "-"), []);

  const updateData = useCallback((city: string, coords: { lat: number; lon: number }, sunrise = 0, sunset = 0) => {
    const formattedCity = formatCityForUrl(city);

    setWeatherData({ city, coordinates: coords, sunrise, sunset });
    setMapData({ city: formattedCity, coordinates: coords });
    setInputValue(city);

    setRecentCities((prev) => {
      if (prev.some((c) => c.name === city)) return prev;
      return [{ name: city, coordinates: coords }, ...prev].slice(0, 5);
    });
  }, [formatCityForUrl]);

  useEffect(() => {
    if (searchData) {
      updateData(searchData.city, searchData.coordinates, searchData.sunrise, searchData.sunset);
    } else if (geoCity && geoCoords) {
      updateData(geoCity, geoCoords);
    }
  }, [searchData, geoCity, geoCoords, updateData]);

  useEffect(() => {
    if (geoError || searchError) {
      setCurrentError(geoError || searchError);
    }
  }, [geoError, searchError]);

  const handleErrorClose = () => setCurrentError(null);

  const handleCitySelect = useCallback((city: string) => {
    const cityData = recentCities.find((c) => c.name === city);
    if (cityData) {
      setWeatherData({ city: cityData.name, coordinates: cityData.coordinates, sunrise: 0, sunset: 0 });
      setMapData({ city: formatCityForUrl(city), coordinates: cityData.coordinates });
    }
  }, [recentCities, formatCityForUrl]);

  const handleRemoveCity = useCallback((cityToRemove: string) => {
    setRecentCities((prev) => prev.filter((c) => c.name !== cityToRemove));
  }, []);

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
      <Suspense fallback={<CircularProgress color="inherit" size={24} />}>
        <Header
          city={weatherData.city}
          recentCities={recentCities.map((c) => c.name)}
          sunrise={weatherData.sunrise}
          sunset={weatherData.sunset}
          onCitySelect={handleCitySelect}
          onRemoveCity={handleRemoveCity}
        />
      </Suspense>

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
        <Suspense fallback={<CircularProgress color="inherit" size={24} />}>
          <CitySearch
            inputValue={inputValue}
            isLoading={geoLoading || searchLoading}
            suggestions={suggestions}
            showSuggestions={showSuggestions}
            onInputChange={handleInputChange}
            onCitySearch={handleCitySearch}
            onSuggestionClick={handleSuggestionClick}
            onKeyDown={handleKeyDown}
          />
        </Suspense>

        <Suspense fallback={<CircularProgress color="inherit" size={24} />}>
          <WeatherDashboard
            city={weatherData.city}
            coordinates={weatherData.coordinates}
            mapData={mapData}
            isLoading={geoLoading || searchLoading}
          />
        </Suspense>
      </Container>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>

      <ErrorSnackbar error={currentError} onClose={handleErrorClose} />
    </Box>
  );
};

export default AppLayout;
export interface CitySuggestion {
  name: string;
  country: string;
  countryCode?: string;
  state?: string;
  lat: number;
  lon: number;
  }
  
  export interface Coordinates {
    lat: number;
    lon: number;
  }
  
  export interface WeatherData {
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
      humidity?: number;
    };
    weather: {
      description: string;
      icon: string;
    }[];
    wind: {
      speed: number;
      deg: number;
      gust?: number;
    };
  }
  
  export interface SearchData {
    city: string;
    coordinates: Coordinates;
    sunrise: number;  // Sunrise as Unix timestamp
    sunset: number;   // Sunset as Unix timestamp
  }
  
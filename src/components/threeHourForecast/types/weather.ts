// types/weather.ts
export interface ForecastMain {
    temp: number;
    humidity: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure?: number;
    sea_level?: number;
    grnd_level?: number;
  }
  
  export interface ForecastWeather {
    id: number;
    main: string;
    description: string;
    icon: string;
  }
  
  export interface ForecastWind {
    speed: number;
    deg: number;
    gust?: number;
  }
  
  export interface ForecastItem {
    dt: number;
    main: ForecastMain;
    weather: ForecastWeather[];
    wind: ForecastWind;
    clouds?: {
      all: number;
    };
    rain?: {
      '1h'?: number;
      '3h'?: number;
    };
    snow?: {
      '1h'?: number;
      '3h'?: number;
    };
  }
  export interface Props {
    city: string;
    lat: number;
    lon: number;
  }
  
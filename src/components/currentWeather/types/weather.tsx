export interface WeatherMain {
    temp: number;
    pressure: number;
    temp_min: number;
    temp_max: number;
    feels_like: number;
    humidity?: number;
    sea_level?: number;
    grnd_level?: number;
  }
  
  export interface WeatherWind {
    speed: number;
    gust?: number;
    deg: number;
  }
  
  export interface WeatherCondition {
    id: number;
    main: string;
    description: string;
    icon: string;
  }
  
  export interface WeatherSys {
    type?: number;
    id?: number;
    country: string;
    sunrise?: number;
    sunset?: number;
  }
  
  export interface WeatherData {
  coordinates: {
    lat: number;
    lon: number;
    };
    weather: WeatherCondition[];
    base?: string;
    main: WeatherMain;
    visibility?: number;
    wind: WeatherWind;
    clouds?: {
      all: number;
    };
    dt?: number;
    sys: WeatherSys;
    timezone?: number;
    id?: number;
    name: string;
    cod?: number;
  }
  export interface Props {
    city: string;
    lat: number;
    lon: number;
  }
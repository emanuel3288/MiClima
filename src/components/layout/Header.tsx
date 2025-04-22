import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SolarHours from "../SolarHours";

interface HeaderProps {
  city: string;
  recentCities: string[];
  sunrise?: number;
  sunset?: number;
  onCitySelect: (city: string) => void;
  onRemoveCity: (city: string) => void;
}

const Header = ({ city, recentCities, onCitySelect, onRemoveCity }: HeaderProps) => {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#0D47A1" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
        
        {/* LOGO */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              backgroundColor: "orange",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 50,
              height: 50,
            }}
          >
            <WbSunnyIcon sx={{ color: "white", fontSize: 30 }} />
          </Box>
          <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>
            Mi Clima
          </Typography>
        </Box>

        {/* Ciudad actual + Horas de luz centrados */}
        <Box 
          sx={{ 
            display: { xs: "none", md: "flex" }, // Ocultar en xs, mostrar en md
            alignItems: "center", 
            gap: 2, 
            textAlign: "center", 
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)"
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocationOnIcon />
            <Typography variant="h6" sx={{ color: "white" }}>{city}</Typography>
            <SolarHours city={city} />
          </Box>
        </Box>

        {/* Ciudades recientes */}
        <Box 
          sx={{ 
            display: {xs:"none",md: "none" },
            gap: 1 
          }}
        >
          {[...new Set(recentCities)].map((recentCity) => (
            <Box
              key={recentCity}
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "orange",
                color: "white",
                padding: "5px 10px",
                borderRadius: "15px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={() => onCitySelect(recentCity)}
            >
              <Typography variant="body2">{recentCity}</Typography>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveCity(recentCity);
                }}
                sx={{ marginLeft: 1, color: "black" }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  Typography,
  Divider,
  alpha,
  useTheme,
  Fade
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Flag from 'react-world-flags';
import React from 'react';
import { CitySuggestion } from '../../types';

interface CitySearchProps {
  inputValue: string;
  isLoading: boolean;
  suggestions: CitySuggestion[];
  showSuggestions: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCitySearch: () => void;
  onSuggestionClick: (suggestion: CitySuggestion) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const CitySearch = ({
  inputValue,
  isLoading,
  suggestions,
  showSuggestions,
  onInputChange,
  onCitySearch,
  onSuggestionClick,
  onKeyDown
}: CitySearchProps) => {
  const theme = useTheme();

  const renderSuggestion = (suggestion: CitySuggestion, index: number) => (
    <React.Fragment key={`${suggestion.name}-${suggestion.country}-${index}`}>
      <ListItem
        onClick={() => onSuggestionClick(suggestion)}
        sx={{
          py: 1.5,
          px: 2,
          color: 'rgba(255, 255, 255, 0.9)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            transform: 'scale(1.02)',
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: '40px' }}>
          <LocationOnIcon sx={{ color: 'rgba(255, 255, 255, 0.8)' }} />
        </ListItemIcon>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Typography variant="body1" fontWeight="medium">
            {suggestion.name}
          </Typography>
          {suggestion.state && (
            <Typography variant="body2" sx={{ ml: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
              {suggestion.state}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
          <Flag
            code={suggestion.countryCode}
            height="16"
            style={{ filter: 'brightness(0) invert(1) opacity(0.8)' }}
          />
          <Typography
            variant="body2"
            sx={{ ml: 1, color: 'rgba(255, 255, 255, 0.7)' }}
          >
            {suggestion.country}
          </Typography>
        </Box>
      </ListItem>
      {index < suggestions.length - 1 && (
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />
      )}
    </React.Fragment>
  );

  return (
    <Box sx={{ position: 'relative', maxWidth: 600, mx: 'auto', width: '100%', mt: 4 }}>
      <TextField
        fullWidth
        label="Buscar ciudad..."
        placeholder="Ejemplo: Madrid, Tokyo, New York..."
        value={inputValue}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        margin="normal"
        variant="outlined"
        disabled={isLoading}
        sx={{
          '& .MuiOutlinedInput-root': {
            height: 56,
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.common.white, 0.2),
            backdropFilter: 'blur(14px)',
            color: theme.palette.common.white,
            transition: 'all 0.3s ease-in-out',
            '& fieldset': {
              border: '1px solid rgba(255, 255, 255, 0.2)',
            },
            '&:hover': {
              transform: 'scale(1.02)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.4)',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
            },
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={onCitySearch}
                edge="end"
                disabled={isLoading || !inputValue.trim()}
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : <SearchIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Fade in={showSuggestions && suggestions.length > 0}>
        <Paper
          elevation={0}
          sx={{
            position: 'absolute',
            zIndex: theme.zIndex.modal,
            width: '100%',
            mt: 1,
            maxHeight: 400,
            overflow: 'auto',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(18px)',
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 10px 40px 0 rgba(31, 38, 135, 0.2)',
          }}
        >
          <List disablePadding>
            {suggestions.map(renderSuggestion)}
          </List>
        </Paper>
      </Fade>
    </Box>
  );
};

export default CitySearch;

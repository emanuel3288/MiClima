import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter> {/* Router envuelve toda la app */}
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
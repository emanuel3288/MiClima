import React, { useState, useRef } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  IconButton, 
  TextField, 
  Button, 
  InputAdornment, 
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Email, Message, Subject, GitHub, LinkedIn, Twitter } from '@mui/icons-material';
import emailjs from '@emailjs/browser';

const Footer = () => {
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const formRef = useRef<HTMLFormElement>(null);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email.includes('@') || !formData.subject || !formData.message) {
      setSnackbar({
        open: true,
        message: 'Por favor completa todos los campos correctamente',
        severity: 'error'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await emailjs.sendForm(
        'service_3ej9qba',
        'template_climapp',
        formRef.current!,
        '_wMS5z3g6oZJTWS9t'
      );

      setSnackbar({
        open: true,
        message: '¡Mensaje enviado con éxito!',
        severity: 'success'
      });
      setFormData({
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error al enviar:', error);
      setSnackbar({
        open: true,
        message: 'Error al enviar el mensaje. Por favor inténtalo nuevamente.',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        color: 'white'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.light' }}>
              Clima App
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.6 }}>
            Plataforma de información meteorológica con datos en tiempo real.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.light' }}>
              Enlaces Rápidos
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <RouterLink to="/" style={{ textDecoration: 'none' }} onClick={scrollToTop}>
                <Typography sx={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': { 
                    color: 'primary.light',
                    transform: 'translateX(5px)',
                  },
                  display: 'inline-block',
                  transition: 'all 0.3s ease'
                }}>
                  Inicio
                </Typography>
              </RouterLink>
              <RouterLink to="/sobre-nosotros" style={{ textDecoration: 'none' }}>
                <Typography sx={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': { 
                    color: 'primary.light',
                    transform: 'translateX(5px)',
                  },
                  display: 'inline-block',
                  transition: 'all 0.3s ease'
                }}>
                  Sobre Nosotros
                </Typography>
              </RouterLink>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.light' }}>
              Contáctanos
            </Typography>
            
            <Box 
              component="form" 
              ref={formRef}
              onSubmit={handleSubmit}
              sx={{
                '& .MuiTextField-root': { 
                  mb: 2,
                  '& .MuiInputBase-root': {
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)'
                    }
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                  },
                  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.light',
                    borderWidth: '1px'
                  }
                }
              }}
            >
              <TextField
                fullWidth
                placeholder="Tu correo electrónico"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    color: 'white',
                    py: 1.5
                  }
                }}
              />
              
              <TextField
                fullWidth
                placeholder="Asunto"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Subject sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    color: 'white',
                    py: 1.5
                  }
                }}
              />
              
              <TextField
                fullWidth
                placeholder="Tu mensaje"
                name="message"
                value={formData.message}
                onChange={handleChange}
                multiline
                rows={3}
                required
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignItems: 'flex-start', mt: 1 }}>
                      <Message sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    color: 'white',
                  }
                }}
              />
              
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitting}
                size="medium"
                sx={{
                  py: 1.5,
                  fontWeight: 'bold',
                  mt: 1,
                  borderRadius: '8px',
                  backgroundColor: 'primary.light',
                  color: 'primary.dark',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  },
                  transition: 'all 0.3s ease',
                }}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
              </Button>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © {new Date().getFullYear()} Clima App. Todos los derechos reservados.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
              <IconButton 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'primary.light',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease'
                }}
                aria-label="GitHub"
                component="a"
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHub fontSize="small" />
              </IconButton>
              <IconButton 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'primary.light',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease'
                }}
                aria-label="LinkedIn"
                component="a"
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedIn fontSize="small" />
              </IconButton>
              <IconButton 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'primary.light',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease'
                }}
                aria-label="Twitter"
                component="a"
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Footer;
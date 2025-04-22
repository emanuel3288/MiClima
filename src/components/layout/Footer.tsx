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
  const [formData, setFormData] = useState({ email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { email, subject, message } = formData;
    if (!email.includes('@') || !subject || !message) {
      setSnackbar({
        open: true,
        message: 'Por favor completa todos los campos correctamente',
        severity: 'error',
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
        severity: 'success',
      });
      setFormData({ email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error al enviar:', error);
      setSnackbar({
        open: true,
        message: 'Error al enviar el mensaje. Por favor inténtalo nuevamente.',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  const iconButtonStyles = {
    color: 'rgba(255, 255, 255, 0.7)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: 'primary.light',
      transform: 'translateY(-2px)',
    },
  };

  const linkStyles = {
    color: 'rgba(255, 255, 255, 0.9)',
    display: 'inline-block',
    transition: 'all 0.3s ease',
    '&:hover': {
      color: 'primary.light',
      transform: 'translateX(5px)',
    },
  };

  const inputBaseStyles = {
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
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
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* Descripción */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.light' }} gutterBottom>
              Clima App
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.6 }}>
              Plataforma de información meteorológica con datos en tiempo real.
            </Typography>
          </Grid>

          {/* Enlaces */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.light' }} gutterBottom>
              Enlaces Rápidos
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <RouterLink to="/" onClick={scrollToTop} style={{ textDecoration: 'none' }}>
                <Typography sx={linkStyles}>Inicio</Typography>
              </RouterLink>
              <RouterLink to="/sobre-nosotros" style={{ textDecoration: 'none' }}>
                <Typography sx={linkStyles}>Sobre Nosotros</Typography>
              </RouterLink>
            </Box>
          </Grid>

          {/* Formulario */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.light' }} gutterBottom>
              Contáctanos
            </Typography>
            <Box component="form" ref={formRef} onSubmit={handleSubmit}>
              {[
                {
                  name: 'email',
                  placeholder: 'Tu correo electrónico',
                  icon: <Email />,
                  type: 'email',
                },
                {
                  name: 'subject',
                  placeholder: 'Asunto',
                  icon: <Subject />,
                },
              ].map((field) => (
                <TextField
                  key={field.name}
                  fullWidth
                  required
                  size="small"
                  type={field.type || 'text'}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {React.cloneElement(field.icon, {
                          sx: { color: 'rgba(255, 255, 255, 0.7)' },
                        })}
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 2,
                    '& .MuiInputBase-root': inputBaseStyles,
                    '& .MuiInputBase-input': { color: 'white', py: 1.5 },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.light',
                      borderWidth: 1,
                    },
                  }}
                />
              ))}

              <TextField
                fullWidth
                required
                multiline
                rows={3}
                size="small"
                name="message"
                placeholder="Tu mensaje"
                value={formData.message}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ mt: 1 }}>
                      <Message sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputBase-root': inputBaseStyles,
                  '& .MuiInputBase-input': { color: 'white' },
                  mb: 2,
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitting}
                size="medium"
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                sx={{
                  py: 1.5,
                  fontWeight: 'bold',
                  mt: 1,
                  borderRadius: 2,
                  backgroundColor: 'primary.light',
                  color: 'primary.dark',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Social + Copyright */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © {new Date().getFullYear()} Clima App. Todos los derechos reservados.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
              {[{ icon: GitHub, url: 'https://github.com' }, { icon: LinkedIn, url: 'https://linkedin.com' }, { icon: Twitter, url: 'https://twitter.com' }].map(({ icon: Icon, url }, i) => (
                <IconButton
                  key={i}
                  sx={iconButtonStyles}
                  aria-label={url}
                  component="a"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={snackbar.severity} onClose={handleCloseSnackbar} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Footer;

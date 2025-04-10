import React, { useState, useRef } from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  InputAdornment, 
  CircularProgress,
  Snackbar,
  Alert,
  Paper,
  Grid
} from '@mui/material';
import { Email, Person, Message, Subject } from '@mui/icons-material';
import emailjs from '@emailjs/browser';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email.includes('@') || !formData.subject || !formData.message) {
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
        name: '',
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
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '500px', // Mismo ancho que el contenedor de forecast
        mx: 'auto',
        px: 2,
        my: 4
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.08)',
          borderLeft: '4px solid #3f51b5'
        }}
      >
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            fontWeight: 'bold',
            mb: 3,
            textAlign: 'center',
            color: 'text.primary'
          }}
        >
          <Message sx={{ verticalAlign: 'middle', mr: 1 }} />
          Formulario de Contacto
        </Typography>

        <form ref={formRef} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Asunto"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Subject color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mensaje"
                name="message"
                value={formData.message}
                onChange={handleChange}
                multiline
                rows={4}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Message color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitting}
                size="large"
                sx={{
                  py: 1.5,
                  fontWeight: 'bold',
                  mt: 1
                }}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactForm;
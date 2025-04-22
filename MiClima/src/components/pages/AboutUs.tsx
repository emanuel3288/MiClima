import { Box, Container, Typography, Grid, Card, Avatar } from '@mui/material';
import CloudIcon from '@mui/icons-material/Cloud';
import DevicesIcon from '@mui/icons-material/Devices';
import SpeedIcon from '@mui/icons-material/Speed';

const AboutUs = () => {
  const features = [
    {
      icon: <CloudIcon sx={{ fontSize: 40 }} />,
      title: 'Datos Precisos',
      description: 'Utilizamos fuentes confiables para proporcionar la información meteorológica más precisa y actualizada.',
      gradient: 'linear-gradient(135deg, #00C6FB 0%, #005BEA 100%)'
    },
    {
      icon: <DevicesIcon sx={{ fontSize: 40 }} />,
      title: 'Diseño Responsivo',
      description: 'Nuestra aplicación se adapta perfectamente a cualquier dispositivo, desde móviles hasta pantallas de escritorio.',
      gradient: 'linear-gradient(135deg, #F6D242 0%, #FF52E5 100%)'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: 'Actualizaciones en Tiempo Real',
      description: 'Datos meteorológicos actualizados constantemente para mantenerte informado en todo momento.',
      gradient: 'linear-gradient(135deg, #69FF97 0%, #00E4FF 100%)'
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("https://www.transparenttextures.com/patterns/cubes.png")',
        opacity: 0.1,
        zIndex: 1
      }
    }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: 8 }}>
        {/* Sección Hero */}
        <Box sx={{ 
          textAlign: 'center', 
          mb: 8,
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '150px',
            height: '4px',
            background: 'linear-gradient(90deg, #00C6FB, #005BEA)',
            borderRadius: '2px'
          }
        }}>
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              color: 'white',
              fontWeight: 900,
              mb: 3,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              letterSpacing: '-1px'
            }}
          >
            Sobre Nosotros
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              mb: 4,
              maxWidth: '800px',
              mx: 'auto',
              textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
              lineHeight: 1.6
            }}
          >
            Somos un equipo apasionado por proporcionar información meteorológica precisa y accesible para todos.
          </Typography>
        </Box>

        {/* Características */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{
                height: '100%',
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease-in-out',
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: feature.gradient
                },
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  '& .MuiAvatar-root': {
                    background: feature.gradient,
                    transform: 'scale(1.1) rotate(10deg)'
                  }
                }
              }}>
                <Avatar sx={{ 
                  width: 80, 
                  height: 80, 
                  background: 'rgba(255, 255, 255, 0.1)',
                  mb: 3,
                  color: 'white',
                  transition: 'all 0.3s ease-in-out'
                }}>
                  {feature.icon}
                </Avatar>
                <Typography 
                  variant="h5" 
                  component="h3" 
                  sx={{ 
                    color: 'white',
                    mb: 2,
                    fontWeight: 'bold',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                    lineHeight: 1.6
                  }}
                >
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Misión */}
        <Box sx={{ 
          textAlign: 'center',
          p: 6,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
          backdropFilter: 'blur(20px)',
          borderRadius: '30px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at top right, rgba(0, 198, 251, 0.1), transparent 70%)',
            zIndex: 0
          }
        }}>
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              color: 'white',
              mb: 3,
              fontWeight: 900,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              position: 'relative',
              zIndex: 1
            }}
          >
            Nuestra Misión
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: '800px',
              mx: 'auto',
              fontSize: '1.2rem',
              lineHeight: 1.8,
              textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
              position: 'relative',
              zIndex: 1
            }}
          >
            Nos dedicamos a proporcionar información meteorológica precisa y fácil de entender para ayudarte a planificar tu día.
            Nuestro objetivo es mantener a nuestros usuarios informados con datos meteorológicos actualizados y confiables,
            presentados de una manera clara y accesible.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutUs; 
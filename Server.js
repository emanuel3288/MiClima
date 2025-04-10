import express from 'express';
import axios from 'axios';

const app = express();
const port = 3001;

// Ruta principal ("/")
app.get('/', (req, res) => {
  res.send('¡Servidor Express en funcionamiento!');
});

// Ruta para proxy
app.get('/proxy', async (req, res) => {
  const { url } = req.query; // Obtiene la URL desde el query param 'url'

  if (!url) {
    return res.status(400).send('URL is required');
  }

  try {
    const response = await axios.get(url, { responseType: 'stream' });
    res.setHeader('Content-Type', response.headers['content-type']);
    response.data.pipe(res); // Pasa el contenido de la respuesta al cliente
  } catch (error) {
    console.error('Error al hacer la solicitud:', error);
    res.status(500).send('Error en el servidor');
  }
});

app.listen(port, () => {
  console.log(`Servidor Express corriendo en http://localhost:${port}`);
});

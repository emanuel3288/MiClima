import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, TextField, Typography, IconButton } from '@mui/material';
import { WiDaySunny } from 'react-icons/wi';
import SendIcon from '@mui/icons-material/Send';
import Together from 'together-ai';
import { franc } from 'franc-min';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const WeatherChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const together = new Together({
    apiKey: '3936ad1b041aae4a9cc5c70c457dbf0b6a40a6d9ebd158230cc2a32332039496'
  });

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');

    // Detectar el idioma del mensaje
    const language = franc(input); // Detecta el idioma del texto ingresado

    // Traducir el mensaje al sistema para que sepa en qué idioma responder
    let systemMessage = '';
    if (language === 'spa') {
      systemMessage = 'Eres un experto en meteorología. Responde solo a preguntas relacionadas con el clima y fenómenos meteorológicos en español.';
    } else if (language === 'eng') {
      systemMessage = 'You are a weather expert. Only answer questions related to the weather and meteorological phenomena in English.';
    } else {
      systemMessage = 'Eres un experto en meteorología. Responde solo a preguntas relacionadas con el clima y fenómenos meteorológicos en español.';
    }

    try {
      const response = await together.chat.completions.create({
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: input }
        ],
        model: 'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8',
        max_tokens: 200
      });

      if (response.choices && response.choices[0] && response.choices[0].message && response.choices[0].message.content) {
        const botMessage: Message = { sender: 'bot', text: response.choices[0].message.content.trim() };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else {
        console.warn('No se recibieron respuestas válidas del bot.');
      }
    } catch (error) {
      console.error('Error al obtener respuesta del bot:', error);
    }
  };

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Box sx={{ position: 'fixed', bottom: 0, left: 0, m: 2, zIndex: 1000 }}>
      <Button variant="contained" onClick={toggleChat} startIcon={<WiDaySunny />} style={{ background: "#FF8C00" }}>
        Chat del Clima
      </Button>
      {isOpen && (
        <Box sx={{ width: 320, height: 450, backgroundColor: '#000000', boxShadow: 4, borderRadius: 3, p: 2, mt: 1 }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#ffffff', fontWeight: 'bold' }}>Chat del Clima</Typography>
          <Box
            ref={messageContainerRef}
            sx={{
              height: '80%',
              overflowY: 'auto',
              mb: 1,
              backgroundColor: '#f5f5f5',
              borderRadius: 2,
              p: 2
            }}
          >
            {messages.map((message, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography
                  align={message.sender === 'user' ? 'right' : 'left'}
                  sx={{
                    backgroundColor: message.sender === 'user' ? '#e3f2fd' : '#bbdefb',
                    color: message.sender === 'user' ? '#0d47a1' : '#1e88e5',
                    borderRadius: 2,
                    p: 1,
                    display: 'inline-block',
                    maxWidth: '75%',
                    boxShadow: 1
                  }}
                >
                  {message.text}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={input}
              onChange={handleInputChange}
              placeholder="Escribe tu pregunta..."
              sx={{ backgroundColor: 'white', borderRadius: 2 }}
            />
            <IconButton color="primary" onClick={handleSend}>
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default WeatherChat;

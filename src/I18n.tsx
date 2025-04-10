// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Definir los idiomas soportados y sus traducciones
const resources = {
  en: {
    translation: {
      "welcome": "Welcome to our website",
      "about": "About Us",
      "contact": "Contact",
      "chat_weather": "Weather Chat",
      "ask_question": "Ask your question...",
      "send": "Send",
      "language": "Language"
    }
  },
  es: {
    translation: {
      "welcome": "Bienvenido a nuestro sitio web",
      "about": "Sobre nosotros",
      "contact": "Contacto",
      "chat_weather": "Chat del Clima",
      "ask_question": "Escribe tu pregunta...",
      "send": "Enviar",
      "language": "Idioma"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "es", // Idioma por defecto
    fallbackLng: "es", // Idioma a usar si el idioma preferido no está disponible
    interpolation: {
      escapeValue: false // React ya hace el escape
    }
  });

export default i18n;

import { Routes, Route } from 'react-router-dom';
import HomePage from './components/layoutApp/HomePage';
import AboutUs from './components/pages/AboutUs';

const App = () => {
  return (
    <Routes>
      <Route path="/sobre-nosotros" element={<AboutUs />} />
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
};

export default App;
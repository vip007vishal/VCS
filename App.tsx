
import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { SimulationProvider } from './context/SimulationContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppRouter } from './app/Router';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <SimulationProvider>
        <Router>
          <AppRouter />
        </Router>
      </SimulationProvider>
    </ThemeProvider>
  );
};

export default App;

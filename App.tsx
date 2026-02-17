import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { SimulationProvider } from './context/SimulationContext';
import { AppRouter } from './app/Router';

const App: React.FC = () => {
  return (
    <SimulationProvider>
      <Router>
        <AppRouter />
      </Router>
    </SimulationProvider>
  );
};

export default App;

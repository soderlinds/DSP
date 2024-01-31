import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Merch from './pages/Merch';
import EarnTokens from './pages/EarnTokens';
import AI from './pages/AI';
import Rewards from './pages/Rewards';
import SDV from './pages/SDV';
import "./styles/_app.sass";
import Header from './components/Header';
import { SmartContractProvider } from './SmartContractContext';

function App() {
  return (
    <SmartContractProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/merch" element={<Merch />} />
          <Route path="/earn-tokens" element={<EarnTokens />} />
          <Route path="/ai" element={<AI />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/sdv" element={<SDV />} />
        </Routes>
      </Router>
    </SmartContractProvider>
  );
}

export default App;

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Market from './pages/Market';
import EarnPoints from './pages/EarnPoints';
import AI from './pages/AI';
import Rewards from './pages/Rewards';
import MyWallet from './pages/MyWallet';
import ScoreBoard from './pages/ScoreBoard';
import Admin from './pages/Admin';
import "./styles/_app.sass";
import Header from './components/Header';
import { PointsProvider } from './context/PointsContext';
import { SmartContractProvider } from './SmartContractContext';
import { Web2AuthProvider } from './context/Web2AuthContext';

function App() {
 
  return (
    <PointsProvider>
      <Web2AuthProvider>
      <SmartContractProvider>
          <Router>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/market" element={<Market />} />
              <Route path="/earn-points" element={<EarnPoints />} />
              <Route path="/ai" element={<AI />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/scoreboard" element={<ScoreBoard />} />
              <Route path="/mywallet" element={<MyWallet />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </Router>
      </SmartContractProvider>
      </Web2AuthProvider>
    </PointsProvider>
  );
}

export default App;

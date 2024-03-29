import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Market from './pages/Market';
import Quests from './pages/Quests';
import AI from './pages/AI';
import Rewards from './pages/Rewards';
import MyWallet from './pages/MyWallet';
import LeaderBoard from './pages/LeaderBoard';
import Admin from './pages/Admin';
import "./styles/_app.sass";
import Header from './components/Header';
import { PointsProvider } from './context/PointsContext';
import { SmartContractProvider } from './context/SmartContractContext';
import { NFTProvider } from './context/NFTContext';
import { Web2AuthProvider } from './context/Web2AuthContext';

function App() {
 
  return (
    <PointsProvider>
      <Web2AuthProvider>
      <SmartContractProvider>
      <NFTProvider>
          <Router>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/market" element={<Market />} />
              <Route path="/quests" element={<Quests />} />
              <Route path="/ai" element={<AI />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/leaderboard" element={<LeaderBoard />} />
              <Route path="/mywallet" element={<MyWallet />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </Router>
          </NFTProvider>
      </SmartContractProvider>
      </Web2AuthProvider>
    </PointsProvider>
  );
}

export default App;

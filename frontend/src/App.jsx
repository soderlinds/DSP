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
import { SmartContractProvider } from './SmartContractContext';

function App() {
  const [userId, setUserId] = useState(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    return userData ? userData.id : null;
  });

  const handleLogout = () => {
    setUserId(null);
  };

  return (
    <SmartContractProvider>
      <Router>
        <Header handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home handleLogout={handleLogout} />} />
          <Route path="/market" element={<Market />} />
          <Route path="/earn-points" element={<EarnPoints userId={userId} />} />
          <Route path="/ai" element={<AI />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/scoreboard" element={<ScoreBoard />} />
          <Route path="/mywallet" element={<MyWallet userId={userId} />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </SmartContractProvider>
  );
}

export default App;

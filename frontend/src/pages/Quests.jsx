import React, { useState, useEffect } from 'react';
import usePointsBalance from '../hooks/PointsBalance';
import { useSmartContract } from '../context/SmartContractContext';
import { useWeb2Auth } from '../context/Web2AuthContext'; 
import '../styles/_quests.sass'; 


function EarnPoints() {
  const { account} = useSmartContract();; 
  const { userId } = useWeb2Auth(); 
  const [pointsBalance, earnPoints] = usePointsBalance();

  const identifier = account || userId;

  const handleEarnPoints = (amount) => {
    if (identifier) {
      earnPoints(amount);
      alert(`You earned ${amount} points successfully!`);
    } else {
      alert('You need to be logged in to earn points!');
    }
  };

  return (
    <div className="wrapper">
      <div>
        <p className="earntokens-header">Receive SDV's by doing any of the following ↓</p>
        <div className="earn-item" onClick={() => handleEarnPoints(100)}>
          <span>Online review of a Saloranta & de Vylder production</span>
          <span>100</span>
        </div>
        <div className="earn-item" onClick={() => handleEarnPoints(100)}>
          <span>Post about Saloranta & de Vylder on Instagram</span>
          <span>100</span>
        </div>
        <div className="earn-item" onClick={() => handleEarnPoints(400)}>
          <span>Interview Saloranta & de Vylder for a featured article</span>
          <span>400</span>
        </div>
      </div>
    </div>
  );
}

export default EarnPoints;

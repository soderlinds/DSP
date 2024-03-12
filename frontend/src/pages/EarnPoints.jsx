import React, { useState, useEffect } from 'react';
import { usePoints } from '../context/PointsContext'; 
import { useSmartContract } from '../SmartContractContext'; 
import { useWeb2Auth } from '../context/Web2AuthContext'; 
import '../styles/_earntokens.sass'; 

function EarnPoints() {
  const { account } = useSmartContract();
  const { points, addPoints } = usePoints(); 
  const { userId } = useWeb2Auth(); 
  const [pointsBalance, setPointsBalance] = useState(0);
  const identifier = account ? account : userId; 

  useEffect(() => {
    const totalPointsEarned = points
      .filter(point => point.userId === identifier)
      .reduce((total, point) => total + point.amount, 0);
    setPointsBalance(totalPointsEarned);
  }, [points, identifier]); 

  const earnPoints = (amount) => {
    addPoints(identifier, amount);
    setPointsBalance(prevBalance => prevBalance + amount); 
    alert(`You earned ${amount} points successfully!`);
    console.log(`You earned ${amount} points successfully!`);
  };
  
  console.log('Identifier:', identifier);

  return (
    <div>
      <h2>Earn tokens</h2>
      <div className="container">
        <span>Points balance: </span>{pointsBalance}
        <p className="earntokens-header">Receive SDV's by doing any of the following ↓</p>
        <div className="earn-item" onClick={() => {identifier && earnPoints(100)}}>
          <span>Online review of a Saloranta & de Vylder production</span>
          <span>100</span>
        </div>
        <div className="earn-item" onClick={() => {identifier && earnPoints(100)}}>
          <span>Post about Saloranta & de Vylder on Instagram</span>
          <span>100</span>
        </div>
        <div className="earn-item" onClick={() => {identifier && earnPoints(400)}}>
          <span>Interview Saloranta & de Vylder for a featured article</span>
          <span>400</span>
        </div>
      </div>
    </div>
  );
}

export default EarnPoints;

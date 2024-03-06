import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { useSmartContract } from '../SmartContractContext'; 
import '../styles/_earntokens.sass'; 

function EarnPoints({ userId }) {
  const { account } = useSmartContract(); 
  const [pointsBalance, setPointsBalance] = useState(0);
  const identifier = account ? account : userId; 

  useEffect(() => {
    fetchPointsBalance();
  }, [identifier]); 

//Should be moved - components/pointsBalance
  const fetchPointsBalance = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/points/${identifier}`);
      const transactions = response.data;
      const totalPointsEarned = transactions.reduce((total, transaction) => total + transaction.amount, 0);
      setPointsBalance(totalPointsEarned);
      console.log('Points balance updated:', totalPointsEarned);
    } catch (error) {
      console.error('Error fetching points balance:', error);
    }
  };
  
  //Should be moved - apiService
  const earnPoints = async (amount) => {
    try {
      if (identifier) {
        await axios.post(`http://localhost:5000/api/points/${identifier}`, { amount });
        fetchPointsBalance();
        alert('Points earned successfully!');
      }
    } catch (error) {
      console.error('Error earning points:', error);
    }
  };
  
  console.log('Identifier:', identifier);

  return (
    <div>
      <h2>Earn tokens</h2>
      <div className="container">
        {pointsBalance}
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
          <span>Intervju Saloranta & de Vylder for a featured article</span>
          <span>400</span>
        </div>
      </div>
    </div>
  );
}

export default EarnPoints;
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

  const fetchPointsBalance = async () => {
    try {
      if (identifier) {
        const response = await axios.get(`http://localhost:5000/api/points/${identifier}`);
        const transactions = response.data;
        const totalPointsEarned = transactions.reduce((total, transaction) => total + transaction.amount, 0);
        setPointsBalance(totalPointsEarned);
        console.log('Points balance updated:', totalPointsEarned);
      }
    } catch (error) {
      console.error('Error fetching points balance:', error);
    }
  };
  
  const earnPoints = async () => {
    try {
      if (identifier) {
        await axios.post(`http://localhost:5000/api/points/${identifier}`, { amount: 100 }); 
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
        <p>Points balance: {pointsBalance}</p>
        {identifier && <button onClick={earnPoints}>Earn Points</button>} 
      </div>
    </div>
  );
}

export default EarnPoints;

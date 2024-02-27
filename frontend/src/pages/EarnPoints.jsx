import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import '../styles/_earntokens.sass'; 

function EarnPoints({ userId, account }) { 
  const [pointsBalance, setPointsBalance] = useState(0);

  useEffect(() => {
    fetchPointsBalance();
    console.log("user", userId);
  }, [userId]); 

  const fetchPointsBalance = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/points/${userId}`);
      const transactions = response.data;
      const totalPointsEarned = transactions.reduce((total, transaction) => total + transaction.amount, 0);
      setPointsBalance(totalPointsEarned);
      console.log('Points balance updated:', totalPointsEarned);
    } catch (error) {
      console.error('Error fetching points balance:', error);
    }
  };
  
  const earnPoints = async () => {
    try {
      const idToUse = account || userId; // Use account number for Web3 users
      await axios.post(`http://localhost:5000/api/points/${idToUse}`, { amount: 100 }); 
      fetchPointsBalance();
      alert('Points earned successfully!'); 
    } catch (error) {
      console.error('Error earning points:', error);
    }
  };

  return (
    <div>
      <h2>Earn tokens</h2>
      <div className="container">
        <p>Points balance: {pointsBalance}</p>
        <button onClick={earnPoints}>Earn Points</button>
      </div>
    </div>
  );
}

export default EarnPoints;

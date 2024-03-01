import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSmartContract } from '../SmartContractContext';
import '../styles/_mywallet.sass';

function MyWallet({ userId }) {
  const { account, tokenBalance, exchangePointsForTokens } = useSmartContract();
  const [pointsBalance, setPointsBalance] = useState(0);
  const [pointsToExchange, setPointsToExchange] = useState(0);

  const identifier = account || userId;

  useEffect(() => {
    fetchPointsBalance();
  }, [account, userId, identifier]);

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

  const handleExchange = async () => {
    try {
      const tokensToReceive = Math.floor(pointsToExchange / 1000); 
      await exchangePointsForTokens(tokensToReceive * 1000); 
      await axios.put(`http://localhost:5000/api/points/${identifier}/deduct`, { amount: pointsToExchange });
      await fetchPointsBalance();
      setPointsToExchange(0);
    } catch (error) {
      console.error('Error exchanging points for tokens:', error);
    }
  };

  const exchangeOptions = [];
  for (let i = 1; i <= Math.floor(pointsBalance / 1000); i++) {
    exchangeOptions.push(i * 1000);
  }

  return (
    <div className="container">
      <h2>My Wallet</h2>
      {userId && <p>User ID: {userId}</p>}
      <p>Token Balance: {tokenBalance}</p>
      <p>Points Balance: {pointsBalance}</p>
      <div>
        <select value={pointsToExchange} onChange={(e) => setPointsToExchange(parseInt(e.target.value))}>
          <option value="0">Select Points to Exchange</option>
          {exchangeOptions.map((option) => (
            <option key={option} value={option}>{option} Points</option>
          ))}
        </select>
        <div>
        <button onClick={handleExchange}>Exchange Points for Tokens</button>
        </div>
      </div>
    </div>
  );
}

export default MyWallet;

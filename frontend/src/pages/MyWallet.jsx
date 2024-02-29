import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSmartContract } from '../SmartContractContext';
import '../styles/_mywallet.sass';

function MyWallet({ userId }) {
  const { account, tokenBalance, exchangePointsForTokens } = useSmartContract();
  const [pointsBalance, setPointsBalance] = useState(0);
  const [pointsToExchange, setPointsToExchange] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [exchangeOptions, setExchangeOptions] = useState([]);

  const identifier = account || userId;

  useEffect(() => {
    fetchPointsBalance();
  }, [account, userId, identifier]);

  const fetchPointsBalance = async () => {
    try {
      if (identifier) {
        const response = await axios.get(`http://localhost:5000/api/points/${identifier}`);
        const transactions = response.data;
        const totalPointsEarned = transactions.reduce((total, transaction) => total + transaction.amount, 0);
        setPointsBalance(totalPointsEarned);
        console.log('Points balance updated:', totalPointsEarned);
        generateExchangeOptions(totalPointsEarned);
      }
    } catch (error) {
      console.error('Error fetching points balance:', error);
    }
  };

  const generateExchangeOptions = (totalPoints) => {
    const maxExchangeAmount = Math.floor(totalPoints / 1000) * 1000; 
    const options = [];
    for (let i = 1000; i <= maxExchangeAmount; i += 1000) {
      options.push(i);
    }
    setExchangeOptions(options);
    setSelectedAmount(options[0]); 
  };

  const handleExchange = async () => {
    try {
      if (!identifier) {
        console.error('Identifier not available.');
        return;
      }

  
      await exchangePointsForTokens(selectedAmount / 1000);

      await axios.put(`http://localhost:5000/api/points/${identifier}/deduct`, { amount: selectedAmount });

      await fetchPointsBalance();

      setSelectedAmount(0);
    } catch (error) {
      console.error('Error exchanging points for tokens:', error);
    }
  };

  return (
    <div className="container">
      <h2>My Wallet</h2>
      {identifier && <p>Identifier: {identifier}</p>}
      <p>Token Balance: {tokenBalance}</p>
      <p>Points Balance: {pointsBalance}</p>
      <div className="exchange-section">
        <select value={selectedAmount} onChange={(e) => setSelectedAmount(parseInt(e.target.value))}>
          {exchangeOptions.map((option, index) => (
            <option key={index} value={option}>{option} points - {option / 1000} SDVtoken(s)</option>
          ))}
        </select>
        <button onClick={handleExchange}>Exchange Points for Tokens</button>
      </div>
    </div>
  );
}

export default MyWallet;

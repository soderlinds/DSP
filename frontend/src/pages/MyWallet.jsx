import React from 'react';
import { useSmartContract } from '../SmartContractContext';

function MyWallet() {
  const { active, account, tokenBalance } = useSmartContract();

  return (
    <div className="container">
      <h2>My Wallet</h2>
      <p>Status: {active ? 'Connected' : 'Not Connected'}</p>

          <p>Account: {account}</p>
          <p>Token Balance: {tokenBalance}</p>
      
    </div>
  );
}

export default MyWallet;


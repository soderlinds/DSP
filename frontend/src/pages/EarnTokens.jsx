import React from 'react';
import { useSmartContract } from '../SmartContractContext';

function EarnTokens() {
  const { active, account, tokenBalance, earnTokens } = useSmartContract();

  return (
    <div>
      <h2>Earn tokens </h2>
      <div className="container">
      <p>Status: {active ? 'Connected' : 'Not Connected'}</p>
      <p>Account: {account}</p>
      <p>Token Balance: {tokenBalance}</p>
      <button onClick={() => earnTokens(100)}>Earn tokens</button>
      </div>
    </div>
  );
}

export default EarnTokens;

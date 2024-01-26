import React from 'react';
import { useSmartContract } from '../SmartContractContext';

function AI() {
  const { active, account, tokenBalance, contributeToPerformance } = useSmartContract();

  return (
    <div>
      <h2>AI dialogues: co-creating live art</h2>
      <div className="container">
      <p>Status: {active ? 'Connected' : 'Not Connected'}</p>
      <p>Account: {account}</p>
      <p>Token Balance: {tokenBalance}</p>
      <button onClick={() => contributeToPerformance(100)}>Contribute</button>
      </div>
    </div>
  );
}

export default AI;

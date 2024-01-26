import React from 'react';
import { useSmartContract } from '../SmartContractContext';

function Home() {
  const { active, account, tokenBalance, registerUser } = useSmartContract();

  return (
    <div className="container">
      <h1>SDV LOYALTY GROUP</h1>
      <p>Status: {active ? 'Connected' : 'Not Connected'}</p>

          <p>Account: {account}</p>
          <p>Token Balance: {tokenBalance}</p>

        <button onClick={() => registerUser('example@email.com')}>Register</button>
      
    </div>
  );
}

export default Home;



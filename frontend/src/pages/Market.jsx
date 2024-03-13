import React from 'react';
import { useSmartContract } from '../SmartContractContext';

function Merch() {
  const { active, account, tokenBalance, buyMerch } = useSmartContract();

  return (
    <div>
      <div className="wrapper">
      <p>Status: {active ? 'Connected' : 'Not Connected'}</p>
      <p>Account: {account}</p>
      <p>Token Balance: {tokenBalance}</p>
      <button onClick={() => buyMerch(50)}>Buy Merch</button>
      </div>
    </div>
  );
}

export default Merch;

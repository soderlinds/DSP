import React from 'react';
import { useSmartContract } from '../SmartContractContext';
import '../styles/_earntokens.sass'; 

function EarnTokens() {
  const { earnPoints } = useSmartContract();

  return (
    <div>
      <h2>Earn tokens</h2>
      <div className="container">
        <p className="earntokens-header">Receive SDV's by doing any of the following ↓</p>
        <div className="earn-item" onClick={() => earnPoints(100)}>
          <span>Online review of a Saloranta & de Vylder production</span>
          <span>100</span>
        </div>
        <div className="earn-item" onClick={() => earnPoints(100)}>
          <span>Post about Saloranta & de Vylder on Instagram</span>
          <span>100</span>
        </div>
        <div className="earn-item" onClick={() => earnPoints(400)}>
          <span>Intervju Saloranta & de Vylder for a featured article</span>
          <span>400</span>
        </div>
      </div>
    </div>
  );
}

export default EarnTokens;

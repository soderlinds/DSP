import React, { useState, useEffect } from 'react';
import Web2LoggedInScreen from '../components/Web2LoggedInScreen';
import Web3LoggedInScreen from '../components/Web3LoggedInScreen';
import { useWeb2Auth } from '../context/Web2AuthContext';
import { useSmartContract } from '../context/SmartContractContext';
import ConnectButton from '../components/ConnectButton';


const Homepage = () => {
  const { isLoggedInWeb2, userId, username } = useWeb2Auth();
  const { account } = useSmartContract();
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="container">
      <h1>SDV LOYALTY GROUP</h1>
      <div className="button-wrapper">
      {!isLoggedInWeb2 && !showPopup && !account && ( 
         <ConnectButton size="big" />
      )}
        {isLoggedInWeb2 && !account && (
          <Web2LoggedInScreen userId={userId} username={username} />
        )}
        {account && (
          <Web3LoggedInScreen account={account} />
        )}
      </div>
    </div>
  );
};

export default Homepage;

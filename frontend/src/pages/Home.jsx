import React, { useState, useEffect } from 'react';
import PopupScreen from '../components/PopupScreen';
import Web2LoggedInScreen from '../components/Web2LoggedInScreen';
import Web3LoggedInScreen from '../components/Web3LoggedInScreen';
import { useWeb2Register, useWeb2Login, useWeb2Auth } from '../context/Web2AuthContext';
import { useSmartContract } from '../SmartContractContext'; 
import '../styles/_home.sass';

const Homepage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const register = useWeb2Register();
  const login = useWeb2Login();
  const { isLoggedInWeb2, userId, username } = useWeb2Auth();
  const { active: isWeb3Active } = useSmartContract(); 

  const handleConnectClick = (action) => {
    setSelectedAction(action);
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const handlePopupAction = () => {
    if (selectedAction === 'register') {
      register();
    } else if (selectedAction === 'login') {
      login();
    }
  };

  return (
    <div className="container">
      <h1>SDV LOYALTY GROUP</h1>
      <div className="button-wrapper">
      {!isLoggedInWeb2 && !showPopup && !isWeb3Active && ( 
        <button onClick={() => handleConnectClick('connect')} className="connect-button">Connect</button>
      )}

      {showPopup && (
        <PopupScreen
          handlePopupClose={handlePopupClose}
          handlePopupAction={handlePopupAction}
        />
      )}

      {isLoggedInWeb2 && !isWeb3Active && ( 
        <Web2LoggedInScreen userId={userId} username={username} /> 
      )}

      {isWeb3Active && (
        <Web3LoggedInScreen /> 
      )}
      </div>
    </div>
  );
};

export default Homepage;

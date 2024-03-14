import React, { useState } from 'react';
import PopupScreen from './PopupScreen';
import { useWeb2Register, useWeb2Login, useWeb2Auth } from '../context/Web2AuthContext';
import { useSmartContract } from '../context/SmartContractContext';
import '../styles/_connectbutton.sass';

const ConnectButton = ({ size }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const register = useWeb2Register();
  const login = useWeb2Login();
  const { isLoggedInWeb2, logout: logoutWeb2 } = useWeb2Auth();
  const { account, logoutWeb3 } = useSmartContract(); 

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

  const handleDisconnect = () => {
    if (isLoggedInWeb2) {
      logoutWeb2(); 
    }
    if (account) {
      logoutWeb3();
    }
  };

  const buttonSize = size === 'small' ? 'small-connect-button' : 'big-connect-button';

  return (
    <>
      {isLoggedInWeb2 || account ? ( 
        <button onClick={handleDisconnect} className={`connect-button ${buttonSize}`}>
          Disconnect
        </button>
      ) : (
        <button onClick={() => handleConnectClick('connect')} className={`connect-button ${buttonSize}`}>
          Connect
        </button>
      )}
      {showPopup && (
        <PopupScreen
          handlePopupClose={handlePopupClose}
          handlePopupAction={handlePopupAction}
        />
      )}
    </>
  );
};

export default ConnectButton;

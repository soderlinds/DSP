import React, { useState, useEffect, useContext } from 'react';
import LoggedInSection from './LoggedInSection';
import PopupScreen from './PopupScreen';
import { useSmartContract } from '../SmartContractContext';
import { v4 as uuidv4 } from 'uuid';
import '../styles/_loggedoutsection.sass';

const LoggedOutSection = ({ handleLogin }) => {
  const { connectWeb3 } = useSmartContract();
  const [registrationFormData, setRegistrationFormData] = useState({ name: '', username: '', email: '', password: '' });
  const [loginFormData, setLoginFormData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isWeb2LoggedIn, setIsWeb2LoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const loggedInStatus = localStorage.getItem('isLoggedIn');

    if (userData?.username && loggedInStatus === 'true') {
      setIsLoggedIn(true);
      setIsWeb2LoggedIn(true);
      setUserId(userData.id);
    }
  }, []);

  const handleWeb2Registration = () => {
    if (!registrationFormData.name || !registrationFormData.username || !registrationFormData.email || !registrationFormData.password) {
      alert("Please fill out all fields before registering.");
      return;
    }

    const userData = {
      id: uuidv4(),
      ...registrationFormData
    };
    localStorage.setItem('userData', JSON.stringify(userData));
    setUserId(userData.id);
    localStorage.setItem('isLoggedIn', 'true');
    setShowPopup(false);
  };

  const handleWeb2Login = () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.username === loginFormData.username && userData.password === loginFormData.password) {
      setIsLoggedIn(true);
      setIsWeb2LoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      setUserId(userData.id);
      setShowPopup(false);
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsWeb2LoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    setUserId(null);
  };

  const handleConnectClick = (action) => {
    setSelectedAction(action);
    setShowPopup(true);
    if (action === 'register') {
      handleWeb2Registration();
    } else if (action === 'login') {
      handleWeb2Login();
    } else if (action === 'connectweb3') {
      connectWeb3(); // Call connectWeb3 function
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  return (
    <div className="logged-out-section">
      {!isLoggedIn && !showPopup && (
        <button onClick={() => handleConnectClick('connect')} className="connect-button">Connect</button>
      )}

      {showPopup && <PopupScreen
        handlePopupAction={handleConnectClick}
        handlePopupClose={handlePopupClose}
        selectedAction={selectedAction}
        registrationFormData={registrationFormData}
        setRegistrationFormData={setRegistrationFormData}
        loginFormData={loginFormData}
        setLoginFormData={setLoginFormData}
        loginError={loginError}
        handleWeb2Registration={handleWeb2Registration}
        handleWeb2Login={handleWeb2Login}
        handleConnectWeb3={connectWeb3}
      />}

      {isLoggedIn && (
        <>
          <LoggedInSection isWeb2={isWeb2LoggedIn} handleLogin={handleLogin} userId={userId} />
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </div>
  );
};

export default LoggedOutSection;

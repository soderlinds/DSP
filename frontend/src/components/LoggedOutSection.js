import React, { useState, useEffect, useRef } from 'react';
import LoggedInSection from './LoggedInSection';
import PopupScreen from './PopupScreen';
import { v4 as uuidv4 } from 'uuid';
import '../styles/_loggedoutsection.sass'; 

const LoggedOutSection = ({ handleLogin }) => {
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
    
    if (userData && userData.username && loggedInStatus === 'true') {
      setIsLoggedIn(true);
      setIsWeb2LoggedIn(true);
      setUserId(userData.id); 
    } else {
      setIsLoggedIn(false);
      setIsWeb2LoggedIn(false);
    }
    console.log('LoggedOutSection userId:', userId); 
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
    console.log('User registered successfully:', userData);
    setUserId(userData.id);
    localStorage.setItem('isLoggedIn', 'true');
    setShowPopup(false);
  };

  const handleWeb2Login = () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.username === loginFormData.username && userData.password === loginFormData.password) {
      console.log('User logged in successfully:', userData);
      setIsLoggedIn(true);
      setIsWeb2LoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      setUserId(userData.id);
      setShowPopup(false); 
    } else {
      setLoginError('Invalid username or password');
    }
  };

  //Function not working, doesn't connect properly
  // const handleConnectWeb3 = async () => {
  //   try {
  //     const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  //     console.log('Connected with Web3. Account:', accounts[0]);
  //     setIsLoggedIn(true);
  //     setUserId(null);
  //   } catch (error) {
  //     console.error('Web3 connection error:', error);
  //   }
  // };


  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsWeb2LoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    setUserId(null);
  };

  const handleConnectClick = (action) => {
    setSelectedAction(action);
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const handlePopupAction = () => {
    setShowPopup(false);
    if (selectedAction === 'login') {
      handleWeb2Login();
    } else if (selectedAction === 'register') {
      handleWeb2Registration();
    }
  };

  return (
    <div>
      {!isLoggedIn && !showPopup && (
        <button onClick={() => handleConnectClick('register')}>Connect</button>
      )}

      {showPopup && <PopupScreen
        handlePopupAction={handlePopupAction}
        handlePopupClose={handlePopupClose}
        selectedAction={selectedAction}
        registrationFormData={registrationFormData}
        setRegistrationFormData={setRegistrationFormData}
        loginFormData={loginFormData}
        setLoginFormData={setLoginFormData}
        loginError={loginError}
        handleWeb2Registration={handleWeb2Registration}
        handleWeb2Login={handleWeb2Login}
        // handleConnectWeb3={handleConnectWeb3}
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

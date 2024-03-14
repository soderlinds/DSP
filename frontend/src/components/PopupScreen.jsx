import React, { useEffect, useRef, useState } from 'react';
import { useWeb2Register, useWeb2Login, useWeb2Auth } from '../context/Web2AuthContext';
import { useSmartContract } from '../context/SmartContractContext'; 
import '../styles/_popupscreen.sass'; 

const PopupScreen = ({ handlePopupClose }) => {
  const { isLoggedInWeb2 } = useWeb2Auth();
  const register = useWeb2Register();
  const login = useWeb2Login();
  const { connectWeb3 } = useSmartContract();
  const popupRef = useRef(null);
  const [registrationFormData, setRegistrationFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  });
  const [loginFormData, setLoginFormData] = useState({
    username: '',
    password: ''
  });
  const [isRegistering, setIsRegistering] = useState(false); // Track if registering or logging in

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        handlePopupClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handlePopupClose]);

  const handleWeb2Registration = (e) => {
    e.preventDefault();
    register(registrationFormData);
    setIsRegistering(false); 
  };

  const handleWeb2Login = (e) => {
    e.preventDefault();
    console.log("Submitting login form");
    const loginSuccess = login(loginFormData); 
    if (loginSuccess) {
      handlePopupClose(); 
    }
  };

  const handleConnectWeb3 = async (e) => {
    e.preventDefault();
    connectWeb3(); 
    handlePopupClose(); 
  };

  const toggleRegistrationMode = () => {
    setIsRegistering(!isRegistering);
  };

  const handleClosePopup = () => {
    handlePopupClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content" ref={popupRef}>
        <span className="close" onClick={handleClosePopup}>&times;</span>
        <div className="popup-body">
        {isRegistering ? (
  <div className="register-section">
    <div className="popup-header">SDV LOYALTY GROUP</div>
    <div className="popup-signin">REGISTER</div>
    <form onSubmit={handleWeb2Registration}>
      <input
        type="text"
        placeholder="Name"
        value={registrationFormData.name}
        onChange={(e) => setRegistrationFormData({ ...registrationFormData, name: e.target.value })}
        required // Adding required attribute
      />
      <input
        type="text"
        placeholder="Username"
        value={registrationFormData.username}
        onChange={(e) => setRegistrationFormData({ ...registrationFormData, username: e.target.value })}
        required 
      />
      <input
        type="email"
        placeholder="Email"
        value={registrationFormData.email}
        onChange={(e) => setRegistrationFormData({ ...registrationFormData, email: e.target.value })}
        required 
      />
      <input
        type="text"
        placeholder="Phone Number"
        value={registrationFormData.phoneNumber}
        onChange={(e) => setRegistrationFormData({ ...registrationFormData, phoneNumber: e.target.value })}
        required 
      />
      <input
        type="password"
        placeholder="Password"
        value={registrationFormData.password}
        onChange={(e) => setRegistrationFormData({ ...registrationFormData, password: e.target.value })}
        required 
      />
      <div>
        <button type="submit" className="action-button login">Register</button>
      </div>
    </form>
    <p>Already have an account? <span className="sign-in-link" onClick={toggleRegistrationMode}>SIGN IN</span></p>
  </div>

          ) : (
            <div className="login-section">
              <div className="popup-header">SDV LOYALTY GROUP</div>
              <div className="popup-signin">SIGN IN</div>
              <form onSubmit={handleWeb2Login}>
                <input
                  type="text"
                  placeholder="Username"
                  value={loginFormData.username}
                  onChange={(e) => setLoginFormData({ ...loginFormData, username: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={loginFormData.password}
                  onChange={(e) => setLoginFormData({ ...loginFormData, password: e.target.value })}
                />
                <div>
                  <button type="submit" className="action-button login">Sign in</button>
                </div>
                <div>
                  <button onClick={handleConnectWeb3} className="action-button web3">Connect with web3</button>
                </div>
              </form>
              <p>Don't have an account yet? <span className="sign-in-link" onClick={toggleRegistrationMode}>REGISTER</span></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopupScreen;

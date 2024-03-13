import React, { useEffect, useRef, useState } from 'react';
import { useWeb2Register, useWeb2Login, useWeb2Auth } from '../context/Web2AuthContext';
import '../styles/_popupscreen.sass'; 

const PopupScreen = ({ handlePopupClose }) => {
  const { isLoggedInWeb2 } = useWeb2Auth();
  const register = useWeb2Register();
  const login = useWeb2Login();
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
  };

  const handleWeb2Login = (e) => {
    e.preventDefault();
    console.log("Submitting login form");
    const loginSuccess = login(loginFormData); 
    if (loginSuccess) {
      handlePopupClose(); 
    }
  };
  

  const handleClosePopup = () => {
    if (isLoggedInWeb2) {
      handlePopupClose();
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content" ref={popupRef}>
        <span className="close" onClick={handleClosePopup}>&times;</span>
        <div className="popup-body">
          <div className="register-section">
            <h4>Register</h4>
            <form onSubmit={handleWeb2Registration}>
              <input
                type="text"
                placeholder="Name"
                value={registrationFormData.name}
                onChange={(e) => setRegistrationFormData({ ...registrationFormData, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Username"
                value={registrationFormData.username}
                onChange={(e) => setRegistrationFormData({ ...registrationFormData, username: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                value={registrationFormData.email}
                onChange={(e) => setRegistrationFormData({ ...registrationFormData, email: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                value={registrationFormData.password}
                onChange={(e) => setRegistrationFormData({ ...registrationFormData, password: e.target.value })}
              />
              <div>
              <button type="submit">Register with Web2</button>
              </div>
            </form>
          </div>
          <div className="login-section">
            <h4>Login</h4>
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
              <button type="submit">Login</button>
              </div>
              <div>
              <button>Connect with web3</button> 
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupScreen;

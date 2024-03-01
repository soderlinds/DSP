import React, { useEffect, useRef } from 'react';

import '../styles/_loggedoutsection.sass'; 

const PopupScreen = ({ 
  handlePopupAction, 
  handlePopupClose, 
  registrationFormData, 
  setRegistrationFormData, 
  loginFormData, 
  setLoginFormData, 
  loginError, 
  handleWeb2Registration, 
  handleWeb2Login,
  handleConnectWeb3
}) => {
  const popupRef = useRef(null);

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

  return (
    <div className="popup-overlay">
      <div className="popup-content" ref={popupRef}>
        <span className="close" onClick={handlePopupClose}>&times;</span>
        <div className="popup-body">
          <div className="register-section">
            <h4>Register</h4>
            <form onSubmit={(e) => { e.preventDefault(); handleWeb2Registration(); }}>
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
            <form onSubmit={(e) => { e.preventDefault(); handleWeb2Login(); }}>
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
              {loginError && <p>{loginError}</p>}
            </form>
          </div>
          <div className="web3-section">
            <button onClick={handleConnectWeb3}>Connect with Web3</button>
          </div>
        </div>
        <div className="popup-footer">
          <button onClick={handlePopupAction}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default PopupScreen;
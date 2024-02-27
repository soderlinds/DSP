import React, { useState, useEffect } from 'react';
import LoggedInSection from './LoggedInSection';
import { v4 as uuidv4 } from 'uuid';
import EarnPoints from '../pages/EarnPoints';

const LoggedOutSection = ({ handleLogin }) => {
  const [registrationFormData, setRegistrationFormData] = useState({ name: '', username: '', email: '', password: '' });
  const [loginFormData, setLoginFormData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isWeb2LoggedIn, setIsWeb2LoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);


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
    const userData = {
      id: uuidv4(),
      ...registrationFormData
    };
    localStorage.setItem('userData', JSON.stringify(userData));
    console.log('User registered successfully:', userData);
    setUserId(userData.id);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleWeb2Login = () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.username === loginFormData.username && userData.password === loginFormData.password) {
      console.log('User logged in successfully:', userData);
      setIsLoggedIn(true);
      setIsWeb2LoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      setUserId(userData.id);
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

  return (
    <div>
      {!isLoggedIn ? (
        <>
          <p>Register</p>
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
            <button type="submit">Register with Web2</button>
          </form>

          <p>Login</p>
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
            <button type="submit">Login</button>
            {loginError && <p>{loginError}</p>}
          </form>
        </>
      ) : (
        <>
           <LoggedInSection isWeb2={isWeb2LoggedIn} handleLogin={handleLogin} userId={userId} />
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </div>
  );
};

export default LoggedOutSection;
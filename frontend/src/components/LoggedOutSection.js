import React, { useState, useEffect } from 'react';
import LoggedInSection from './LoggedInSection';

const LoggedOutSection = () => {
  const [registrationFormData, setRegistrationFormData] = useState({ name: '', username: '', email: '', password: '' });
  const [loginFormData, setLoginFormData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.username) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleWeb2Registration = () => {
    localStorage.setItem('userData', JSON.stringify(registrationFormData));
    console.log('User registered successfully:', registrationFormData);
  };

  const handleWeb2Login = () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.username === loginFormData.username && userData.password === loginFormData.password) {
      console.log('User logged in successfully:', userData);
      setIsLoggedIn(true);
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
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
          <LoggedInSection />
          <button onClick={handleLogout}>Logout</button>
        </> 
      )}
    </div>
  );
};

export default LoggedOutSection;

import React from 'react';
import { useWeb2Logout } from '../context/Web2AuthContext';

const Web2LoggedInScreen = ({ userId, username }) => {
  const logout = useWeb2Logout();

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      <p>Welcome {username}</p>
      <p>User ID: {userId}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Web2LoggedInScreen;

import React from 'react';
import LoggedInScreen from '../pages/LoggedInScreen';
import LoginLogoutButton from '../components/LoginLogoutButton';
import { usePrivy } from '@privy-io/react-auth';
import '../styles/_home.sass';

const Homepage = () => {
  const { user, authenticated } = usePrivy(); 

  return (
    <div>
      <h1>SDV LOYALTY GROUP</h1>
      <div className="home-wrapper">
        {user && authenticated ? ( 
          <LoggedInScreen user={user} />
        ) : (
          <LoginLogoutButton /> 
        )}
      </div>
    </div>
  );
};

export default Homepage;

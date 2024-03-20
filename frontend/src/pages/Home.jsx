import React from 'react';
import Web3LoggedInScreen from '../components/Web3LoggedInScreen';
import LoginLogoutButton from '../components/LoginLogoutButton';
import { usePrivy } from '@privy-io/react-auth';
import '../styles/_home.sass';

const Homepage = () => {
  const { user } = usePrivy(); 

  return (
    <div>
      <h1>SDV LOYALTY GROUP</h1>
      <div className="home-wrapper">
        {user && user.id && (
          <Web3LoggedInScreen account={user.account} />
        )}
        <LoginLogoutButton userId={user ? user.id : null} />
      </div>
    </div>
  );
};

export default Homepage;


// import React from 'react';
// import Web2LoggedInScreen from '../components/Web2LoggedInScreen';
// import Web3LoggedInScreen from '../components/Web3LoggedInScreen';
// import { useWeb2Auth } from '../context/Web2AuthContext';
// import { useSmartContract } from '../context/SmartContractContext';
// import LoginLogoutButton from '../components/LoginLogoutButton';
// import '../styles/_home.sass';


// const Homepage = () => {
//   const { isLoggedInWeb2, userId, username } = useWeb2Auth();
//   const { account } = useSmartContract();

//   return (
//     <div>
//       <h1>SDV LOYALTY GROUP</h1>
//       <div className="home-wrapper">
//         {isLoggedInWeb2 && !account && (
//           <Web2LoggedInScreen userId={userId} username={username} />
//         )}
//         {account && (
//           <Web3LoggedInScreen account={account} />
//         )}
//         <LoginLogoutButton />
//       </div>
//     </div>
//   );
// };

// export default Homepage;

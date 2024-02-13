import React, { useState, useEffect } from 'react';
import { useSmartContract } from '../SmartContractContext';

function Home() {
  const { active, account, tokenBalance, registerUser, fetchUsers } = useSmartContract();
  const [users, setUsers] = useState([]);
  const [currentUserStatus, setCurrentUserStatus] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const allUsers = await fetchUsers();
        console.log('All Users:', allUsers); 

        if (allUsers) {
          setUsers(allUsers);

          const currentUser = allUsers.find(user => user.user.toLowerCase() === account.toLowerCase());
          console.log('Current User:', currentUser); 

          if (currentUser) {
            setCurrentUserStatus(currentUser.status);
            console.log('Current User Status:', currentUser.status); 
          } else {
            setCurrentUserStatus(null);
            console.log('Current User Status: Not Found');
          }
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    getUsers();
  }, [fetchUsers, account]);

  return (
    <div className="container">
      <h1>SDV LOYALTY GROUP</h1>
      <p>Status: {active ? 'Connected' : 'Not Connected'}</p>
      <p>Account: {account}</p>
      <p>Token Balance: {tokenBalance}</p>
      <p>Status: {currentUserStatus !== null ? currentUserStatus : 'Loading...'}</p>
      <button onClick={() => registerUser('example@email.com')}>Register</button>
      <div>
        <h4>Users:</h4>
        <ul>
          {users.map((userData, index) => (
            <li key={index}>
              {userData.user} - Status: {userData.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;

import React, { useState, useEffect } from 'react';
import { useSmartContract } from '../SmartContractContext';
import '../styles/_currentuserstatus.sass'; 

const useCurrentUserStatus = () => {
  const { account, fetchUsers } = useSmartContract();
  const [currentUserStatus, setCurrentUserStatus] = useState(null);

  useEffect(() => {
    const fetchCurrentUserStatus = async () => {
      try {
        const allUsers = await fetchUsers();
        if (allUsers) {
          const currentUser = allUsers.find(user => user.user.toLowerCase() === account.toLowerCase());
          setCurrentUserStatus(currentUser ? currentUser.status : null);
        }
      } catch (error) {
        console.error('Error fetching current user status:', error);
      }
    };

    fetchCurrentUserStatus();
  }, [fetchUsers, account]);

  return currentUserStatus;
};

export default useCurrentUserStatus;

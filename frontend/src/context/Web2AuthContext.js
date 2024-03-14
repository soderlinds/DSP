//Context used during testing, implement backend later
import React, { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const Web2AuthContext = createContext();

export const Web2AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoggedInWeb2, setIsLoggedInWeb2] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const storedUsersData = JSON.parse(localStorage.getItem('usersData'));
    if (storedUsersData) {
      const loggedInUser = storedUsersData.find(user => user.isLoggedIn);
      if (loggedInUser) {
        setUserData(loggedInUser);
        setUserId(loggedInUser.id);
        setUsername(loggedInUser.username);
        setIsLoggedInWeb2(true);
      }
    }
  }, []);

  const register = (userData) => {
    const newUserId = uuidv4();
    const userDataWithId = { ...userData, id: newUserId, isLoggedIn: true };
    const storedUsersData = JSON.parse(localStorage.getItem('usersData')) || [];
    const updatedUsersData = [...storedUsersData.filter(user => !user.isLoggedIn), userDataWithId];
    setUserData(userDataWithId);
    setUserId(newUserId);
    setUsername(userData.username);
    localStorage.setItem('usersData', JSON.stringify(updatedUsersData));
  };

  const login = (loginData) => {
    const storedUsersData = JSON.parse(localStorage.getItem('usersData'));
    if (storedUsersData) {
      const currentUser = storedUsersData.find(user => user.username === loginData.username && user.password === loginData.password);
      if (currentUser) {
        currentUser.isLoggedIn = true;
        setUserData(currentUser);
        setUserId(currentUser.id);
        setUsername(currentUser.username);
        setIsLoggedInWeb2(true);
        localStorage.setItem('usersData', JSON.stringify(storedUsersData));
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    const storedUsersData = JSON.parse(localStorage.getItem('usersData')) || [];
    const updatedUsersData = storedUsersData.map(user => {
      if (user.id === userId) {
        return { ...user, isLoggedIn: false };
      }
      return user;
    });
    localStorage.setItem('usersData', JSON.stringify(updatedUsersData));
    setUserData(null);
    setUserId(null);
    setUsername(null);
    setIsLoggedInWeb2(false);
  };
  

  return (
    <Web2AuthContext.Provider value={{ userData, isLoggedInWeb2, userId, username, register, login, logout }}>
      {children}
    </Web2AuthContext.Provider>
  );
};

export const useWeb2Auth = () => useContext(Web2AuthContext);

export const useWeb2Register = () => {
  const { register } = useContext(Web2AuthContext);
  return register;
};

export const useWeb2Login = () => {
  const { login } = useContext(Web2AuthContext);
  return login;
};

export const useWeb2Logout = () => {
  const { logout } = useContext(Web2AuthContext);
  return logout;
};

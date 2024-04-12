//Context used during testing, implement backend later
import React, { createContext, useContext, useEffect, useState } from 'react';

const PointsContext = createContext();

export const PointsProvider = ({ children }) => {
    const [points, setPoints] = useState([]);
  
    useEffect(() => {
      const storedPoints = JSON.parse(localStorage.getItem('userPoints')) || [];
      setPoints(storedPoints);
    }, []);
  
    const updateLocalStorage = (updatedPoints) => {
      localStorage.setItem('userPoints', JSON.stringify(updatedPoints));
    };
  
    const addPoints = (userId, amount) => {
      const updatedPoints = [...points, { userId, amount }];
      setPoints(updatedPoints);
      updateLocalStorage(updatedPoints);
    };
  
    const deductPoints = (userId, amount) => {
        const userPoints = points.find((point) => point.userId === userId);
        if (!userPoints) {
          console.error('User not found');
          return;
        }
      
        if (userPoints.amount < amount) {
          console.error('Insufficient points');
          return;
        }
      
        const updatedPoints = points.map((point) => {
          if (point.userId === userId) {
            return { ...point, amount: point.amount - amount };
          }
          return point;
        });
      
        setPoints(updatedPoints);
        updateLocalStorage(updatedPoints);
      };
      
  
    const getAllPoints = () => {
      return points;
    };
  
    return (
      <PointsContext.Provider
        value={{
          points,
          addPoints,
          deductPoints,
          getAllPoints,
        }}
      >
        {children}
      </PointsContext.Provider>
    );
  };
  

export const usePoints = () => useContext(PointsContext);
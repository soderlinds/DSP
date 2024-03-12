import React, { createContext, useState, useContext } from 'react';

const PointsContext = createContext();

export const PointsProvider = ({ children }) => {
  const [points, setPoints] = useState([]);

  const fetchPointsByUserId = (userId) => {
    return points.filter(point => point.userId === userId);
  };

  const addPoints = (userId, amount) => {
    setPoints(prevPoints => [...prevPoints, { userId, amount, createdAt: new Date() }]);
  };

  const deductPoints = (userId, amount) => {
    setPoints(prevPoints => {
      const userIndex = prevPoints.findIndex(point => point.userId === userId);
      if (userIndex !== -1) {
        const updatedPoints = [...prevPoints];
        updatedPoints[userIndex].amount -= amount;
        return updatedPoints;
      } else {
        console.log("User has no points to deduct.");
        return prevPoints;
      }
    });
  };

  return (
    <PointsContext.Provider value={{ points, fetchPointsByUserId, addPoints, deductPoints }}>
      {children}
    </PointsContext.Provider>
  );
};

export const usePoints = () => useContext(PointsContext);

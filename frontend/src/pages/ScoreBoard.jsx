import React, { useEffect, useState } from 'react';
import { usePoints } from '../context/PointsContext';
import { useSmartContract } from '../SmartContractContext';
import '../styles/_scoreboard.sass';

function ScoreBoard({ userId }) {
  const { getAllPoints } = usePoints();
  const { account } = useSmartContract();
  const [scoreboardData, setScoreboardData] = useState([]);

  useEffect(() => {
    fetchScoreboardData();
  }, [account, userId]); 

  const identifier = account || userId;

  const fetchScoreboardData = async () => {
    try {
      const allPoints = getAllPoints();
      const users = getUsers(allPoints);
      const sortedUsers = sortUsers(users);
      const nonZeroUsers = filterZeroPointsUsers(sortedUsers);
      setScoreboardData(nonZeroUsers);
    } catch (error) {
      console.error('Error fetching scoreboard data:', error);
    }
  };

  const getUsers = (data) => {
    const usersMap = new Map();
    data.forEach((transaction) => {
      const userId = transaction.userId;
      const points = transaction.amount;
      if (!usersMap.has(userId)) {
        usersMap.set(userId, { userId, points });
      } else {
        const existingUser = usersMap.get(userId);
        existingUser.points += points;
        usersMap.set(userId, existingUser);
      }
    });
    return Array.from(usersMap.values());
  };

  const sortUsers = (users) => {
    return users.sort((a, b) => b.points - a.points);
  };

  const filterZeroPointsUsers = (users) => {
    return users.filter((user) => user.points !== 0);
  };

  return (
    <div className="scoreboard">
      <h3>Scoreboard</h3>
      <div className="scoreboard-users">
        {scoreboardData.map((user, index) => (
          <div key={index} className="scoreboard-user">
            <div className="user-rank">#{index + 1}</div>
            <div className="user-info">
              <div className="user-id">{user.userId}</div>
              <div className="user-points">{user.points}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ScoreBoard;

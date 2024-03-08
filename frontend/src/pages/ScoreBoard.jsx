import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/_scoreboard.sass';

function ScoreBoard() {
  const [scoreboardData, setScoreboardData] = useState([]);

  useEffect(() => {
    fetchScoreboardData();
  }, []);

  const fetchScoreboardData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/points');
      const users = getUsers(response.data);
      const sortedUsers = sortUsersByPoints(users);
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

  const sortUsersByPoints = (users) => {
    return users.sort((a, b) => b.points - a.points);
  };

  const filterZeroPointsUsers = (users) => {
    return users.filter((user) => user.points !== 0);
  };

  return (
    <div className="scoreboard">
      <h2>Scoreboard</h2>
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

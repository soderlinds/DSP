import React, { useEffect, useState } from 'react';
import { usePoints } from '../context/PointsContext';
import usePointsBalance from '../hooks/PointsBalance';
import { usePrivy } from '@privy-io/react-auth';
import '../styles/_leaderboard.sass';

function LeaderBoard() {
  const { getAllPoints } = usePoints();
  const { user } = usePrivy();
  const [scoreboardData, setScoreboardData] = useState([]);
  const [pointsBalance] = usePointsBalance(user ? user.id : null);
  const [userRanking, setUserRanking] = useState(null);

  useEffect(() => {
    fetchScoreboardData();
  }, [user ? user.id : null]);

  const identifier = user ? user.id : null; 

  const fetchScoreboardData = async () => {
    try {
      const allPoints = getAllPoints();
      const users = getUsers(allPoints);
      const sortedUsers = sortUsers(users);
      const nonZeroUsers = filterZeroPointsUsers(sortedUsers);
      setScoreboardData(nonZeroUsers);
  
      const currentUserRanking = nonZeroUsers.findIndex(userData => userData.userId === identifier);
      setUserRanking(currentUserRanking !== -1 ? currentUserRanking + 1 : null);
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
      <div className="currentuser-info">
        {identifier && (
          <div className="currentuser-points">Your points:<span className="currentuser"> {pointsBalance}</span>
          {userRanking && <div className="currentuser-ranking">Your ranking:<span className="currentuser"> #{userRanking}</span></div>}
          </div>
        )}
        
      </div>
      <div className="scoreboard-users">
        {scoreboardData.map((user, index) => (
          <div key={index} className={`scoreboard-user ${index < 3 ? `top-${index + 1}` : ''}`}>
            <div className="user-rank">#{index + 1}</div>
            <div className="user-info">
              <div className="user-id">{identifier}</div>
              <div className="user-points-container">
                <div className="user-score">{user.points}p</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LeaderBoard;

import { useState, useEffect } from 'react';
import { usePoints } from '../context/PointsContext';
import { usePrivy } from '@privy-io/react-auth';

function usePointsBalance() {
  const { points, addPoints } = usePoints();
  const { user } = usePrivy();
  const [pointsBalance, setPointsBalance] = useState(0);
  const identifier = user.id;

  useEffect(() => {
    const totalPointsEarned = points
      .filter(point => point.userId === identifier)
      .reduce((total, point) => total + point.amount, 0);
    setPointsBalance(totalPointsEarned);
  }, [points, identifier]);

  const earnPoints = (amount) => {
    addPoints(identifier, amount);
    setPointsBalance(prevBalance => prevBalance + amount);
  };

  return [pointsBalance, earnPoints];
}

export default usePointsBalance;
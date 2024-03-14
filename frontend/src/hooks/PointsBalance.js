import { useState, useEffect } from 'react';
import { usePoints } from '../context/PointsContext';
import { useSmartContract } from '../context/SmartContractContext';
import { useWeb2Auth } from '../context/Web2AuthContext';

function usePointsBalance() {
  const { account } = useSmartContract();
  const { points, addPoints } = usePoints();
  const { userId } = useWeb2Auth();
  const [pointsBalance, setPointsBalance] = useState(0);
  const identifier = account ? account : userId;

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

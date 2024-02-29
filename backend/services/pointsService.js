const points = []; 

exports.getPointsByUserId = async (userId) => {
  return points.filter(point => point.userId === userId);
};

exports.addPoints = async (userId, amount) => {
  points.push({ userId, amount, createdAt: new Date() });
};

exports.deductPoints = async (userId, amount) => {
  const userIndex = points.findIndex(point => point.userId === userId);
  if (userIndex !== -1) {
    points[userIndex].amount -= amount; 
  } else {
    console.log("User has no points to deduct.");
  }
};

exports.getAllPoints = async () => {
  return points;
};
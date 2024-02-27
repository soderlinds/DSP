const points = []; 

exports.getPointsByUserId = async (userId) => {
  return points.filter(point => point.userId === userId);
};

exports.addPoints = async (userId, amount) => {
  points.push({ userId, amount, createdAt: new Date() });
};

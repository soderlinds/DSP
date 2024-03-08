const pointsService = require('../services/pointsService');

exports.getPointsByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const userPoints = await pointsService.getPointsByUserId(userId);

    res.json(userPoints);
  } catch (error) {
    console.error('Error fetching points:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.addPoints = async (req, res) => {
  const { userId } = req.params;
  const { amount } = req.body;
  try {
    await pointsService.addPoints(userId, amount);
    res.json({ message: 'Points added successfully' });
  } catch (error) {
    console.error('Error adding points:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deductPoints = async (req, res) => {
  const { userId } = req.params;
  const { amount } = req.body;
  try {
    await pointsService.deductPoints(userId, amount);
    res.json({ message: 'Points deducted successfully' });
  } catch (error) {
    console.error('Error deducting points:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllPoints = async (req, res) => {
  try {
    const allPoints = await pointsService.getAllPoints();
    res.json(allPoints);
  } catch (error) {
    console.error('Error fetching all points:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
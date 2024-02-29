const express = require('express');
const router = express.Router();
const pointsController = require('../controllers/pointsController');

router.get('/:userId', pointsController.getPointsByUserId);
router.post('/:userId', pointsController.addPoints);
router.put('/:userId/deduct', pointsController.deductPoints);
router.get('/', pointsController.getAllPoints);

module.exports = router;

const express = require('express');
const router = express.Router();
const pointsController = require('../controllers/pointsController');

router.get('/:userId', pointsController.getPointsByUserId);
router.post('/:userId', pointsController.addPoints);

module.exports = router;

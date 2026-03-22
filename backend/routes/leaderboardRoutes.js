const router = require('express').Router();
const controller = require('../controllers/leaderboardController');

router.post('/', controller.addEntry);
router.get('/', controller.getTop);
router.put('/:id', controller.updateEntry);

module.exports = router;
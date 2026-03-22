const router = require('express').Router();
const controller = require('../controllers/highscoreController');

router.post('/', controller.submitHighscore);
router.get('/user/:userId', controller.getUserHighscore); 
router.get('/top', controller.getTopHighscores);       

module.exports = router;
const express = require('express');
const { registerController, loginController, testController } = require('../controllers/authController');
const { isAdmin, requireSignIn } = require('../middlewares/authMiddleware');

const router = express.Router();

// routes

// register POST method
router.post('/register', registerController)
// LOGIN POST METHOD
router.post('/login', loginController)

// test routes get
router.get('/test', requireSignIn, isAdmin, testController)
module.exports = router
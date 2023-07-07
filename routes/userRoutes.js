const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');

  
router.post('/checkEmail', (req, res) => {
  userController.checkEmailExists(req.body)
  .then(resultFromController => res.send(resultFromController));
});

// Route for user registration
router.post('/register', (req, res) => {
  userController.registerUser(req.body)
  .then(resultFromController => res.send(resultFromController))
});

// Route for user authentication
router.post('/login', (req, res) => {
  userController.loginUser(req.body)
  .then(resultFromController => res.send(resultFromController))
});

// Route for retrieving user details
router.post('/details', (req, res) => {
  // Provide the user's ID for the profile controller method
  userController.getProfile({userId: req.body.id})
  .then(resultFromController => res.send(resultFromController))
});

module.exports = router;
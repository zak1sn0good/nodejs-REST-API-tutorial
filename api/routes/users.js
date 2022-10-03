const express = require('express');
const router = express.Router();

const {
  createNewUser,
  logIn,
  deleteUser
} = require('../controllers/usersController');

router.post('/signup', createNewUser);

router.post('/login', logIn);

router.delete('/:userId', deleteUser);

module.exports = router;
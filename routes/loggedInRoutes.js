const express = require('express');

const loggedInRouter = express();

const { showCurrentUser } = require('../controllers/getControllers');

loggedInRouter.get('/current-user', showCurrentUser);

module.exports = {
  loggedInRouter,
};
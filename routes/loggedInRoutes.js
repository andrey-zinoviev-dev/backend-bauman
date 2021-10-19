const express = require('express');

const loggedInRouter = express();

const { showCurrentUser, logoutCurrentUser } = require('../controllers/getControllers');

loggedInRouter.get('/current-user', showCurrentUser);

loggedInRouter.get('/logout-user', logoutCurrentUser);

module.exports = {
  loggedInRouter,
};
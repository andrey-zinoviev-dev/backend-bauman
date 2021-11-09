const express = require('express');

const loggedInRouter = express();

const { showCurrentUser, logoutCurrentUser, showUserOrders } = require('../controllers/getControllers');

loggedInRouter.get('/current-user', showCurrentUser);

loggedInRouter.get('/logout-user', logoutCurrentUser);

loggedInRouter.get('/show-orders',showUserOrders);

module.exports = {
  loggedInRouter,
};
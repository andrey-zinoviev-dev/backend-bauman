const express = require('express');
const postRouter = express();

const { sendLoginData, sendRegisterData, sendServiceOrderData } = require('../controllers/postControllers');

postRouter.post('/login', sendLoginData);
postRouter.post('/register', sendRegisterData);
postRouter.post('/add-service', sendServiceOrderData);

module.exports = {
  postRouter,
}
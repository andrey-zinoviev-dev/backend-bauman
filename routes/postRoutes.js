const express = require('express');
const postRouter = express();

const { sendLoginData, sendRegisterData } = require('../controllers/postControllers');

postRouter.post('/login', sendLoginData);
postRouter.post('/register', sendRegisterData);

module.exports = {
  postRouter,
}
const express = require('express');
const postRouter = express();

const { sendLoginData, sendRegisterData, sendServiceOrderData, changeUserData } = require('../controllers/postControllers');

postRouter.post('/login', sendLoginData);
postRouter.post('/register', sendRegisterData);
postRouter.post('/add-service', sendServiceOrderData);

//измненение данных пользователя
postRouter.put('/change-user-data', changeUserData);
module.exports = {
  postRouter,
}
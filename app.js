require("dotenv").config();

const express = require('express');

const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');

const path = require('path');
// const staticFolder = path.resolve(__dirname, "frontend", "public");

// console.log(staticFolder);

const { wrongAdress } = require('./controllers/getControllers');
const { router } = require('./routes/mainRoutes');
const { postRouter } = require('./routes/postRoutes');
const { loggedInRouter } = require('./routes/loggedInRoutes');

const { userAuth } = require('./middlewares/authentification');

const app = express();

const { port = 3000 } = process.env;

//подключение базы данных
mongoose.connect('mongodb://localhost:27017/electricity');

app.use(express.static(path.join(__dirname, "frontend")));

app.use(express.json());

//подключение парсера кук
app.use(cookieParser());


//если проблемы- убрать app.get("/*"), раскомментировать app.use('/', router)
// app.use('/', router);
app.use('/', postRouter);


//для теста закомментировать проверку авторизации
// app.use(userAuth);

app.use('/', loggedInRouter);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/index.html"));
  // res.send({
  //   path: __dirname + '/index.html',
  // })
  // res.sendFile(path.resolve(__dirname, "public", 'index.html'));
});


// app.get('*', wrongAdress);

app.listen(port, () => {
  console.log('server is up');
  // console.log(staticFolder);
});
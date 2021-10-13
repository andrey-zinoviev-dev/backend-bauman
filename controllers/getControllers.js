const path = require('path');
// const fileLocation = path.join(__dirname, "../public/index.html");

const User = require('../models/user');

const aboutCompany = (req, res) => {
  res.status(200).send({headline: "Информация о компании", content: "Наша компания крайне могучая и сильная, она может сделать все, что угодно, если это законно", partners: ["Газпром", "Роснефть", "Гугл"], crew:["Алексей", "Андрей", "Георгий"]});
};
const showContacs = (req, res) => {
  res.status(200).send({headline: "Наши контакты", phone: "+7 495 123-45-67", email: "dronis_dronis@mail.ru"});
};
const registerPopup = (req, res) => {
  res.status(200).send({
    headline: "Регистрация",
    form: 'register',
    // para: ["Не можете войти?", "Нет учетной записи?"],
    links: ['Войти'],
  });
};
const loginPopup = (req, res) => {
  res.status(200).send({
    headline: "Вход",
    form: 'login',
    links: ["Не можете войти?", "Нет учетной записи?"],
  })
}
const wrongAdress = (req, res) => {
  res.status(200).send({message: "Такой страницы не существует"});
};

const showCurrentUser = (req, res) => {
  if(!req.user) {
    return res.status(401).send({
      message: "Пользователь не найден",
    });
  }
  const { _id } = req.user;
  return User.findById(_id)
  .then((data) => {
    if(!data) {
      return res.status(400).send({
        message: "Пользователь не найден"
      });
    }
    return res.status(200).send(data);
  })
};

const loadCatalogue = (req, res) => {
  // res.sendFile(fileLocation);
  res.status(200).send({ message: "Каталог загружен" });
  
}

module.exports = {
  aboutCompany,
  showContacs,
  registerPopup,
  loginPopup,
  wrongAdress,
  showCurrentUser,
  loadCatalogue
};
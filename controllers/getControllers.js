const path = require('path');
// const fileLocation = path.join(__dirname, "../public/index.html");
const jwt = require('jsonwebtoken');

const User = require('../models/user');

// const aboutCompany = (req, res) => {
//   res.status(200).send({headline: "Информация о компании", content: "Наша компания крайне могучая и сильная, она может сделать все, что угодно, если это законно", partners: ["Газпром", "Роснефть", "Гугл"], crew:["Алексей", "Андрей", "Георгий"]});
// };
// const showContacs = (req, res) => {
//   res.status(200).send({headline: "Наши контакты", phone: "+7 495 123-45-67", email: "dronis_dronis@mail.ru"});
// };
// const registerPopup = (req, res) => {
//   res.status(200).send({
//     headline: "Регистрация",
//     form: 'register',
//     // para: ["Не можете войти?", "Нет учетной записи?"],
//     links: ['Войти'],
//   });
// };
// const loginPopup = (req, res) => {
//   res.status(200).send({
//     headline: "Вход",
//     form: 'login',
//     links: ["Не можете войти?", "Нет учетной записи?"],
//   })
// }
// const wrongAdress = (req, res) => {
//   res.status(200).send({message: "Такой страницы не существует"});
// };

const showCurrentUser = (req, res) => {
  const { token } = req.cookies;
  if(!token) {
    return res.status(403).send({
      message: "Необходима авторизация",
    })
  };

  const payload = jwt.verify(token, process.env.SECRET_KEY);
  const { _id } = payload;

  // if(!req.user) {
  //   return res.status(401).send({
  //     message: "Пользователь не найден",
  //   });
  // }
  
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

const logoutCurrentUser = (req, res) => {
  const { token } = req.cookies;
  if(!token) {
    return res.status(403).send({
      message: "Необходима авторизация",
    })
  }
  return res.cookie('token', "", {
    expires: new Date('Thu, 01 Jan 1970 00:00:00 GMT'),
    httpOnly: true,
  }).status(200).send({
    message: "Успешный выход"
  })
}

const loadCatalogue = (req, res) => {
  // res.sendFile(fileLocation);
  res.status(200).send([{title: "Электрооборудование", image: ""}, {title: "Резервуары", image: ""}, {title: "Электростанции", image: ""}, {title: "Трубопроводы", image: ""}, {title: "Металлоконструкции", image: ""}, {title: "Перемешивающие устройства", image: ""}, {title: "Бесперебойное питание", image: ""}, {title: "Строительные материалы", image: ""}]);
  
}

module.exports = {
  // aboutCompany,
  // showContacs,
  // registerPopup,
  // loginPopup,
  // wrongAdress,
  showCurrentUser,
  logoutCurrentUser,
  loadCatalogue,
};
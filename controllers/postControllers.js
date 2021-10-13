const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const user = require('../models/user');

const User = require('../models/user');

const sendLoginData = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }, (err, doc) => {
    if(!doc) {
      console.log('no');
      return res.status(400).send({
        message: "Пользователь не найден",
      })
    } else {
      return bcrypt.compare(password, doc.password)
      .then((matched) => {
        if(!matched) {
          return res.status(400).send({
            message: "Проверьте пароль",
          });
        }
        const token = jwt.sign({
          _id: doc._id
        }, process.env.SECRET_KEY);
        return res.cookie('token', token, {
          httpOnly: true,
        }).status(200).send({
          result: "Вы успешно вошли",
        });
        // res.status(200).send({payload: token})
      });
    }

  });
  // .then((data) => {
  //   if(data === null) {
  //     return res.status(400).send({
  //       message: "Пользователь не найден",
  //     })
  //   } 
  //   // else {
  //   //   bcrypt.compare(password, data.password)
  //   //   .then((matched) => {
  //   //     const token = jwt.sign({
  //   //       _id: data._id
  //   //     }, process.env.SECRET_KEY);
  //   //     return res.status(200).send({payload: token});
  //   //   });
  //   // }
    
  //   // res.send(data);
  // })
  // .catch(() => {
  //   res.status(400).send({
  //     message: "Пользователь не найден",
  //   });
  // });
  // res.status(200).send({
  //   message: "Вы успешно вошли"
  // });
};

const sendRegisterData = (req, res) => {
  const { login, email, password } = req.body;

  User.findOne({ email })
  .then((user) => {
    if(user) {
      return res.status(400).send({
        message: "Пользователь с такой почтой уже существует",
      }) 
    }
    bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email, password: hash, name: login,
      })
      .then((user) => {
        const token = jwt.sign({
          _id: user._id
        }, process.env.SECRET_KEY);
        res.cookie('token', token, {
          httpOnly: true,
        }).status(201).send({
          result: "Вы успешно создали учетную запись",
        });
        // res.status(201).send({payload: token});
      })
    });
  });
};
module.exports = {
  sendLoginData,
  sendRegisterData,
}
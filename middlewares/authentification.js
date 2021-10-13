const jwt = require('jsonwebtoken');

const userAuth = (req, res, next) => {
  if(!req.cookies.token) {
    return res.status(403).send({
      message: "Необходима авторизация"
    });
  }
  const token = req.cookies.token;
  const payload = jwt.verify(token, process.env.SECRET_KEY);
  req.user = payload;
  next();
};

module.exports = {
  userAuth,
}

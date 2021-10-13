const path = require('path');

const staticPagePath = path.join(__dirname, "../public/index.html");


const loadPage = (req, res, next) => {
  res.sendFile(staticPagePath);
  next();
}

module.exports = {
  loadPage,
}
const express = require('express');
const router = express();
const { loadCatalogue } = require('../controllers/getControllers');

// const { sendLoginData } = require('../controllers/postControllers');

// router.get('/company', aboutCompany);
// router.get('/contacts', showContacs);
// router.get('/register', registerPopup);
// router.get('/login', loginPopup);
router.get('/load-catalogue', loadCatalogue);

// router.post('/login/post', sendLoginData);
module.exports = {
  router,
}

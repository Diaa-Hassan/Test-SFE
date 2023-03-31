const express = require('express');
const userRoutres = require('./userRoutes');

const router = express.Router();

router.use('/user', userRoutres);

module.exports = router;
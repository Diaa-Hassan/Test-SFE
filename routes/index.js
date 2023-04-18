const express = require('express');
const userRoutres = require('./userRoutes');
const blogRoutres = require('./blogRouter');


const router = express.Router();

router.use('/user', userRoutres);
router.use('/blogs', blogRoutres);

module.exports = router;
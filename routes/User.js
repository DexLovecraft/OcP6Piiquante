const express = require('express');
const userControlers = require('../controlers/User')

const router = express.Router();

router.post('/signup', userControlers.signup)
router.post('/login', userControlers.login)

module.exports = router;
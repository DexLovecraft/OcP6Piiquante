const express = require('express');
const sauceControlers = require('../controlers/Sauce');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const router = express.Router();

router.get('/', auth, sauceControlers.getAllSauces)
router.get('/:id', auth, sauceControlers.getOneSauce)
router.post('/', auth, multer, sauceControlers.createOneSauce)
router.put('/:id', auth, multer,sauceControlers.modifyOneSauce)
router.delete('/:id', auth, sauceControlers.deleteOneSauce)
router.post('/:id/like', auth, sauceControlers.isLikeOrDislike)

module.exports = router;
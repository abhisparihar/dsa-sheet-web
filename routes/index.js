var express = require('express');
var router = express.Router();
const { getLogin, postLogin, logout, updateUser } = require('../controller/index');
const { checkAuth } = require('../functions/auth');
const validate = require('../middlewares/validate');
const { updateUserSchema, login } = require('../validations/userValidation');

/* GET home page. */
router.get('/', getLogin);
router.post('/', postLogin);
router.get('/logout', logout);
router.post('/update-completed', checkAuth, validate(updateUserSchema), updateUser);

module.exports = router;

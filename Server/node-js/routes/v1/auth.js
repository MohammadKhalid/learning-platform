const userAuthRouter = require('express').Router();
const AuthController = require('../../controllers/auth.controller');

userAuthRouter.post('/login', AuthController.login);

module.exports = userAuthRouter;
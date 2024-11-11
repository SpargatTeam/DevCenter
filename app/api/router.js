const express = require('express');
const { loginUserLogic } = require('./login/login.js');
const { registerUserLogic } = require('./register/register.js');
const { createFolderLogic } = require('./shared/create.js')
const dotenv = require('dotenv');
dotenv.config();
const appRouter = express.Router();
appRouter.use('/login/', loginUserLogic);
appRouter.use('/shared/create/', createFolderLogic);
if (process.env.API_REGISTER === '1') {
    appRouter.use('/register/', registerUserLogic);
} else {
    console.log('Register route is disabled because API_REGISTER is not set to 1');
}
module.exports = appRouter;
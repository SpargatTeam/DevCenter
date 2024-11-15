const express = require('express');
const { loginUser } = require('./login/login.js');
const { registerUser } = require('./register/register.js');
const { createFolderLogic } = require('./shared/create.js')
const { conectUser } = require('./conect/conect.js')
const dotenv = require('dotenv');
dotenv.config();
const appRouter = express.Router();
appRouter.use('/login/', loginUser);
appRouter.use('/shared/create/', createFolderLogic);
if (process.env.API_REGISTER === '1') {
    appRouter.use('/register/', registerUser);
} else {
    console.log('Register route is disabled because API_REGISTER is not set to 1');
}
appRouter.use('/conect/', conectUser);
module.exports = appRouter;
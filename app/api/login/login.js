const fs = require('fs');
const path = require('path');
const generateAccessToken = require('../token.js');
const usersFilePath = path.join(process.cwd(), 'storage', 'db', 'users.json');
const readUsers = () => {
    if (fs.existsSync(usersFilePath)) {
        const data = fs.readFileSync(usersFilePath, 'utf8');
        return JSON.parse(data) || [];
    }
    return [];
};
const loginUserLogic = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }
    const users = readUsers();
    const user = users.find((u) => u.username === username && u.password === password);
    if (user) {
        user.accessToken = generateAccessToken();
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
        return res.status(200).json({ accessToken: user.accessToken });
    } else {
        return res.status(401).send('Invalid username or password');
    }
};
module.exports = { loginUserLogic };
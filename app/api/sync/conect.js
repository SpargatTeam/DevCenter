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
const conectUser = (req, res) => {
    const { id, accessToken } = req.body;
    if (!id || !accessToken) {
        return res.status(400).send('id and accessToken are required');
    }
    const users = readUsers();
    const user = users.find((u) => u.id === id && u.accessToken === accessToken);
    if (user) {
        user.accessToken = generateAccessToken();
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
        return res.status(200).json({ accessToken: user.accessToken });
    } else {
        return res.status(401).send('Invalid id or accessToken');
    }
};
module.exports = { conectUser };
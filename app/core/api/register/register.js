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
const writeUsers = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};
const registerUser = (req, res) => {
    const { username, email, name, password } = req.body; 
    if (!username || !email || !name || !password) {
        return res.status(400).send('All fields are required');
    }
    const users = readUsers();
    const existingUser_Email = users.find((u) => u.email === email);
    const existingUser_Username = users.find((u) => u.username === username); 
    if (existingUser_Email) {
        return res.status(409).send('Email already exists');
    }
    if (existingUser_Username) {
        return res.status(409).send('Username already exists');
    }
    const newUser  = {
        id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
        accessToken: generateAccessToken(),
        email,
        username,
        name,
        hasPassword: true,
        password,
        theme: 1,
        role: 1
    };
    users.push(newUser );
    writeUsers(users);
    return res.status(201).json({ message: 'User  registered successfully', accessToken: newUser .accessToken });
};
module.exports = { registerUser };
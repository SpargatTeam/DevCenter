const fs = require('fs');
const path = require('path');
const usersFilePath = path.join(process.cwd(), 'storage', 'db', 'users.json');
const staticFilePath = path.join(process.cwd(), 'storage', 'static', 'static.json');
const readUsers = () => {
    if (fs.existsSync(usersFilePath)) {
        const data = fs.readFileSync(usersFilePath, 'utf8');
        return JSON.parse(data) || [];
    }
    return [];
};
const readStatic = () => {
    if (fs.existsSync(staticFilePath)) {
        const data = fs.readFileSync(staticFilePath, 'utf8');
        return JSON.parse(data) || [];
    }
    return [];
};
const writeStatic = (data) => {
    fs.writeFileSync(staticFilePath, JSON.stringify(data, null, 2));
};
const createFolderLogic = (req, res) => {
    const { accessToken, folderName, id } = req.body;
    if (!accessToken || !folderName || !id) {
        return res.status(400).send('Access token, folder name, and user ID are required');
    }
    const users = readUsers();
    const user = users.find(u => u.accessToken === accessToken && u.id === id);
    if (!user) {
        return res.status(401).send('Invalid access token or user ID');
    }
    const folderPath = path.join(process.cwd(), 'storage', 'static', 'storage', folderName);
    fs.mkdir(folderPath, { recursive: true }, (err) => {
        if (err) {
            return res.status(500).send('Error creating folder');
        }
        const staticData = readStatic();
        staticData.push({ folderName, createdBy: user.username, createdAt: new Date(), userId: user.id });
        writeStatic(staticData);
        return res.status(201).send(`Folder "${folderName}" created successfully`);
    });
};
module.exports = { createFolderLogic };
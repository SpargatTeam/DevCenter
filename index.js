const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const whitelist = ['127.0.0.1', '192.168.1.1', '::1'];

const checkWhitelist = (req, res, next) => {
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if (whitelist.includes(clientIP)) {
        next();
    } else {
        res.status(403).json({
            error: '403 Forbidden',
            message: 'Your IP is not allowed',
            ip: clientIP 
        });
        customLog(`403 Forbidden: ${clientIP} is not in the whitelist`);
    }
};

const logToFile = (message) => {
    const logFilePath = path.join(__dirname, 'server.log');
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logFilePath, `${timestamp} - ${message}\n`);
};

const customLog = (message) => {
    console.log(message);
    logToFile(message);
};

app.use(checkWhitelist);

app.use((req, res) => {
    customLog(`404 Not Found: ${req.originalUrl}`);
    const index = path.join(__dirname, 'app', 'pages', '404.html');
    fs.readFile(index, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(404).send('404 Not Found');
        } else {
            res.status(404).send(data);
        }
    });
});

const PORT = 80;
app.listen(PORT, () => {
    customLog(`HTTP server is running on port ${PORT}`);
});
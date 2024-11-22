const express = require('express');
const fs = require('fs');
const path = require('path');
const { customLog } = require('./app/core/func/server/logger.js');
const os = require('os');
require('dotenv').config();
const router = require('./app/core/func/page/router.js');
const app = express();
const whitelist = JSON.parse(fs.readFileSync('storage/db/whitelist.json', 'utf-8'));
const isPublic = process.env.WEB_PUBLIC === '1';
const https = require('https');
const sslOptions = require('./app/core/func/server/https.js');
const checkWhitelist = (req, res, next) => {
    if (isPublic) {
        next();
    } else {
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
    }
};
app.use(checkWhitelist);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/core/pages'));
app.use('/', router);
const PORT = process.env.WEB_PORT;
const { getIPAddress } = require('./app/core/func/server/ip.js');
https.createServer(sslOptions, app).listen(PORT, '0.0.0.0', () => {
    const ipAddress = getIPAddress();
    customLog(`HTTP server is running on port ${PORT}`);
    customLog(`Accessible on localhost at http://localhost:${PORT}`);
    customLog(`Accessible on network at http://${ipAddress}:${PORT}`);
    customLog(`or https://${ipAddress}:${PORT}`);
});
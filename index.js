const express = require('express');
const fs = require('fs');
const path = require('path');
const { customLog } = require('./logger.js');
const os = require('os');
require('dotenv').config();
const routers = require('./app/api/router.js');
const app = express();
const whitelist = JSON.parse(fs.readFileSync('storage/db/whitelist.json', 'utf-8'));
const isPublic = process.env.WEB_PUBLIC === '1';
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
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/pages'));
app.use('/shared/', express.static(path.join(__dirname, 'storage', 'static', 'storage')));
app.use('/assets/', express.static(path.join(__dirname, 'app', 'assets')));
app.use('/api/v1/', routers);
app.get('/', (req, res) => {
    res.render('index');
});
app.get('/login/', (req, res) => {
    res.render('login');
});
if (process.env.API_REGISTER === '1') {
    app.get('/register/', (req, res) => {
        res.render('register');
    });
} else {
    console.log('Register route is disabled because API_REGISTER is not set to 1');
}
app.use((req, res) => {
    customLog(`404 Not Found: ${req.originalUrl}`);
    res.status(404).render('404', { location: req.originalUrl });
});
const PORT = process.env.WEB_PORT;
const getIPAddress = () => {
    const interfaces = os.networkInterfaces();
    for (let iface in interfaces) {
        for (let alias of interfaces[iface]) {
            if (alias.family === 'IPv4' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return 'localhost';
};
app.listen(PORT, '0.0.0.0', () => {
    const ipAddress = getIPAddress();
    customLog(`HTTP server is running on port ${PORT}`);
    customLog(`Accessible on localhost at http://localhost:${PORT}`);
    customLog(`Accessible on network at http://${ipAddress}:${PORT}`);
});
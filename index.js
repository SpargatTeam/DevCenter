const express = require('express');
const fs = require('fs');
const path = require('path');
const { customLog } = require('./app/func/logger.js');
const os = require('os');
require('dotenv').config();
const routers = require('./app/api/router.js');
const app = express();
const whitelist = JSON.parse(fs.readFileSync('storage/db/whitelist.json', 'utf-8'));
const isPublic = process.env.WEB_PUBLIC === '1';
const https = require('https');
const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, 'cert/server.key')), 
    cert: fs.readFileSync(path.join(__dirname, 'cert/server.cert')),
};
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
app.set('views', path.join(__dirname, 'app/pages'));
app.use('/assets/', express.static(path.join(__dirname, 'app', 'assets')));
app.use('/api/v1/', routers);
app.get('/', (req, res) => {
    res.render('index');
});
app.get('/share', (req, res) => {
    res.redirect('/shared/');
});
app.get('/shared/*', (req, res) => {
    const relativePath = decodeURIComponent(req.params[0]);
    const baseDirectory = path.join(__dirname, 'storage', 'static', 'storage');
    const requestedPath = path.join(baseDirectory, relativePath);
    if (!requestedPath.startsWith(baseDirectory)) {
        return res.status(400).send('Invalid path');
    }
    fs.stat(requestedPath, (err, stats) => {
        if (err) {
            return res.status(404).send('File or directory not found');
        }
        if (stats.isDirectory()) {
            fs.readdir(requestedPath, (err, items) => {
                if (err) {
                    return res.status(500).send('Error reading directory');
                }
                const directories = [];
                const files = [];
                items.forEach(item => {
                    const itemPath = path.join(requestedPath, item);
                    const itemStats = fs.statSync(itemPath);
                    const itemInfo = {
                        name: item,
                        isDirectory: itemStats.isDirectory(),
                        url: path.join(req.originalUrl, item) 
                    };
                    if (itemStats.isDirectory()) {
                        directories.push(itemInfo);
                    } else {
                        files.push(itemInfo);
                    }
                });
                res.render('shared', {
                    directories,
                    files,
                    location: req.originalUrl.replace('/shared', '')
                });
            });
        } else {
            res.download(requestedPath);
        }
    });
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
https.createServer(sslOptions, app).listen(PORT, '0.0.0.0', () => {
    const ipAddress = getIPAddress();
    customLog(`HTTP server is running on port ${PORT}`);
    customLog(`Accessible on localhost at http://localhost:${PORT}`);
    customLog(`Accessible on network at http://${ipAddress}:${PORT}`);
    customLog(`or https://${ipAddress}:${PORT}`);
});
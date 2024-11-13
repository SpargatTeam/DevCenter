const express = require('express');
const mustache = require('mustache');
const fs = require('fs');
const path = require('path');
const { customLog } = require('./logger.js');
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
app.use((req, res) => {
    customLog(`404 Not Found: ${req.originalUrl}`);
    const index = path.join(__dirname, 'app', 'pages', '404.html');
    fs.readFile(index, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(404).send('404 Not Found');
        } else {
            const rendered = mustache.render(data, { location: req.originalUrl });
            res.status(404).send(rendered);
        }
    });
});
const PORT = process.env.WEB_PORT;
app.listen(PORT, () => {
    customLog(`HTTP server is running on port ${PORT}`);
    customLog(`http://localhost:${PORT}`);
});
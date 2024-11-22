const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
router.use('/assets/', express.static(path.join(process.cwd(), 'app', 'assets')));
router.use('/api/', require('../../api/router')); 
const { customLog } = require('../server/logger.js');
router.get('/', (req, res) => {
    res.render('index');
});
router.get('/share', (req, res) => {
    res.redirect('/shared/');
});
router.get('/shared/*', (req, res) => {
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
                        url: path.join(req.originalUrl, item),
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
                    location: req.originalUrl.replace('/shared', ''),
                });
            });
        } else {
            res.download(requestedPath);
        }
    });
});
router.get('/login/', (req, res) => {
    res.render('login');
});
if (process.env.API_REGISTER === '1') {
    router.get('/register/', (req, res) => {
        res.render('register');
    });
} else {
    console.log('Register route is disabled because API_REGISTER is not set to 1');
}
router.use((req, res) => {
    customLog(`404 Not Found: ${req.originalUrl}`);
    res.status(404).render('404', { location: req.originalUrl });
});
module.exports = router;
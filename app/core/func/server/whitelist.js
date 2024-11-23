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
module.exports = {
    checkWhitelist
};
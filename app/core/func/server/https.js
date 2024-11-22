const fs = require('fs');
const path = require('path');
const sslOptions = {
    key: fs.readFileSync(path.join(process.cwd(), 'cert/server.key')),
    cert: fs.readFileSync(path.join(process.cwd(), 'cert/server.cert')),
};
module.exports = sslOptions;
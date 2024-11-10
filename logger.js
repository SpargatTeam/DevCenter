const fs = require('fs');
const path = require('path');

const logToFile = (message) => {
    const logFilePath = path.join(__dirname, 'server.log');
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logFilePath, `${timestamp} - ${message}\n`);
};

const customLog = (message) => {
    console.log(message);
    logToFile(message);
};

module.exports = {
    customLog
};
const fs = require('fs');
const path = require('path');
const logToFile = (message) => {
    const logFilePath = path.join(__dirname, 'server.log');
    const timestamp = new Date().toISOString();
    let logMessage = `${timestamp} - ${message}\n`;
    if (fs.existsSync(logFilePath)) {
        const fileContent = fs.readFileSync(logFilePath, 'utf8');
        if (fileContent.length > 0 && !fileContent.endsWith('\n')) {
            logMessage = `\n${logMessage}`;
        }
    }
    fs.appendFileSync(logFilePath, logMessage);
};
const customLog = (message) => {
    console.log(message);
    logToFile(message);
};
module.exports = {
    customLog
};
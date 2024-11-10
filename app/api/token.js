const crypto = require('crypto');

function generateAccessToken() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=+[]{})(*&^%$#@!;:/?.><,|~`';
    let token = 'BaseTokenaro:';
    const randomBytes = crypto.randomBytes(40);
    for (let i = 0; i < 40; i++) {
        token += characters.charAt(randomBytes[i] % characters.length);
    }
    return token;
}

module.exports = generateAccessToken;
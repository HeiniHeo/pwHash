require('dotenv').config();
const crypto = require('crypto');  

function createHash(userpw){
    const pwHash = crypto.createHmac('sha256',Buffer.from(process.env.salt))
                    .update(userpw)
                    .digest('base64')
                    .replace('==','')
                    .replace('=','')
    return pwHash;
}

module.exports = createHash;
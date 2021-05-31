require('dotenv').config();
const crypto = require('crypto');

//JWT 토큰 생성 header.payload.signature
function createToken(userid){
    let header={
        'typ':'JWT',
        'alg':'HS256'
    }
    let exp = new Date().getTime() + ((60 * 60 * 2) * 1000) // 1970.1.1 == 0  // 현재시간부터 두시간을 더한 시간
    let payload = {
        userid,
        exp  //토큰의 만료 시간
    }
    const encodingHeader = Buffer.from(JSON.stringify(header))
                                        .toString('base64')
                                        .replace('=','')
                                        .replace('==','');
    const encodingPayload = Buffer.from(JSON.stringify(payload))
                                        .toString('base64')
                                        .replace('==','')
                                        .replace('=','');
    const signature = crypto.createHmac('sha256',Buffer.from(process.env.salt))
                    .update(encodingHeader+'.'+encodingPayload)
                    .digest('base64')
                    .replace('=','')
                    .replace('==','')
    let jwt = `${encodingHeader}.${encodingPayload}.${signature}`;
    return jwt;
}

module.exports = createToken;
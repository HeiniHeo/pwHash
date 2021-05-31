require('dotenv').config();
const crypto = require('crypto');

module.exports = (req,res,next)=>{
    let {AccessToken} = req.cookies; // client의 cookie.accesstoken에서 가지고 와야한다.
    if(AccessToken == undefined){
        res.json({result:false,msg:'로그인을 진행해주세요'});
        return 
    }
    
    let [header,payload,sign] = AccessToken.split('.');
    let signature  = getSignature(header,payload);
    
    if(sign == signature){
        console.log('checked token');
        let {userid,exp} = JSON.parse(Buffer.from(payload,'base64').toString())
        console.log(userid);
        console.log(exp) // 현재(토큰을 생성한) 시간으로 부터 2시간 뒤를 저장한 getTime()
        let nextdate = new Date().getTime();
        if(nextdate > exp){
            //기간 만료
            // res.json({result:false,msg:'your token is expired'})
            res.clearCookie('AccessToken');
            res.redirect('/?msg =your token is expired');
        }
//DB에 접속해서 확인
        req.userid = userid;
        next();
    }else{
        res.json({result:false,msg:'wrong Token'})
    }
}

function getSignature(header,payload){
    const signature = crypto.createHmac('sha256',Buffer.from(process.env.salt))
                            .update(header+'.'+payload)
                            .digest('base64')
                            .replace('==','')
                            .replace('=','');
    return signature;
}
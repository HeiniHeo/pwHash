require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const ctoken = require('./jwt');
const auth = require('./middleware/auth');
const {sequelize,User} = require('./models/index');
const pwHash = require('./createHash');
const crypto = require('crypto');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(express.static('public'))
app.set('view engine','html');
nunjucks.configure('views',{
    express:app,
});

sequelize.sync({ force : false, })
.then(()=>{
    console.log('접속 성공');
})
.catch(()=>{
    console.log('접속 실패');
})

app.get('/',(req,res)=>{
    let {msg} = req.query;
    res.render('index');
});

app.get('/menu1',(req,res)=>{
    console.log(req.cookies);
    res.send('menu1 page');
});

app.get('/user/info',auth,(req,res)=>{
    res.send(`HELLO ${req.userid}`)
});

app.post('/auth/local/login', async (req,res)=>{
    let {userid,userpw} = req.body;
    console.log('body req : ',userid,userpw);
    let result = {};

    let hashedPw = crypto.createHmac('sha256',Buffer.from(process.env.salt))
                                                .update(userpw)
                                                .digest('base64')
                                                .replace('==','')
                                                .replace('=','');
    
    let findResult = await User.findOne({
        where:{userid,userpw:hashedPw}
    })

    if(findResult != null){
        result = {
            result:true,
            msg:'login success'
        }
        //token 생성
        let token = ctoken(userid);
        res.cookie('AccessToken',token,{});
    } else{
        result={
            result:false,
            msg:'check your ID and PASSWORD'
        }
    }
    res.json(result);
});

app.get('/user/join',(req,res)=>{
    res.render('join');
});

app.post('/user/join_success', async (req,res)=>{
    let {userid,userpw} = req.body;
    console.log(userid,userpw);

    let userHash = pwHash(userpw);
    await User.create({userid,userpw:userHash});

    res.redirect('/');
})

app.listen(3000,()=>{
    console.log('server starting port 3000');
});
document.addEventListener('DOMContentLoaded',init);
function init(){
    const loginBtn = document.querySelector('#loginBtn');
    const layerPopup = document.querySelector('.layerPopup');
    const localLogin = document.querySelector('#localLogin');
    loginBtn.addEventListener('click',loginBtnFn); 
    layerPopup.addEventListener('click',popupClose);
    localLogin.addEventListener('click',login);
}
// 로그인 버튼 클릭시 열리게
function loginBtnFn(){
    const layerPopup = document.querySelector('.layerPopup');
    layerPopup.classList.add('open');
}
// 배경을 클릭 시 로그인창 꺼지게
function popupClose(event){
    //console.log(event); // div layerPopup 이거를 가리킨다.
    //console.log(this);  // 내가 클릭한 element
    if(event.target == this){  // 배경클릭시에만 open 클래스 지우게 
        this.classList.remove('open')
    }
}

async function login(){
    const userid = document.querySelector('#userid');
    const userpw = document.querySelector('#userpw');

    if(userid.value == ""){
        alert('아이디를 입력해주세요');
        userid.focus();
        return 0;  
    }
    if(userpw.value == ""){
        alert('비밀번호를 입력해주세요');
        userpw.focus();
        return 0;
    }

    // POST로 요청 auth/local/login
    let url = 'http://localhost:3000/auth/local/login';
    
    let options = {
        method:'POST',
        headers :{
            'content-type' : `application/json`,
        },
        body:JSON.stringify({
            userid:userid.value,
            userpw:userpw.value
        })
    }

    let response = await fetch(url, options);       
    
    let json = await response.json();
    
    let {result,msg} = json;
    alert(msg);     
    if(result){
        let layerPopup = document.querySelector('.layerPopup');
        layerPopup.classList.remove('open');
    }else{
        //로그인 실패시 내용 다 지워주고 포커스 이동
        userid.value='';        
        userpw.value='';
        userid.focus();
    }
}
const socket = io.connect();
function $$(id) { return document.getElementById(id); }
function check(){
    password=$$('password');
    password_again=$$('password_again');
    if(password.value==''){
        password.setCustomValidity("请填写该字段。");
    }
    else if(password.value.length<6){
        password.setCustomValidity("密码不能少于6位。");
    }
    else{
        password.setCustomValidity('');
    }
    if(password_again.value==''){
        password_again.setCustomValidity("请填写该字段。");
    }
    else if(password_again.value!=password.value){
        password_again.setCustomValidity("两次密码输入不一致。");
    }
    else{
        password_again.setCustomValidity('');
    }
}
$$('applyform').onsubmit=()=>{
    let data={
        username:$$('username').value,
        password:$$('password').value,
        institution:$$('institution').value,
        type:"person",
        status:"available",
        location:"",
        connectAdd:"",
        manager:"",
        telphone:"",
        introduction:""
    };
    socket.emit('user:register',data);
    return false;
};

socket.on('user:register',(res)=>{
    if(res){
        alert("注册成功。");
        window.location.href="/signin";
    }
    else{
        alert("注册失败：用户名已被注册。");
    }
});
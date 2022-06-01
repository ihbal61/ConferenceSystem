/*
id: username => 用户名
id: title => 资源名
id: description => 描述
id: category => 分类
id: keyword => 关键词
id: points => 积分
id: uploadfile => 要上传的文件
id: upload_btn => 上传按钮
 */
const socket = io.connect();
function $$(id) { return document.getElementById(id); }
let authinfo;
let user_cookie_name = 'user_username';
let pwd_cookie_name = 'user_password';
let confirmed = false;

function load(path, fn){
    let reader = new FileReader();
    reader.onload = (evt) => {
        fn(evt.srcElement.result);
    };
    reader.readAsDataURL(path);
}
socket.on('user:login', (res) => {
    if (res){
        $$('username').innerHTML = authinfo.user ;
        socket.emit('func:check_privilege', authinfo);
    }
    else {
        authinfo = null ;
        cookie_helper.delCookie(user_cookie_name);
        cookie_helper.delCookie(pwd_cookie_name);
        alert("请先登录");
        window.location.href = '/Login.html';
    }
});
socket.on('func:check_privilege', (res) => {
    if (res === 1 || res === 2){
        //专家或管理员
        confirmed = true ;
    }
    else{
        //没有权限
        alert("只有专家用户能够上传资源");
        window.location.href = '/index.html';
    }
});
$$('upload_form1').onsubmit = (event) => {
    if (!confirmed){
        alert("身份认证错误");
        window.location.href = '/index.html';
        return false;
    }
    let file = {};
    let files = $$('uploadfile').files;
    file.filename = files[0].name;
    file.size = files[0].size;
    /*file.author1 = $$('author1').value;
    file.author2 = $$('author2').value;
    file.author3 = $$('author3').value;
    file.uploader = authinfo.user ;
    file.title = $$('title').value;
    file.keywords = $$('keyword').value;
    file.organ = $$('organ').value;
    file.summary = $$('summary').value;*/
    load(files[0], (res) => {
        file.base64 = res.replace(/^data:.*?;base64,/, "");
        socket.emit('user:upload',file);
    });
    return false;
};
socket.on('expert:upload', (res) => {
    if (res){
        alert("上传成功");
        location.reload();
    }
    else
    {
        alert("上传失败，请稍后再试");
    }
});

$$('logout').onclick = () => {
    cookie_helper.delCookie(user_cookie_name);
    cookie_helper.delCookie(pwd_cookie_name);
    window.location.href = '/';
    return false;
};



let username = cookie_helper.getCookie(user_cookie_name);
let password = cookie_helper.getCookie(pwd_cookie_name);
if (username !== null && password !== null)
{
    authinfo = {
        user : username,
        password : password
    };
    socket.emit('user:login', authinfo);
}
else {
    alert("请先登录");
    window.location.href = '/Login.html';
}
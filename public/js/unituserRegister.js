const socket = io.connect();
function $$(id) { return document.getElementById(id); }
$$('applyform').onsubmit=()=>{
    let data={
        institution:$$('institution').value,
        type:"unit",
        location:$$('province').value + ' ' + $$('city').value + ' ' + $$('district').value,
        connectAdd:$$('connectAdd').value,
        manager:$$('manager').value,
        telphone:$$('telphone').value,
        introduction:$$('introduction').value
    };
    socket.emit('user:unitRegister',data);
    return false;
};
socket.on('user:unitRegister',(res)=>{
    console.log(res);
    if (res){
        alert("注册成功");
        window.location.href = "/meetinfo";
    }
    else {
        alert("注册失败");
    }
})
const socket = io.connect();
function $$(id) { return document.getElementById(id); }
$$("form").onsubmit = (e) => {
  let data = {
    username: $$('inputEmail').value,
    password: $$('inputPassword').value
  };
  socket.emit('user:login', data);
  return false;
};
socket.on('user:login', (res) => {
  console.log(res);
  if (res){
    alert('登录成功');
    window.location.href = '/meetinfo';
  }
  else {
    alert('登录失败');
  }
});
const socket = io.connect();
function $$(id) { return document.getElementById(id); }

function update(){

    let data = {
        _cid: cid,
        update:{
            description: $$('des').value,
            paper_info: $$('info').value,
            arrange: $$('arrange').value
        }
    }
    socket.emit('user:updateconfer',data);
};

socket.on('user:updateconfer', (res) => {
    if (res){
        alert("更新成功");
        window.location.href = '/mymeetings';
    }
    else {
        alert("更新失败");
    }
});
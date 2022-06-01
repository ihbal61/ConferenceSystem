const socket = io.connect();
function $$(id) { return document.getElementById(id); }
$$('button').onclick = () =>   {
    let file = {};
    let files = $$('uploadfile').files;

    file.filename = files[0].name;

    file.size = files[0].size;

    file.title= $$('Contitle').value,
    file.org=$$('org').value,
    file.firstau=$$('FirstAu').value,
    file.secondau=$$('SecondAu').value,
    file.thirdau=$$('ThirdAu').value,
    file.abstract=$$('Abstract').value
    /*file.conferenceid=$$('cid').value*/
    load(files[0], (res) => {

        file.base64 = res.replace(/^data:.*?;base64,/, "");
        socket.emit('user:contribution_upload',file);
    });
    socket.on('user:contribution_upload', (res) => {
        if (res){
            alert("上传成功");
            window.location.href = '/meetinfo';
        }
        else {
            alert("上传失败");
        }
    });
};
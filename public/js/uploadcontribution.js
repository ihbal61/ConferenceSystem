function load(path, fn){
    let reader = new FileReader();
    reader.onload = (evt) => {
        fn(evt.srcElement.result);
        console.log(evt.srcElement.result);
    };
    reader.readAsDataURL(path);
}
const socket = io.connect();
function $$(id) { return document.getElementById(id); }
$$('button').onclick = () =>   {
    if($$('uploadfile').value==''){
        alert('请选择您的稿件！');
        return false;
    }
    if($$('Contitle').value==''){
        alert('标题不能为空！');
        return false;
    }
    else if($$('org').value==''){
        alert('机构不能为空！');
        return false;
    }
    else if($$('FirstAu').value==''&&$$('SecondAu').value==''&&('ThirdAu').value=='') {
        alert('至少需要一个作者！');
        return false;
    }
    else if($$('Abstract').value==''){
        alert('摘要不能为空！');
        return false;
    }


    let file = {};
    let files = $$('uploadfile').files;

    file.filename = files[0].name;

    file.size = files[0].size;

    file.title= $$('Contitle').value;
    file.org=$$('org').value;
    file.firstau=$$('FirstAu').value;
    file.secondau=$$('SecondAu').value;
    file.thirdau=$$('ThirdAu').value;
    file.abstract=$$('Abstract').value;
    file.conferenceid=$$('cid').innerHTML;
    file.result = 0;
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
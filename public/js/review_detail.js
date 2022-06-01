function pass() {
  let data = {
    cid: $('#cid')[0].innerHTML,
    pid: $('#_id')[0].innerHTML,
    update:{
      opinion: $('#review_opinion')[0].value,
      result: 1
    }
  };
  socket.emit('org:review', data);
}

function modify() {
  let data = {
    cid: $('#cid')[0].innerHTML,
    pid: $('#_id')[0].innerHTML,
    update:{
      opinion: $('#review_opinion')[0].value,
      result: 2
    }
  };
  socket.emit('org:review', data);
}

function reject() {
  let data = {
    cid: $('#cid')[0].innerHTML,
    pid: $('#_id')[0].innerHTML,
    update:{
      opinion: $('#review_opinion')[0].value,
      result: 3
    }
  };
  socket.emit('org:review', data);
}

socket.on('org:review', (res) => {
  if (res){
    alert("评审结果录入成功");
    let cid = $('#cid')[0].innerHTML;
    window.location.href = '/conference/' + cid + '/review';
  }
  else {
    alert("评审结果录入失败");
  }
});
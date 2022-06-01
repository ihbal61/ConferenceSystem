const socket = io.connect();
function $$(id) { return document.getElementById(id); }

$$('form').onsubmit = (event) => {
  var validation = $$('form').checkValidity();
  $$('form').classList.add('was-validated');
  if (validation){
      let data = {
          title: $$('meettitle').value,
          org: $$('org').value,
          location: $$('province').value + ' ' + $$('city').value + ' ' + $$('district').value,
          important_dates: {
              conference_start: $$('startDate').value,
              conference_end: $$('endDate').value,
              paper_end: $$('paperDate').value,
              inform_end: $$('infoDate').value,
              register_end: $$('regDate').value,
          },
          description: $$('meetdes').value,
          paper_info: $$('paperdes').value,
          conferarrange: $$('arrange').value,
          creator: creator
      };
      socket.emit('user:add_conference', data);
      return false;
  }
  return false;
};
socket.on('user:add_conference', (res) => {
  if (res){
    alert("发布成功");
    window.location.href = '/meetinfo';
  }
  else {
    alert("发布失败");
  }
});
function loadTime() {
    var time = new Date();
    var year = time.getFullYear();
    var month = time.getMonth();
    var day = time.getDate();
    var hour = time.getHours();
    var minute = time.getMinutes();
    month = month+1;
    if (month < 10){
        month = '0'+month;
    }
    if (day < 10){
        day = '0'+day;
    }
    if (hour < 10){
        hour = '0'+hour;
    }
    if (minute < 10){
        minute = '0'+minute;
    }
    var defaultdate = year+'-'+month+'-'+day;
    var defaultdatetime = defaultdate+'T'+ hour+':'+minute;
    $$('startDate').min = defaultdate;
    $$('endDate').min = defaultdate;
    $$('paperDate').min = defaultdatetime;
    $$('infoDate').min = defaultdatetime;
    $$('regDate').min = defaultdatetime;
}


$$('startDate').oninput= ()=>{
    if ($$('startDate').value > $$('endDate').value){
        $$('endDate').value ='';
    }
    $$('endDate').min = $$('startDate').value;
    var maxdatetime = $$('startDate').value + 'T00:00';
    $$('paperDate').max = maxdatetime;
    $$('infoDate').max = maxdatetime;
    $$('regDate').max = maxdatetime;
}

$$('paperDate').oninput= ()=>{
    $$('infoDate').min = $$('paperDate').value;
    $$('regDate').min = $$('paperDate').value;
}

$$('infoDate').oninput= ()=>{
    $$('regDate').min = $$('infoDate').value;
}


window.onload = loadTime;

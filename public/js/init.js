var socket = io.connect();
function $$(id) { return document.getElementById(id); }

var cookie_helper = {

  setCookie(name, value, days)//两个参数，一个是cookie的名子，一个是值
  {
    var exp = new Date();
    exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";path=/;expires=" + exp.toUTCString();

  },

  setCookie(name, value)//两个参数，一个是cookie的名子，一个是值
  {
    var exp = new Date();
    exp.setTime(exp.getTime() + 15 * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";path=/;expires=" + exp.toUTCString();

  },

  getCookie(name)//取cookies函数
  {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) {
      return unescape(arr[2]);
    } else {
      return null;
    }

  },

  delCookie(name)//删除cookie
  {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = this.getCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + ";path=/;expires=" + exp.toUTCString();
  }
};

function getUrlParms(name){
  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if(r!=null)
    return unescape(r[2]);
  return null;
}

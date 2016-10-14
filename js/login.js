

var phonenubmer = "15600901539";

var tokenstr = phonenubmer+GC.key;

console.log("tokenstr="+tokenstr);
//var hash = hex_md5("123dafd");
var token = md5(tokenstr);

console.log("token="+token);
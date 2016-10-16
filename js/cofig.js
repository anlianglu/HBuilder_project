

var GC = GC ||{}


GC.key = "bab8af935901d5b86ccb1d27c4985c32";


URL.COMMON='http://182.92.237.100:8080/wpa/wpahandler.ashx?'


//判断密码是否有特殊字符
GC.Getindexof=function(str){
    var badword =';|<>`&!*(~^)#?:"/$=\\'+"'";
    for(var i=0;i<str.length;i++){
        if(badword.indexOf(str[i])>=0){
            //表示有特殊字符
            return 0;
        }
    }
    return 1;
}


    RegRequestHttpClient=function(RequestData,fun){
        var  httprequest = new XMLHttpRequest();
      
        httprequest.withCredentials = true;
        console.log("url="+URL.COMMON+RequestData);
        httprequest.open("GET", URL.COMMON + RequestData,true);//
        //httprequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        httprequest.ontimeout = function(){
            console.log(" timeout...");
            httprequest.abort();
            fun(0);
        };
        httprequest.onreadystatechange=function(){
            if(httprequest.readyState == 4){
                if (httprequest.status == 200 ){
                    var httpResponse = httprequest.responseText;
                    try{
                        var getjosn = JSON.parse(httpResponse);
                        var jsonbool = getjosn["code"];
                        if(jsonbool!=null){
                            fun(httpResponse);
                        }else{
                            fun(0);
                        }
                    }catch(e){
                        cc.log(e.name + ":" + e.message);
                    }
                }else{
                    fun(0);
                }
            }
        }
        httprequest.send();
      
    }
    
    LoginRequestHttpClient=function(RequestData,fun){
        var  httprequest = new XMLHttpRequest();
      
        httprequest.withCredentials = true;
        console.log("url="+URL.COMMON+RequestData);
        httprequest.open("GET", URL.COMMON + RequestData,true);//
        //httprequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        httprequest.ontimeout = function(){
            console.log(" timeout...");
            httprequest.abort();
            fun(0);
        };
        httprequest.onreadystatechange=function(){
            if(httprequest.readyState == 4){
                if (httprequest.status == 200 ){
                    var httpResponse = httprequest.responseText;
                    try{
                        var getjosn = JSON.parse(httpResponse);
                        var jsonbool = getjosn["code"];
                        if(jsonbool!=null){
                            fun(httpResponse);
                        }else{
                            fun(0);
                        }
                    }catch(e){
                        cc.log(e.name + ":" + e.message);
                    }
                }else{
                    fun(0);
                }
            }
        }
        httprequest.send();
      
    }
    
    SendEmileRequestHttpClient=function(RequestData,fun){
        var  httprequest = new XMLHttpRequest();
      
        httprequest.withCredentials = true;
        console.log("url="+URL.COMMON+RequestData);
        httprequest.open("GET", URL.COMMON + RequestData,true);//
        //httprequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        httprequest.ontimeout = function(){
            console.log(" timeout...");
            httprequest.abort();
            fun(0);
        };
        httprequest.onreadystatechange=function(){
            if(httprequest.readyState == 4){
                if (httprequest.status == 200 ){
                    var httpResponse = httprequest.responseText;
                    try{
                        var getjosn = JSON.parse(httpResponse);
                        var jsonbool = getjosn["code"];
                        if(jsonbool!=null){
                            fun(httpResponse);
                        }else{
                            fun(0);
                        }
                    }catch(e){
                        cc.log(e.name + ":" + e.message);
                    }
                }else{
                    fun(0);
                }
            }
        }
        httprequest.send();
      
    }
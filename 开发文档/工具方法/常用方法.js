define(function(){
    return {
        //测试引入是否成功
        test:function(){alert("success");},
        //页面跳转
        goNextPage:function(path) {
            document.location.href = path;
        },
        /**
		*清空字符串内的空格，并返回trim后的字符串
		*/
        StrTrim:function(str) {
            var regEx = /\s+/g;
            return str.replace(regEx, "");
		
        },
		
        /*
		* 错误提示 借助layer插件
		* params  string MsgTitle 弹框title
		* params  string Msg 错误信息
        * params  object CallBack 回调函数
		*/
        // ShowError:function(MsgTitle, Msg,CallBack){
        //     layer.closeAll();
        //     layer.open({
        //         type: 1,
        //         title: [MsgTitle, "background:#e76705;color:#fff;font-size:20px"],
        //         closeBtn: 0,
        //         shadeClose: false,
        //         time: 2000,
        //         skin: 'yourclass',
        //         content: "<div style='font-size:18px; padding:20px 30px;'>" + Msg + "</div>",
        //         success: (CallBack == undefined ? null : CallBack)
        //     });
		
        // },
        // ShowLoading: function (Msg) {
        //     layer.closeAll();
        //     layer.load(1, {
        //         shade: [0.1, '#fff'],
        //         content: "<div id=\"txt_result\" style=\"position:absolute;margin-left:-116px; left:50%;padding-top:56px;width:245px; color:#e76705;font-size:20px;text-align:center;\">"+Msg+"..</div>"
        //     });
        // },

        //设置cookie
        SetCookie: function (name, value) {
            var Days = 30;
            var exp = new Date();
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);//30天过期时间
            document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
        },
        //读取cookie
        GetCookie:function(name)
        {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg)){
                return unescape(arr[2]);}
            else{
                return null;
            }
        },
         //删除cookie
       DelCookie:function(name) {
             var exp = new Date();
             exp.setTime(exp.getTime() - 1);
             var cval = getCookie(name);
             if (cval != null){
                 document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
             }
       },
        /*获取地址栏参数，并返回对象*/
       GetRequest: function () {
                var url = location.search; //获取url中"?"符后的字串 
                var theRequest = new Object(); 
                if (url.indexOf("?") != -1) { 
                    var str = url.substr(1); 
                    strs = str.split("&"); 
                    for(var i = 0; i < strs.length; i ++) { 
                        theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]); 
                    } 
                } 
                return theRequest; 

       },

      
        /*
        *检查是否登录，参考需要改
        *如果未登录，则返回到登录页面。
        *退出
        */
       CheckLogin: function () {
           var FOrg = this.GetCookie("FOrg");
           var FType = this.GetCookie("FType");
           var Fuser = this.GetCookie("FUser");
           //var ShowError = this.ShowError;
           if (Fuser != null) {
                $.ajax({
                    type: 'POST',
                    url: '/handlers/CheckUserLogin.ashx',
                    data: {
                        type:1,
                        OrgCode: FOrg,
                        userType:FType,
                        userName: Fuser,
                    },
                    async: true,
                    dataType: "json",
                    success: function (data) {
                        //退出成功后，清空用户信息cookie，并跳转到登录页
                        if (data.IsSuccess) {
                            return true;
                        }
                        else {
                            if (data.ErrorCode == "200")
                            {
                                ShowError("提示", "请登录后进行该操作！", function () { setTimeout(function () { ShowError = null;window.location.href = "/views/login.html"; }, 2000); });
                            }
                            else if(data.ErrorCode == "401")
                            {
                                ShowError("提示", "用户登录超时！请重新登录！", function () { setTimeout(function () { ShowError = null; window.location.href = "/views/login.html"; }, 2000); });
                                //ShowError("提示", "用户登录超时！请重新登录！");
                            }
                            else if (data.ErrorCode == "201") {
                                ShowError("提示", "非法请求！请登录后进行该操作！", function () { setTimeout(function () { ShowError = null; window.location.href = "/views/login.html"; }, 2000); });
                            }
                        }
                    }
                });
           }
           else {
               ShowError("提示", "用户登录超时！请重新登录！", function () { window.location.href = "/views/login.html";});
           }
       },
       LogOff: function () {
           $(".btn_exit").click(function () {
               $.ajax({
                   type: 'POST',
                   url: '/handlers/CheckUserLogin.ashx',
                   data: {
                       type: 2
                   },
                   async: true,
                   dataType: "json",
                   success: function (data) {
                       //退出成功后，清空用户信息cookie，并跳转到登录页
                       if (data.IsSuccess) {
                           console.log("退出成功！");
                           window.location.href = "/views/login.html";
                       }
                       else {
                           console.log("退出失败！")
                       }
                   }
               });
           })
          
       },

        //生成指定长度的随机字符串
       GenerataString: function (n){    
           var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
           var res = "";
           for (var i = 0; i < n ; i++) {
               var id = Math.ceil(Math.random() * 35);
               res += chars[id];
           }
           return res;
       },

       // //键盘事件,f11控制全屏按键
       //keyFn:function () {
       // $(document).on('keyup', function (e) {
       //     var currKey = 0;
       //     var e = e || event;
       //     currKey = e.keyCode || e.which || e.charCode;
       //     //alert(currKey);
       //     if (currKey == 122) {
       //         //window.location.reload();
       //         history.go(0);
       //     }
       // });
       //},
        //兼容谷歌回去URl地址
       getUrlParam: function (key) {
           // 获取参数
           var url = window.location.search;
           // 正则筛选地址栏
           var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
           // 匹配目标参数
           var result = url.substr(1).match(reg);
           //返回参数值
           return result ? decodeURIComponent(result[2]) : null;
       },
        //显示时间
       timer: function () {
           setInterval(function () {
               var date = new Date();
               var seperator1 = "-";
               var seperator2 = ":";
               var month = date.getMonth() + 1;
               var strDate = date.getDate();
               var hours = date.getHours();
               var min = date.getMinutes();
               var sec = date.getSeconds();
               if (month >= 1 && month <= 9) {
                   month = "0" + month;
               }
               if (strDate >= 0 && strDate <= 9) {
                   strDate = "0" + strDate;
               }
               if (hours >= 0 && hours <= 9) {
                   hours = "0" + hours;
               }
               if (min >= 0 && min <= 9) {
                   min = "0" + min;
               }
               if (sec >= 0 && sec <= 9) {
                   sec = "0" + sec;
               }

               var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                       + " " + hours + seperator2 + min + seperator2 + sec;
               //+ seperator2 + date.getSeconds();
               //return currentdate;
               $(".sysInfo_time").html(currentdate);

           }, 1000);
       },
        //生成uuid-32位
       NewUUID: function () {
           var guid = "";
           for (var k = 1; k <= 32; k++) {
               var n = Math.floor(Math.random() * 16.0).toString(16);
               guid += n;
               if ((k == 8) || (k == 12) || (k == 16) || (k == 20))
                   guid += "";
           }
           return guid;
       },
        //设置dropkick下拉选中事件（传入value）
       DropKickSet: function (id, key){
           for (var i = 0; i < document.getElementById(id).options.length; i++) {
               if (key == document.getElementById(id).options[i].value) {
                   document.getElementById(id).selectedIndex = i;
                  
                   break;
               }
           }
           $("#" + id).dropkick("refresh");
       },
        //设置dropkick下拉选中事件(传入text)
        DropKickSetText: function (id, key){
        for (var i = 0; i < document.getElementById(id).options.length; i++) {
            if (key == document.getElementById(id).options[i].innerHTML) {
                document.getElementById(id).selectedIndex = i;
                  
                break;
            }
        }
        $("#" + id).dropkick("refresh");
        }

			
	}
});
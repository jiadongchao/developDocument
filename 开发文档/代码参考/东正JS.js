
(function($,document,window){
    var pageFn = {};

    pageFn = {
        init : function(){
            this.delegateInit();
            this.getCaptcha();
            this.placeHolderInit();
        },
        reg : {
            phoneReg : /^\d{11}$/,
            imgCaptchaReg : /^[a-zA-Z0-9]{4}$/,
            usernameReg : /^[\w|\u4E00-\uFA29]{4,15}$/
        },
        /*
         * placeholder兼容处理
         */
        placeHolderInit : function(){
            $.fn.placeholder = function () {
                var i = document.createElement('input'),
                    placeholdersupport = 'placeholder' in i;
                if (!placeholdersupport) {
                    var inputs = $(this);
                    inputs.each(function () {
                        var input = $(this),
                            text = input.attr('placeholder'),
                            pdl = 0,
                            placeholder = $('<span class="tips">' + text + '</span>');

                        placeholder.click(function () {
                            input.focus();
                        });
                        if (input.val() != "") {
                            placeholder.css({display: 'none'});
                        } else {
                            placeholder.css({display: 'inline'});
                        }
                        placeholder.insertAfter(input);
                        input.keyup(function (e) {
                            if ($(this).val() != "") {
                                placeholder.css({display: 'none'});
                            } else {
                                placeholder.css({display: 'inline'});
                            }
                        });
                    });
                }
                return this;
            }
            if (/msie/.test(navigator.userAgent.toLowerCase())) {
                $("input[placeholder]").placeholder();
            }
        },
        /*
         * 获取图形验证码
         * @method getCaptcha
         */
        getCaptcha : function(){
            $('.capachaImg').attr('src','/daipai/captcha.php?rn=' + (+new Date()));
            $('.capachaImg').live('click',function(){
                this.src = '/daipai/captcha.php?rn=' + (+new Date());
            });
        },
        delegateInit : function(){
            var _class = this;
            $('.delegateBtn').live('click',function(){
                var artcode = $(this).attr('data-artcode') || '',
                    special = $(this).attr('data-special') || '',
                    openType = $(this).attr('data-fullscreen') ||'',
                    $pop = $('.delegatePop'),
                    $picWrap = $(this).closest('li').find('.proPic'),
                    $submitBtn =$pop.find('.submitBtn');
                if(openType){
                    $(".delegateWrap").show();
                }else{
                    $pop.css({
                        left: $picWrap.offset().left +'px',
                        top :  $picWrap.offset().top+'px'
                    }).show();
                }
                $pop.find('.capachaImg')[0].click();
                artcode && $submitBtn.attr('data-artcode',artcode);
                special && $submitBtn.attr('data-special',special);
            });
            $('.delegateWrap .smsBtn').live('click',getSMSCode);
            $('.delegateWrap .submitBtn').live('click',submitForm);
            $('.delegateWrap .close').live('click','.close',function(){
                var $pop = $(this).closest('.delegatePop');
                resetForm($pop.find('.smsBtn')[0],true);
            });
            $('.delegateWrap .input').live('focus',function(){
                $(this).closest('.delegateWrap').find('.note').html('');
            });
            /*获取短信验证码*/
            function getSMSCode(){
                var _this = this,
                    $wrap = $(_this).closest('.delegateWrap'),
                    $SMSInput = $wrap.find('.smsInput'),
                    $Mobile = $wrap.find('.mobile'),
                    $CaptchaInput =  $wrap.find('.captchaInput');

                if( _class.checkMobile($Mobile) === '0' || _class.checkCaptcha($CaptchaInput) === '0'){
                    return;
                }

                /*获取验证码code:图片验证码 mobile：手机号码*/
                var captchaCode = $.trim($CaptchaInput.val()),
                    mobile = $.trim($Mobile.val()),
                    url = '/daipai/sendMobile.php';

                if ($(_this).hasClass('disabled')) {
                    return;
                }
                $(_this).addClass('disabled');
                $.ajax({
                    type: 'post',
                    url:  url,
                    data: {
                        code : captchaCode,
                        mobile : mobile
                    },
                    dataType : 'json',
                    success: function (data) {
                        if (data.code == 0) {
                            cutDown(_this);
                        }else {
                           $wrap.find('.note').html(data.msg || "网络异常");
                           $(_this).removeClass('disabled');
                        }
                    },
                    fail: function (msg) {
                        $(_this).removeClass('disabled');
                        console.log(msg);
                    }
                });
                /*60秒倒计时*/
                function cutDown(smsBtn){
                    var $smsBtn =$(smsBtn),
                        time = time || 60,
                        toDouble = function(num){
                            return num < 10 ? "0" + num : num;
                        };
                    $smsBtn.addClass('disabled');
                    $smsBtn.length && $smsBtn.attr('readOnly','readOnly');
                    smsBtn.timeInterval = setInterval(function(){
                        $smsBtn.html('<span class="txt"><em>'+toDouble(--time)+'</em>秒后重发</span>');

                        if(time <= 0){
                            clearInterval(smsBtn.timeInterval);
                            $smsBtn.removeClass('disabled').html('获取验证码');
                            $Mobile.length && $Mobile.removeAttr("readOnly");
                        }
                    }, 2000);
                }

            }
            /*提交表单*/
            function submitForm(){
                var _this = this,
                    $this = $(this),
                    $Wrap = $this.closest('.delegateWrap'),
                    $SMSBtn = $Wrap.find('.smsBtn'),
                    $Mobile = $Wrap.find('.mobile'),
                    $CaptchaInput =  $Wrap.find('.captchaInput'),
                    name = $.trim($Wrap.find('.name').val()),
                    mobile = $.trim($Mobile.val()),
                    captcha = $.trim($CaptchaInput.val()),
                    smscode = $.trim($Wrap.find('.smsInput').val()),
                    $agree = $this.closest(".formBtn").children(".agree");
                    url = '/daipai/save.php';
                if(_this.ajaxDisable){ return;}
                if(!name){
                    $Wrap.find('.note').html('姓名不能为空');
                    return ;
                }
                if(_class.checkMobile($Mobile) === '0' || _class.checkCaptcha($CaptchaInput) === '0') {
                    return ;
                }
                if(!$agree.children(".label").hasClass("checked")){
                    $Wrap.find('.note').html('请确认接受《用户代拍服务协议》');
                    return ;
                }
                _this.ajaxDisable = true;
                $.ajax({
                    url: url,
                    type: 'post',
                    dataType : 'json',
                    data: {
                        userName : $.trim($Wrap.find('.name').val()),
                        mobile : mobile,
                        code : smscode,
                        artCode : $this.attr('data-artcode')||'',
                        specialCode  : $this.attr('data-special') ||'',
                        sessionCode  : $this.attr('data-session') ||''
                    },
                    success: function (data) {
                        if (data.code == 0) {
                            $Wrap.find('.popStatus').removeClass('ok error').addClass('ok').html('预约成功!');
                            resetForm($SMSBtn[0]);
                        }else {
                            $Wrap.find('.note').html(data.msg || "网络异常");
                        }
                        _this.ajaxDisable = false;
                    },
                    fail: function (msg) {
                        _this.ajaxDisable = false;
                        console.log(msg);
                    }
                });
            }
            /*重置表单*/
            function resetForm(smsBtn,isRightNow){
                var $SMSBtn = $(smsBtn),
                    $Wrap = $SMSBtn.closest('.delegateWrap'),
                    $Mobile = $Wrap.find('.mobile'),
                    $CaptchaImg = $Wrap.find('.capachaImg'),
                    $agree = $Wrap.find(".agree");
                smsBtn && clearInterval(smsBtn.timeInterval);
                setTimeout(function(){
                    $Wrap.find('.popStatus').removeClass('ok error');
                    $Wrap.hasClass('delegatePop') && $Wrap.hide() ;
                },isRightNow ? 0: 2000);

                $Wrap.find('.input').val('');
                $Wrap.find('.note').html('');
                $SMSBtn.removeClass('disabled');
                $SMSBtn.html('获取验证码');
                $agree.find(".label").addClass('checked');
                $Mobile.length && $Mobile.removeAttr("readOnly");
                $CaptchaImg[0].click();
                _class.placeHolderInit();
            }

        },
        checkMobile : function ($mobile){
            var checkPhone,
                mobile = $.trim($mobile.val()),
                $note= $mobile.closest('.delegateWrap').find('.note');

            if(!mobile){
                $note.html('请输入手机号码');
                return '0';
            }else{
                checkPhone = this.reg.phoneReg.test(mobile);
                if(!checkPhone){
                    $note.html('请填写有效的11位手机号码');
                    return '0';
                }
            }
            return '1';
        },
        checkCaptcha : function ($imgCaptchaEle){
            var checkCaptcha,
                captchaVal =$.trim($imgCaptchaEle.val()),
                $note= $imgCaptchaEle.closest('.delegateWrap').find('.note');

            // var reg = this.reg.imgCaptchaReg;
            // checkCaptcha = reg.test(captchaVal);
            if(!captchaVal){
                $note.html('请输入图形验证码');
                return '0';
            }
            // if(!checkCaptcha){
            //     $note.html('图形验证码不匹配');
            //     return '0';
            // }
            return '1';
        }
    };

    $(function(){
        pageFn.init();
    });
})(jQuery,document,window);
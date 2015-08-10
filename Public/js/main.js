function Workroom() {
    if(this instanceof Workroom) {
        this.init(); 
    } else {
        return new Workroom();
    }
};
Workroom.prototype = {
    init: function() {
        this.setLayout();
        this.setStyle();
        this.addListener();
        this.resizeLayout();
        this.register();   
    },
    
    setLayout: function() {
        var width = $(document).width() - 240 + 'px',
            height = $(document).height() - 70 + 'px';
        $('.tableDetail').width(width); 
        $('#mainWrap').height(height);
        $('.aside').height(height);        
    },
    
    //随着窗口改变设置样式
    resizeLayout: function() {
        var that = this; 
        $(window).bind('resize', function() {
            that._throttle(that.setLayout);
        });  
    },
    
    //表格设置样式
    setStyle: function() {
        $('#aside a').map(function() {

            if($('.title span').html() === $(this).text().trim()) {
                $(this).css('color', '#47bea0');
            }
        });
        $('tr:odd').addClass('odd');
        $('tr:even').addClass('even');
    },

    //页面的弹出层
    addListener: function() {
        $(document).delegate('#ad-mod-pwd', 'click', function() {
            $('#show-ad-pwd').show();

        }).delegate('.icon-cross', 'click', function() {

            $('.pop-level').hide();
        }).delegate('#log-out', 'click', function() {

           $('#show-lg-out').show();
        }).delegate('.cancle', 'click', function() {

            $(this).parents('.pop-level').hide();
        }).delegate('#add-user', 'click', function() {

            $('#show-add-user').show();
        }).delegate('.user-del', 'click', function() {

            $('#show-user-del').show();
        }).delegate('#add-class', 'click', function() {

            $('#show-add-cla').show();
        }).delegate('.cla-mod', 'click', function() {

            $('#show-mod-cla').show();
        }).delegate('#add-not', 'click', function() {

            $('#show-add-not').show();
        }).delegate('.det-not', 'click', function() {

            $('#show-det-not').show();
        }).delegate('.del-not', 'click', function() {

            $('#show-del-not').show();
        }).delegate('.feed-del', 'click', function() {

            $('#show-feed-del').show();
        }).delegate('.class-del', 'click', function() {

            $('#show-class-del').show();
        }).delegate('.pop-cancle', 'click', function(event) {

            event.preventDefault();
        }).delegate('#add-user', 'mouseover', function() {

            $(this).css('opacity', '0.6');
        }).delegate('#add-user', 'mouseout', function() {

            $(this).css('opacity', '1');
        });  
    },
    
    //表单验证
    register: function() {
        this._rgsNoticeForm('#mod-notice');
        this._rgsNoticeForm('#add-notice');
        this._rgsclassForm('#modclaName');
        this._rgsclassForm('#addclaName');
        this._rgsUserForm();
        this._rgsadminForm();
        this._rgsAuditForm();
        this._rgsFeedForm();
    },

    //函数节流
    _throttle: function(method, context) {
        clearTimeout(method.tId);
        method.tId = setTimeout(function() {
            method.call(context);
        }, 100);
    },

    //审核页面验证
    _rgsAuditForm: function() {
        $(document).delegate('#yes', 'click', function(event) {

            $.ajax({
                type    : "post",
                url     : URL+"/audit",
                data    : "messageId=",
                dataType: "text",
                success : function(msg){
                    if( msg ){
                        window.location = URL+"/index";
                        alert("审核结果成功");
                    }else{
                        window.location = URL+"/index";
                        alert("审核失败");
                    }
                }
            });
        });
    },

    // 用户页面验证
    _rgsUserForm: function() {
        $(document).delegate('#adduserFrm', 'click', function() {
            var param = {
                    uName: {
                        con: $('#userName').val(),
                        min: 4,
                        max: 10
                    },
                    psd: {
                        con: $('#password1').val(),
                        min: 8,
                        max: 16
                    },
                    psdSame: {
                        psd1: $('#password1').val(),
                        psd2: $('#password2').val()
                    }
                },
                mark = {
                    uName: '#userName',
                    psd: '#password1',
                    psdSame: '#password2'
                };
            Workroom.prototype._registerForm(param, mark, '#adduserFrm');
            event.preventDefault();

        }).delegate('#deluserFrm', 'click', function(event) {

            $.ajax({
                type     : "post",
                url      : URL+"/delUser",
                data     : "workroomId=",
                dataType : "html",
                success  : function(msg){
                    if( msg ){
                        alert("删除用户成功");
                    }else{
                        alert("删除用户失败");
                    }
                }
            });
        }).delegate('.re-pw', 'click',function(event) {
            
            $.ajax({
                type    : "post",
                url     : URL+"/resetPwd",
                data    : "workroomId=",
                dataType: "html",
                success : function(msg){
                    if( msg ){
                        $('#show-re-pw').show();    
                        setTimeout(function () {
                            $('#show-re-pw').hide();
                        }, 500);
                    }else{
                        alert("重置密码失败");
                    }
                }
            });
        });
    },
    _rgsclassForm: function(cur) {
        $(document).delegate(cur, 'click', function(event) {
            var param = {
                    empty: $(this).parent().find('input[name=className]').val()
                },
                mark = {
                    empty: 'input[name=className]'
                };
            $('.pop-level .wrong').remove();

            //调用验证体系
            global.validator.validate(param);

            var msg = global.validator.message,
                i;

            if(global.validator.hasErrors()) {

                for(i in msg) {
                    $(mark[i]).after('<span class="wrong">' + msg[i] + '</span>');
                }
            } else {
                $.ajax({
                    url     : '',
                    data    : param.empty,
                    dataType: 'text',
                    success: function(msg) {
                        if(msg) {
                            console.log("message");
                        } else {
                            alert('修改密码失败');
                        }
                    }
                });
            }          
            event.preventDefault();
        }).delegate('#delclassFrm', 'click', function() {
            $.ajax({
                type    : "post",
                url     : URL+"/delNotice",
                data    : "id=",
                dataType: "text",
                success : function(msg){
                    if( msg ){
                        alert("删除公告成功");
                    }else{
                        alert("删除公告失败");
                    }
                }
            });
        });
     },

     //用户更改密码验证
    _rgsadminForm: function() {
        $(document).delegate('#modpsdFrm', 'click', function(event) {
            var param = {
                    psd: {
                        con: $('#user-pw1').val(),
                        min: 8,
                        max: 10
                    },
                    psdSame: {
                        psd1: $('#user-pw1').val(),
                        psd2: $('#user-pw2').val()
                    }
                },
                mark = {
                    psd: '#user-pw1',
                    psdSame: '#user-pw2' 
                };  
            $('.pop-level .wrong').remove();

            //调用验证体系
            global.validator.validate(param);

            var msg = global.validator.message,
                i;

            if(global.validator.hasErrors()) {

                for(i in msg) {
                    $(mark[i]).after('<span class="wrong">' + msg[i] + '</span>');
                }
            } else {
                $.ajax({
                    url: '',
                    data: param.empty,
                    success: function(msg) {
                        if(msg) {
                            console.log("message");
                        } else {
                            alert('密码修改失败')
                        }
                    }
                });
            }          
            event.preventDefault();
        });
    },

    //通知页面表单验证
    _rgsNoticeForm: function(cur) {
        $(document).delegate(cur, 'click', function(event) {
            var param = {
                    empty: $(this).parent().find('input[name="title"]').val(),
                    emptyC: $(this).parent().find('textarea[name="content"]').val()
                },
                mark = {
                    empty: 'input[name="title"]',
                    emptyC: 'textarea[name="content"]'
                };
            $('.pop-level .wrong').remove();

            //调用验证体系
            global.validator.validate(param);

            var msg = global.validator.message,
                i;

            if(global.validator.hasErrors()) {

                for(i in msg) {
                    $(mark[i]).after('<span class="wrong">' + msg[i] + '</span>');
                }
            } else {
                $.ajax({
                    url: '',
                    data: param.empty,
                    dataType: 'text',
                    success: function(msg) {
                        if(msg) {
                            console.log("message");
                        } else {
                            alert('修改密码失败');
                        }
                    }
                });
            }          
            event.preventDefault();
        }).delegate('#delnotFrm', 'click', function(event) {

            $.ajax({
                type    : "post",
                url     : URL+"/delNotice",
                data    : "id=",
                dataType: "text",
                success : function(msg){
                    if( msg ){
                        window.location.reload();
                        alert("删除公告成功");
                    }else{
                        alert("删除公告失败");
                    }
                }
            });
            event.preventDefault();
        });
    },

    _registerForm: function(param, mark, cur) {
        $('.pop-level .wrong').remove();

        //调用验证体系
        global.validator.validate(param);

        var msg = global.validator.message,
            i;

        if(global.validator.hasErrors()) {

            for(i in msg) {
                $(mark[i]).after('<span class="wrong">' + msg[i] + '</span>');
            } 
        } else {
            $(cur).parents('form').submit();
        }
    },
    _rgsFeedForm: function() {
        $(document).delegate('#delfeedFrm', 'click', function() {
           
            $.ajax({
                type    : "post",
                url     : URL+"/delSuggest",
                data    : "id=",
                dataType: "text",
                success : function(msg){
                    if( msg ){
                        window.location.reload();
                        alert("删除信息成功");
                    }else{
                        alert("删除信息失败");
                    }
                }
            });
        });
    }
};
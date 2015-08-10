function Login() {
    if(this instanceof Login) {
        this.register();
    } else {
        return new Login();
    }
}
Login.prototype.register = function() {
    $(document).delegate('#login-btn', 'click', function() {
        var param = {
                    empty: $('#userName').val(),
                    emptyC: $('#password').val()
                },
                mark = {
                    empty: '#userName',
                    emptyC: '#password'
                };
            $('.lg_input .wrong').remove();

            //调用验证体系
            global.validator.validate(param);

            var msg = global.validator.message,
                i;

            if(global.validator.hasErrors()) {

                for(i in msg) {
                    $(mark[i]).after('<span class="wrong">' + msg[i] + '</span>');
                }
            } else {
                var d = $("#userName").val() 
                        + "&password="+$("#password").val()
                        + "&code="
                        + $("#code").val();
                $.ajax({
                    type    : 'post',
                    url     : 'server.php',
                    data    : d,
                    dataType: "text",
                    success : function(msg){
                        if(msg == ""){
                            alert("用户名或密码错误");
                        }else if(msg == "code fail"){
                            alert("验证码错误");
                        }else{
                            alert('登陆成功');
                        }
                    }
                });
            }          
            event.preventDefault();

    }).delegate('#checking', 'click', function() {
        $(this).attr('src', '__APP__/Home/Verify/index/id/' + Math.random());
    });
};
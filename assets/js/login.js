$(function () {
    // 1.隐藏盒子
    $('#reg_link').on('click', function () {
        $('.reg_box').show();
        $('.login_box').hide();
    });
    $('#login_link').on('click', function () {
        $('.login_box').show();
        $('.reg_box').hide();
    });
    // 2.自定义认证规则
    let form = layui.form;
    // console.log(form);
    form.verify({
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        // 确认密码
        repwd: function (value) {
            console.log(value);
            let pwd = $('.reg_box input[name=password]').val();
            console.log(pwd);
            if (value != pwd) {
                return '两次输的密码不一致'
            }
        }
    })

    // 3.注册
    let layer = layui.layer;
    $('#reg_form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/api/reguser',
            type: 'post',
            data: {
                username: $('.reg_box input[name=username]').val(),
                password: $('.reg_box input[name=password]').val()
            },
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.mag(res, message, { icon: 5 });
                }
                layer.msg('注册成功', { icon: 6 })
                $('#login_link').click();
                $('#reg_form')[0].reset();
            }
        })
    })
    // 4.登录
    $('#login_form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            type: 'post',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                }
                layer.msg('登录成功', { icon: 6 });
                localStorage.setItem('mytoken', res.token)
                location.href = '/index.html'
            }
        })
    })
})
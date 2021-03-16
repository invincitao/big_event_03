$(function () {
    // 自定义认证规则
    let form = layui.form;
    let layer = layui.layer;
    // console.log(form);
    form.verify({
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            if (value == $('[name=oldPwd]').val()) {
                return '与原密码相同'
            }
        },
        // 确认密码
        rePwd: function (value) {
            // console.log(value);
            let pwd = $('[name=newPwd]').val();
            // console.log(pwd);
            if (value != pwd) {
                return '两次输的密码不一致'
            }
        }
    });

    // 修改密码
    $('#formPwd').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/updatepwd',
            type: 'post',
            data: $(this).serialize(),
            success: (res) => {
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                }
                layer.msg('成功修改密码！', { icon: 6 });
                // 清空列表
                $('#formPwd')[0].reset();
                localStorage.removeItem('mytoken')
                location.href = '/login.html';
            }
        })
    })
})
$(function () {
    // 自定义规则
    let form = layui.form;
    let layer = layui.layer;
    form.verify({
        nickname: function (value) {
            if (value.trim().length < 2 || value.trim().length > 6) {
                return '昵称长度为2-6之间'
            }
        },

    });
    // 渲染页面
    initUserInfo();
    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            type: 'get',

            success: (res) => {
                if (res.status != 0) {
                    return layui.layer.msg(res.message, { icon: 5 })
                };
                form.val('formUserInfo', res.data);
            }
        })
    };

    // 重置表单
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        initUserInfo();
    });

    // 修改用户信息
    $('#formUserInfo').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/userinfo',
            type: 'post',
            data: $(this).serialize(),
            success: (res) => {
                if (res.status != 0) {
                    return layui.layer.msg(res.message, { icon: 5 })
                };
                layer.msg('用户修改成功！', { icon: 6 });
                window.parent.getuserInfo();
            }
        })
    })
})
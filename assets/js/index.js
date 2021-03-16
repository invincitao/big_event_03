$(function () {
    getuserInfo();

    // 点击退出
    $('#btnLogout').on('click', function () {
        layer.confirm('是否确认退出？', { icon: 3, title: '提示' }, function (index) {
            //do something
            localStorage.removeItem('mytoken');
            location.href = '/login.html';
            layer.close(index);
        });
    })
})

function getuserInfo() {
    $.ajax({
        url: '/my/userinfo',
        type: 'get',
        data: {},
        // 登录拦截
        // headers: {
        //     Authorization: localStorage.getItem('mytoken') || ''
        // },
        // complete: function (res) {
        //     let obj = res.responseJSON;
        //     // console.log(obj);
        //     if (obj.status == 1 || obj.message == '身份认证失败！') {
        //         // 销毁token
        //         localStorage.removeItem('mytoken');
        //         location.href = '/login.html';
        //     }
        // },
        success: (res) => {
            // console.log(res);
            if (res.status != 0) {
                return layui.layer.msg(res.message, { icon: 5 })
            }
            // 请求成功
            renderAvatar(res.data);
        }
    })
}

function renderAvatar(user) {
    let name = user.nicname || user.username;
    $('#welcome').html(name);
    if (user.user_pic != null) {
        $('.layui-nav-img').show().attr('src', user.user_pic);
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        let text = name[0].toUpperCase();
        $('.text-avatar').show().html(text);
    }
}
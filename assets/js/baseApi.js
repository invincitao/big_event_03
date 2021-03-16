$(function () {
    baseAPI = 'http://api-breakingnews-web.itheima.net';

    $.ajaxPrefilter(function (options) {
        options.url = baseAPI + options.url;

        // 登录拦截
        if (options.url.indexOf('/my/') != -1) {
            options.headers = {
                Authorization: localStorage.getItem('mytoken') || ''
            };
        };


        options.complete = function (res) {
            let obj = res.responseJSON;
            // console.log(obj);
            if (obj.status == 1 && obj.message == '身份认证失败！') {
                // 销毁token
                localStorage.removeItem('mytoken');
                location.href = '/login.html';
            }
        }
    })
})
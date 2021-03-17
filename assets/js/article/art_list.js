$(function () {
    let form = layui.form;
    let layer = layui.layer;

    template.defaults.imports.dateForm = function (dateStr) {
        let dt = new Date(dateStr);
        let y = dt.getFullYear();
        let m = padZero(dt.getMonth() + 1);
        let d = padZero(dt.getDate());
        let hh = padZero(dt.getHours());
        let mm = padZero(dt.getMinutes());
        let ss = padZero(dt.getSeconds());

        return `${y}-${m}-${d}  ${hh}:${mm}:${ss}`
    };

    // 加零
    function padZero(num) {
        return num < 10 ? '0' + num : num;
    }
    let q = {
        pagenum: 1,
        pagesize: 5,
        state: "",
        cate_id: ""
    };

    initTable();
    function initTable() {
        $.ajax({
            url: '/my/article/list',
            type: 'get',
            data: q,
            success: (res) => {
                if (res.status != 0) {
                    return layui.layer.msg(res.message, { icon: 5 })
                };
                let htmlStr = template('tpl-table', { data: res.data });
                $('tbody').html(htmlStr);
                renderPage(res.total);
            }
        })
    };
    // 初始化分类
    initCate();
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            type: 'get',
            success: (res) => {
                if (res.status != 0) {
                    return layui.layer.msg(res.message, { icon: 5 })
                };
                let htmlStr = template('tpl-cate', { data: res.data });
                $('[name=cate_id]').html(htmlStr)
                // 插件方法
                form.render();

            }
        })
    };
    // 筛选
    $('#form-search').on('submit', function (e) {
        // console.log(this);
        e.preventDefault();
        let state = $('[name=state]').val();
        let cate_id = $('[name=cate_id]').val();

        q.state = state;
        q.cate_id = cate_id;

        initTable();
    });

    // 分页
    let laypage = layui.laypage;
    function renderPage(total) {
        layui.code
        //开启location.hash的记录
        laypage.render({
            elem: 'pageBox',
            count: total,
            curr: q.pagenum, //获取起始页
            limit: q.pagesize,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                //首次不执行
                if (!first) {
                    initTable();
                }
            }
        });

    };

    // 删除
    $('tbody').on('click', '.btn-delete', function () {
        let id = $(this).attr('data-id');
        // console.log(id);
        layer.confirm('确认是否删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                url: '/my/article/delete/' + id,
                type: 'get',
                data: {},
                success: (res) => {
                    if (res.status != 0) {
                        return layui.layer.msg(res.message, { icon: 5 })
                    };
                    layer.msg('删除成功', { icon: 6 });
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--;
                    initTable();
                }
            })
            layer.close(index);
        });

    })
})
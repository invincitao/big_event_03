$(function () {
    let form = layui.form;
    let layer = layui.layer;

    // 获取文章列表
    initArtCateList();
    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            type: 'get',
            data: {},
            success: (res) => {
                if (res.status != 0) {
                    return layui.layer.msg(res.message, { icon: 5 })
                };
                let htmlStr = template('tpl-cate', { content: res.data })
                $('tbody').html(htmlStr);
            }
        })
    };
    // 添加结构
    let indexAdd = null;
    $('#btnAdd').on('click', function () {
        indexAdd = layer.open({
            title: '添加文章分类',
            type: 1,
            area: ['500px', '250px'],
            content: $('#dialog-add').html()
        });
    })
    // 添加
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/article/addcates',
            type: 'post',
            data: $(this).serialize(),
            success: (res) => {
                if (res.status != 0) {
                    return layui.layer.msg(res.message, { icon: 5 })
                };
                // 从新获取列表
                initArtCateList();
                layer.msg('添加成功', { icon: 6 });
                layer.close(indexAdd);
            }
        })
    });

    // 修改结构
    let indexEdit = null;
    $('tbody').on('click', '#btn-edit', function () {
        indexEdit = layer.open({
            title: '修改文章分类',
            type: 1,
            area: ['500px', '250px'],
            content: $('#dialog-edit').html()
        });
        let id = $(this).attr('data-id');

        $.ajax({
            url: '/my/article/cates/' + id,
            type: 'get',
            success: (res) => {
                if (res.status != 0) {
                    return layui.layer.msg(res.message, { icon: 5 })
                };
                // 从新获取列表
                // initArtCateList();
                // layer.msg('修改成功', { icon: 6 });
                // layer.close(indexEdit);
                form.val('form-edit', res.data);
            }
        })
    });

    // 修改
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/article/updatecate',
            type: 'post',
            data: $(this).serialize(),
            success: (res) => {
                if (res.status != 0) {
                    return layui.layer.msg(res.message, { icon: 5 })
                };
                // 从新获取列表
                initArtCateList();
                layer.msg('修改成功', { icon: 6 });
                layer.close(indexEdit);
            }
        })
    });

    // 删除
    $('tbody').on('click', '.btn-delete', function () {
        // console.log(1);
        let id = $(this).attr('data-id');
        // console.log(id);

        layer.confirm('是否删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                url: '/my/article/deletecate/' + id,
                type: 'get',
                success: (res) => {
                    if (res.status != 0) {
                        return layui.layer.msg(res.message, { icon: 5 })
                    };
                    initArtCateList();
                    layer.msg('删除成功', { icon: 6 });
                    layer.close(index);
                }
            })

        });

    })
})
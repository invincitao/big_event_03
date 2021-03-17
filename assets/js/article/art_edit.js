$(function () {
    let form = layui.form;
    let layer = layui.layer;

    // 加载表单
    function initForm() {
        let id = location.search.split('=')[1];
        $.ajax({
            url: '/my/article/' + id,
            type: 'get',
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layui.layer.msg(res.message, { icon: 5 })
                };
                form.val("form-edit", res.data);
                tinyMCE.activeEditor.setContent(res.data.content);
                if (!res.data.cover_img) {
                    return layer.msg('用户未曾上传头像');
                }
                let newImage = 'http://api-breakingnews-web.itheima.net' + res.data.cover_img;
                $image
                    .cropper('destroy')      // 销毁旧的裁剪区域
                    .attr('src', newImage)  // 重新设置图片路径
                    .cropper(options)        // 重新初始化裁剪区域
            }
        })
    }

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
                initForm();
            }
        })
    }

    // 初始化富文本编辑器
    initEditor()
    // 1. 初始化图片裁剪器
    let $image = $('#image')

    // 2. 裁剪选项
    let options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    $('#btnChooseImage').on('click', function () {
        $('#file').click();
    });

    $('#file').on('change', function (e) {
        let file = e.target.files[0]

        if (file == undefined) {
            return layer.msg('请选择一张照片作为封面', { icon: 7 });
        }
        let newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    });

    // 设置状态
    let state = '发布'

    $("#btnSave2").on('click', function () {
        state = '存为草稿'
    });

    // 提交
    $('#form-edit').on('submit', function (e) {
        e.preventDefault();
        // form收集数据
        let fd = new FormData(this);
        fd.append('state', state);
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                // console.log(...fd);
                publishArticle(fd);
            });
    });

    // 封装修改文章
    function publishArticle(fd) {
        $.ajax({
            url: '/my/article/edit',
            type: 'POST',
            data: fd,
            processData: false,
            contentType: false,
            success: (res) => {
                if (res.status != 0) {
                    return layui.layer.msg(res.message, { icon: 5 })
                };

                layer.msg('修改成功', { icon: 6 });
                setTimeout(function () {
                    window.parent.document.querySelector('#art_list').click();
                }, 1500)
            }
        })
    }
})


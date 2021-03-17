$(function () {
    let form = layui.form;
    let layer = layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    $('#btnChooseImage').on('click', function () {
        $('#file').click();
    })

    $('#file').on('change', function (e) {
        let file = e.target.files[0];

        if (file == undefined) {
            return layer.msg('请选择上传的头像', { icon: 7 });
        }
        let newImgURL = URL.createObjectURL(file)

        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    });

    // 上传
    $('#btnUpload').on('click', function () {
        console.log(1);
        let dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png');     // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        $.ajax({
            url: '/my/update/avatar',
            type: 'post',
            data: {
                avatar: dataURL
            },
            success: (res) => {
                if (res.status != 0) {
                    return layui.layer.msg(res.message, { icon: 5 })
                };
                layer.msg('头像上传成功', { icon: 6 });
                window.parent.getuserInfo();
            }
        })
    })

})
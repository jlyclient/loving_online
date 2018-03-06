var uploader = WebUploader.create({

    // swf文件路径
    swf: 'Uploader.swf',

    // 文件接收服务端。
    server: 'http://webuploader.duapp.com/server/fileupload.php',

    // 选择文件的按钮。可选。
    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
    pick: '#picker',

    // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
    resize: false,
    // 只允许选择图片文件。
    accept: {
        title: 'Images',
        extensions: 'gif,jpg,jpeg,bmp,png',
        mimeTypes: 'image/*'
    }
});
uploader.on('uploadSuccess', function(file) {
    console.log(file);
});
// 当有文件添加进来的时候
uploader.on('fileQueued', function(file) {
    uploader.makeThumb(file, function(error, src) {
        if (error) {
            $img.replaceWith('<span>不能预览</span>');
            return;
        }
        $('.love_img_show img').attr('src', src);
    });
});
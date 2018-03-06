/**
 * tools.js
 * @author 小灰辉
 * @website https://gitee.com/zhxh543
 * @description Professional front-end development
 * @copyright Gray
 * @license 1.0
 * @email zhxh2752@yeah.net
 */
function get_cookie_by_name(name)
{
    var start = document.cookie.indexOf(name);
    if (start != -1) {
        var res = "";
        var end  = document.cookie.indexOf(";", start+1);
        if (end == -1) {
            res = document.cookie.substring(start+name.length+1);
        } else {
            res = document.cookie.substring(start+name.length+1, end);
        }
        return res;
    }
    return "";
}

$(function() {
    var uploader = '';
    if ($('#city_1').length > 0) {
        //现居
        $("#city_1").citySelect({
            prov: "北京",
            city: "东城区"
        });
    }
    if ($('#city_2').length > 0) {
        //籍贯
        $("#city_2").citySelect({
            prov: "北京",
            city: "东城区"
        });
    }
    //select自定义控件
    var selectArry = $('select');
    $.each(selectArry, function(index, item) {
        var _text = $(item).find('option:selected').text().replace(/\(/, '<span>(').replace(/\)/, ')<span>');
        if (_text === '') {
            _text = '东城区';
        }
        $(item).prev().html(_text);
    });
    $(document).on('change', 'select', function() {
        var _text = $(this).find('option:selected').text().replace(/\(/, '<span>(').replace(/\)/, ')<span>');
        $(this).prev().html(_text);
    });

    var citySelects = $('.select_city');
    $.each(citySelects,function(index,item){
        $(item).find('select').eq(0).on('change',function() {
            $(this).parents('.select_city').find('.city').find('option').eq(0).attr('selected',true);
            var _text = $(this).parents('.select_city').find('.city').find('option').eq(0).text().replace(/\(/, '<span>(').replace(/\)/, ')<span>');
            $(this).parents('.select_city').find('.city').prev().html(_text);
        });
    });
    //更多搜索
    $(document).on('click', '.love_search_more', function() {
        $(this).toggleClass('active');
        if ($(this).attr('class').indexOf('active') > 0)
            $('.love_search_other').show();
        else
            $('.love_search_other').hide();
    });

    //分页
    $(document).on('click', '.love_page>div span', function() {
        var _text = $(this).attr('class');
        if (_text && (_text.indexOf('icon') > 0 || _text.indexOf('love_total') > 0 || _text.indexOf('love_page_more') > 0))
            return false;
        else {
            $(this).parent().find('span').removeClass('active');
            $(this).addClass('active');
        }
    });

    //返回顶部
    $(document).on('click', '.love_back_top', function() {
        $('html , body').animate({ scrollTop: 0 }, 'slow');
    });

    //滚动监听，判断什么时候显示返回顶部
    $(window).scroll(function() {
        var top = $(document).scrollTop();
        if (top >= 100)
            $('.love_back_top').show();
        else
            $('.love_back_top').hide();
    });

    //获取动态码
    $(document).on('click', '.btn_ver', function() {
        var count = 60;
        var $this = $(this);
        $this.attr('disabled', true);
        $this.text(count + 's后重发');
        $this.parent().append("<p>验证码1分钟内有效</p>");
        var interval = setInterval(function() {
            if (count - 1 > 0) {
                count--;
                $this.text(count + 's后重发');
            } else {
                clearInterval(interval);
                $this.text('获取验证码');
                $this.attr('disabled', false);
            }
        }, 1000);
    });

    //显示弹窗遮罩层
    $(document).on('click', '.btn_dialog', function() {
        if ($('body').find('.love_dialog_mask').length > 0)
            return false;
        else
            $('body').css('overflow', 'hidden').append('<div class="love_dialog_mask"></div>');
    });

    //私信提醒弹窗
    $(document).on('click', '.btn_dialog_alert', function() {
        $('.love_dialog>div').addClass('d_n');
        $('.love_dialog').find('.love_dialog_alert').removeClass('d_n');
    });

    //私信内容弹窗
    $(document).on('click', '.btn_go_letter', function() {
        $('.love_dialog>div').addClass('d_n');
        $('.love_dialog').find('.love_dialog_letter').removeClass('d_n');
    });
    //登录弹窗
    $(document).on('click', '.btn_dialog_login', function() {
        $('.love_dialog>div').addClass('d_n');
        $('.love_dialog').find('.love_dialog_login').removeClass('d_n');
    });
    $('#denglu').click(function(e) {
        var xsrf = get_cookie_by_name('_xsrf');
        var passwd = $('input[name="loginpassword"]').val();
        var name = $('input[name="loginname"]').val();
        $.ajax({
            type: 'POST',
            url: '/login',
            data: {'username': name, 'password': passwd, '_xsrf': xsrf},
            success: function(para) {
                var d = JSON.parse(para);
                if (d['code'] == '0') {
                    var msg = d['msg'];
                    $('.love_header_tools').replaceWith(msg);
                    $('.love_dialog').find('.love_dialog_login').addClass('d_n');
                    $('body').css('overflow', 'auto');
                    $('.love_dialog_mask').remove();
                } else {
                    alert('用户名或密码错误');
                }
            },
            error: function(para) {
            }
        });
    });
    //注册弹窗
    $(document).on('click', '.btn_dialog_reg', function() {
        $('.love_dialog>div').addClass('d_n');
        $('.love_dialog').find('.love_dialog_reg').removeClass('d_n');
    });
    $('#zhuce').click(function(e) {
        var xsrf = get_cookie_by_name('_xsrf');
        var name = $('input[name="nick_name"]')[0].value;
        var sex = $('input[type="radio"][name="radio"]:checked')[0].value; 
        var p1  = $('input[name="passwd1"]')[0].value;
        var p2  = $('input[name="passwd2"]')[0].value;
        if (name == "") {
            alert('用户名不能为空!');
            return;
        }
        if (p1 == "") {
            alert('请输入密码!');
            return;
        }
        if (p2 == "") {
            alert('请重复输入密码!');
            return;
        }
        if (p1 != p2) {
            alert('两次输入的密码不一致!');
            return;
        }
        $.ajax({
            type: 'POST',
            url: '/regist',
            data: {'username': name, 'password': p1, '_xsrf': xsrf},
            success: function(para) {
                if (para == '0') {
                    alert('注册成功!')
                    return;
                }
                if (para == '-1') {
                    alert('用户名已经存在!');
                    return;
                }
                $('input[name="nick_name"]')[0].value = '';
                $('input[name="passwd1"]')[0].value = '';
                $('input[name="passwd2"]')[0].value = '';
                $('.love_dialog').find('.love_dialog_password_phone').addClass('d_n');
            },
            error: function(para) {
            }
        });
    });

    //手机号找回密码弹窗
    $(document).on('click', '.btn_dialog_password_phone', function() {
        $('.love_dialog>div').addClass('d_n');
        $('.love_dialog').find('.love_dialog_password_phone').removeClass('d_n');
    });
    //邮箱找回密码弹窗
    $(document).on('click', '.btn_dialog_password_email', function() {
        $('.love_dialog>div').addClass('d_n');
        $('.love_dialog').find('.love_dialog_password_email').removeClass('d_n');
    });
    //回复消息弹窗
    $(document).on('click', '.btn_message', function() {
        $('.love_dialog>div').addClass('d_n');
        $('.love_dialog').find('.love_dialog_message').removeClass('d_n');
    });
    //发信弹窗
    $(document).on('click', '.btn_send', function() {
        $('.love_dialog>div').addClass('d_n');
        $('.love_dialog').find('.love_dialog_message').removeClass('d_n');
    });
    //查看消息弹窗
    $(document).on('click', '.btn_see', function() {
        $('.love_dialog>div').addClass('d_n');
        $('.love_dialog').find('.love_dialog_see').removeClass('d_n');
    });
    //充值弹窗
    $(document).on('click', '.btn_recharge', function() {
        $('.love_dialog>div').addClass('d_n');
        $('.love_dialog').find('.love_dialog_rec').removeClass('d_n');
    });
    //充值二维码弹窗
    $(document).on('click', '.btn_pay_submit', function() {
        $('.love_pay_content_1').hide();
        $('.love_pay_content_2').show();
    });

    //弹窗关闭
    $(document).on('click', '.btn_dialog_close,.picScroll img', function() {
        $('body').css('overflow', 'auto');
        $('.love_dialog_mask').remove();
        $('.love_dialog>div').addClass('d_n');
        if ($('.love_dialog_rec').length > 0) {
            $('.love_pay_content_1').show();
            $('.love_pay_content_2').hide();
        }
        uploader.destroy();
    });
    //图片上传弹窗
    $(document).on('click', '.btn_dialog_img', function() {
        $('.love_dialog>div').addClass('d_n');
        $('.love_dialog').find('.love_dialog_img').removeClass('d_n');
        uploader = WebUploader.create({

            // swf文件路径
            swf: 'Uploader.swf',

            // 文件接收服务端。
            server: 'http://localhost:8000/fileupload',

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
    });

    //编辑个人资料兴趣选择效果
    $(document).on('click', '.tools_span_select span', function() {
        $(this).toggleClass('active');
    });

    //充值金额选择
    $(document).on('click', '.love_rec_select span', function() {
        $(this).addClass('active').siblings('span').removeClass('active');
    });

    //充值方式选择
    $(document).on('click', '.love_pay', function() {
        $(this).addClass('active').siblings('.love_pay').removeClass('active');
    });

    //点击图片看原图
    $(document).on('click', '.picScroll-left .picList li', function() {
        var _flag = $(this).parents('.picList').attr('data-flag');
        if ($('body').find('.love_dialog_mask').length > 0)
            return false;
        else
            $('body').css('overflow', 'hidden').append('<div class="love_dialog_mask"></div>');
        var list = $(this).parents('.picList').html();
        $('.love_dialog>div').addClass('d_n');
        $('.love_dialog').find('.love_img_pic').removeClass('d_n');
        $('.picScroll .picList').html(list);
        var _height = $('.picScroll .picList img').height();
        $('.picScroll a.prev,.picScroll a.next').css({ 'height': _height + 'px', 'line-height': _height + 'px' });
        jQuery(".picScroll").slide({
            mainCell: ".bd ul",
            autoPage: true,
            effect: "left",
            autoPlay: false,
            vis: 1,
            scroll: 1,
            pnLoop: false,
            trigger: "click",
            opp: true,
            prevCell: ".prev",
            nextCell: ".next"
        });
    });

    fill_other();
});

//倒计时
function show_time() {
    var time_start = new Date().getTime(); //设定当前时间
    var time_end = new Date("2018/02/08 00:00:00").getTime(); //设定目标时间
    // 计算时间差 
    var time_distance = time_end - time_start;
    // 天
    var int_day = Math.floor(time_distance / 86400000)
    time_distance -= int_day * 86400000;
    // 时
    var int_hour = Math.floor(time_distance / 3600000)
    time_distance -= int_hour * 3600000;
    // 分
    var int_minute = Math.floor(time_distance / 60000)
    time_distance -= int_minute * 60000;
    // 秒 
    var int_second = Math.floor(time_distance / 1000)
        // 时分秒为单数时、前面加零 
    if (int_day < 10) {
        int_day = "0" + int_day;
    }
    if (int_hour < 10) {
        int_hour = "0" + int_hour;
    }
    if (int_minute < 10) {
        int_minute = "0" + int_minute;
    }
    if (int_second < 10) {
        int_second = "0" + int_second;
    }
    // 显示时间 
    // $("#time_d").val(int_day);
    $(".love_time_h").text(int_hour);
    $(".love_time_m").text(int_minute);
    $(".love_time_s").text(int_second);
    // 设置定时器
    setTimeout("show_time()", 1000);
}

function fill_other()
{
    var xsrf = get_cookie_by_name('_xsrf');
    $.ajax({
        type: 'POST',
        url:  '/indexother',
        data: {'_xsrf': xsrf},
        success: function(para) {
            var r = JSON.parse(para);
            if (r['code'] == '0') {
                var new_= r['new'];
                $('#index_ctx').empty().append(new_);
                var find = r['find'];
                $('#index_ctx').append(find);
            } else {
                //inner error
            }
        },
        error: function(para) {
        }
    });
}

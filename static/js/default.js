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
var uploader = null;
// 所有页面共存的方法，例如 翻页,城市选择之类
$(function() {

    // 首页城市选择器
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
        console.log('login');
        $('.love_dialog>div').addClass('d_n');
        $('.love_dialog').find('.love_dialog_login').removeClass('d_n');
    });
    
    //qq二维码登录弹窗
    $(document).on('click', '.love_icon-qq', function() {
        console.log('click');
        $('.love_dialog>div').addClass('d_n');
        $('.love_dialog').find('.love_dialog_login_code').removeClass('d_n');
        $('#love_login_code_header').html('QQ二维码登陆');
        $('#love_login_code_way').html('请使用QQ扫描图中二维码');
    })
    //微信二维码登录
    $(document).on('click', '.love_icon-weixin-copy', function() {
        $('.love_dialog>div').addClass('d_n');
        $('.love_dialog').find('.love_dialog_login_code').removeClass('d_n');
        $('#love_login_code_header').html('微信二维码登陆');
        $('#love_login_code_way').html('请使用微信扫描图中二维码');
    })
    
    //注册弹窗
    $(document).on('click', '.btn_dialog_reg', function() {
        $('.love_dialog>div').addClass('d_n');
        $('.love_dialog').find('.love_dialog_reg').removeClass('d_n');
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
        close_popup();
    });
     //充值金额选择
     $(document).on('click', '.love_rec_select span', function() {
        $(this).addClass('active').siblings('span').removeClass('active');
    });

    //充值方式选择
    $(document).on('click', '.love_pay', function() {
        $(this).addClass('active').siblings('.love_pay').removeClass('active');
    });

       //图片上传弹窗
       $(document).on('click', '.btn_dialog_img', function() {
        $('.love_dialog>div').addClass('d_n');
        $('.love_dialog').find('.love_dialog_img').removeClass('d_n');
        uploader = WebUploader.create({

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
    });
    var phone_zheng = /^1[3|4|5|8][0-9]\d{4,8}$/;
    phone_zheng = /^(1[356789])[0-9]{9}$/;
    // 登陆
    $(document).on('click', '#love_login_btn', function() {
        var user = $('#love_login_user').val();
        var password = $("#love_login_password").val();
        var xsrf = get_cookie_by_name('_xsrf');
        if (user != '' && password != '' && phone_zheng.test(user)) {
            $.ajax({
                type:'POST',
                url: '/login',
                data: {
                    "_xsrf":xsrf,
                    mobile: user,
                    password: password
                },
                success: function(data) {
                    var boydata = JSON.parse(data);
                    if (boydata['code'] == '0') {
                        alert('登陆成功');
                        $('.love_header_tools').empty();
                        var login = "<a id='love_recharge' class='btn_dialog btn_recharge' data-flag='true' href='javascript:void(0);'>充值</a>" +
                "<dl id='love_islogin' class='love_header_tools_center'> " +
                  "<dt><a id='login_name' href='/center'>" + boydata.data.nick_name + "</a></dt> " +
                  "<dd><a class='/logout' href=''>退出登录</a></dd>" +
                "</dl>";
                        $('.love_header_tools').append(login);
                        close_popup(); // 关闭弹窗
                    } else if (boydata['code'] == '-1') {
                        alert('手机号或密码不正确');
                    } else {
                        alert('服务器出错');
                    }
                    console.log(data);
                },
                error: function(para) {
                    alert(para, 'ajax请求失败！');
                }
            })
        } else {
            alert('请输入完整并且正确的信息！');
        }
    });

     // 注册
     $(document).on('click', '#love_regiest_btn', function() {
        var obj = {
            mobile: '',
            code: '',
            sex: '',
            password1: '',
            password2: '',
            checked: false,
        }
        var xsrf = get_cookie_by_name('_xsrf');
        $('#love_register').find('input').map((index, data) => {
            if (data.type == 'text' || data.type == 'password') {
                obj[data.name] = data.value;
            } else if (data.type == 'radio' && data.checked == true) {
                obj.sex = $(data).attr('sex');
            } else if (data.type == 'checkbox') {
                obj.checked = data.checked;
            }
        });
        if (obj.mobile != '' && obj.code != '' && obj.sex != '' && obj.password1 != '' && obj.password2 != '' && obj.password1 === obj.password2 && obj.checked == true) {
            $.ajax({
                type: 'POST',
                url: '/regist',
                data: {
                    "_xsrf":xsrf,
                    mobile: obj.mobile,
                    code: obj.code,
                    sex: obj.sex,
                    password1: obj.password1,
                    password2: obj.password2,
                    token: g_token, //在index.js中定义
                    time: g_time,   //在index.js中定义
                },
                success: function(data) {
                    var boydata = JSON.parse(data);
                    if (boydata['code'] == '0') {
                        close_popup(); // 关闭弹窗
                    } else {
                        alert(boydata['msg']);
                    }
                }
            });
            gt_time = g_token = 0;
        } else {
            alert('请填写完整的信息！')
        }
    });

    // 找回密码
    $(document).click('on', '#findpassword_btn', function() {
        var obj = {
            mobile: '',
            code: '',
            password1: '',
            password2: '',
        }
        var xsrf = get_cookie_by_name('_xsrf');
        $('#love_register').find('input').map((index, data) => {
            obj[data.attr('name')] = $(data).val();
        });
        if (obj.mobile != '' && obj.code != '' && obj.password1 != '' && obj.password2 != '' && obj.password1 === obj.password2) {
            $.ajax({
                type: 'POST',
                url: '/find_password',
                data: {
                    "_xsrf":xsrf,
                    mobile: obj.mobile,
                    code: obj.code,
                    password1: obj.password1,
                    password2: obj.password2,
                    token: '',
                    time: '',
                },
                success: function(data) {
                    var boydata = JSON.parse(data);
                    if (boydata['code'] == '0') {
                        close_popup(); // 关闭弹窗
                    } else {
                        alert(boydata['msg']);
                    }
                },
                error: function(para) {
                    alert(para, 'ajax请求失败！');
                }
            })
        }
    })

    // 注册发送验证码
    $(document).click('on', '#regiest', function() {
        send_verify('regiest');
    })
    // 找回密码发送验证码
    $(document).click('on', '#find_password', function() {
        send_verify('find_password');
    })

})

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
// 关闭弹窗
function close_popup() {
    $('body').css('overflow', 'auto');
        $('.love_dialog_mask').remove();
        $('.love_dialog>div').addClass('d_n');
        if ($('.love_dialog_rec').length > 0) {
            $('.love_pay_content_1').show();
            $('.love_pay_content_2').hide();
        }
        if (uploader != null) {
            uploader.destroy();
        }
}
var g_time=null, g_token=null;
// 发送验证码
function send_verify(type) {
    // type为  regrets find_password
    var mobile = $('#love_register').find('input:text[name = user]').val();
    var pat = /^(1[356789])[0-9]{9}$/;
    if (mobile == null || !pat.test(mobile)) {
        alert('电话号码不正确');
        return -1;
    }
    $.ajax({
        type: 'GET',
        url: '/verify_code',
        data: {'mobile':mobile},
        success:function(para) {
            var d = JSON.parse(para);
            if (d['code'] == 0) {
                g_time = d['time'];
                g_token = d['token'];
                alert(para);
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
            } else {
                alert(d['msg']);
            }
        },
        error: function(para) {
        }
    });
}


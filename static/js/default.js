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
    var xsrf = get_cookie_by_name('_xsrf');
    // 首页城市选择器
    if ($('#city_1').length > 0) {
        //现居
        $("#city_1").citySelect();
    }
    if ($('#city_2').length > 0) {
        //籍贯
        $("#city_2").citySelect();
    }
    //select自定义控件
    var selectArry = $('select');
    $.each(selectArry, function(index, item) {
        var _text = $(item).find('option:selected').text().replace(/\(/, '<span>(').replace(/\)/, ')<span>');
        if (_text === '') {
            _text = '请选择';
        }
        $(item).prev().html(_text);
    });
    $(document).on('change', 'select', function() {
        var _text = $(this).find('option:selected').text().replace(/\(/, '<span>(').replace(/\)/, ')<span>');
        $(this).prev().html(_text);
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
     $(".love_page>div span").click(function() {
        var _text = $(this).attr('class');
        if (_text && (_text.indexOf('icon') > 0 || _text.indexOf('love_total') > 0 || _text.indexOf('love_page_more') > 0))
            return false;
        else {
            $(this).parent().find('span').removeClass('active');
            $(this).addClass('active');
        }
     });

     //返回顶部
     $(".love_back_top").click(function() {
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
    $(".btn_dialog").click(function() {
        if ($('body').find('.love_dialog_mask').length > 0)
        return false;
    else
        $('body').css('overflow', 'hidden').append('<div class="love_dialog_mask"></div>');
    });

    //私信提醒弹窗
    $(".btn_dialog_alert").click(function() {
        $('.love_dialog>div').addClass('d_n');
        $('.love_dialog').find('.love_dialog_alert').removeClass('d_n');
    })

    //私信内容弹窗
    $(".btn_go_letter").click(function() {
        $('.love_dialog>div').addClass('d_n');
        $('.love_dialog').find('.love_dialog_letter').removeClass('d_n');
    })

    //登录弹窗
    $(".btn_dialog_login").click(function() {
      $('.love_dialog>div').addClass('d_n');
      $('.love_dialog').find('.love_dialog_login').removeClass('d_n');
        // wx_login();
    });
    
    // 修改密码弹窗
    $(".btn_dialog_password").click(function() {
        $('.love_dialog>div').addClass('d_n');
        $('.love_dialog').find('.love_dialog_modifypassword').removeClass('d_n');
    })
    
    //qq二维码登录弹窗
    $(".love_icon-qq").click(function() {
        $('.love_dialog>div').addClass('d_n');
        $('.love_dialog').find('.love_dialog_login_code').removeClass('d_n');
        $('#love_login_code_header').html('QQ二维码登陆');
        $('#love_login_code_way').html('请使用QQ扫描图中二维码');
    });

    //微信二维码登录
    $(".love_icon-weixin-copy").click(function() {
        $('.love_dialog>div').addClass('d_n');
        $('.love_dialog').find('.love_dialog_login_code').removeClass('d_n');
        $('#love_login_code_header').html('微信二维码登陆');
        $('#love_login_code_way').html('请使用微信扫描图中二维码');
    });
    
    //注册弹窗
    $('.btn_dialog_reg').click(function() {
        $('.love_dialog>div').addClass('d_n');
        $('.love_dialog').find('.love_dialog_reg').removeClass('d_n');
    });

    //手机号找回密码弹窗
    $(".btn_dialog_password_phone").click(function() {
        $('.love_dialog>div').addClass('d_n');
        $('.love_dialog').find('.love_dialog_password_phone').removeClass('d_n');
    })

    //邮箱找回密码弹窗
    $(".btn_dialog_password_email").click(function() {
        $('.love_dialog>div').addClass('d_n');
        $('.love_dialog').find('.love_dialog_password_email').removeClass('d_n');
    })

    //回复消息弹窗
    $(".btn_message").click(function() {
        $('.love_dialog>div').addClass('d_n');
        $('.love_dialog').find('.love_dialog_message').removeClass('d_n');
    });

    //发信弹窗
    $(".btn_send").click(function() {
        $('.love_dialog>div').addClass('d_n');
        $('.love_dialog').find('.love_dialog_message').removeClass('d_n');
    });

    //查看消息弹窗
    $(".btn_see").click(function() {
        $('.love_dialog>div').addClass('d_n');
        $('.love_dialog').find('.love_dialog_see').removeClass('d_n');
    });

    //充值弹窗
    $(".btn_recharge").click(function() {
        $('.love_dialog>div').addClass('d_n');
        $('.love_dialog').find('.love_dialog_rec').removeClass('d_n');
        $.ajax({
            url: 'yue',
            type: 'POST',
            data: {
                "_xsrf":xsrf
            },
            success: function(data) {
                var jsondata = JSON.parse(data);
                $(".love_balance").empty();
                console.log(jsondata);
                if (jsondata.code == 0) {
                    var balancehtml = '<p>充值余额：<span>'+ jsondata.data.num +'</span>爱豆</p><p>赠送余额：<span>'+ jsondata.data.free +'</span>爱豆</p>';
                    $(".love_balance").append(balancehtml);  
                } else {
                    alert(jsondata.msg);
                }
            }
        })
    });

    //充值二维码弹窗
    $(".btn_pay_submit").click(function() {
        var chongzhinum = 0;
        // var chongzhitype = 0;
        var flag = false;
        var yuanarr = [1.00, 2.00, 5.00, 10.00, 20.00, 50.00, 100.00];
        $(".love_rec_select").find('span').map((index, data) => {
            if ($(data).attr('class') == 'active') {
                chongzhinum = $(data).attr('name');
            }
            console.log(chongzhinum);
        });
        $(".love_rec_pay").find(".love_pay").map((index, data) => {
            console.log($(data).attr('class'));
            if ($(data).attr('class') == 'love_pay active') {
                flag = true;
            }
        });
        if (flag == true) {
            $.ajax({
                url: '/chongzhi',
                type: 'POST',
                data: {
                    "_xsrf":xsrf,
                    kind: chongzhinum,
                    way: 0
                },
                success: function(data) {
                    var jsondata = JSON.parse(data);
                    console.log(jsondata);
                    if (jsondata.code == 0) {
                        $('.love_pay_content_1').hide();
                        $('.love_pay_content_2').show();
                        $(".love_content2_title").empty();
                        $("#qrcode").empty();
                        var payhtml = '尊敬的会员<span>'+ $("#login_name").html() +'</span>，您正在使用即时到帐付款功能，您即将付款<span>'+ yuanarr[chongzhinum] +'</span>元。';
                        $(".love_content2_title").append(payhtml);
                        $(".love_pay_num").html(yuanarr[chongzhinum]);
                        var qrcode = new QRCode(document.getElementById("qrcode"), {
                            width : 178,
                            height : 178,
                        });
                        qrcode.makeCode(jsondata.data.code_url);
                        var time = 0;
                        var t = setInterval(function() {
                            if (time == 30) {
                                clearInterval(t);
                                close_popup();
                                return;
                            }
                            $.ajax({
                                url: '/query_pay_order',
                                type: 'POST',
                                data: {
                                    "_xsrf":xsrf,
                                    out_trade_no: jsondata.data.out_trade_no
                                },
                                success: function(data) {
                                    var codedata = JSON.parse(data);
                                    console.log(codedata);
                                    if (codedata.code == 0) {
                                        clearInterval(t);
                                        close_popup();
                                    } else {
                                        alert(codedata.msg);
                                    }
                                },
                            });
                            time ++;
                        }, 2000);
                    } else {
                        alert(jsondata.msg, '执行到这里是jsondata.code不为0, default.js254行');
                    }
                }
            });    
        } else {
            alert('请选择支付方式！');
        }    
    });
 

    //弹窗关闭
    $(".btn_dialog_close,.picScroll img").click(function() {
        close_popup();
    });

     //充值金额选择
     $(".love_rec_select span").click(function() {
        $(this).addClass('active').siblings('span').removeClass('active');
     })

    //充值方式选择
    $(".love_pay").click(function() {
        $(this).addClass('active').siblings('.love_pay').removeClass('active');
    })

    // 页面跳转
    $(".love_nav").find("a").map((index, data) => {
        $(data).click(function() {
            console.log(data);
            $(data).parent().attr("class", 'active')
        });
    });

   

       //图片上传弹窗
       var upload_type = null;
    $(".btn_dialog_img").click(function(){
        upload_type = $(this).attr("name");
        $('.love_dialog>div').addClass('d_n');
        $('.love_dialog').find('.love_dialog_img').removeClass('d_n');
        $('.love_img_show img').attr('src', '');
        // var fileserver_url = 'http://www.' + document.domain + '/fileupload';
        uploader = WebUploader.create({
            // swf文件路径
            swf: 'Uploader.swf',
            // 文件接收服务端。
            server: '/fileupload',

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
            },
            method: 'POST',
        });
        uploader.on('uploadSuccess', function(file) {
            console.log(file);
        });
        // 当有文件添加进来的时候
        uploader.on('fileQueued', function(file) {
            uploader.makeThumb(file, function(error, src) {
                console.log(file, error, src);
                if (error) {
                    alert("不能预览，请重新上传！")
                    console.log('bunengyulan');
                }
                $('.love_img_show img').attr('src', src);
            });
        });
    });

    $(".btn_save_pic").click(function() {
        console.log('success');
        uploader.option('formData',{
            "_xsrf":xsrf,
            kind: upload_type
         });
        //添加完需要与图片一起上传的参数之后,就可以手动触发uploader的上传事件了.
        uploader.upload();

        uploader.on('uploadProgress', function( file, percentage ) {
            console.log('uploadProgress');
        });
        uploader.on('uploadSuccess',function(file,response){
            console.log(file,response);
            if(response.msg== 'ok') {
                close_popup();
                alert("图片上传成功！");
                window.location.reload();
         　　} else {
             alert(response.msg, '执行到这里时response.msg不为OK, default.js 352');
            }
        });
        uploader.on('uploadError',function(file,response){
            console.log(file,response);

        });
        
    });
    // 删除图片
    $("#love_user_pic").on('click', '.love_icon-delete', function() {
        var src = $(this).parent().next().attr("src");
        var This = this;
        console.log(src);
        var a = src.split('/');
        if (a.length != 7) {
            return -1;
        }
        var t = a[3] + '/' + a[4] + '/' + a[5];
        // console.log($(This).parent().parent().parent().eq(0).css({ display: 'none' }));
        $.ajax({
            url: '/delimg',
            type: 'POST',
            data: {
                "_xsrf":xsrf,
                'src':t
            },
            success: function(data) {
                var jsondata = JSON.parse(data);
                console.log(jsondata);
                if (jsondata.code == 0) {
                    alert("图片删除成功！")
                } else {
                    alert(jsondata.msg);
                }
                $(This).parent().parent().parent().eq(0).css({ display: 'none' });
            },
            error: function(para){
                console.log('ajax', para);
            },
        })
    });

    var phone_zheng = /^(1[356789])[0-9]{9}$/;
    // 登陆
    $("#love_login_btn").click(function() {
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
        } 
        if(user === '' || !phone_zheng.test(user)) {
            $("#love_login .love_err_message").eq(0).css({ display: 'block'});
        } 
        if (password === '') {
            $("#love_login .love_err_message").eq(1).css({ display: 'block'});
        }
    });
    $('input').change(function() {
        $('.love_err_message').css({ display: 'none'});
    });

     // 注册
     $("#love_regiest_btn").click(function() {
        var obj = {
            mobile: '',
            code: '',
            sex: '',
            password1: '',
            password2: '',
            checked: false
        }
        
        $('#love_register').find('input').map((index, data) => {
            if (data.type == 'text' || data.type == 'password') {
                obj[$(data).attr('name')] = data.value;
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
                    token: g_token,
                    time: g_time
                },
                success: function(data) {
                    var boydata = JSON.parse(data);
                    if (boydata['code'] == '0') {
                        close_popup(); // 关闭弹窗
                    } else {
                        alert(boydata['msg'], '执行到这里时code不为0 default.js 482');
                    }
                }
            });
            gt_time = g_token = 0;
        } 
        if (obj.mobile === '') {
            $("#love_register .love_err_message").eq(0).css({ dispaly: 'block'});
        }
        if (obj.code === '') {
            $("#love_register .love_err_message").eq(1).css({ dispaly: 'block'});
        }
        if (obj.password1 === '') {
            $("#love_register .love_err_message").eq(2).css({ dispaly: 'block'});
        }
     });

     // 注册再次输入密码
    $("#love_register input:password[name = password2]").change(function(e) {
        if (e.target.value !== $("#love_register input:password[name = password1]").val()) {
            $("#love_register .love_err_message").eq(3).css({ dispaly: 'block'});
        } else {
            $("#love_register .love_err_message").eq(3).css({ dispaly: 'none'});
        }
    })

    // 找回密码
      $('#findpassword_btn').click(function() {
        var obj = {
            mobile: '',
            code: '',
            password1: '',
            password2: ''
        }
        var xsrf = get_cookie_by_name('_xsrf');
        $('#love_findpassword').find('input').map((index, data) => {
            obj[$(data).attr('name')] = $(data).val();
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
                    token: g_token,
                    time: g_time
                },
                success: function(data) {
                    var boydata = JSON.parse(data);
                    if (boydata['code'] == '0') {
                        close_popup(); // 关闭弹窗
                    } else {
                        alert(boydata['msg'], '执行到这里时code不为0 default.js 538');
                    }
                },
                error: function(para) {
                    alert(para, 'ajax请求失败！');
                }
            })
        }
        if (obj.mobile === '') {
            $("#love_findpassword .love_err_message").eq(0).css({ dispaly: 'block'});
        } 
        if (obj.code === '') {
            $("#love_findpassword .love_err_message").eq(1).css({ dispaly: 'block'});
        }
        if (obj.password1 === '') {
            $("#love_findpassword .love_err_message").eq(2).css({ dispaly: 'block'});
        }
    })
     // 找回密码再次输入密码
    $("#love_findpassword input:password[name = password2]").change(function(e) {
        if (e.target.value !== $("#love_register input:password[name = password1]").val()) {
            $("#love_findpassword .love_err_message").eq(3).css({ dispaly: 'block'});
        } else {
            $("#love_findpassword .love_err_message").eq(3).css({ dispaly: 'none'});
        }
    })
    // 注册发送验证码
    $('#regist').click(function() {
        if (phone_zheng.test($('#love_register').find('input:text[name=mobile]').val())) {
            send_verify(1);
        } else {
            $("#love_register .love_err_message").eq(0).css({ dispaly: 'block'});
        }
        
    });
    // 找回密码发送验证码
    $('#find_password').click(function() {
        if (phone_zheng.test($('#love_findpassword').find('input:text[name=mobile]').val())){
            send_verify(2);
        } else {
            $("#love_findpassword .love_err_message").eq(0).css({ dispaly: 'block'});
        }
         
    });

    var cookie = get_cookie_by_name('userid');
    if (cookie != null && cookie != '') {
     // 获取未读邮件个数
    $.ajax({
        url: '/email_unread',
        type: 'POST',
        data: {
            "_xsrf":xsrf
        },
        success: function(data) {
            var jsondata = JSON.parse(data);
            console.log(jsondata);
            if (jsondata.code == 0) {
                $(".love_icon-lingdang").empty();
                if (jsondata.data > 0) {
                    var weiduhtml = '<i class="weidunumber">'+ (jsondata.data > 99 ? '99+' : jsondata.data) +'</i>';
                    $(".love_icon-lingdang").append(weiduhtml);
                }
                
            } else {
                alert(jsondata.msg);
            }
        },
        error: function(para) {
            console.log(para);
        },
    });
    }
    
    // 确认修改密码
    $("#changepassword_btn").click(function() {
        var obj = {mobile: '', password1: '', password2: ''};
        $("#love_modify_password").find('input').map((index, data) => {
            obj[$(data).attr('name')] = $(data).val();
        });
        if (obj.mobile !== '' && phone_zheng.test(obj.mobile) && obj.password1 !== '' && obj.password2 !== '' && obj.password1 === obj.password2 ) {
            // 满足修改密码的所有条件
            
        }
        if (obj.mobile === '' || !phone_zheng.test(obj.mobile)) {
            $("#love_modify_password .love_err_message").eq(0).css({ dispaly: 'block'});
        }
        if (obj.password1 === '') {
            $("#love_modify_password .love_err_message").eq(1).css({ dispaly: 'block'});
        }
        if (obj.password2 === '' || obj.password1 !== obj.password2) {
            $("#love_modify_password .love_err_message").eq(3).css({ dispaly: 'block'});
        }
    })
})

// 距离到现在的时间
function now_time(time) {
    var time_start = new Date(time.replace(/\-/g, "/")).getTime(); //设定当前时间
    var time_end = new Date().getTime(); //设定目标时间
    // 计算时间差 
    var time_distance = time_end - time_start;

    // 天
    var int_day = Math.floor(time_distance / 86400000);
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
    var timehtml = '<span>'+int_day+'天'+ int_hour +'时'+ int_minute +'分'+ int_second +'秒</span>';
    return timehtml;
}

//倒计时
function show_time(time, i) {
    var time_start = new Date().getTime(); //设定当前时间
    var time_end = time; //设定目标时间
    var num = 0;
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
    $('.love_try_item_right').eq(i).empty();
    var timehtml = '<div><p class="love_time">剩余：<span class="love_time_h">'+ int_day+'</span>天<span class="love_time_h">'+ int_hour+'</span>小时'+
    '<span class="love_time_m">'+ int_minute +'</span>分'+
    '<span class="love_time_s">'+ int_second +'</span>秒</p></div>';
    // console.log(timehtml);
    $('.love_try_item_right').eq(i).append(timehtml);
    setTimeout('show_time('+ time +','+ i +')', 1000);
    // 设置定时器
    // setInterval(function(){
    //     num++;
    //     show_time(time - 1000 * num);
    // }, 1000);
    // return timehtml;
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
    if (type != 1 && type != 2) {
        return -1;
    }
    // type为  regrets find_password
    var mobile = '';
    if (type == 1) {
        mobile = $('#love_register').find('input:text[name=mobile]').val();
    } else {
        mobile = $('#love_findpassword').find('input:text[name=mobile]').val();
    }
    var pat = /^(1[356789])[0-9]{9}$/;
    if (mobile == null || !pat.test(mobile)) {
        alert('电话号码不正确');
        return -1;
    }
    var url = type == 1 ? '/verify_code' : '/find_verify';
    $.ajax({
        type: 'GET',
        url: url,
        data: {'mobile':mobile},
        success:function(para) {
            var d = JSON.parse(para);
            if (d['code'] == 0) {
                g_time = d['time'];
                g_token = d['token'];
                var count = 60;
                var $this;
                if (type === 1) {
                    $this = $("#regist");
                } else {
                    $this = $("#find_password");
                }
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
                alert(d['msg'], '执行到这里时code不为0 default.js 776');
            }
        },
        error: function(para) {
        }
    });
}
// 征婚
function get_html(url, sex, age1, age2, loc1, loc2, next, callback) {
    var xsrf = get_cookie_by_name('_xsrf');
    console.log(url, sex, age1, age2, loc1, loc2, next);
    $.ajax({
        url: url,
        type: 'POST',
        data: {
            '_xsrf': xsrf,
            sex: sex,
            age1: age1,
            age2: age2,
            loc1: loc1,
            loc2: loc2,
            next: next
        },
        success: function(data) {
            var jsondata = JSON.parse(data);
            console.log(jsondata);
            if (jsondata.code == 0) {
                $(".love_try_box").empty();
                callback(Math.ceil(jsondata.data.count / jsondata.data.page), next);
                var listhtml = '';
                var listdata = jsondata.data.arr;
                if (listdata.length > 0) {
                    for(var i = 0; i < listdata.length; i++) {
                        var endtime = Number(new Date(listdata[i].time.replace(/\-/g, "/")).getTime()) + listdata[i].valid_day * 24 * 60 * 60 * 1000;
                        var endflag = new Date().getTime() > endtime ? true : false;
                        var timehtml = '';
                        if (endflag) {
                            timehtml += '<p>报名已截止</p>';
                        } else {
                            show_time(endtime, i);
                        }
                        listhtml += '<div '+ (endflag == true ? 'class="love_try_item love_over"' : 'class="love_try_item"') +'>'+
                        '<div class="love_try_item_left">'+
                            '<div class="love_try_img">'+
                                '<a href="/user?uid='+ listdata[i].uid +'" target="_blank">'+
                                    '<img src='+ listdata[i].src +' alt="">'+
                                '</a>'+
                            '</div>'+
                            '<div class="love_try_item_text">'+
                                '<a href="/detail_zhenghun?zid='+ listdata[i].id +'" target="_blank" >'+
                                    '<div class="love_try_item_top">'+
                                        '<h2>'+ listdata[i].nick_name +'<span>（'+ listdata[i].sex_name +'）</span></h2>'+
                                        '<p><span>['+ listdata[i].loc1 +']</span>'+ listdata[i].nick_name +'发起了征婚</p>'+
                                    '</div>'+
                                '</a>'+
                                '<div class="love_try_item_middle">'+
                                    '<p>'+
                                        '<span>征婚对象：'+ listdata[i].object_name +'</span>'+
                                        '<span>征婚地点：'+ listdata[i].loc1 +'</span>'+
                                    '</p>'+
                                    '<p>'+
                                        '<span>发起时间：'+ listdata[i].time +'</span>'+
                                    '</p>'+
                                    '<p>征婚条件：'+ listdata[i].content +'</p>'+
                                '</div>'+
                                '<div class="love_try_item_bottom">'+
                                    '<a name='+ listdata[i].nick_name +' uid='+ listdata[i].uid +' class="btn btn_default btn_dialog btn_dialog_alert private_email" href="javascript:void(0);">私信TA</a>'+
                                    '<div>'+
                                        '<span>'+ now_time(listdata[i].time) +'</span>'+
                                        '<span>'+ listdata[i].scan_count +'人阅读</span>'+
                                        (url == '/sponsor_zhenghun' ? '<span class="del_zhenghun love_photo_add" name='+ listdata[i].id +'>删除</span>' : '') +
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                        '<div class="love_try_item_right">'+
                            '<div>'+ timehtml +'</div>'+
                        '</div>'+
                    '</div>';
                    }
                } else {
                    console.log('0000000');
                    listhtml += '<div class="love_none"><div class="love_none_text"><i></i><p>暂时没有任何征婚信息，快去征婚吧！</p></div></div>';
                }
                $(".love_try_box").append(listhtml);
            } else {
                alert(jsondata.msg);
            }
        },
        error: function(para) {
            console.log(para);
        }
    });
}

function find_member(sex, agemin, agemax, cur1, cur2, ori1, ori2, degree, salary, xingzuo, shengxiao, next, callback) {
    // console.log(sex, agemin, agemax, cur1, cur2, ori1, ori2, degree, salary, xingzuo, next, shengxiao);
    var xsrf = get_cookie_by_name('_xsrf');
    $.ajax({
        type:'POST',
        url: '/find',
        data: {
            "_xsrf":xsrf,
            sex: sex,
            agemin: agemin,
            agemax: agemax,
            cur1: cur1,
            cur2: cur2,
            ori1: ori1,
            ori2: ori2,
            degree: degree,
            salary: salary,
            xingzuo: xingzuo,
            shengxiao: shengxiao,
            next: next ? next : 0
        },
        success: function(mes) {
            var boydata = JSON.parse(mes);
            console.log(boydata);
            if (boydata['code'] == '0') {
                $('.love_box_line').empty();
                var boyhtml = '';
                var degreearr = ['保密', '高中及以下', '中专/大专', '本科', '研究生', '博士及博士后'];
                var sexarr = ['未填', '男', '女'];
                if (boydata.data.length > 0) {
                    for (var i = 0; i < boydata.data.length; i++) {
                        var head_pic = boydata.data[i].pic.arr[0];
                        if (head_pic.length == 0) {
                            if (boydata.data[i].user.sex == 1) {
                                head_pic = '/img/default_male.jpg';
                            } else if (boydata.data[i].user.sex == 2) {
                                head_pic = '/img/default_female.jpg';
                            }
                        }
                        boyhtml += '<div class="love_col love_col_4 love_item"> ' +
                        '<div class="love_img">' +
                            '<a href="/user?uid='+ boydata.data[i].user.id +'" target=\"_blank\" >' +
                                '<img src='+head_pic+' alt="">' +
                            '</a>'+
                        '</div>'+
                        '<h2>'+ boydata.data[i].user.nick_name +' '+
                            '<span>（'+ sexarr[boydata.data[i].user.sex] +'）</span>' +
                        '</h2>'+
                        '<p>'+
                            '<span>'+ boydata.data[i].user.age +'岁</span>'+
                            '<span>'+ boydata.data[i].user.height +'CM</span>'+
                            '<span>'+ degreearr[boydata.data[i].user.degree] + '</span>'+
                        '</p>'+
                        '<p class="love_text">'+ boydata.data[i].statement.motto+'</p>'+
                    '</div>';
                    }
                } else {
                    boyhtml += '<div class="love_none"><div class="love_none_text"><i></i><p>没有符合条件的人！</p></div></div>';
                }
                $('.love_box_line').append(boyhtml);
                if (callback) {
                    callback(Math.ceil(boydata.count / boydata.page), next);
                }
            } else {
                alert(jsondata.msg);
            }
        },
        error: function(para) {
            console.log('ajax请求失败：' + para);
        } 
    })
}

// 展示图片
function show_img(src) {
    var showhtml = '<div class="love_img_box">'+
    '<span onclick="close_showimg()" class="love_img_close"></span>'+
    '<img class="img_show" src='+ src +' alt="">'+
    '</div>';
    $('body').append(showhtml);
}
function close_showimg() {
    var delimgbox = $('.love_img_box')[0];
    var box = $('body')[0];
    box.removeChild(delimgbox);
}

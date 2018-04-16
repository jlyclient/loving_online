var email_data;
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
    var show_data, send_email;
    var xsrf = get_cookie_by_name('_xsrf');
    var show_type = 'in';
    get_data('email', 'in', 0, gethtmlFun);
    function gethtmlFun(value, next) {
        Page({
			num:value,				//页码数
			startnum:next+1,		//指定页码
			elem:$('#page1'),		//指定的元素
            callback:function(n) {	//回调函数
                console.log(n);
				get_data(
                    'email',
                    show_type,
                    n-1,
                    gethtmlFun,
                );
			}
		});
    }
    var spanarr = $(".love_inbox_tab").find('span');
    for (var i = 0; i < spanarr.length; i++) {
        $(spanarr[i]).click(function() {
            for (var j = 0; j < spanarr.length; j++){
                $(spanarr[j]).attr('class', '');
            }
            $(this).attr('class', 'active');
            show_type = $(this).attr('type');
            show_html($(this).attr('type'));
            if (show_type == 'in') {
                gethtmlFun(Math.ceil(email_data.total_in / email_data.page), 0);
            } else {
                gethtmlFun(Math.ceil(email_data.totoal_out / email_data.page), 0);
            }
            
        })
    }
    console.log('ajax');
    $.ajax({
        url: '/latest_conn',
        type: 'POST',
        data: {
            '_xsrf': xsrf,
        },
        success: function(data) {
            var jsondata = JSON.parse(data);
            console.log(jsondata);
            if (jsondata.code == 0) {
                var latest = '';
                for (var i = 0; i < jsondata.data.length; i++) {
                    latest+= '<div class="love_lately_item">'+
                    '<div class="love_lately_img">'+
                    '<a href=\"/user?uid=' + jsondata.data[i].id + '\" target=\"_blank\">' +
                    '<img src='+ jsondata.data[i].src +' alt="">'+ '</a>' +
                    '</div>'+
                    '<h2>'+ jsondata.data[i].name +'<span>（'+ jsondata.data[i].sex_name +'）</span></h2>'+
                    '<p>'+ jsondata.data[i].last_login +'</p>'+
                '</div>';
                }
                $(".love_inbox_lately").append(latest);
            }
        },
        error: function(para) {
            console.log(para);
        }
    });
    $(".email_inbox").on("click", ".btn_message", function() {
        send_email = $(this).attr('name');
        $("#send_name").html($(this).attr('send'));
        $('.love_dialog>div').addClass('d_n');
        $('.love_dialog').find('.love_dialog_message').removeClass('d_n');
    });
    $(".email_inbox").on('click', '.btn_resultbtn', function() {
        var This = $(this);
        if (This.parent().prev().find('.radio')[0]) {
            $.ajax({
                url: '/yanyuan_reply',
                type: 'POST',
                data: {
                    '_xsrf': xsrf,
                    kind: This.attr('kind'),
                    uid: This.attr("name"),
                    eid: This.attr("eid"),
                },
                success: function(data) {
                    var jsondata = JSON.parse(data);
                    console.log(jsondata, This.attr('kind'), This.attr("name"), This.attr("eid"));
                    if (jsondata.code == 0) {
                        
                        var n = $('.weidunumber').html();
                            n = parseInt(n)
                            n = n-1
                            $('.weidunumber').html(n);
                            // $(this).parent().removeChild();
                            // console.log(This.parent().prev().find('.radio')[0]);
                            This.parent().prev()[0].removeChild(This.parent().prev().find('.radio')[0]);
                    }
                },
                error: function(para) {
                    console.log(para);
                },
            })
        }
    });

    $(".email_inbox").on('click', '.btn_see', function() {
        var This = $(this);
        $(".love_see_content").empty();
        var seearr = email_data[$(this).attr('type')];
        var seedata = email_data[$(this).attr('type')][$(this).attr('num')];
        var seeemail = '<div class="love_see_img">'+
            '<img src='+ seedata.user.pic +' alt="">'+
        '</div>'+
        '<div class="love_see_text">'+
            '<div class="see_line">'+
                '<div>'+ ($(this).attr('type') == 'in' ? '发件人' : '收件人') +'：</div>'+
                '<div><em >'+ seedata.user.name +'</em></div>'+
                '<div class="fr">时&emsp;间：'+ seedata.mail.time +'</div>'+
            '</div>'+
            '<div class="see_line">'+
                '<div>正&emsp;文：</div>'+
                '<div class="see_text">'+
                    '<p>'+ seedata.mail.content +'</p>'+
                '</div>'+
            '</div>'+
        '</div>';
        $(".love_see_content").append(seeemail);
        $("#love_seeemail_header").html(seedata.user.name + '的消息');
        $('.love_dialog>div').addClass('d_n');
        $('.love_dialog').find('.love_dialog_see').removeClass('d_n');
        if (seedata.mail.read == 0) {
            $.ajax({
                url: '/see_email',
                type: 'POST',
                data: {
                    '_xsrf': xsrf,
                    eid: seedata.mail.id,
                },
                success: function(data) {
                    var jsondata = JSON.parse(data);
                    if (jsondata.code == 0) {
                        var n = $('.weidunumber').html();
                        n = parseInt(n)
                        n = n-1
                        $('.weidunumber').html(n);
                        This.parent().prev()[0].removeChild(This.parent().prev().find('.radio')[0]);
                        // console.log(This.parent().prev().find(".radio"));
                        // This.parent().prev();
                    }
                    console.log(jsondata);
                },
                error: function(para) {
                    console.log(para);
                }
            });
        }
    });
    $(".email_inbox").on('click', '.del_email', function() {
        var T = this;
        var eid = $(this).attr('name');
        if (eid == null) {
            return -1
        }
        $.ajax({
            url: '/del_email',
            type: 'POST',
            data: {
                '_xsrf': xsrf,
                eid: eid,
            },
            success: function(data) {
                var jsondata = JSON.parse(data);
                if (jsondata.code == 0) {
                    $(T).parent().remove();
                    console.log(jsondata);
                }
            }
        })
    })
    $(".send_back_message").click(function() {
        var cnt = $("#send_back_content").val();
        if (cnt == null || cnt == '') {
            alert('发信内容不能为空');
            return -1;
        }
        if (cnt.length > 500) {
            alert('发信内容不能超过500字');
            return -1;
        }
        console.log(send_email)
        $.ajax({
            url: '/sendemail',
            type: 'POST',
            data: {
                '_xsrf': xsrf,
                uid: send_email,
                content: cnt,
            },
            success: function(data) {
                var jsondata = JSON.parse(data);
                console.log(jsondata);
                if (jsondata.code == 0) {
                    console.log(jsondata);
                    close_popup();
                }
            },
            error: function(para) {
                console.log(para);
                close_popup();
            }
        });
    })
})

function get_data(url, type, next, callback) {
    var xsrf = get_cookie_by_name('_xsrf');
    var url_ = '/' + url;
    $.ajax({
        url: url_,
        type: 'POST',
        data: {
            '_xsrf': xsrf,
            next: next,
        },
        success: function(data) {
            var jsondata = JSON.parse(data);
            console.log(jsondata);
            if (jsondata.code == 0) {
                email_data = jsondata.data;
                if (type == 'in') {
                    callback(Math.ceil(jsondata.data.total_in / jsondata.data.page), next);
                } else {
                    callback(Math.ceil(jsondata.data.totoal_out / jsondata.data.page), next);
                }
                
                show_html(type);
            }
        },
        error: function(para) {
            console.log(para);
        }
    });
}

function show_html(type) {
    var email_html = '';
    var backmsg = type == 'in' ? '马上回复' : '写信给Ta';
    console.log(type, email_data);
    for(var i = 0; i< email_data[type].length; i++) {
        var msg_kind = email_data[type][i].mail.kind == 0 ? '[普通邮件]':'[系统消息]';
        var msg_kindbtn ='';
        var charkan = '';
        if (type = 'in') {
            msg_kindbtn = email_data[type][i].mail.kind == 1 ? ('<button eid='+ email_data[type][i].mail.id +' kind="1" name='+ email_data[type][i].user.id +' class="btn btn_dialog btn_resultbtn">同意') : ('<button name='+ email_data[type][i].user.id +' send='+ email_data[type][i].user.name +' class="btn btn_dialog btn_message">' + backmsg);
            charkan = email_data[type][i].mail.kind == 1 ? '</button><button eid='+ email_data[type][i].mail.id +' kind="0" name='+ email_data[type][i].user.id +' class="btn btn_plain btn_dialog btn_resultbtn">拒绝</button></h3>' : '</button><button type='+ type +' num='+ i +' class="btn btn_plain btn_dialog btn_see">查看</button></h3>';   
        } else {
            msg_kindbtn = email_data[type][i].mail.kind == 1 ? '' : ('<button name='+ email_data[type][i].user.id +' send='+ email_data[type][i].user.name +' class="btn btn_dialog btn_message">' + backmsg);
            charkan = email_data[type][i].mail.kind == 1 ? '' : '</button><button type='+ type +' num='+ i +' class="btn btn_plain btn_dialog btn_see">查看</button></h3>';   
        }
        if (type == 'out') {
            msg_kind = '';
        }
        var radio = "";
        if (email_data[type][i].mail.read == 0 && type == 'in') {
            radio += '<i class="radio"></i>'
        }
        var msg_ = '';
        if (type == 'in') {
            msg_ = email_data[type][i].mail.kind == 0 ? '给您发送了邮件' : '给你发送了眼缘';
            msg_ = '<em>'+ email_data[type][i].user.name +'</em><i>' + msg_;
        } else {
            if (email_data[type][i].mail.kind == 0) {
                msg_ = '您给' + '<em>'+ email_data[type][i].user.name +'</em><i>' + '发送了邮件';
            } else {
                msg_ = '您给' + '<em>'+ email_data[type][i].user.name +'</em><i>' +  '发送了眼缘';
            }
        }

        email_html += '<div class="love_inbox_line">'+
        '<div class="love_inbox_img">'+
        '<a href="/user?uid='+ email_data[type][i].user.id +'\" target=\"_blank\"><img src='+ email_data[type][i].user.pic +' alt=""></a></div>'+
        '<div class="love_inbox_text"><p><span>' + msg_kind + '</span>'+ radio +
                msg_ + '</i></p>'+
            '<h3>' + msg_kindbtn + charkan +
        '</div><span name='+ email_data[type][i].mail.id +' class="love_dialog_close del_email"></span><div class="love_inbox_time">'+ email_data[type][i].mail.time +'</div></div>';
    }
    $(".email_inbox").empty();
    $(".email_inbox").prepend(email_html);
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

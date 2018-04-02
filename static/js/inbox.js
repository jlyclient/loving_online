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
    get_data('email');
    var spanarr = $(".love_inbox_tab").find('span');
    for (var i = 0; i < spanarr.length; i++) {
        $(spanarr[i]).click(function() {
            for (var j = 0; j < spanarr.length; j++){
                $(spanarr[j]).attr('class', '');
            }
            $(this).attr('class', 'active');
            show_html($(this).attr('type'))
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
                    '<img src='+ jsondata.data[i].src +' alt="">'+
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
    $(".send_back_message").click(function() {
        if ($("#send_back_content").val() != '') {
            console.log(send_email)
            $.ajax({
                url: '/sendemail',
                type: 'POST',
                data: {
                    '_xsrf': xsrf,
                    uid: send_email,
                    content: $("#send_back_content").val(),
                },
                success: function(data) {
                    console.log(data);
                    var jsondata = JSON.parse(data);
                    if (jsondata.code == 0) {
                        console.log(jsondata);
                        close_popup();
                    }
                },
                error: function(para) {
                    console.log(para);
                }
            })
        }
    })
})

function get_data(url) {
    var xsrf = get_cookie_by_name('_xsrf');
    $.ajax({
        url: '/'+url,
        type: 'POST',
        data: {
            '_xsrf': xsrf,
        },
        success: function(data) {
            var jsondata = JSON.parse(data);
            console.log(jsondata);
            if (jsondata.code == 0) {
                email_data = jsondata.data;
                show_html('in');
            }
        },
        error: function(para) {
            console.log(para);
        }
    });
}

function show_html(type) {
    var email_html = '';
    console.log(type, email_data);
    for(var i = 0; i< email_data[type].length; i++) {
        email_html += '<div class="love_inbox_line">'+
        '<div class="love_inbox_img">'+
        '<a href="/user?uid='+ email_data[type][i].user.id +'\" target=\"_blank\"><img src='+ email_data[type][i].user.pic +' alt=""></a></div>'+
        '<div class="love_inbox_text"><p><span>[系统消息]</span>'+
                '<em>'+ email_data[type][i].user.name +'</em><i>关注了你</i></p>'+
            '<h3><button name='+ email_data[type][i].user.id +' send='+ email_data[type][i].user.name +' class="btn btn_dialog btn_message">马上回复</button><button class="btn btn_plain btn_dialog btn_see">查看</button></h3>'+
        '</div><div class="love_inbox_time">'+ email_data[type][i].mail.time +'</div></div>';
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
$(function() {
    var xsrf = get_cookie_by_name('_xsrf');
    var email_id = null;
    get_html('/sponsor_zhenghun','','','','','',0, gethtmlFun);
    $(".love_try_tab").find('li').map((index, data) => {
        $(data).removeClass("active");
        if (index == 2) {
            $(data).addClass("active");
        }
    });
    $(".love_nav").find('li').map((index, data) => {
        $(data).removeClass("active");
        if (index == 2) {
            $(data).addClass("active");
        }
    }); 
    function gethtmlFun(value, next) {
        Page({
			num:value,				//页码数
			startnum:next+1,		//指定页码
			elem:$('#page1'),		//指定的元素
            callback:function(n){	//回调函数
                console.log(n);
				get_html(
                    '/sponsor_zhenghun',
                    '',
                    '',
                    '',
                    '',
                    '',
                    n-1,
                    gethtmlFun,
                );
			}
		});
    }
    $(".love_try_box").on('click', '.private_email', function() {
        email_id = $(this).attr("uid");
        $('.love_dialog').find('.love_dialog_letter').removeClass('d_n');
        $("#send_email").html($(this).attr("name"));
    });
    $(".love_try_box").on("click", '.del_zhenghun', function() {
        del_id = $(this).attr("name");
        $.ajax({
            url: ' /remove_zhenghun',
            type: 'POST',
            data: {
                '_xsrf': xsrf,
                zid: del_id,
            },
            success: function(data) {
                var jsondata = JSON.parse(data);
                console.log(jsondata);
                if (jsondata.code == 0) {
                    get_html('/sponsor_zhenghun','','','','','',0, gethtmlFun);
                }
            }
        });
    })
    $(".btn_send_email").click(function() {
        if ($("#send_email_content").val().length > 0) {
            $.ajax({
                url: '/sendemail',
                type: 'POST',
                data: {
                    '_xsrf': xsrf,
                    uid: email_id,
                    content: $("#send_email_content").val(),
                },
                success: function(data) {
                    var jsondata = JSON.parse(data);
                    console.log(jsondata);
                    if (jsondata.code == 0) {
                        close_popup();
                    } else{
                        alert(jsondata.msg);
                    }
                },
                error: function(para) {
                    console.log(para);
                }
            })
        }
    });
})
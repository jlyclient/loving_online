$(function() {
    var xsrf = get_cookie_by_name('_xsrf');
    var email_id = null;
    var obj = {
        sex: '',
        age1: '',
        age2: '',
        loc1: '',
        loc2: '',
    }
    $("#city_9").citySelect();
    get_html('/list_zhenghun','','','','','',0, gethtmlFun);
    function gethtmlFun(value, next) {
        Page({
			num:value,				//页码数
			startnum:next+1,		//指定页码
			elem:$('#page1'),		//指定的元素
            callback:function(n){	//回调函数
                console.log(n);
				get_html(
                    '/list_zhenghun',
                    obj.sex,
                    obj.age1,
                    obj.age2,
                    obj.loc1,
                    obj.los2,
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

    $(".fr").click(function() {   
        $(".love_search_box").find("input").map((index, data) => {
            var type = $(data).attr("type");
            if (type === 'radio' && data.checked) {
                console.log(data.checked);
                obj[$(data).attr("name")] = $(data).attr("option");
            }
        });
        $(".love_start").find('select').map((index, data) => {
            obj[$(data).attr("name")] = $(data).find("option:selected").attr("value");
        });
        if (obj.age1 > obj.age2) {
            alert('请按年龄从小到大筛选！');
        } else {
            get_html(
                '/list_zhenghun',
                obj.sex,
                obj.age1,
                obj.age2,
                obj.loc1,
                obj.los2,
                0,
                gethtmlFun,
            );
        }
    })
})

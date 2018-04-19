$(function() {
    $("#city_9").citySelect({
        prov: '北京',
        city: '东城区',
    });
    $(".love_try_tab").find('li').map((index, data) => {
        $(data).removeClass("active");
        if (index == 3) {
            $(data).addClass("active");
        }
    }); 
    $(".love_nav").find('li').map((index, data) => {
        $(data).removeClass("active");
        if (index == 2) {
            $(data).addClass("active");
        }
    }); 
    var xsrf = get_cookie_by_name('_xsrf');
    $(".create_zhenghun").click(function() {
        var obj = {
            loc1: '',
            loc2: '',
            title: '',
            content: '',
            valid_day: '',
            object: '',
        }
        $(".love_seek_start").find('input').map((index, data) => {
            if ($(data).attr('type') == 'text') {
                obj[$(data).attr("name")] = $(data).val();
            }
            if ($(data).attr('type') == 'radio' && data.checked) {
                obj[$(data).attr("name")] = $(data).attr("option");
            }
        });
        $(".love_seek_start").find("select").map((index, data) => {
            obj[$(data).attr('name')] = $(data).find("option:selected").attr("value");
        });
        obj.content = $(".love_seek_start").find('textarea').eq(0).val();
        console.log(obj);
        if (obj.loc1 != '' && obj.loc2 != '' && obj.title != '' && obj.valid_day != '' && obj.object != '' ) {
            $.ajax({
                url: '/create_zhenghun',
                type: 'POST',
                data: {
                    '_xsrf': xsrf,
                    loc1: obj.loc1,
                    loc2: obj.loc2,
                    title: obj.title,
                    content: obj.content,
                    valid_day: obj.valid_day,
                    object: obj.object,
                },
                success: function(data) {
                    var jsondata = JSON.parse(data);
                    console.log(jsondata);
                    if (jsondata.code == 0) {
                        alert('发起约会成功！');
                        window.location.reload();
                    }
                },
                error: function(para) {
                    console.log(para);
                }
            })
        } else {
            alert('请填写完整的征婚信息！');
        }
    });
})
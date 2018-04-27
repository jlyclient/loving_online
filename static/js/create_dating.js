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
    var obj = {
        sjt: '',
        dt:  '',
        loc1: '',
        loc2: '',
        locd: '',
        obj:  '',
        num: '',
        fee:  '',
        bc: '',
        vt: ''
    }
    $("#city_9").citySelect();
    $(".love_try_tab").find('li').map((index, data) => {
        $(data).removeClass("active");
        if (index == 4) {
            $(data).addClass("active");
        }
    });
    $(".love_nav").find('li').map((index, data) => {
        $(data).removeClass("active");
        if (index == 1) {
            $(data).addClass("active");
        }
    }); 
    $('.launch_data').click('on', function() {
        $(".love_start").find('input').map((index, data) => {
            // text radio num
            var type = $(data).attr("type");
            if (type === 'text' || type === 'number') {
                obj[$(data).attr("name")] = $(data).val();
            }
            if (type === 'radio' && data.checked) {
                console.log(data.checked);
                obj[$(data).attr("name")] = $(data).attr("option");
            }
        });
        $(".love_start").find('select').map((index, data) => {
            obj[$(data).attr("name")] = $(data).find("option:selected").attr("value");
        });
        $(".love_start").find("textarea").map((index, data) => {
            obj[$(data).attr("name")] = $(data).val();
        })
        console.log(obj);
        if (obj.sjt != '' && obj.dt != '' && obj.loc1 != '' && obj.loc2 != '' && obj.obj != '' && obj.num != '' && obj.fee != '' && obj.vt != '') {
            var xsrf = get_cookie_by_name('_xsrf');
            $.ajax({
                type: 'POST',
                url: '/create_dating',
                data: {
                    '_xsrf': xsrf,
                    sjt: obj.sjt,
                    dt:  obj.dt,
                    loc1: obj.loc1,
                    loc2: obj.loc2,
                    locd: obj.locd,
                    obj:  obj.obj,
                    num: obj.num,
                    fee:  obj.fee,
                    bc: obj.bc,
                    vt: obj.vt
                },
                success: function(data) {
                    var jsondata = JSON.parse(data);
                    console.log(jsondata);
                    if (jsondata.code == 0) {
                        alert('约会发起成功！');
                        window.location.reload();
                    } else {
                        alert(jsondata.msg);
                    }
                },
                error: function(para) {
                    console.log(para);
                }
            });
        } else {
            alert("请将约会信息填写完整！");
        } 
    });
});

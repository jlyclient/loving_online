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
function get_new_member(sex_, dom) {
    var xsrf = get_cookie_by_name('_xsrf');
    $(".love_nav").find('li').map((index, data) => {
        $(data).removeClass("active");
        if (index == 0) {
            $(data).addClass("active");
        }
    }); 
    $.ajax({
        type: 'POST',
        url: '/new',
        data: {
            "_xsrf":xsrf, 
            sex: sex_,
            limit: 4,
            page: 12,
            next: 0
        },
        success: function(data) {
            var boydata = JSON.parse(data);
            if (boydata['code'] == '0') {
                var boyhtml = '';
                for (var i = 0; i < boydata.data.length; i++) {
                    var sex = '未填', degree = '保密';
                    boydata.data[i].user.sex === 1 ? sex = '男' : sex = '女';
                    if (boydata.data[i].user.degree === 1) {
                        degree = '高中及以下';
                    } else if (boydata.data[i].user.degree === 2) {
                        degree = '中专/大专';
                    } else if (boydata.data[i].user.degree === 3) {
                        degree = '本科';
                    }  else if (boydata.data[i].user.degree === 4) {
                        degree = '研究生';
                    }  else if (boydata.data[i].user.degree === 5) {
                        degree = '博士及博士后';
                    }
                    var head_pic = boydata.data[i].pic.arr[0];
                    if (head_pic.length == 0) {
                        if (sex_ == 1) {
                            head_pic = '/img/default_male.jpg';
                        } else if (sex_ == 2) {
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
                        '<span>（'+ sex +'）</span>' +
                    '</h2>'+
                    '<p>'+
                        '<span>'+ boydata.data[i].user.age +'岁</span>'+
                        '<span>'+ boydata.data[i].user.height +'CM</span>'+
                        '<span>'+ degree + '</span>'+
                    '</p>'+
                    '<p class="love_text">'+ boydata.data[i].statement.motto+'</p>'+
                '</div>';
                }
                $('#'+dom+'').append(boyhtml);
            } else {
                console.log('获取最新注册男会员失败！');
            }
        },
        error: function(para) {
            console.log('ajax请求失败：' + para);
        } 
    });
}

function wx_login() {
    var url = '/wxlogin_code';
    var xsrf = get_cookie_by_name('_xsrf');
    $.ajax({  
        url: url,
        type:'POST',
        data: {'_xsrf':xsrf},
        success: function(data){  
            document.location.href = data;
        },
        error: function(para) {
            var d = para;
        }
    });  
}
$(function() {
    // 最新注册男会员
    get_new_member(1, 'love_row_boy');
    // 最新注册女会员
    get_new_member(2, 'love_row_girl');
    // 获取寻觅信息
    find_member();

    $(".search_self").click(function() {
        var obj = {
            sex: '',
            agemin: '',
            agemax: '',
            cur1: '',
            cur2: '',
            ori1: '',
            ori2: '',
            degree: '',
            salary: '',
            xingzuo: '',
            shengxiao: ''
        }
        $(".love_search_box").find("input").map((index, data) => {
            var type = $(data).attr("type");
            if (type === 'radio' && data.checked) {
                console.log(data.checked);
                obj[$(data).attr("name")] = $(data).attr("option");
            }
        });
        $(".love_search_box").find('select').map((index, data) => {
            obj[$(data).attr("name")] = $(data).find("option:selected").attr("value");
        });
        if (obj.age1 > obj.age2) {
            alert('请按年龄从小到大筛选！');
        } else {
            console.log(obj);
            // get_html('/list_zhenghun', obj.sex, obj.age1, obj.age2, obj.loc1, obj.los2);
            find_member( obj.sex, obj.agemin, obj.agemax, obj.cur1, obj.cur2, obj.ori1, obj.ori2, obj.degree, obj.xingzuo, obj.shengxiao);
        }
    });
})

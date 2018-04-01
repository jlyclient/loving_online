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
    $.ajax({
        type: 'POST',
        url: '/new',
        data: {
            "_xsrf":xsrf, 
            sex: sex_,
            limit: 4,
            page: 12,
            next: 0,
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
function find_member(dom) {
    var xsrf = get_cookie_by_name('_xsrf');
    $.ajax({
        type:'POST',
        url: '/find',
        data: {
            "_xsrf":xsrf
        },
        success: function(mes) {
            var boydata = JSON.parse(mes);
            if (boydata['code'] == '0') {
                console.log(boydata);
                var boyhtml = '';
                var degreearr = ['保密', '高中及以下', '中专/大专', '本科', '研究生', '博士及博士后'];
                var sexarr = ['未填', '男', '女'];
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
                $('#'+dom+'').append(boyhtml);
            } else {
                console.log('获取数据失败！');
            }
        },
        error: function(para) {
            console.log('ajax请求失败：' + para);
        } 
    })
}
$(function() {
    // 最新注册男会员
    get_new_member(1, 'love_row_boy');
    // 最新注册女会员
    get_new_member(2, 'love_row_girl');
    // 获取寻觅信息
    find_member('find_member')
    //更多搜索
    $(document).on('click', '.love_search_more', function() {
        $(this).toggleClass('active');
        if ($(this).attr('class').indexOf('active') > 0)
            $('.love_search_other').show();
        else
            $('.love_search_other').hide();
    });
})

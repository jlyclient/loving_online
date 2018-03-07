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
function get_new_member(sex, dom) {
    $.ajax({
        type: 'POST',
        url: '/new',
        data: {
            "_xsrf":xsrf, 
            sex: sex,
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
                    boyhtml += '<div class="love_col love_col_4 love_item"> ' +
                    '<div class="love_img">' +
                        '<a href="detail.html" target="_blank">' +
                            '<img src='+boydata.data[i].pic.arr[0]+' alt="boy">' +
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
    })
}
$(function() {
    var xsrf = get_cookie_by_name('_xsrf');
    // 最新注册男会员
    get_new_member(1, 'love_row_boy');
    // 最新注册女会员
    get_new_member(2, 'love_row_girl');
    //更多搜索
    $(document).on('click', '.love_search_more', function() {
        $(this).toggleClass('active');
        if ($(this).attr('class').indexOf('active') > 0)
            $('.love_search_other').show();
        else
            $('.love_search_other').hide();
    });


    //获取动态码
    $(document).on('click', '.btn_ver', function() {
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
    });
})
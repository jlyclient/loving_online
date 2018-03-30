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
    var xsrf = get_cookie_by_name('_xsrf');
    $.ajax({
        type: 'POST',
        url: '/seeme',
        data: {
            '_xsrf': xsrf,
        },
        success: function(data) {
            var jsondata = JSON.parse(data);
            console.log(jsondata);
            if (jsondata.code == 0) {
                console.log(jsondata);
                var isee = '';
                if (jsondata.data.data.length > 0) {
                    for (var j = 0; j < jsondata.data.data.length; j++) {
                        isee += ' <div class="love_see_box"> <div class="love_see_title">'+ jsondata.data.data[j].date +'</div><div class="love_see_content love_row">';
                        for (var i = 0; i < jsondata.data.data[j].arr.length; i++) {
                            isee += '<div class="love_col love_col_6 love_see_item"><div class="love_see_item_img">'+
                                '<a href="/user?uid='+ jsondata.data.data[j].arr[i].id +'" target=\"_blank\">'+
                                    '<img src="'+ jsondata.data.data[j].arr[i].src + '"' +' alt="">'+
                                '</a>'+
                            '</div>'+
                            '<h2>'+ jsondata.data.data[j].arr[i].nick_name +'<span>（'+ (jsondata.data.data[j].arr[i].sex === 1 ? "男" : "女") +'）</span></h2>'+
                            '<p>'+
                                '<span>'+ jsondata.data.data[j].arr[i].age +'岁</span>'+
                                '<span>' + jsondata.data.data[j].arr[i].curr_loc1 + jsondata.data.data[j].arr[i].curr_loc2 +'</span>'+
                            '</p>'+
                            '<h3>' + jsondata.data.data[j].date + ' ' + jsondata.data.data[j].arr[i].time +'</h3>'+
                        '</div>';
                        }
                        isee += '</div></div>';
                    }
                }
                console.log(isee);
                $(".love_center_see").append(isee);
            }
        },
        error: function(para) {
            console.log(para);
        }
    })
})

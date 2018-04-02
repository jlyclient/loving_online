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
    var show_data;
    get_data('email');
    var spanarr = $(".love_inbox_tab").find('span');
    for (var i = 0; i < spanarr.length; i++) {
        $(spanarr[i]).click(function() {
            for (var j = 0; j < spanarr.length; j++){
                $(spanarr[j]).attr('class', '');
            }
            $(this).attr('class', 'active');
            get_data($(this).attr('name'));
        })
    }

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

            }
        },
        error: function(para) {
            console.log(para);
        }
    })
}
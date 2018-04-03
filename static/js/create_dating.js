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
    $('.button').click('on', function() {
        var xsrf = get_cookie_by_name('_xsrf');
        $.ajax({
            type: 'POST',
            url: '/create_dating',
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
        });
    });
});

$(function() {
    var xsrf = get_cookie_by_name('_xsrf');
    $.ajax({
        url: '/list_zhenghun',
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
})
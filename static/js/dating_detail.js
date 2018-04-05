$(function() {
    var xsrf = get_cookie_by_name('_xsrf');
    var did = document.URL.split('did=')[1];
    $.ajax({
        url: '/detail_dating',
        type: 'POST',
        data: {
            "_xsrf":xsrf,
            did: did,
        },
        success: function(data) {
            var subject = ['约饭','电影','交友','聊天','喝酒','唱歌','其他'];
            var object = ['男士','女士','男女均可'];
            var fee = ['发起人付','AA制','男士付款，女士免单','视情况定'];
            var jsondata = JSON.parse(data);
            if (jsondata.code == 0) {
                console.log(jsondata);
            }
        }
    })
})
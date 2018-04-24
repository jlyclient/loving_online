$(function() {
    var xsrf = get_cookie_by_name('_xsrf');
    var zid = document.URL.split('zid=')[1];
    $.ajax({
        url: '/detail_zhenghun',
        type: 'POST',
        data: {
            '_xsrf': xsrf,
            zid: zid
        },
        success: function(data) {
            var jsondata = JSON.parse(data);
            console.log(jsondata);
            if (jsondata.code == 0) {
                var detaildata = jsondata.data;
                var detail_title = '<span>'+ detaildata.nick_name +'</span> 发起了征婚';
                $(".love_detail_title").append(detail_title);
                var detail_zhenghun = '<div class="love_detail_box mt-20">'+
                '<div class="love_detail_img">'+
                    '<a href="/user?uid='+ detaildata.uid +'" target="_blank" ><img src='+ detaildata.src +' alt=""></a>'+
                '</div>'+
                '<div class="love_detail_text">'+
                    '<h2>'+ detaildata.nick_name +'<span>（'+ detaildata.sex_name +'）</span></h2>'+
                    '<div class="love_detail_top">'+
                        '<p>'+
                            '<i>'+ detaildata.age +'岁</i>'+
                            '<i>'+ detaildata.height +'CM</i>'+
                            '<i>'+ detaildata.loc1 + detaildata.loc2 +'</i>'+
                        '</p>'+
                        '<p class="text_over2">'+ detaildata.statement +'</p>'+
                        '<div class="love_detail_top_label">'+
                            '<div><span>['+ detaildata.loc1 +']</span>'+ detaildata.nick_name +'发起了征婚</div>'+
                            '<div>浏览：'+ detaildata.scan_count +'次</div>'+
                        '</div>'+
                    '</div>'+
                    '<div class="love_try_item_middle love_detail_middle">'+
                        '<p>'+
                            '<span>征婚对象：'+ detaildata.object_name +'</span>'+
                            '<span>征婚地点：'+ detaildata.loc1 + detaildata.loc2 +'</span>'+
                            '<span>发起时间：'+ detaildata.time +'</span>'+
                        '</p>'+
                        '<p>'+
                            '<span>征婚主题：'+ detaildata.title +'</span>'+
                            '<span>有效期限：'+ detaildata.valid_day +'天</span>'+
                        '</p>'+
                        '<p>帖子详情：'+ detaildata.content +'</p>'+
                    '</div>'+
                '</div>'+
                '<div class="clear"></div>'+
            '</div>';
                $(".love_try_detail").append(detail_zhenghun);
            }
        }
    })
})
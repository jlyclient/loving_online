$(function() {
    console.log('dating_detail');
    var xsrf = get_cookie_by_name('_xsrf');
    var did = document.URL.split('did=')[1];
    $.ajax({
        url: '/detail_dating',
        type: 'POST',
        data: {
            "_xsrf":xsrf,
            did: did
        },
        success: function(data) {
            var subject = ['约饭','电影','交友','聊天','喝酒','唱歌','其他'];
            var object = ['男士','女士','男女均可'];
            var fee = ['发起人付','AA制','男士付款，女士免单','视情况定'];
            var degree = ['保密', '高中及以下', '中专/大专', '本科', '研究生', '博士及博士后']; // 学历
            var jsondata = JSON.parse(data);
            console.log(jsondata);
            if (jsondata.code == 0) {
                console.log(jsondata);
                var detaildata = jsondata.data;
                var detail_title = '<span>'+ detaildata.nick_name +'</span> 发起了'+ subject[detaildata.object] +'型约会';

                $("#detail_dating_img").attr("src", detaildata.src);
                console.log($("#detail_dating_img").attr("src"), detaildata.src);
                $(".love_detail_title").append(detail_title);
                var endtime = Number(new Date(detaildata.time).getTime()) + detaildata.valid_time * 24 * 60 * 60 * 1000;
                var endflag = new Date().getTime() > endtime ? true : false;
                var timehtml = '';
                var love_detail_text = '<h2>'+ detaildata.nick_name +'<span>（'+ detaildata.sex_name +'）</span></h2>'+
                '<div class="love_detail_top">'+
                    '<p>'+
                        '<i>'+ detaildata.age +'岁</i>'+
                        '<i>'+ detaildata.height +'CM</i>'+
                        '<i>'+ detaildata.loc1 + detaildata.loc2 +'</i>'+
                    '</p>'+
                    '<p class="text_over2">'+ detaildata.statement +'</p>'+
                    '<div class="love_detail_top_label">'+
                        '<div><span>['+ detaildata.loc1 +']</span>'+ detaildata.nick_name +'发起了<em>【'+ subject[detaildata.object] +'型】</em>约会</div>'+
                        '<div>浏览：'+ detaildata.scan_count +'次</div>'+
                    '</div>'+
                '</div>'+
                '<div class="love_try_item_middle love_detail_middle">'+
                    '<p>'+
                        '<span>约会人数:'+ detaildata.numbers +'人</span>'+
                        '<span>约会时间:'+ detaildata.dtime +'</span>'+
                        '<span>约会对象:'+ object[detaildata.object] +'</span>'+
                    '</p>'+
                    '<p>'+
                        '<span>约会费用:'+ fee[detaildata.fee] +'</span>'+
                        '<span>发起时间:'+ detaildata.time +'</span>'+
                    '</p>'+
                    '<p>约会地点:'+ detaildata.loc_detail +'</p>'+
                    '<p>约会补充:'+ detaildata.buchong +'</p>'+
                '</div>';
                console.log(detaildata.already, endflag);
                if(detaildata.already == 0 && endflag == false) {
                    love_detail_text += '<div class="love_detail_bottom">'+
                    '<div class="love_detail_sign love_detail_label">'+
                        '<p class="fl">剩余：'+ now_time(detaildata.time) +''+
                        '<div class="love_sign_submit fl">'+
                            '<button class="btn right_signUp">立即报名</button>'+
                        '</div>'+
                    '</div>'+
                '</div>';
                }
                if (detaildata.already == 1) {
                    love_detail_text += '<button class="btn">您已报名</button>'
                }
                if (detaildata.baoming) {
                    var bmmumber = '';
                    for (var i = 0; i < detaildata.baoming.length; i++) {
                        bmmumber += '<div class="love_col love_col_3 love_item">'+
                        '<div class="love_img">'+
                            '<a href="/user?uid='+ detaildata.baoming[i].id +'" target="_blank">'+
                                '<img src='+ detaildata.baoming[i].src +' alt="girl">'+
                            '</a>'+
                        '</div>'+
                        '<h2>'+ detaildata.baoming[i].nick_name +''+
                            '<span>（' + detaildata.baoming[i].sex_name + '）</span>'+
                        '</h2>'+
                        '<p>'+
                            '<span>'+ detaildata.baoming[i].age +'岁</span>'+
                            '<span>'+ detaildata.baoming[i].height +'CM</span>'+
                            '<span>'+ detaildata.baoming[i].degree_name +'</span>'+
                        '</p>'+
                        '<p class="love_text">'+ detaildata.baoming[i].statement +'</p>'+
                        '<p>报名时间：<em>'+ detaildata.baoming[i].time +'</em></p>'+
                    '</div>';
                    }
                    love_detail_text += '<p class="love_detail_label">已报名：<span>' + detaildata.baoming.length + '</span>人</p>'+
                    '<div class="love_row love_detail_row">'+ bmmumber +'</div>';     
                }
                $(".love_detail_text").append(love_detail_text);
            } else {
                alert(jsondata.msg);
            }
        }
    });

    $(".love_detail_text").on('click', '.right_signUp', function() {
        $.ajax({
            url: '/baoming_dating',
            type: 'POST',
            data: {
                "_xsrf":xsrf,
                did: did
            },
            success: function(data) {
                var reasondata = JSON.parse(data);
                console.log(reasondata);
                if (reasondata.code == 0) {
                    alert("您的报名成功！");
                    $(".love_detail_bottom").empty();
                } else {
                    alert(reasondata.msg);
                }
            },
            error: function(para) {
                console.log(para);
            }
        })
    })
})

$(function() {
    function loc_display(loc1, loc2) {
        return loc1 + '·' + loc2;
    }
    var xsrf = get_cookie_by_name('_xsrf');
    sponsor_datinghtml(0, sponsordatingFun);
    function sponsordatingFun(value, next) {
        Page({
			num:value,				//页码数
			startnum:next+1,		//指定页码
			elem:$('#page1'),		//指定的元素
            callback:function(n){	//回调函数
                console.log(n);
				sponsor_datinghtml(
                    n-1,
                    sponsordatingFun,
                );
			}
		});
    }
    $(".love_try_tab").find('li').map((index, data) => {
        $(data).removeClass("active");
        if (index == 2) {
            $(data).addClass("active");
        }
    }); 
    $(".love_nav").find('li').map((index, data) => {
        $(data).removeClass("active");
        if (index == 1) {
            $(data).addClass("active");
        }
    }); 
    function sponsor_datinghtml(next, callback) {
        $.ajax({
            url: '/sponsor_dating',
            type: 'POST',
            data: {
                "_xsrf":xsrf,
                next: next,
            },
            success: function(data) {
                var jsondata = JSON.parse(data);
                console.log(jsondata, next);
                var subject = ['约饭','电影','交友','聊天','喝酒','唱歌','其他'];
                var object = ['男士','女士','男女均可'];
                var fee = ['发起人付','AA制','男士付款，女士免单','视情况定'];
                if (jsondata.code == 0) {
                    $(".love_try_box").empty();
                    callback(Math.ceil(jsondata.data.count / jsondata.data.page),next)
                    var listhtml = '';
                    var listdata = jsondata.data.arr;
                    if (listdata.length == 0) {
                        listhtml += '<div class="love_none"><div class="love_none_text"><i></i><p>暂时没有任何约会信息，快去约会吧！</p></div></div>';
                    } else {
                        for (var i = 0; i< listdata.length; i++) {
                            var endtime = Number(new Date(listdata[i].time).getTime()) + listdata[i].valid_time * 24 * 60 * 60 * 1000;
                            var endflag = new Date().getTime() > endtime ? true : false;
                            var timehtml = '';
                            console.log(endflag);
                            if (endflag) {
                                timehtml += '<p>报名已截止</p>';
                            } else {
                                timehtml += show_time(endtime);
                            }
                            loc_ = loc_display(listdata[i].loc1, listdata[i].loc2);
                            listhtml += '<div '+ (endflag == true ? 'class="love_try_item love_over"' : 'class="love_try_item"') +'>'+
                            '<div class="love_try_item_left">'+
                                '<div class="love_try_img">'+
                                    '<a href="/user?uid='+ listdata[i].uid +'" target="_blank">'+
                                        '<img src='+ listdata[i].src +' alt="">'+
                                    '</a>'+
                                '</div>'+
                                '<div class="love_try_item_text">'+
                                    '<div class="love_try_item_top">'+
                                        '<h2>'+ listdata[i].nick_name +'<span>（'+ listdata[i].sex_name +'）</span></h2>'+
                                        '<p><span>['+ loc_ +']</span>'+ listdata[i].nick_name +'发起了<em>【'+ subject[listdata[i].subject] +'】</em>约会</p>'+
                                    '</div>'+
                                    '<div class="love_try_item_middle">'+
                                        '<p>'+
                                            '<span>约会人数:'+ listdata[i].numbers +'人</span>'+
                                            '<span>约会时间:'+ listdata[i].dtime.slice(0, 10) +'</span>'+
                                            '<span>约会对象:'+ object[listdata[i].object] +'</span>'+
                                        '</p>'+
                                        '<p>'+
                                            '<span>约会费用:'+ fee[listdata[i].fee] +'</span>'+
                                            '<span>发起时间:'+ listdata[i].time.slice(0, 10) +'</span>'+
                                        '</p>'+
                                        '<p>约会补充:'+ listdata[i].buchong +'</p>'+
                                    '</div>'+
                                    '<div class="love_try_item_bottom">'+ (endflag || listdata[i].baoming ? '' : '<a class="btn btn_default" href="/dating_detail?did='+ listdata[i].id +'">查看</a>') +''+
                                        '<div>'+ now_time(listdata[i].time) +'<span>'+ listdata[i].scan_count +'人阅读</span>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                            '<div class="love_try_item_right">'+
                                '<div>'+ timehtml +'</div>'+
                            '</div>'+
                        '</div>';
                        }
                    }
                    
                    $(".love_try_box").append(listhtml);
                }
                console.log(jsondata);
            }
        })
    }
    
})

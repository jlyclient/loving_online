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
    var centerobj = {};
    var salary = ['未填', '2000以下', '2000~5000', '5000~10000', '10000~20000', '20000~50000', '50000以上']; // 薪资水平
    var aim = ['未填', '交友', '征婚', '聊天']; // 交友目的
    var degree = ['保密', '高中及以下', '中专/大专', '本科', '研究生', '博士及博士后']; // 学历
    var sex = ['未填', '男', '女'];  // 性别
    var shengxiao = ['未填','鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪']; // 生肖
    var marriage = ['未填','单身','离异','丧偶'];
    var xingzuo = ['未填','白羊座','金牛座','双子座','巨蟹座','狮子座','处女座','天秤座','天蝎座','射手座','摩羯座','水瓶座','双鱼座'];
    var blood = ['未填','A','B','AB','O'];
    var house = ['未填','已购','未购','需要时购'];
    var work = ['未填','学生','老师','工程师','商务人士','个体老师','白领人士','其他'];
    var interesting = ['爬山','摄影','音乐','电影','旅游','游戏','健身','美食','跑步','逛街','唱歌','跳舞','扑克','麻将','网购','看书'];
    var seeother, This;
    var xsrf = get_cookie_by_name('_xsrf');
    var uid = document.URL.split('uid=')[1];
    if (uid == null) {
        return -1;
    }
    $.ajax({
        type: 'POST',
        url: '/user',
        data: {
            '_xsrf': xsrf,
            'uid': uid
        },
        success: function(data) {
            var jsondata = JSON.parse(data);
            console.log(jsondata);
            if (jsondata.code === 0) {
                if (jsondata.yanyuan == 1) {
                    $(".btn_yanyuan").css({ background: '#2cade3', borderColor: '#2cade3', color: '#fff', cursor: 'none' });
                }
                centerobj = jsondata.data;
                var centermestitle = '', centermescon = '', centerintroduction = '';
                var center_interest = '';
                for(var i = 0; i < centerobj.hobby.arr.length; i ++) {
                    if(centerobj.hobby.arr[i] == 1) {
                        center_interest += '<em>'+ interesting[i] +'</em>';
                    }
                };
                centermestitle += '<h2>'+ centerobj.user.nick_name +
                    '<span>（'+ sex[centerobj.user.sex] +'）</span>'+
                '</h2>';
                centermescon += "<div class='love_mater_detail'>";
                var tmp = 
                    "<span>征友状态："+ (centerobj.user.state === 0 ? '征友进行中' : '找到意中人') + "</span>"+

                    "<span>意向："+ aim[centerobj.user.aim] +"</span>"+
                    "<span>年龄："+ centerobj.user.age +"</span>"+
                    "<span>婚姻："+ marriage[centerobj.user.marriage] +"</span>"+
                    "<span>星座："+ xingzuo[centerobj.user.xingzuo] +"</span>"+
                    "<span>属相："+ shengxiao[centerobj.user.shengxiao] +"</span>"+
                    "<span>血型："+ blood[centerobj.user.blood] +"</span>"+
                    "<span>体重："+ centerobj.user.weight +"KG</span>"+
                    "<span>身高："+ centerobj.user.height +"CM</span>"+
                    "<span>学历："+ degree[centerobj.user.degree] +"</span>"+
                    "<span>民族："+ centerobj.user.nation_name +"</span>"+
                    "<span>现居："+ centerobj.user.curr_loc1  +' ' + centerobj.user.curr_loc2 +"</span>"+
                    "<span>籍贯："+ centerobj.user.ori_loc1 + ' ' + centerobj.user.ori_loc2 +"</span>"+
                "</div>";
                centermescon += tmp;
                centerintroduction += '<p>'+
                    '<span>简介：</span>'+
                    '<span class="text_over2">'+ centerobj.statement.motto +'</span>'+
                '</p>'+
                '<p>'+
                    '<span>兴趣：</span>'+ center_interest +
                '</p>';
                $('#love_center_right').prepend(centermestitle + centermescon + centerintroduction);
                // 内心独白
                $("#love_heart_content").html(centerobj.statement.content);

                $("#love_material").append('<div class="love_col love_col_4">月薪：'+ 
                salary[centerobj.otherinfo.salary] +
                '</div><div class="love_col love_col_4">职业：'+
                 work[centerobj.otherinfo.work]+
                 '</div><div class="love_col love_col_4">购车：'+ 
                 house[centerobj.otherinfo.car] +
                 '</div><div class="love_col love_col_4">购房：'+
                  house[centerobj.otherinfo.house] +
                  '</div>');

                var user_show_pic = '';
                for(var i = 0; i < centerobj.pic.arr.length; i++ ) {
                    if (i > 0 && centerobj.pic.arr[i] !== '') {
                        user_show_pic += '<li><img src='+ centerobj.pic.arr[i] +'></li>';
                    }   
                }
                $(".picList").append(user_show_pic);
                $("#love_user_portrait").attr("src", centerobj.pic.arr[0]);
                var other_code = [0, centerobj.otherinfo.fee_m, centerobj.otherinfo.fee_w, centerobj.otherinfo.fee_q,centerobj.otherinfo.fee_e];
                $(".love_seeother").click(function() {
                    seeother = $(this).attr("name");
                    This = this;
                    $(".payment_money").html('您需要消耗'+ other_code[seeother] +'个示爱豆，是否继续？');
                    $('.love_dialog>div').addClass('d_n');
                    $('.love_dialog').find('.love_show_payment').removeClass('d_n');
                });

            }

            $("#send_name").html(centerobj.user.nick_name);
            $(".love_send_message").click(function() {
                var msg = $("#love_write").val();
                if (msg.length == 0) {
                    alert('内容不能为空!');
                    return -1;
                }
                if (msg.length > 500) {
                    alert('内容不能为超过500字');
                    return -1;
                }
                $.ajax({
                    url: '/sendemail',
                    type: 'POST',
                    data: {
                        '_xsrf': xsrf,
                        uid: uid,
                        content: msg,
                    },
                    success: function(data) {
                        var jsondata = JSON.parse(data);
                        console.log(jsondata);
                        if (jsondata.code == 0) {
                            close_popup();
                        } else {
                            alert(jsondata.msg);
                        }
                    },
                    error: function(para) {
                        console.log(para);
                    }
                });
            });
            $(".btn_yanyuan").click(function() {
                if (jsondata.yanyuan != 1) {
                    $.ajax({
                        url: '/yanyuan',
                        type: 'POST',
                        data: {
                            '_xsrf': xsrf,
                            uid: uid,
                        },
                        success: function(data) {
                            var jsondata = JSON.parse(data);
                            console.log(jsondata);
                            if (jsondata.code === 0) {
                                alert('眼缘请求发送成功！');
                                $(".btn_yanyuan").css({ background: '#2cade3', borderColor: '#2cade3', color: '#fff', cursor: 'none' });
                            }
                        },
                        error: function(para) {
                            console.log(para);
                        }
                    })
                }
            });
        }
    });
    $(".love_payment_btn").click(function() {
        $.ajax({
            url: '/seeother',
            type: 'POST',
            data: {
                '_xsrf': xsrf,
                kind: seeother,
                uid: uid,
            },
            success: function(data) {
                var jsondata = JSON.parse(data);
                console.log(jsondata);
                if (jsondata.code === 0) {
                    $(This).parent().prev().html(jsondata.data);
                    $(This).parent().css({ display: 'none'});
                    close_popup();
                } else {
                    close_popup();
                    alert(jsondata['msg']);
                }
            },
            error: function(para) {
                console.log(para);
            },
        })
    })
})
// 关闭弹窗
function close_popup() {
    $('body').css('overflow', 'auto');
        $('.love_dialog_mask').remove();
        $('.love_dialog>div').addClass('d_n');
        if ($('.love_dialog_rec').length > 0) {
            $('.love_pay_content_1').show();
            $('.love_pay_content_2').hide();
        }
        if (uploader != null) {
            uploader.destroy();
        }
}

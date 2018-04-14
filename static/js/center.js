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
    var xsrf = get_cookie_by_name('_xsrf');
    var email_zheng = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/; 
    var nation_arr = ['未填', '汉族', '壮族', '满族', '回族', '苗族',
    '维吾尔族', '土家族', '彝族', '蒙古族', '藏族',
    '布依族', '侗族', '瑶族', '朝鲜族', '白族',
    '哈尼族', '哈萨克族', '黎族', '傣族', '畲族',
    '傈傈族', '仡佬族', '东乡族', '高山族', '拉祜族',
    '水族', '佤族', '纳西族', '羌族', '土族',
    '仫佬族', '锡伯族', '柯尔克孜族', '达翰尔族', '景颇族',
    '毛南族', '撒拉族', '布朗族', '塔吉克族', '阿昌族',
    '普米族', '鄂温克族', '怒族', '京族', '基诺族',
    '德昂族', '保安族', '俄罗斯族', '裕固族', '乌孜别克族',
    '门巴族', '鄂伦春族', '独龙族', '塔塔尔族', '赫哲族',
    '珞巴族'];
    var selectobj = {
        salary: salary,
        aim: aim,
        degree: degree,
        shengxiao: shengxiao,
        marriage: marriage,
        xingzuo: xingzuo,
        blood: blood,
        house: house,
        car: house,
        work: work,
        state: ['征友进行中', '找到意中人'],
        nation: nation_arr,
    }
    $.ajax({
        type:'POST',
        url: '/center',
        data: {
            "_xsrf":xsrf,
        },
        success: function(data) {
            var centerdata = JSON.parse(data);
            if (centerdata.code === 0) {
                centerobj = centerdata.data;
                 // 获取个人资料
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

                $('#love_center_right').append(centermestitle + centermescon + centerintroduction);
                // 内心独白
                $("#love_heart_content").html(centerobj.statement.content);

                // 其他资料
                $("#love_material").append('<div class="love_col love_col_4">月薪：'+ 
                salary[centerobj.otherinfo.salary] +
                '</div><div class="love_col love_col_4">职业：'+
                 work[centerobj.otherinfo.work]+
                 '</div><div class="love_col love_col_4">购车：'+ 
                 house[centerobj.otherinfo.car] +
                 '</div><div class="love_col love_col_4">购房：'+
                  house[centerobj.otherinfo.house] +
                  '</div>');
                    // 其他资料账号相关
                var love_accountmobile = '', love_accountemail = '', love_accountwx = '', love_accountqq = '';
                love_accountmobile = '<div class="love_col love_col_5">手机：' + centerobj.otherinfo.mobile +
                    '<div class="love_other_tools"><button name="1" public="public_m" ' +
                    (centerobj.otherinfo.public_m === 0 ? "class ='btn_center btn_center_plain'" : "class ='btn_center'") +
                    '>'+ 
                    (centerobj.otherinfo.public_m === 0 ? '对外公开' : '对外隐藏' )+
                    '</button></div></div>';
                love_accountemail = '<div class="love_col love_col_5">邮箱：'+ 
                centerobj.otherinfo.email +
                    '<div class="love_other_tools"><button name="4" public="public_e" '+
                    (centerobj.otherinfo.public_e === 0 ? "class ='btn_center btn_center_plain'" : "class ='btn_center'") +
                    '>'+ 
                    (centerobj.otherinfo.public_e === 0 ? '对外公开' : '对外隐藏') +
                    '</button></div></div>';
                love_accountwx = '<div class="love_col love_col_5">微信：'+ 
                centerobj.otherinfo.wx +
                    '<div class="love_other_tools"><button name="2" public="public_w" '+
                    (centerobj.otherinfo.public_w === 0 ? "class ='btn_center btn_center_plain'" : "class ='btn_center'") +
                    '>'+ 
                    (centerobj.otherinfo.public_w === 0 ? '对外公开' : '对外隐藏') +
                    '</button></div></div>';
                love_accountqq = '<div class="love_col love_col_5">QQ：'+ 
                centerobj.otherinfo.qq +
                    '<div class="love_other_tools"><button name="3" public="public_q" '+
                    (centerobj.otherinfo.public_q === 0 ? "class ='btn_center btn_center_plain'" : "class ='btn_center'") +
                    '>'+ 
                    (centerobj.otherinfo.public_q === 0 ? '对外公开' : '对外隐藏') +
                    '</button></div></div>';
                $("#love_account").append(love_accountmobile += love_accountemail += love_accountwx += love_accountqq);
                console.log(centerobj);

                var user_show_pic = '';

                var user_pic = "";
                console.log(centerobj.pic.arr.length);
                var show_uoload_btn = 0;
                for(var i = 0; i < centerobj.pic.arr.length; i++ ) {
                    if (i === 0 && centerobj.pic.arr[0] !== '') {
                        $("#love_user_portrait").attr("src", centerobj.pic.arr[0]);
                        show_uoload_btn+= 1;
                    }
                    if (i > 0 && centerobj.pic.arr[i] !== '') {
                        user_pic += '<div class="love_col love_col_2"><div class="love_photo"><p><span class="love_icon love_icon-delete"></span></p><img src='+ centerobj.pic.arr[i] +'></div></div>';
                        user_show_pic += '<li><img src='+ centerobj.pic.arr[i] +'></li>';
                        show_uoload_btn += 1;
                    }   
                }
                $("#love_user_pic").prepend(user_pic);
                $(".picList").append(user_show_pic);
                if(show_uoload_btn >= 10) {
                    $(".love_upload_btn").css({display: 'none'});
                }
                $(".love_show_img").map(function() {
                    $(this).attr("src", centerobj.pic.arr[0]);
                });
            } else {
                alert(centerobj.msg.reason);
            }
        },
        error: function(para) {
            alert(para, 'ajax请求失败！');
        }
    });

   

    //编辑个人资料兴趣选择效果
    $(document).on('click', '.tools_span_select span', function() {
        $(this).toggleClass('active');
    });
     //点击图片看原图
     $(document).on('click', '.picScroll-left .picList li', function() {
        var _flag = $(this).parents('.picList').attr('data-flag');
        if ($('body').find('.love_dialog_mask').length > 0)
            return false;
        else
            $('body').css('overflow', 'hidden').append('<div class="love_dialog_mask"></div>');
        var list = $(this).parents('.picList').html();
        $('.love_dialog>div').addClass('d_n');
        $('.love_dialog').find('.love_img_pic').removeClass('d_n');
        $('.picScroll .picList').html(list);
        var _height = $('.picScroll .picList img').height();
        $('.picScroll a.prev,.picScroll a.next').css({ 'height': _height + 'px', 'line-height': _height + 'px' });
        jQuery(".picScroll").slide({
            mainCell: ".bd ul",
            autoPage: true,
            effect: "left",
            autoPlay: false,
            vis: 1,
            scroll: 1,
            pnLoop: false,
            trigger: "click",
            opp: true,
            prevCell: ".prev",
            nextCell: ".next"
        });
    });

     //基本资料
     $(document).on('click', '.love_mater_edit', function() {
        $("#love_editcenter_box").find('input').map((index, data) => {
            $(data).val(centerobj.user[$(data).attr('name')]);
            if ($(data).attr("name") == 'sex') {
                $(data).val(sex[centerobj.user[$(data).attr('name')]]);
            }
        }); 
        $("#love_user_portrait_edit").attr("src", centerobj.pic.arr[0]);
        $("#love_editcenter_box").find('select').map((index, data) => {
            $(data).find('option').map((indexs, datas) => {
                if (Number($(datas).attr('value')) == centerobj.user[$(data).attr('name')]) {
                    if (selectobj[$(data).attr('name')]) {
                        $(datas).parent().prev().html(selectobj[$(data).attr('name')][Number($(datas).attr('value'))]);
                    }
                    // else {
                    //     console.log(centerobj.user,$(datas).attr('value'),  '--------');
                    //     $(datas).parent().prev().html($(datas).attr('value'));
                    // }      
                    // $("#city_1").citySelect({prov:centerobj.user.curr_loc1, city: centerobj.user.curr_loc2});            
                    $(datas).attr('selected', true);
                }
            });
            if($(data).attr("name") === 'curr_loc1' || $(data).attr("name") === 'curr_loc2' || $(data).attr("name") === 'ori_loc1' ||$(data).attr("name") === 'ori_loc2') {
                $(data).prev().html(centerobj.user[$(data).attr("name")]);
            }
            $("#city_3").citySelect({
                prov: centerobj.user.curr_loc1,
                city: centerobj.user.curr_loc2,
            });
            $("#city_4").citySelect({
                prov: centerobj.user.ori_loc1,
                city: centerobj.user.ori_loc2,
            });

        });
        $("#love_editcenter_box").find('textarea').eq(0).val(centerobj.statement.motto);
        for(var j = 0; j < centerobj.hobby.arr.length; j++) {
            console.log(centerobj.hobby.arr[j], $(".love_tools_intersting").find('span').eq(j));
            if (centerobj.hobby.arr[j] === 1) {
                $(".love_tools_intersting").find('span').eq(j).addClass('active');
            } else {
                $(".love_tools_intersting").find('span').eq(j).removeClass('active');
            }
        }
        // $(".love_tools_intersting").find('span').map((index, data) => {
        //     centerobj.hobby.arr.map((indexs, datas) => {
        //         if (indexs === 1) {
        //             $(data).addClass('active');
        //         } else {
        //             $(data).removeClass('active');
        //         }
        //     });
        // });
        $('.love_mater_before').hide();
        $('.love_mater_after').show();
    });
    $(document).on('click', '.love_mater_back', function() {
        $('.love_mater_before').show();
        $('.love_mater_after').hide();
    });
    //内心独白
    $(document).on('click', '.love_white_edit', function() {
        console.log('click 内心独白');
        $('.love_heart_before').hide();
        $('.love_heart_after').show();
        $("#love_white_edittext").val(centerobj.statement.content);
    });
    $(document).on('click', '.love_white_back', function() {
        $('.love_heart_before').show();
        $('.love_heart_after').hide();
    });

    //其他信息
    $(document).on('click', '.love_oth_edit', function() {
        $('.love_other_before').hide();
        $('.love_other_after').show();
        $("#love_oth_edit").find("select").map((index, data) => {
            $(data).find('option').map((indexs, datas) => {
                if(centerobj.otherinfo[$(data).attr("name")] == $(datas).attr("value")) {
                    $(data).prev().html(selectobj[$(data).attr("name")][Number($(datas).attr("value"))]);
                    $(datas).attr('selected', true);
                }
            });
        })
    });

    $(document).on('click', '.love_other_back', function() {
        $('.love_other_before').show();
        $('.love_other_after').hide();
    });

    // 确认修改个人资料
    $("#edit_lovecenter").click(function() {
        const obj = {
            nick_name: '',
            aim: 0,
            age: '',
            marriage: 0,
            xingzuo: 0,
            shengxiao: 0,
            blood: 0,
            weight: '',
            height: '',
            degree: 0,
            nation: 0,
            curr_loc1: '',
            curr_loc2: '',
            ori_loc1: '',
            ori_loc2: '',
            motto: '',
            hobby: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        };
        $("#love_editcenter_box").find('input').map((index, data) => {
            obj[$(data).attr('name')] = $(data).val();
        });
        $("#love_editcenter_box").find('select').map((index, data) => {
            if($(data).attr('name') == 'curr_loc1' || $(data).attr('name') == 'curr_loc2' || $(data).attr('name') == 'ori_loc1' || $(data).attr('name') =='ori_loc2') {
                obj[$(data).attr('name')] = $(data).find("option:selected").attr("value");
            } else {
                obj[$(data).attr('name')] = Number($(data).find("option:selected").attr("value"));
            }
        });
        obj.motto = $("#love_editcenter_box").find("textarea").eq(0).val();
        $(".love_tools_intersting").find('span').map((index, data) => {
            if($(data).attr('class') == 'active') {
                obj.hobby.splice(index, 1, 1);
            }
        });
        console.log(obj,JSON.stringify(obj.hobby));
        $.ajax({
            type:'POST',
            url: '/editbasic',
            data: {
                "_xsrf":xsrf,
                nick_name: obj.nick_name,
                aim: obj.aim,
                age: obj.age,
                marriage: obj.marriage,
                xingzuo: obj.xingzuo,
                shengxiao: obj.shengxiao,
                blood: obj.blood,
                weight: obj.weight,
                height: obj.height,
                degree: obj.degree,
                nation: obj.nation,
                curr_loc1: obj.curr_loc1,
                curr_loc2: obj.curr_loc2,
                ori_loc1: obj.ori_loc1,
                ori_loc2: obj.ori_loc2,
                motto: obj.motto,
                hobby: JSON.stringify(obj.hobby),
            },
            success: function(data) {
                var jsondata = JSON.parse(data);
                console.log(jsondata);
                if (jsondata['code'] == 0) {
                    $('.love_mater_before').show();
                    $('.love_mater_after').hide();
                    window.location.reload();
                }
            },
            error: function(para) {
                alert(para, 'ajax请求失败！');
            }
        })
    });

    $("#love_white_statement").click(function() {
        $.ajax({
            type:'POST',
            url: '/editstatement',
            data: {
                "_xsrf":xsrf,
                content: $("#love_white_edittext").val(),
            },
            success: function(data) {
                var jsondata = JSON.parse(data);
                console.log(jsondata);
                if (jsondata['code'] == 0) {
                    $('.love_heart_before').show();
                    $('.love_heart_after').hide();
                    window.location.reload();
                }
            }
        })
    });

    // 确认修改其他资料
    $(".love_other_sure").click(function() {
        var obj = {
            salary: 0,
            work: 0,
            car: 0,
            house: 0,
            mobile: '',
            wx: '',
            qq: '',
            email: '',
        }
        $("#love_oth_edit").find("select").map((index, data) => {
            obj[$(data).attr("name")] = Number($(data).find("option:selected").attr("value"));
        });
        $("#love_oth_edit").find('input').map((index, data) => {
            obj[$(data).attr("name")] =$(data).val();
        })
        $.ajax({
            type:'POST',
            url: '/other_edit',
            data: {
                "_xsrf":xsrf,
                salary: obj.salary,
                work: obj.work,
                car: obj.car,
                house: obj.house,
                mobile: obj.mobile,
                wx: obj.wx,
                qq: obj.qq,
                email: obj.email,
            },
            success: function(data) {
                var jsondata = JSON.parse(data);
                if(jsondata.code === 0) {
                    $('.love_other_before').show();
                    $('.love_other_after').hide();
                    window.location.reload();
                }
                console.log(jsondata);
            },
            error: function(para) {
                console.log(para);
                alert('ajax', para);
            },
        });
    });
    // 对外公开
    $("#love_account").on('click', '.btn_center' , function() {
        if($(this).attr('name')) {
            $.ajax({
                type:'POST',
                url: '/public',
                data: {
                    "_xsrf":xsrf,
                    kind: Number($(this).attr("name")),
                    action: Number(centerobj.otherinfo[$(this).attr('public')]) === 0 ? 1 : 0,
                },
                success: function(data) {
                    var jsondata = JSON.parse(data);
                    console.log(jsondata);
                    if(jsondata.code == 0) {
                        window.location.reload();
                    }
                },
                error: function(para){
                    console.log(para);
                }
            })
        }
        console.log($(this).attr("id"));
        if($(this).attr("id") === "love_bind_email") {
            // 绑定微信
            $('.love_dialog>div').addClass('d_n');
            $('.love_dialog').find('.love_dialog_email').removeClass('d_n');
        }
        if ($(this).attr("id") === 'love_bind_wx') {
            // 验证微信
            $('.love_dialog>div').addClass('d_n');
            $('.love_dialog').find('.love_dialog_login_code').removeClass('d_n');
            $("#love_login_code_header").html('微信二维码验证');
            $("#love_login_code_way").html("请使用微信扫描图中二维码");
        }
        if ($(this).attr("id") === 'love_bind_qq') {
            // 绑定qq
            $('.love_dialog>div').addClass('d_n');
            $('.love_dialog').find('.love_dialog_login_code').removeClass('d_n');
            $("#love_login_code_header").html('QQ二维码验证');
            $("#love_login_code_way").html("请使用QQ扫描图中二维码");
        }
    });

    // 发送邮箱链接
    $("#findpassword_btn").click(function() {
        var email = $(".love_dialog_email").find('input').eq(0).val();
        if (email !== '' && email_zheng.test(email)) {
            // 发送链接
            $.ajax({
                type: 'GET',
                url: '/verify_other',
                data: {
                    num: email,
                    kind: 3,
                },
                success: function(data) {
                    var jsondata = JSON.parse(dsta);
                    console.log(jsondata);
                    if (jsondata.code === 0) {
                        $(".love_bind_err").css({ display: 'block'});
                        $(".love_bind_err").html('您好，您已发送验证链接至指定邮箱，请注意查收。');
                    }
                },
                error: function(para) {
                    console.log(para);
                },
            })
        } else {
            $(".love_bind_err").css({ display: 'block'});
            $(".love_bind_err").html('请输入正确的邮箱号');
        }
    });

    $("input").change(function(e) {
        console.log(e);
        $('.love_bind_err').css({display: 'none'});
    });


    // 查看图片
    $("#love_user_pic").on("click", 'li', function() {
        show_img($(this).find('img').attr('src'));
    });
})
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

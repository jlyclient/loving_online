$(function() {
    var centerobj = {};
    var salary = ['未填', '2000以下', '2000~5000', '5000~10000', '10000~20000', '20000~50000', '50000以上']; // 薪资水平
    var aim = ['未填', '交友', '征婚', '聊天']; // 交友目的
    var degreearr = ['保密', '高中及以下', '中专/大专', '本科', '研究生', '博士及博士后']; // 学历
    var sex = ['未填', '男', '女'];  // 性别
    var shengxiao = ['未填','鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪']; // 生肖
    var marriage = ['未填','单身','离异','丧偶'];
    var xingzuo = ['未填','白羊座','金牛座','双子座','巨蟹座','狮子座','处女座','天秤座','天蝎座','射手座','摩羯座','水瓶座','双鱼座'];
    var blood = ['未填','A','B','AB','O'];
    var house = ['未填','已购','未购','需要时购'];
    var work = ['未填','学生','老师','工程师','商务人士','个体老师','白领人士','其他'];
    var interesting = ['爬山','摄影','音乐','电影','旅游','游戏','健身','美食','跑步','逛街','唱歌','跳舞','扑克','麻将','网购','看书'];
    var xsrf = get_cookie_by_name('_xsrf');
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
    var centermes = '';
    var center_interest = '';
    console.log(centerobj);
    for(var i = 0; i < centerobj.hobby.arr.length; i ++) {
        if(centerobj.hobby.arr == 1) {
            center_interest += '<em>'+ interesting[i] +'</em>';
        }
    };
    centermes += '<div class="love_mater_right"> '+
    '<h2>'+ centerobj.user.nick_name +'<span>（'+ sex[centerobj.user.sex] +'）</span></h2>'+
    '<div class="love_mater_detail">'+
        '<span>征友状态：'+ centerobj.user.state === 0 ? '征友进行中' : '找到意中人' +'</span>'+
        '<span>意向：'+ aim[centerobj.user.aim] +'</span>'+
        '<span>年龄：'+ centerobj.user.age +'</span>'+
        '<span>婚姻：'+ marriage[centerobj.user.marriage] +'</span>'+
        '<span>星座：'+ xingzuo[centerobj.user.xingzuo] +'</span>'+
        '<span>属相：'+ shengxiao[centerobj.user.shengxiao] +'</span>'+
        '<span>血型：'+ blood[centerobj.user.blood] +'</span>'+
        '<span>体重：'+ centerobj.user.weight +'KG</span>'+
        '<span>身高：'+ centerobj.user.height +'CM</span>'+
        '<span>学历：'+ degreearr[centerobj.user.degreearr] +'</span>'+
        '<span>民族：'+ centerobj.user.nation +'</span>'+
        '<span>现居：'+ centerobj.user.curr_loc1  +'/' + centerobj.user.curr_loc2 +'</span>'+
        '<span>籍贯：'+ centerobj.user.ori_loc1 + '/' + centerobj.user.ori_loc2 +'</span>'+
    '</div>'+
    '<p>'+
        '<span>简介：</span>'+
        '<span class="text_over2">'+ centerobj.statement.motto +'</span>'+
    '</p>'+
    '<p>'+
        '<span>兴趣：</span>'+ center_interest
    '</p>'+
'</div>';
   $('#love_center_right').append(centermes);
    // 内心独白
    $("#love_heart_content").html(centerobj.statement.content);

    // 其他资料
    var love_material;
    love_material += '<div class="love_col love_col_4">月薪：'+ salary[centerobj.user.salary] +'</div>'+
    '<div class="love_col love_col_4">职业：'+ work[centerobj.user.work]+'</div>'+
    '<div class="love_col love_col_4">购车：'+ house[centerobj.user.car] +'</div>'+
    '<div class="love_col love_col_4">购房：'+ house[centerobj.user.house] +'</div>';
    $("#love_material").append(love_material);
    // 其他资料账号相关
   var love_account;
   love_account += '<div class="love_col love_col_5">'+
   '手机：' + centerobj.otherinfo.mobile +' '+
   '<div class="love_other_tools">'+
       '<button class="btn_center">'+ centerobj.otherinfo.public_m === 0 ? '对外隐藏' : '对外公开' +'</button>'+
   '</div>'+
'</div>'+
'<div class="love_col love_col_5">'+
   '邮箱：'+ centerobj.otherinfo.email +''+
   '<div class="love_other_tools">'+
       '<button class="btn_center">'+ centerobj.otherinfo.public_e === 0 ? '对外隐藏' : '对外公开' +'</button>'+
       '<button class="btn_center btn_center_plain">'+ centerobj.otherinfo.verify_e === 0 ? '验证邮箱' : '解绑' +'</button>'+
   '</div>'+
'</div>'+
'<div class="love_col love_col_5">'+
   '微信：'+ centerobj.otherinfo.wx +''+
   '<div class="love_other_tools">'+
       '<button class="btn_center">'+ centerobj.otherinfo.public_w === 0 ? '对外隐藏' : '对外公开' +'</button>'+
       '<button class="btn_center">'+ centerobj.otherinfo.verify_w === 0 ? '验证微信' : '解绑' +'</button>'+
   '</div>'+
'</div>'+
'<div class="love_col love_col_5">'+
   'QQ：'+ centerobj.otherinfo.qq +''+
   '<div class="love_other_tools">'+
       '<button class="btn_center">'+ centerobj.otherinfo.public_q === 0 ? '对外隐藏' : '对外公开' +'</button>'+
       '<button class="btn_center btn_center_plain">'+ centerobj.otherinfo.verify_q === 0 ? '验证qq' : '解绑' +'</button>'+
   '</div>'+
'</div>';
   $("#love_account").append(love_account);

                console.log(centerobj);
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
        $('.love_mater_before').hide();
        $('.love_mater_after').show();
    });
    $(document).on('click', '.love_mater_back', function() {
        $('.love_mater_before').show();
        $('.love_mater_after').hide();
    });
    //内心独白
    $(document).on('click', '.love_white_edit', function() {
        $('.love_heart_before').hide();
        $('.love_heart_after').show();
    });
    $(document).on('click', '.love_white_back', function() {
        $('.love_heart_before').show();
        $('.love_heart_after').hide();
    });
    //其他信息
    $(document).on('click', '.love_oth_edit', function() {
        $('.love_other_before').hide();
        $('.love_other_after').show();
    });

    $(document).on('click', '.love_other_back', function() {
        $('.love_other_before').show();
        $('.love_other_after').hide();
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
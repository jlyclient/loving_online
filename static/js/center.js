//判断字符串是否为空
function isEmpty(obj) {
    if (obj === null) return true;
    if (typeof obj === 'undefined') {
        return true;
    }
    if (typeof obj === 'string') {
        if (obj === "") {
            return true;
        }
        var reg = new RegExp("^([ ]+)|([　]+)$");
        return reg.test(obj);
    }
    return false;
}
function common(selector_src,
                selector_des,
                default_val_str,
                default_val_num,
                dic=null) {
    var s = $(selector_src).html();
    if (s == null || s == default_val_str) {
        $(selector_des).prev().html(default_val_str);
        $(selector_des).val(default_val_num)
    } else {
        var m = s.split('：')[1];
        if (m.indexOf('kg') != -1 || m.indexOf('cm') != -1) {
            m = m.substring(0, m.length-2);
            $(selector_des).prev().html(m);
            $(selector_des).val(m);
        } else if (m.indexOf('岁') != -1) {
            m = m.substring(0, m.length-1);
            $(selector_des).prev().html(m);
            $(selector_des).val(m);
        }else {
            if (dic) {
                var num = dic[m] == null ? '0' : dic[m];
                $(selector_des).prev().html(m);
                $(selector_des).val(num);
            } else {
                $(selector_des).prev().html(m);
                $(selector_des).val(m);
            }
        }
    }
}
function edit_basic() {
    var dic = {'未填': '0', '交友': '1', '征婚': '2', '聊天': '3'};
    common('#aim_a', '#aim', '未填', '0', dic);

    common('#age_a', '#age', '19', '19', null);

    dic = {'保密':'0', '单身':'1', '非单身':'2', '已婚':'3', '丧偶':'4'};
    common('#marr_a', '#marriage', '保密', '0', dic);

    dic = {'未填':'0', '白羊座':'1', '金牛座':'2', '双子座':'3',
           '巨蟹座':'4', '狮子座':'5', '处女座':'6', '天秤座':'7',
   '天蝎座':'8', '射手座':'9', '摩羯座':'10', '水瓶座':'11', '双鱼座':'12'};
    common('#xz_a', '#xingzuo', '未填', '0', dic);

    dic = {'未填':'0', '鼠':'1', '牛':'2', '虎':'3', '兔':'4',
           '龙':'5', '蛇':'6', '马':'7', '羊':'8', '猴':'9',
           '鸡':'10', '狗':'11', '猪':'12'};
    common('#sx_a', '#shengxiao', '未填', '0', dic);

    dic = {'未填':'0', 'A':'1', 'B':'2', 'AB':'3', 'O':'4'};
    common('#bd_a', '#blood', '未填', '0', dic);

    common('#wei_a', '#weight', '30', '30', null);

    common('#hei_a', '#height', '130', '130', null);
    
    dic = {'保密':'0', '高中及以下':'1', '中专/大专':'2', '本科':'3',
           '研究生':'4', '博士及博士后':'5'};
    common('#xl_a', '#degree', '未填', '0', dic);

    common('#nation_a', '#nation', '未填', '0', null);
    
    var cur = $('#cur_a').html().split('：')[1];
    if (cur) {
        cur = cur.split('/');
        $('#cur_loc1').prev().html(cur[0])
        $('#cur_loc1').val(cur[0]);
        $('#cur_loc1').trigger('change');
        $('#cur_loc2').prev().html(cur[1])
        $('#cur_loc2').val(cur[1]);
    }
    var ori = $('#ori_a').html().split('：')[1];
    if (ori) {
        ori = ori.split('/');
        $('#ori_loc1').val(ori[0]);
        $('#ori_loc1').prev().html(ori[0]);
        $('#ori_loc1').trigger('change');
        $('#ori_loc2').val(ori[1]);
        $('#ori_loc2').prev().html(ori[1]);
    }
    $('.love_mater_before').hide();
    $('.love_mater_after').show();
    $('.love_center_mater').css("border-bottom", "none");
    $('.love_center_group').css("border-bottom", "1px solid #d6d6d6");
}
function edit_after() {
    $('.love_mater_before').show();
    $('.love_mater_after').hide();
    $('.love_center_mater').css("border-bottom", "1px solid #d6d6d6");
    $('.love_center_group').css("border-bottom", "none");
}
//内心独白
function edit_st_after() {
     $('.love_heart_before').show();
     $('.love_heart_after').hide();
}
function edit_statement() {
    $('.love_heart_before').hide();
    $('.love_heart_after').show();
    var cnt = $('#content').html();
    $('#statement').html(cnt);
}
function set_other(src, des) {
    var t = $(src).html();
    if (t) {
        t = t.split('：');
        if (t.length == 2) {
            t[1] = $.trim(t[1]);
            if (t[1] != '未填') {
                $(des).val(t[1]);
            } else {
                $(des).attr('placeholder', '未填');
            }
        }
    }
}
//其他信息
function edit_other() {
    set_other('#m_o1', '#m_o4');
    set_other('#em_o1', '#em_o4');
    set_other('#w_o1', '#w_o4');
    set_other('#q_o1', '#q_o4');

    $('.love_other_before').hide();
    $('.love_other_after').show();
}
function edit_other_after() {
    $('.love_other_before').show();
    $('.love_other_after').hide();
}

$(function() {
    $('#height').change(function() {
        $.each($('#height'), function(index, item) {
            var _text = $(item).find('option:selected').text().replace(/\(/, '<span>(').replace(/\)/, ')<span>');
            if (_text === '') {
                _text = '130';
            }   
            $(item).prev().html(_text);
        });
    });
    $('#weight').change(function() {
        $.each($('#weight'), function(index, item) {
            var _text = $(item).find('option:selected').text().replace(/\(/, '<span>(').replace(/\)/, ')<span>');
            if (_text === '') {
                _text = '30';
            }   
            $(item).prev().html(_text);
        });
    });

    //基本资料
    //基本资料
    $(document).on('click', '.love_mater_edit', edit_basic);
    $(document).on('click', '.love_mater_back', edit_after);
    $(document).on('click', '.love_white_edit', edit_statement);
    $(document).on('click', '.love_white_back', edit_st_after);
    $(document).on('click', '.love_oth_edit',   edit_other);
    $(document).on('click', '.love_other_back', edit_other_after);
    $('#basic_sure').click(function() {
        var aim = $('#aim').val();//交友目的
        var age = $('#age').val();//年龄
        var mar = $('#marriage').val();//婚姻状况
        var xz  = $('#xingzuo').val();//星座
        var sx  = $('#shengxiao').val();//生肖属相
        var bd  = $('#blood').val();//血型
        var wei = $('#weight').val();//体重kg
        var hei = $('#height').val();//身高cm
        var deg = $('#degree').val();//学历
        var nat = $('#nation').val();//籍贯
        var cur1= $('#cur_loc1').val();//当前住址 省(直辖市)
        var cur2= $('#cur_loc2').val();//当前住址 市(区)
        var ori1= $('#ori_loc1').val();//籍贯住址 省(直辖市)
        var ori2= $('#ori_loc2').val();//籍贯住址 市(区)
        var mot = $('#motto').val();//个性签名
        var hobby = $('.tools_span_select>.active');//兴趣爱好
        var h = [];
        for (var i = 0; i < hobby.length; ++i) {
            var e = hobby[i].innerHTML;
            h.push(e);
        }
        h = JSON.stringify(h);
        var xsrf = get_cookie_by_name('_xsrf');
        var D = {'aim': aim,
                 'age':       age,       'marriage': mar,
                 'xingzuo':   xz,        'shengxiao': sx,
                 'blood':     bd,        'weight': wei,
                 'height':    hei,       'degree': deg,
                 'nation':    nat,       'cur_loc1': cur1,
                 'cur_loc2':  cur2,      'ori_loc1': ori1,
                 'ori_loc2':  ori2,      'motto': mot,
                 'hobby':     h,         '_xsrf': xsrf};
        $.ajax({
            type: 'POST',
            url:  '/basic_edit',
            data: D,
            success: function(para) {
                d = JSON.parse(para);
                if (d['code'] == '0') {
                    alert(d['msg']);
                    window.location.href = '/center';
                } else {
                    alert(d['msg']);
                }
            },
            error: function(para) {
            }
        });
    });
    $('#state_sure').click(function() {
        var cnt = $('#statement').val();
        if (cnt.length >= 1000) {
            alert('字数不能超过1000字!');
            return -1;
        }
        var xsrf = get_cookie_by_name('_xsrf');
        var D = {'_xsrf':xsrf, 'content': cnt};
        $.ajax({
            type: 'POST',
            url:  '/statement_edit',
            data: D,
            success: function(para) {
                var d = JSON.parse(para);
                if (d['code'] == '0') {
                    alert(d['msg']);
                    $('#content').html(cnt);
                } else {
                    alert('编辑失败!');
                }
                edit_st_after();
            },
            error: function(para) {
                edit_st_after();
            }
        });
    });
    $('#other_sure').click(function() {
        var f  = 0;
        var qq = $('#q_o4').val();
        qq = $.trim(qq);
        var wx = $('#w_o4').val();
        wx = $.trim(wx);
        var em = $('#em_o4').val();
        em = $.trim(em);
        var mo = $('#m_o4').val();
        mo = $.trim(mo);
        var xsrf = get_cookie_by_name('_xsrf');
        var D  = {};
        if (qq && qq != '未填') {
            D['qq'] = qq;
            f = 1;
        }
        if (wx && wx != '未填') {
            D['wx'] = wx;
            f = 1;
        }
        if (em && em != '未填') {
            D['email'] = em;
            f = 1;
        }
        if (mo && mo != '未填') {
            D['mobile'] = mo;
            f = 1;
        }
        if (f == 0) {
            alert('请先编辑联系方式,再提交!');
            return -1;
        }
        $.ajax({
            type: 'POST',
            url: '/other_edit',
            data: D,
            success: function(para) {
                var d = JSON.parse(para);
                alert(d['msg']);
                edit_other_after();
            },
            error: function(para) {
                edit_other_after();
            }
        });
    });
});

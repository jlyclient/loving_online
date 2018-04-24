$(function() {
    var obj = {
        sex: '',
        agemin: '',
        agemax: '',
        cur1: '',
        cur2: '',
        ori1: '',
        ori2: '',
        degree: '',
        salary: '',
        xingzuo: '',
        shengxiao: ''
    }
    function callbackFun(value, next) {
        console.log(value, '000000');
        Page({
			num:value,				//页码数
			startnum:next+1,				//指定页码
			elem:$('#page1'),		//指定的元素
            callback:function(n){	//回调函数
                console.log(n);
				find_member(
                    obj.sex,
                    obj.agemin == '不限' || obj.agemin == undefined ? '' : obj.agemin,
                    obj.agemax == '不限' || obj.agemax == undefined ? '' : obj.agemax,
                    obj.cur1 == '不限' ||  obj.cur1 == undefined ? '' : obj.cur1,
                    obj.cur2 == '不限' || obj.cur2 == undefined ? '' : obj.cur2,
                    obj.ori1 == '不限' || obj.ori1 == undefined ? '' : obj.ori1,
                    obj.ori2 == '不限' || obj.ori2 == undefined ? '' : obj.ori2,
                    obj.degree == '不限' || obj.degree == undefined ? '' : obj.degree,
                    obj.salary == '不限' || obj.salary == undefined ? '' : obj.salary,
                    obj.xingzuo == '不限'|| obj.xingzuo == undefined ? '' : obj.xingzuo,
                    obj.shengxiao == '不限' || obj.shengxiao == undefined ? '' : obj.shengxiao,
                    n-1,
                    callbackFun
                );
			}
		});
    }
    $(".love_nav").find('li').map((index, data) => {
        $(data).removeClass("active");
        if (index == 3) {
            $(data).addClass("active");
        }
    }); 
    var page = find_member('', '', '', '', '', '', '', '', '', '', '',0, callbackFun);
    console.log(page);
    $("#city_8").citySelect();
    $("#city_9").citySelect();
    $(".search_self").click(function() {
        $(".love_search_box").find("input").map((index, data) => {
            var type = $(data).attr("type");
            if (type === 'radio' && data.checked) {
                console.log(data.checked);
                obj[$(data).attr("name")] = $(data).attr("option");
            }
        });
        $(".love_search_box").find('select').map((index, data) => {
            obj[$(data).attr("name")] = $(data).find("option:selected").attr("value"); 
        });
        if (obj.age1 > obj.age2) {
            alert('请按年龄从小到大筛选！');
            return -1;
        } else {
            console.log(obj.shengxiao);
            // get_html('/list_zhenghun', obj.sex, obj.age1, obj.age2, obj.loc1, obj.los2);
            find_member(
                obj.sex,
                obj.agemin == '不限' || obj.agemin == undefined ? '' : obj.agemin,
                obj.agemax == '不限' || obj.agemax == undefined ? '' : obj.agemax,
                obj.cur1 == '不限' ||  obj.cur1 == undefined ? '' : obj.cur1,
                obj.cur2 == '不限' || obj.cur2 == undefined ? '' : obj.cur2,
                obj.ori1 == '不限' || obj.ori1 == undefined ? '' : obj.ori1,
                obj.ori2 == '不限' || obj.ori2 == undefined ? '' : obj.ori2,
                obj.degree == '不限' || obj.degree == undefined ? '' : obj.degree,
                obj.salary == '不限' || obj.salary == undefined ? '' : obj.salary,
                obj.xingzuo == '不限'|| obj.xingzuo == undefined ? '' : obj.xingzuo,
                obj.shengxiao == '不限' || obj.shengxiao == undefined ? '' : obj.shengxiao,
                0,
                callbackFun
            );
        }
    });
    
})

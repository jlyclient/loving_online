$(function() {
    find_member();
    $(".search_self").click(function() {
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
            shengxiao: '',
        }
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
        } else {
            console.log(obj);
            // get_html('/list_zhenghun', obj.sex, obj.age1, obj.age2, obj.loc1, obj.los2);
            find_member( obj.sex, obj.agemin, obj.agemax, obj.cur1, obj.cur2, obj.ori1, obj.ori2, obj.degree, obj.xingzuo, obj.shengxiao);
        }
    });
    
})
$(function() {
    //更多搜索
    $(document).on('click', '.love_search_more', function() {
        $(this).toggleClass('active');
        if ($(this).attr('class').indexOf('active') > 0)
            $('.love_search_other').show();
        else
            $('.love_search_other').hide();
    });


    //获取动态码
    $(document).on('click', '.btn_ver', function() {
        var count = 60;
        var $this = $(this);
        $this.attr('disabled', true);
        $this.text(count + 's后重发');
        $this.parent().append("<p>验证码1分钟内有效</p>");
        var interval = setInterval(function() {
            if (count - 1 > 0) {
                count--;
                $this.text(count + 's后重发');
            } else {
                clearInterval(interval);
                $this.text('获取验证码');
                $this.attr('disabled', false);
            }
        }, 1000);
    });
})
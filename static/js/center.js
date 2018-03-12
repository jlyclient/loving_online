$(function() {
  
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
$(function() {
    var xsrf = get_cookie_by_name('_xsrf');
    var email_id = null;
    get_html('/sponsor_zhenghun');
    $(".love_try_box").on('click', '.private_email', function() {
        email_id = $(this).attr("uid");
        $('.love_dialog').find('.love_dialog_letter').removeClass('d_n');
        $("#send_email").html($(this).attr("name"));
    });
    $(".btn_send_email").click(function() {
        if ($("#send_email_content").val().length > 0) {
            $.ajax({
                url: '/sendemail',
                type: 'POST',
                data: {
                    '_xsrf': xsrf,
                    uid: email_id,
                    content: $("#send_email_content").val(),
                },
                success: function(data) {
                    var jsondata = JSON.parse(data);
                    console.log(jsondata);
                    if (jsondata.code == 0) {
                        close_popup();
                    } else{
                        alert(jsondata.msg);
                    }
                },
                error: function(para) {
                    console.log(para);
                }
            })
        }
    });
})
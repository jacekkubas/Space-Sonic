$(document).ready(function() {
    
    $.fn.serializeFormJSON = function () {

        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
    
    $('#wyniki').submit(function(e) {
        e.preventDefault();
        var data = $(this).serializeFormJSON();
        console.log(data);
    });
    
    $('#form').submit(function(e) {
        e.preventDefault();
        var value = $('#form input').val();
        $('#wyniki input:first-child').val(value);
        $('canvas').addClass('active');
        $('.btns').addClass('active');
        $('#form button, #form input').blur();
        startGame();
    });
    
    // auto start
    window.onload = function () {
        $('canvas').addClass('active');
        $('.btns').addClass('active');
        startGame();
    }
})
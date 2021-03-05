/**
 * Created by Administrator on 2016/3/16.
 */
(function($){
    $.fn.autoHeight = function(){
        function autoHeight(elem){
            elem.style.height = 'auto';
            elem.scrollTop = 0; //防抖动
            elem.style.height = elem.scrollHeight + 'px';
        }

        this.each(function(){
            autoHeight(this);
            $(this).on('keyup', function(){
                autoHeight(this);
            });
        });
    }
    $('textarea').attr("autoHeight",true);
    $('textarea[autoHeight]').autoHeight();
})(jQuery);
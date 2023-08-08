
(function($){
    $.fn.DefaultInput = function(def) {
        return this.each(function(i, e){
            $(this).data("def", def).val(def);
            $(this).keydown(function() {
                $(this).data("changed", true);
                $(this).unbind("keydown");
            });
            $(this).focus(function(){
                if (!$(this).data("changed") &&
                   $(this).val() == $(this).data("def"))
                {
                    $(this).val("");
                }
            });
            $(this).blur(function(){
                if (!$(this).data("changed") || $(this).val() == "")
                {
                    $(this).val($(this).data("def"));
                }
            });
        });
    };
})(jQuery);
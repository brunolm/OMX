$.om = {};

//#region Popup

$.om.popup = function(content) {
    var pop = $(".manager-popup-outter");

    if (pop.length == 0)
    {
        var outter = $("<div />").addClass("manager-popup-outter");
        var inner = $("<div />").addClass("manager-popup-inner");

        var close = $("<span />").addClass("manager-close");

        content.appendTo(inner);

        inner.appendTo(outter);

        outter.prependTo($("body"));
    }
    else
    {
        pop.remove();
    }
};
$.om.removepopup = function() { $(".manager-popup-outter").remove(); };

$(".manager-close").live("click", function() {
    $.om.removepopup();
});

//#endregion

var StringHelper = {};
StringHelper.Format=function(b){var a=arguments;return b.replace(/(\{\{\d\}\}|\{\d\})/g,function(b){if(b.substring(0,2)=="{{")return b;var c=parseInt(b.match(/\d/)[0]);return a[c+1]})};
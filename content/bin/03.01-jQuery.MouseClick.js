$.fn.mclick = function() {
    return this.each(function(i,e) {
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent('click',true,true,window,0,0,0,0,0,false,false,false,false,0,null);
        e.dispatchEvent(evt);
    });
};
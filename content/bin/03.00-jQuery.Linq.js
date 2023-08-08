$.fn.Where = function(fn) {
    return this.filter(function(i, el) { return fn(el); });
};
$.fn.IndexOf = function(fn) {
    var index = -1;
    this.each(function(i, el) { if (fn(el)) { index = i; } });
    return index;
};
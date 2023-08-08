$(".manager-share").live("click", function(e) {
    e.preventDefault();

    window.open("http://api.addthis.com/oexchange/0.8/offer?url="
        + encodeURIComponent($(this).data("url"))
        + "&title="
        + encodeURIComponent($(this).data("title") + " | @OrkutManager"));
});

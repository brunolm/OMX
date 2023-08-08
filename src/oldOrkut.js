chrome.extension.sendRequest({
    type: "transfer-item",
    Itens: 'oldOrkut'
}, function(r) {
    if (r === "MainKill") {
        if (!window.location.href.match(/AlbumZoom/i)) {
            if (window.location.href.match(/\/Main#/i)) {
                window.location.href = window.location.href.replace('Main#', '');
            } else {
                var script = window.document.createElement('script');
                script.innerHTML = 'const _initOrkutPage = function(){}';
                window.document.getElementsByTagName('html')[0].appendChild(script);
            }
        }

        document.addEventListener("DOMContentLoaded", function() {
            var Links = document.getElementsByTagName("a");
            LinksLength = Links.length;
            for (ll = 0; ll < LinksLength; ll++) {
                var Link = Links[ll];
                if (!Link)
                    continue;
                if (!Link.getAttribute)
                    continue;
                if (!Link.href.match(/^https?:\/\/.*?orkut.[^\/]*?/i))
                    continue;
                if (window.location.href.match(/AlbumZoom/i))
                    continue;

                Link.href = Link.href.replace(/\/Main#/, "/");

                if (Link.href.match(/&pid/) && Link.href.match(/\$pid/))
                    Link.href = Link.href.replace(/&pid=(\d+)/i, "").replace(/\$pid/i, "&pid");
                if (Link.innerHTML.match(/^https?:\/\/.*?orkut.[^\/]*?/i))
                {
                    Link.innerHTML = Link.innerHTML.replace(/\/Main#/i, "/");
                    if (Link.innerHTML.match(/&amp;pid/) + "&&" + Link.innerHTML.match(/\$pid/))
                        Link.innerHTML = Link.innerHTML.replace(/&amp;pid=(\d+)/i, "").replace(/\$pid/i, "&pid");
                }
            }
        }, true);
    }
});
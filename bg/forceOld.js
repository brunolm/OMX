
chrome.webRequest.onBeforeSendHeaders.addListener(
        function(details) {
            if (localStorage['oldOrkut'] === "ForceOld" || details.url.match('AlbumZoom')) {
                for (var i = 0; i < details.requestHeaders.length; ++i) {
                    if (details.requestHeaders[i].name === 'User-Agent') {
                        details.requestHeaders[i].value = 'Mozilla/5.0 (compatible; MSIE 6.0; Windows NT 6.1; Trident/5.0)';
                        break;
                    }
                }
            }
            return {requestHeaders: details.requestHeaders};
        },
        {urls: ["http://www.orkut.com/*", "http://www.orkut.com.br/*", "http://www.orkut.co.uk/*", "http://www.orkut.pt/*", "http://www.orkut.com.au/*", "http://www.orkut.es/*", "http://www.orkut.pt/*", "http://www.orkut.co.nz/*", "http://www.orkut.gr/*", "http://www.orkut.de/*", "http://www.orkut.nl/*", "http://www.orkut.be/*", "http://www.orkut.ch/*", "http://www.orkut.bj/*", "http://www.orkut.co.in/*"]},
["blocking", "requestHeaders"]);


chrome.webRequest.onBeforeSendHeaders.addListener(
        function(details) {
            for (var i = 0; i < details.requestHeaders.length; ++i) {
                if (details.requestHeaders[i].name === 'Referer') {
                    details.requestHeaders[i].value = 'http://manageraddons.com/';
                    break;
                }
            }
            return {requestHeaders: details.requestHeaders};
        },
        {
            urls: ["http://www.manageraddons.com/*", "http://manageraddons.com/*"],
            types: ["main_frame", "sub_frame", "script"]
        },
["blocking", "requestHeaders"]);
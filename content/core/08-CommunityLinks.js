/// <reference path="../bin/jquery-1.7.1.min.js" />

window.addEventListener("DOMNodeInserted", function (e)
{
    if (e && e.target && e.target.tagName)
    {
        //#region Community links include forum links
        setTimeout(function ()
        {
            var communityLinks = $("a[href*='#Community?cmm=']:not(.manager-forumlink-parsed)");

            communityLinks = communityLinks.Where(function (o)
            {
                return o.querySelector("img") == null && o.querySelector("div") == null;
            });

            communityLinks.each(function (i, el)
            {
                if (!/manager-forumlink-parsed/i.test(el.className))
                {
                    el.className += " manager-forumlink-parsed";

                    var cmm = el.getAttribute("href");
                    cmm = cmm.match(/cmm=(\d+)/i)[1];

                    var a = document.createElement("a");

                    a.setAttribute("href", "/Main#CommTopics?cmm=" + cmm);
                    a.innerHTML = "<sup>forum</sup>";

                    $(a).insertAfter(el);
                }
            });
        }, 100);
        //#endregion

        //http://www.orkut.com.br/Main#CommTopics?cmm=90840394
        //#region Topic links include last page links
        setTimeout(function ()
        {
            var communityLinks = $("a[href*='#CommMsgs?cmm=']:not([href*='&na=']):not([href*='&sort=']):not(.manager-topiclink-parsed)");

            communityLinks = communityLinks.Where(function (o) { return o.querySelector("img") == null; });

            communityLinks.each(function (i, el)
            {
                if ($(el).parent().find("> span > div > button").length >= 1)
                {
                    el.className += " manager-topiclink-parsed";
                    return;
                }

                if (!/manager-topiclink-parsed/i.test(el.className))
                {
                    el.className += " manager-topiclink-parsed";

                    var link = el.getAttribute("href");
                    var cmm = link.match(/cmm=(\d+)/i)[1];
                    var tid = link.match(/tid=(\d+)/i)[1];

                    var a = document.createElement("a");

                    a.className += " manager-topiclink-parsed";
                    a.setAttribute("href", "/Main#CommMsgs?cmm=" + cmm + "&tid=" + tid + "&na=2&scroll=-1");
                    a.innerHTML = "<sup>last</sup>";

                    $(a).insertAfter(el);
                }
            });
        }, 100);

        //#endregion
    }
}, !1);
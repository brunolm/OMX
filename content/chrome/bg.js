//chrome.browserAction.setBadgeText({text:"0"});
//chrome.browserAction.setBadgeBackgroundColor({color: [108, 108, 108, 255]});

var fetch = 10 * 1000;

function UpdateNotification(manual)
{
var userID = 1;// document.getElementsByTagName("script")[0].innerHTML.match(/uid[^\n]+'(\d+)'[^\n]+/)[1]

var url = "http://www.orkut.com.br/Main#Profile?uid=" + userID;

var xhr = new XMLHttpRequest();
xhr.onreadystatechange=function()
{
    if (xhr.readyState==4 && xhr.status==200)
    {
        var d = xhr.responseText;
        // ITODO: Get numbers from HTML
                        
        var n = 0;

        chrome.browserAction.setBadgeText({text:n});

        if (parseInt(n,10) > 0)
        {
            chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
        }
        else
        {
            chrome.browserAction.setBadgeBackgroundColor({color: [108, 108, 108, 255]});
        }
    }
}
xhr.open("GET", url,true);
xhr.send();

if (!manual)
    setTimeout(UpdateNotification, fetch);
}

//UpdateNotification(true);
//UpdateNotification();

chrome.browserAction.onClicked.addListener(function(tab) {
chrome.windows.getAll({populate:true}, function callback(ws) {
    var url = JSON.parse(localStorage["UserSettings"] || "{}").ExtIconUrl || "http://www.orkut.com.br/";

    var found = false;
    for (var wi in ws)
    {
        var w = ws[wi];
                        
        for (var ti in w.tabs)
        {
            var tab = w.tabs[ti];
            if (tab.url.indexOf(url) >= 0)
            {
                chrome.tabs.update(tab.id, { selected: true });
                return;
            }
        }
    }

    if (!found)
    {
        chrome.tabs.create({ url: url, selected: true, pinned: true });
    }
});

UpdateNotification(true);
});
            
chrome.extension.onRequest.addListener(
function(request, sender, sendResponse)
{
    var $ = jQuery;
    if (/LoadScript/i.test(request.Command))
    {
        var source = "";
        $.ajax
        ({
            url: "../" + request.File,
            async: false,
            dataType: "html",
            success: function(data) {
                source = data;
            }
        });
        sendResponse({Source:source});
    }
    else if (/LoadTemplates/i.test(request.Command))
    {
        var template = "";
        $.ajax
        ({
            url: "../templates/HelpBox.html",
            async: false,
            dataType: "html",
            success: function(data) {
                template = data;
            }
        });
        $.ajax
        ({
            url: "../templates/Config.html",
            async: false,
            dataType: "html",
            success: function(data) {
                template += data;
            }
        });
        sendResponse({Template:template});
    }
    else if (/SetSettings/i.test(request.Command))
    {
        localStorage["UserSettings"] = request.Settings;
        sendResponse({Status:0});
    }
    else if (/GetSettings/i.test(request.Command))
    {
        var settings = localStorage["UserSettings"] || '{"Features":{}}';
        sendResponse({Settings:settings});
    }
    else if (/SetCurrentUser/i.test(request.Command))
    {
        localStorage["CurrentUserID"] = request.EID;
        sendResponse({Status:0});
    }
    else if (/GetDetails/i.test(request.Command))
    {
        sendResponse({ Details: chrome.app.getDetails() });
    }
    else if (/GetLatestVersionInfo/i.test(request.Command))
    {
        $.ajax
        ({
            url: "http://www.manageraddons.info/dl/chrome/omx/update.xml",
            dataType: "xml",
            success: function(data) {
                var info =
                    {
                        Version: $(data).find("updatecheck").attr("version"),
                        Url: "http://www.manageraddons.info/dl/chrome/omx/omx.crx"
                    };
                sendResponse(info);
            }
        });
    }
});
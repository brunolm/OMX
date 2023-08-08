if (!ManagerAddsSystem) var ManagerAddsSystem = { };
if (!ManagerAddsSystem.OrkutManager) ManagerAddsSystem.OrkutManager = { };

ManagerAddsSystem.OrkutManager.LoadScript = function (document, file, name){
    var content = null;
    
    chrome.extension.sendRequest({Command: "LoadScript", File: file},
        function(response)
        {
            try
            {
                content = document.createElement("script");
                content.type = "text/javascript";
                content.setAttribute("from", "om");
                if (typeof(name) != "undefined") content.setAttribute("name", "om-" + name);
                content.innerHTML = response.Source;
                document.getElementsByTagName("head")[0].appendChild(content);
            }
            catch (ex) { }
        });
};

ManagerAddsSystem.OrkutManager.LoadTemplate = function (source)
{
    if (!document.body)
    {
        setTimeout(function() {
            ManagerAddsSystem.OrkutManager.LoadTemplate(source);
        }, 100);
        return;
    }
    var templ = document.createElement("div");
    templ.innerHTML = source;
    templ.style.display = "none";
    try
    {
        templ.setAttribute("data-ManagerTemplate", true);
    }
    catch (ex) { }
    document.getElementsByTagName("body")[0].appendChild(templ);
};

if (/^https?:\/\/www\.orkut\..*/i.test(window.location.href)
    || /manageraddons.com\/omx\/configext/i.test(window.location.href))
{
    chrome.extension.sendRequest({Command: "LoadTemplates"},
        function(response)
        {
            ManagerAddsSystem.OrkutManager.LoadTemplate(response.Template);
        });
}
/// <reference path="../bin/jquery-1.7.1.min.js" />
window.addEventListener("mousedown"
    , function(e)
    {
        if (e && e.target && e.target.tagName == "A" && /Interstitial\?u/i.test(e.target.href))
        {
            var ix = e.target.href.indexOf("?");
            var href = window.GetQueryString(e.target.href.substring(ix+1)).u;

            if (href && href.length > 6)
                e.target.setAttribute("href", href);
        }
    }, false);


$(".manager-trash").live("click", function(e) {
    if (!confirm(ManagerAddsSystem.OrkutManager.Resource("Are you sure you want to delete?")))
    {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
    }
});

$(".manager-reset").live("click", function(e) {
    e.preventDefault();

    if (!confirm("Tem certeza que deseja voltar para o padrao? TODAS suas configuracoes serao reiniciadas")) return;

    if ($.browser.mozilla)
    {
        ManagerAddsSystem.OrkutManager.PrefManager.Set("UserSettings", "{}");
        unsafeWindow.alert(ManagerAddsSystem.OrkutManager.Resource("Saved!"));

        ManagerAddsSystem.OrkutManager.UserSettings = ManagerAddsSystem.OrkutManager.LoadSettings();

        window.location.reload();
    }
    else
    {
        chrome.extension.sendRequest({Command: "SetSettings", Settings: "{}"},
            function(response)
            {
                window.alert(ManagerAddsSystem.OrkutManager.Resource("Saved!"));
                chrome.extension.sendRequest({Command: "GetSettings"},
                    function(response)
                    {
                        ManagerAddsSystem.OrkutManager.UserSettingsObject = ManagerAddsSystem.OrkutManager.LoadSettings();
                    });
            });
    }
});
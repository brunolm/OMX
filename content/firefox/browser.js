if (!ManagerAddsSystem) var ManagerAddsSystem = {};
if (!ManagerAddsSystem.OrkutManager) ManagerAddsSystem.OrkutManager = {};

ManagerAddsSystem.OrkutManager.OpenSettings = function() {
    var url = ManagerAddsSystem.OrkutManager.UserSettingsObject["ExtIconUrl"] || "http://www.orkut.com.br/";
    gBrowser.selectedTab = gBrowser.addTab(url);
};
(function ()
{
    function InitializeComponents(firstrun, curVersion)
    {
        if (firstrun)
        {
            Services.prefs.setBoolPref("extensions.orkutmanager.FirstRun", false);
            Services.prefs.setCharPref("extensions.orkutmanager.InstalledVersion", curVersion);

            var startButtonId = "orkutmanager-button";
            var navBar = document.getElementById("nav-bar");
            var currentSet = navBar.getAttribute("currentset");
            if (!currentSet)
                currentSet = navBar.currentSet;

            var curSet = currentSet.split(",");
            if (curSet.indexOf(startButtonId) == -1)
            {
                var set = curSet.concat(startButtonId);
                navBar.setAttribute("currentset", set.join(","));
                navBar.currentSet = set.join(",");
                document.persist(navBarId, "currentset");

                try
                {
                    BrowserToolboxCustomizeDone(true);
                }
                catch (e) {}
            }
        }
        else
        {
            try
            {
                var installedVersion = Services.prefs.getCharPref("extensions.orkutmanager.InstalledVersion");
                if (curVersion > installedVersion)
                {
                    Services.prefs.setCharPref("extensions.orkutmanager.InstalledVersion", curVersion);
                }
            }
            catch (ex)
            {
                /* Code related to a reinstall */
            }
        }
    }

    var firstrun = Services.prefs.getBoolPref("extensions.orkutmanager.FirstRun");
    var curVersion = 0;

    try // FF 4
    {
        Components.utils.import("resource://gre/modules/AddonManager.jsm");
        AddonManager.getAddonByID("om.brunolm@gmail.com",
            function(addon)
            {
                curVersion = addon.version;
                InitializeComponents(firstrun, curVersion);
            });
    }
    catch (ex)
    {
    }

})();
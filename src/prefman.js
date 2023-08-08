OMSystem.OrkutManager.PrefManager = {
    DefaultVar: function(r)
    {
        this.r = r;
    },
    Get: function(prefName, defaultValue)
    {
        if (typeof(this.r[prefName]) != "undefined")
            return this.r[prefName];
        else
            return defaultValue;
    },
    Set: function(prefName, value)
    {
        chrome.extension.sendRequest({
            type: "post",
            Itens: [prefName],
            Values: [value]
        }, function(r) {
        });

    },
    Clear: function(prefName)
    {
        window.localStorage.removeItem(prefName);
        chrome.extension.sendRequest({
            type: "clear-itens",
            Itens: [prefName],
            Values: [""]
        }, function(r) {
        });
    }
};
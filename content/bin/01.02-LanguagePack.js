ManagerAddsSystem.OrkutManager.DecodeResource = function(s) {
    s = s.match(/#(\d+)/g);
    var r = "";
    for (var i in s)
    {
        r+=String.fromCharCode(s[i].replace("#",""));
    }
    return r;
};

ManagerAddsSystem.OrkutManager.Resource = function(text) {
    var culture = ManagerAddsSystem.OrkutManager.UserSettingsObject.Language ||
        (unsafeWindow.OZ_lang || navigator.language.substring(0, 2));
    var result = ManagerAddsSystem.OrkutManager.Languages[culture];

    if (!result) return text;

    result = result[text];

    if (!result) return text;

    return ManagerAddsSystem.OrkutManager.DecodeResource(result) || result;
};

ManagerAddsSystem.OrkutManager.TranslateTemplate = function(text) {
    if (!text) return text;
    var translatePattern = /\$\{(.*?)(?!\{\d)\}/g;
    return text.replace(translatePattern, function(m,p) {
        return ManagerAddsSystem.OrkutManager.Resource(p);
    });
};
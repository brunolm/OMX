/// <reference path="00-Pages.js" />
/// <reference path="../bin/jquery-1.7.1.min.js" />

var OMConfig = {};

OMConfig.SaveTextTemplate = function ()
{
    (function ()
    {
        var set = ManagerAddsSystem.OrkutManager.UserSettingsObject["TemplateText"];

        set = $(".manager-config-window [name='TemplateText']").val();

        // prevent bogus behavior
        set = set.replace(/\<br\>/gi, "\n");

        ManagerAddsSystem.OrkutManager.UserSettingsObject["TemplateText"] = set;
        ManagerAddsSystem.OrkutManager.SetSetting("TemplateText", set);
    })();
};
OMConfig.SaveQuoteTemplate = function ()
{
    (function ()
    {
        var set = ManagerAddsSystem.OrkutManager.UserSettingsObject["TemplateQuote"];

        set = $(".manager-config-window [name='TemplateQuote']").val();

        ManagerAddsSystem.OrkutManager.UserSettingsObject["TemplateQuote"] = set;
        ManagerAddsSystem.OrkutManager.SetSetting("TemplateQuote", set);
    })();
};
OMConfig.SaveImageTemplate = function ()
{
    var set = [];
    $(".manager-config-window .manager-template-image-input").each(function (i, el)
    {
        var elVal = $(el).val();

        if (elVal.replace(/\s+/g, "") != "")
        {
            set.push(elVal);
        }
    });

    ManagerAddsSystem.OrkutManager.UserSettingsObject["ImageCollection"] = set;
    ManagerAddsSystem.OrkutManager.SetSetting("ImageCollection", set);
};
OMConfig.SaveIcons = function ()
{
    var set = [];
    $(".manager-config-window .manager-template-icon-input").each(function (i, el)
    {
        var elVal = $(el).val();
        var elName = $(el).parent().find(".manager-template-icon-input-code").val();

        if (elVal.replace(/\s+/g, "") != "" && elName.replace(/\s+/g, "") != "")
        {
            set.push({ Link: elVal, Code: elName });
        }
    });

    ManagerAddsSystem.OrkutManager.UserSettingsObject["IconCollection"] = set;
    ManagerAddsSystem.OrkutManager.SetSetting("IconCollection", set);
};

OMConfig.SaveMessageTemplate = function ()
{
    var set = [];
    $(".manager-config-window .manager-template-message-input").each(function (i, el)
    {
        var elVal = $(el).val();

        if (elVal.replace(/\s+/g, "") != "")
        {
            set.push(elVal);
        }
    });

    ManagerAddsSystem.OrkutManager.UserSettingsObject["PreDefinedTemplates"] = set;
    ManagerAddsSystem.OrkutManager.SetSetting("PreDefinedTemplates", set);
};
OMConfig.SaveFontTemplate = function ()
{
    var set = [];
    $(".manager-config-window .manager-template-font-input").each(function (i, el)
    {
        var elVal = $(el).val();

        if (elVal.replace(/\s+/g, "") != "")
        {
            set.push(elVal);
        }
    });

    ManagerAddsSystem.OrkutManager.UserSettingsObject["Fonts"] = set;
    ManagerAddsSystem.OrkutManager.SetSetting("Fonts", set);
};
OMConfig.SaveMenu = function ()
{
    var set = [];
    $(".manager-config-window .manager-template-menu-input-link").each(function (i, el)
    {
        var elVal = $(el).val();
        var elName = $(el).parent().find(".manager-template-menu-input-name").val();

        if (elVal.replace(/\s+/g, "") != "" && elName.replace(/\s+/g, "") != "")
        {
            set.push({ Link: elVal, Name: elName });
        }
    });

    ManagerAddsSystem.OrkutManager.UserSettingsObject["MenuDD"] = set;
    ManagerAddsSystem.OrkutManager.SetSetting("MenuDD", set);
};
OMConfig.SaveModerationTemplate = function ()
{
    (function ()
    {
        var set = ManagerAddsSystem.OrkutManager.UserSettingsObject["ModerationText"];

        set = $(".manager-config-window [name='ModerationText']").val();

        // prevent bogus behavior
        set = set.replace(/\<br\>/gi, "\n");

        ManagerAddsSystem.OrkutManager.UserSettingsObject["ModerationText"] = set;
        ManagerAddsSystem.OrkutManager.SetSetting("ModerationText", set);
    })();
};


OMConfig.ImportLegacy = function (settings, type)
{
    function getSetting(name)
    {
        if (type == "om")
        {
            var value = unescape(settings.filter(function (e) { return e.split(",")[0].toLowerCase() == name.toLowerCase(); })[0].split(",")[1]);
            value = (value == "true") ? true : value;
            value = (value == "false") ? false : value;
            if (parseInt(value)) value = parseInt(value);

            return value;
        }
        else
        {
            return settings[name];
        }
    }

    with (ManagerAddsSystem.OrkutManager.UserSettingsObject)
    {
        console.log("Settings to import ( " + type + " )");
        console.log(settings);

        if (type == "om")
        {
            settings.Language = getSetting("Language");
            settings.omEmailHide = getSetting("omEmailHide");
            settings.omEnableMenuDD = getSetting("omEnableMenuDD");
            settings.omEnableBookmarks = getSetting("omEnableBookmarks");
            settings.omMassDelete = getSetting("omMassDelete");
            settings.omFonts = getSetting("omFonts");
            settings.EmoticonsList = getSetting("EmoticonsList");
            settings.MenuDD = getSetting("MenuDD");
            settings.Bookmarks = getSetting("Bookmarks");
            settings["Bookmarks.Topic"] = getSetting("Bookmarks.Topic");
            settings.HSignature = getSetting("HSignature");
            settings.HColorB = getSetting("HColorB");
            settings.HColorE = getSetting("HColorE");
            settings.HSignature = getSetting("HSignature");
            settings.HQuoteHeaderB = getSetting("HQuoteHeaderB");
            settings.QuoteTextHtml = getSetting("QuoteTextHtml");
            settings.HQuoteHeaderE = getSetting("HQuoteHeaderE");
            settings.HQuoteMessageB = getSetting("HQuoteMessageB");
            settings.HQuoteMessageE = getSetting("HQuoteMessageE");

        }

        Language = settings.Language.substring(0, 2);
        Features.EmailHide = settings.omEmailHide;
        Features.MenuDropdown = settings.omEnableMenuDD;
        Features.Favorites = settings.omEnableBookmarks;
        Features.MultiDelete = settings.omMassDelete;

        Fonts = [];
        var omFonts = settings.omFonts.split("|");
        for (var i in omFonts)
        {
            var font = unescape(omFonts[i]);
            Fonts.push(font);
        }
        delete omFonts;

        IconCollection = [];
        settings.EmoticonsList = JSON.parse(settings.EmoticonsList);
        for (var emoticon in settings.EmoticonsList)
        {
            var icon =
            {
                Link: settings.EmoticonsList[emoticon],
                Code: emoticon
            };

            IconCollection.push(icon);
        }

        MenuDD = [];
        settings.MenuDD = JSON.parse(settings.MenuDD);
        for (var i in settings.MenuDD)
        {
            var str = settings.MenuDD[i].split("|");
            var name = unescape(str[0]);
            var link = unescape(str[1]);

            MenuDD.push({ Name: name, Link: link });
        }

        Favorites = [];

        Favorites.Favoritos = [];
        settings.Bookmarks = JSON.parse(settings.Bookmarks);
        for (var i in settings.Bookmarks)
        {
            var bk = settings.Bookmarks[i].split("|");
            var id = unescape(bk[0]);
            var name = unescape(bk[1]);
            Favorites.Favoritos.push({ Type: 0, Name: name, Link: "#Main?cmm=" + id, Image: "" });
        }
        settings["Bookmarks.Topic"] = JSON.parse(settings["Bookmarks.Topic"]);
        for (var i in settings["Bookmarks.Topic"])
        {
            var bk = settings["Bookmarks.Topic"][i].split("|");
            var id = unescape(bk[0]);
            var cmm = id.split("~")[0];
            var tid = id.split("~")[1];
            var name = unescape(bk[1]);
            Favorites.Favoritos.push({ Type: 1, Name: name, Link: "#Main?cmm=" + cmm + "&tid=" + tid });
        }

        TemplateText = settings.HColorB + "{|}" + settings.HColorE + "\n" + settings.HSignature;
        TemplateQuote =
            settings.HQuoteHeaderB
            + settings.QuoteTextHtml
            + settings.HQuoteHeaderE
            + settings.HQuoteMessageB
            + "{Content}"
            + settings.HQuoteMessageE;

        TemplateQuote = TemplateQuote
            .replace(/\$TPCURL\$/gi, "{TopicURL}")
            .replace(/\$POSTURL\$/gi, "{PostURL}")
            .replace(/\$USER\$/gi, "{UserName}")
            .replace(/\$TIME\$/gi, "{Time}")
            .replace(/\$UID\$/gi, "{UserID}")
            .replace(/\$CURRENTDATE\$/gi, "{CurrentDate}")
            .replace(/\$FUIMG\$/gi, "{UserImageFull}")
            .replace(/\$UIMG\$/gi, "{UserImage}")
            .replace(/\$SUBJ\$/gi, "{Subject}");
    }

    ManagerAddsSystem.OrkutManager.SetSettings(ManagerAddsSystem.OrkutManager.UserSettingsObject);

    alert("Importado com sucesso!");
    window.location.reload();
};

!function ()
{
    function LoadSettings(obj, key)
    {
        if (typeof (obj) == "object")
        {
            for (var i in obj)
            {
                LoadSettings(obj[i], key + "." + i);
            }
        }
        else
        {
            var field = document.querySelector("[name='" + key + "']");

            if (field)
            {
                if (typeof (obj) == "boolean")
                {
                    if (obj)
                        field.setAttribute("checked", obj);
                }
                else
                    field.value = obj;
            }
        }
    }

    function TriggerLoadSettings()
    {
        console.log("OM::LoadSettings");
        console.log(ManagerAddsSystem.OrkutManager.UserSettingsObject);
        for (var k in ManagerAddsSystem.OrkutManager.UserSettingsObject)
        {
            LoadSettings(ManagerAddsSystem.OrkutManager.UserSettingsObject[k], k);
        }

        //#region Image template
        (function ()
        {
            var imageItem = document.querySelector(".manager-config-window .manager-id-template-image-item");
            var imageItemClone = imageItem.cloneNode(true, true);
            imageItemClone.style.display = "block";

            imageItem.style.display = "none";

            ManagerAddsSystem.OrkutManager.UserSettingsObject["ImageCollection"].forEach(function (t)
            {
                var item = imageItemClone.cloneNode(true, true);
                item.querySelector("a").setAttribute("href", t);
                item.querySelector("img").setAttribute("src", t);
                item.querySelector("input").value = t;

                var last = document.querySelectorAll(".manager-config-window .manager-id-template-image-item");
                last = last[last.length - 1];
                last.parentNode.appendChild(item);
            });
        })();
        //#endregion

        //#region Icon template
        (function ()
        {
            var elementItem = document.querySelector(".manager-config-window .manager-id-template-icon-item");
            var elementItemClone = elementItem.cloneNode(true, true);
            elementItemClone.style.display = "block";

            elementItem.style.display = "none";

            ManagerAddsSystem.OrkutManager.UserSettingsObject["IconCollection"].forEach(function (t, i)
            {
                var item = elementItemClone.cloneNode(true, true);

                var inputs = item.querySelectorAll("input");

                item.querySelector("img").setAttribute("src", t.Link);
                inputs[0].value = t.Link;
                inputs[0].setAttribute("data-id", i);
                inputs[1].value = t.Code;
                inputs[1].setAttribute("data-id", i);

                var last = document.querySelectorAll(".manager-config-window .manager-id-template-icon-item");
                last = last[last.length - 1];
                last.parentNode.appendChild(item);
            });
        })();
        //#endregion

        //#region Message template
        (function ()
        {
            var elementItem = document.querySelector(".manager-config-window .manager-id-template-message-item");
            var elementItemClone = elementItem.cloneNode(true, true);
            elementItemClone.style.display = "block";

            elementItem.style.display = "none";

            ManagerAddsSystem.OrkutManager.UserSettingsObject["PreDefinedTemplates"].forEach(function (t, i)
            {
                var item = elementItemClone.cloneNode(true, true);
                item.querySelector("textarea").value = t;
                item.querySelector("textarea").setAttribute("data-id", i);

                var last = document.querySelectorAll(".manager-config-window .manager-id-template-message-item");
                last = last[last.length - 1];
                last.parentNode.appendChild(item);
            });
        })();

        //#endregion

        //#region Font template
        (function ()
        {
            var elementItem = document.querySelector(".manager-config-window .manager-id-template-font-item");
            var elementItemClone = elementItem.cloneNode(true, true);
            elementItemClone.style.display = "block";

            elementItem.style.display = "none";

            ManagerAddsSystem.OrkutManager.UserSettingsObject["Fonts"].forEach(function (t, i)
            {
                var item = elementItemClone.cloneNode(true, true);
                item.querySelector("input").value = t;
                item.querySelector("input").setAttribute("data-id", i);

                var last = document.querySelectorAll(".manager-config-window .manager-id-template-font-item");
                last = last[last.length - 1];
                last.parentNode.appendChild(item);
            });
        })();
        //#endregion

        //#region Menu template
        (function ()
        {
            var elementItem = document.querySelector(".manager-config-window .manager-id-template-menu-item");
            var elementItemClone = elementItem.cloneNode(true, true);
            elementItemClone.style.display = "block";

            elementItem.style.display = "none";

            ManagerAddsSystem.OrkutManager.UserSettingsObject["MenuDD"].forEach(function (t, i)
            {
                var item = elementItemClone.cloneNode(true, true);
                var inputs = item.querySelectorAll("input");
                inputs[0].value = t.Link;
                inputs[0].setAttribute("data-id", i);
                inputs[1].value = t.Name;
                inputs[1].setAttribute("data-id", i);

                var last = document.querySelectorAll(".manager-config-window .manager-id-template-menu-item");
                last = last[last.length - 1];
                last.parentNode.appendChild(item);
            });
        })();
        //#endregion
    }

    if (/manageraddons.com\/omx/i.test(window.location.href))
    {
        function Load()
        {
            var configContainer = $("#config-container");

            configContainer.empty();
            configContainer
                .addClass("manager-config manager-config-window")
                .html(
                    ManagerAddsSystem.OrkutManager.TranslateTemplate($(".manageraddons.config-page").html())
                );

            TriggerLoadSettings();
        }

        try
        {
            Load();
        }
        catch (ex) { }
        $(document).ready(Load);
    }
    else
    {
        window.addEventListener("DOMNodeInserted", function (e)
        {
            if (!/#OMConfig/i.test(window.location.hash)) return;
            if (document.querySelector(".manager-config-window")) return;

            //#region Build Page
            function BuildPage($c)
            {
                if (document.querySelector(".manager-config-window")) return;
                document.querySelector("body").style.background = "#D9E6F7";
                document.title = "Orkut Manager - Config";

                $c
                    .addClass("manager-config manager-config-window")
                    .html(
                        ManagerAddsSystem.OrkutManager.TranslateTemplate($(".manageraddons.config-page").html())
                    );

                window.setTimeout(
                    function ()
                    {
                        TriggerLoadSettings();
                    }, 130);
            }

            var mark = document.getElementById("gwtViewport");
            if (mark)
            {
                setTimeout(function ()
                {
                    BuildPage($(mark));

                    var qs = window.GetQueryString(window.location.hash.replace(/#OMConfig\?/i, ""));

                    setTimeout(function ()
                    {
                        $(document.querySelector("[href$='tab=" + qs["tab"] + "']")).click();
                    }, 100);
                }, 100);
            }
            //#endregion Build Page


        }, false);
    }

}();

$(".manager-tab-link").live("click mousedown", function (e)
{
    e.stopPropagation();
    e.stopImmediatePropagation();
    e.stopPropagation();
});

$(".manager-version-status").live("click", function (e)
{
    ManagerAddsSystem.OrkutManager.GetExtDetails(function (d)
    {
        if (!$.browser.mozilla)
            console.log(d);
        else
            ManagerAddsSystem.OrkutManager.Debug.Log(d);

        var statusContainer = document.querySelector(".manager-status-content");
        if (statusContainer.querySelector("div")) return;

        var title = document.createElement("h3");
        title.innerHTML = "Status";
        statusContainer.appendChild(title);
        statusContainer.appendChild(document.createElement("br"));

        if (d.name)
        {
            var info = document.createElement("div");
            info.innerHTML = "Extension: " + d.name;
            if (d.description)
            {
                info.title = d.description;
            }
            statusContainer.appendChild(info);
        }

        if (d.id)
        {
            var info = document.createElement("div");
            info.innerHTML = "ID: " + d.id;
            statusContainer.appendChild(info);
        }

        if (d.version)
        {
            var info = document.createElement("div");
            info.innerHTML = "Version: " + d.version;
            statusContainer.appendChild(info);
        }

        if (d.updateDate)
        {
            var info = document.createElement("div");
            info.innerHTML = "Last update: " + d.updateDate;
            statusContainer.appendChild(info);
        }

        //#region Fetch lastest version

        {
            var versionInfo = document.createElement("div");
            versionInfo.innerHTML = "Latest version: -";
            statusContainer.appendChild(versionInfo);

            ManagerAddsSystem.OrkutManager.GetLatestVersionInfo(function (response)
            {
                versionInfo.innerHTML = "Latest Version: " + response.Version;

                if (d.version != response.Version)
                {
                    $("<span>&nbsp;&nbsp;</span>")
                        .appendTo(versionInfo);
                    $("<a>")
                        .attr("target", "_blank").attr("href", response.Url)
                        .html("download latest version")
                        .appendTo(versionInfo);
                }
            });
        }

        //#endregion

        var sep = document.createElement("hr");
        statusContainer.appendChild(sep);

        var nav = unsafeWindow.navigator;

        if (nav.appVersion)
        {
            var info = document.createElement("div");
            info.innerHTML = "Browser version: " + nav.appVersion;
            statusContainer.appendChild(info);
        }
        if (nav.platform)
        {
            var info = document.createElement("div");
            info.innerHTML = "Platform: " + nav.platform;
            statusContainer.appendChild(info);
        }
        if (nav.language)
        {
            var info = document.createElement("div");
            info.innerHTML = "Language: " + nav.language;
            statusContainer.appendChild(info);
        }
        if (nav.online)
        {
            var info = document.createElement("div");
            info.innerHTML = "Availability: " + nav.online;
            statusContainer.appendChild(info);
        }
    });
});

//#region Events
$(".manager-config button[type=submit]").live("click", function (e)
{
    e.preventDefault();

    var objSettings = $(".manager-config-window form").serializeObject();

    objSettings = $.extend(ManagerAddsSystem.OrkutManager.UserSettingsObject, objSettings);

    console.log("OM::SaveConfig");
    console.log(objSettings);

    if ($.browser.mozilla)
    {
        ManagerAddsSystem.OrkutManager.PrefManager.Set("UserSettings", JSON.stringify(objSettings));
        ManagerAddsSystem.OrkutManager.UserSettings = ManagerAddsSystem.OrkutManager.LoadSettings();
    }
    else
    {
        chrome.extension.sendRequest({ Command: "SetSettings", Settings: JSON.stringify(objSettings) },
            function (response)
            {
                chrome.extension.sendRequest({ Command: "GetSettings" },
                    function (response)
                    {
                        ManagerAddsSystem.OrkutManager.UserSettingsObject = ManagerAddsSystem.OrkutManager.LoadSettings();
                    });
            });
    }

    OMConfig.SaveTextTemplate();
    OMConfig.SaveQuoteTemplate();
    OMConfig.SaveImageTemplate();
    OMConfig.SaveIcons();
    OMConfig.SaveMessageTemplate();
    OMConfig.SaveFontTemplate();
    OMConfig.SaveMenu();
    OMConfig.SaveModerationTemplate();

    unsafeWindow.alert(ManagerAddsSystem.OrkutManager.Resource("Saved!"));
});
$(".manager-config button[type=reset]").live("click", function (e)
{
    e.preventDefault();
    window.location.reload();
});

$(".manager-config .manager-import-show").live("click", function (e)
{
    $(".manager-import-container").show(0);
});

$(".manager-config button.manager-import-submit").live("click", function (e)
{
    e.preventDefault();

    var files = $(".manager-import-file").get(0).files;

    if (files.length == 0)
        return;

    var file = files[0];

    if (!/(om|om3|om4|cfg)$/i.test(file.name))
        return;

    var fileReader = new FileReader();
    fileReader.onload = function ()
    {
        var c = fileReader.result;
        var settingsObj;

        try
        {
            settingsObj = JSON.parse(c);
        }
        catch (ex)
        {
            alert("Import error: " + ex);
            return;
        }

        console.log("OM::Import");
        console.log(settingsObj);

        var type = file.name.match(/\.(om|om3|om4|cfg)$/i)[1];
        type = type.toLowerCase();

        switch (type)
        {
            case "om":
            case "om3":
            case "cfg":
                OMConfig.ImportLegacy(settingsObj, type);
                break;
            case "om4":
            default:
                ManagerAddsSystem.OrkutManager.SetSettings(settingsObj);
                break;
        }
    };
    fileReader.readAsText(file);
});

$(".manager-export-submit").live("click", function (e)
{
    e.preventDefault();

    var settings = ManagerAddsSystem.OrkutManager.UserSettingsObject;

    var blob = new Blob([JSON.stringify(settings)], { type: "text/plain;charset=UTF-8" });
    var a = document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = "config.om4";
    a.click();
});

//#region Image templates

$(".manager-template-image-newButton").live("click", function (e)
{
    var img = $(".manager-template-image-new", $(this).parent());
    var link = img.val();

    //#region Create visual Element

    var imageItem = $(".manager-config-window .manager-id-template-image-item:first");
    var imageItemClone = imageItem.clone();
    imageItemClone.css("display", "block");

    imageItem.hide(0);

    var item = imageItemClone.clone();
    item.find("a").attr("href", link);
    item.find("img").attr("src", link);
    item.find("input").val(link);
    item.insertAfter($(".manager-config-window .manager-id-template-image-item:last"));

    img.val("");

    //#endregion

    OMConfig.SaveImageTemplate();
});
$(".manager-id-template-image-item .manager-trash").live("click", function (e)
{
    var link = $(this).parent().find("img").attr("src");

    var set = ManagerAddsSystem.OrkutManager.UserSettingsObject["ImageCollection"];
    set.splice(set.indexOf(link), 1);
    ManagerAddsSystem.OrkutManager.UserSettingsObject["ImageCollection"] = set;
    ManagerAddsSystem.OrkutManager.SetSetting("ImageCollection", set);

    $(this).parent().fadeOut(500, function () { $(this).remove(); });
});

//#endregion

//#region Icon templates

$(".manager-template-icon-newButton").live("click", function (e)
{
    var valElementLink = $(".manager-template-icon-new-link", $(this).parent());
    var valElementName = $(".manager-template-icon-new-code", $(this).parent());

    var valLink = valElementLink.val();
    var valName = valElementName.val();

    if (valLink.replace(/\s+/g, "") != "" && valName.replace(/\s+/g, "") != "")
    {
        //#region Create visual Element

        var elementItem = $(".manager-config-window .manager-id-template-icon-item:first");
        var elementItemClone = elementItem.clone();
        elementItemClone.css("display", "block");

        elementItem.hide(0);

        var item = elementItemClone.clone();
        item.find("img").attr("src", valLink);
        item.find("input:eq(0)").val(valLink);
        item.find("input:eq(0)").data("id", elementItem.parent().find("input").length / 2);
        item.find("input:eq(1)").val(valName);
        item.find("input:eq(1)").data("id", elementItem.parent().find("input").length / 2);
        item.insertAfter($(".manager-config-window .manager-id-template-icon-item:last"));

        valElementLink.val("");
        valElementName.val("");

        //#endregion
    }

    OMConfig.SaveMenu();
});
$(".manager-id-template-icon-item .manager-trash").live("click", function (e)
{
    var id = $(this).parent().find("input").data("id");

    var set = ManagerAddsSystem.OrkutManager.UserSettingsObject["IconCollection"];
    set.splice(id, 1);
    ManagerAddsSystem.OrkutManager.UserSettingsObject["IconCollection"] = set;
    ManagerAddsSystem.OrkutManager.SetSetting("IconCollection", set);

    $(this).parent().fadeOut(500, function () { $(this).remove(); });
});


//#endregion

//#region Message templates

$(".manager-template-message-saveChanges").live("click", function (e)
{
    var valElement = $(".manager-template-message-new", $(this).parent());
    var val = valElement.val();

    if (val.replace(/\s+/g, "") != "")
    {
        //#region Create visual Element

        var elementItem = $(".manager-config-window .manager-id-template-message-item:first");
        var elementItemClone = elementItem.clone();
        elementItemClone.css("display", "block");

        elementItem.hide(0);

        var item = elementItemClone.clone();
        item.find("textarea").val(val);
        item.find("textarea").data("id", elementItem.parent().find("textarea").length);
        item.insertAfter($(".manager-config-window .manager-id-template-message-item:last"));

        valElement.val("");

        //#endregion
    }

    OMConfig.SaveMessageTemplate();
});
$(".manager-id-template-message-item .manager-trash").live("click", function (e)
{
    var id = $(this).parent().find("textarea").data("id");

    var set = ManagerAddsSystem.OrkutManager.UserSettingsObject["PreDefinedTemplates"];
    set.splice(id, 1);
    ManagerAddsSystem.OrkutManager.UserSettingsObject["PreDefinedTemplates"] = set;
    ManagerAddsSystem.OrkutManager.SetSetting("PreDefinedTemplates", set);

    $(this).parent().fadeOut(500, function () { $(this).remove(); });
});

//#endregion

//#region Font templates

$(".manager-template-font-saveChanges").live("click", function (e)
{
    var valElement = $(".manager-template-font-new", $(this).parent());
    var val = valElement.val();

    if (val.replace(/\s+/g, "") != "")
    {
        //#region Create visual Element

        var elementItem = $(".manager-config-window .manager-id-template-font-item:first");
        var elementItemClone = elementItem.clone();
        elementItemClone.css("display", "block");

        elementItem.hide(0);

        var item = elementItemClone.clone();
        item.find("input").val(val);
        item.find("input").data("id", elementItem.parent().find("input").length);
        item.insertAfter($(".manager-config-window .manager-id-template-font-item:last"));

        valElement.val("");

        //#endregion
    }

    OMConfig.SaveFontTemplate();
});
$(".manager-id-template-font-item .manager-trash").live("click", function (e)
{
    var id = $(this).parent().find("input").data("id");

    var set = ManagerAddsSystem.OrkutManager.UserSettingsObject["Fonts"];
    set.splice(id, 1);
    ManagerAddsSystem.OrkutManager.UserSettingsObject["Fonts"] = set;
    ManagerAddsSystem.OrkutManager.SetSetting("Fonts", set);

    $(this).parent().fadeOut(500, function () { $(this).remove(); });
});

//#endregion

//#region Menu templates

$(".manager-template-menu-saveChanges").live("click", function (e)
{
    var valElementLink = $(".manager-template-menu-new-link", $(this).parent());
    var valElementName = $(".manager-template-menu-new-name", $(this).parent());

    var valLink = valElementLink.val();
    var valName = valElementName.val();

    if (valLink.replace(/\s+/g, "") != "" && valName.replace(/\s+/g, "") != "")
    {
        //#region Create visual Element

        var elementItem = $(".manager-config-window .manager-id-template-menu-item:first");
        var elementItemClone = elementItem.clone();
        elementItemClone.css("display", "block");

        elementItem.hide(0);

        var item = elementItemClone.clone();
        item.find("input:eq(0)").val(valLink);
        item.find("input:eq(0)").data("id", elementItem.parent().find("input").length / 2);
        item.find("input:eq(1)").val(valName);
        item.find("input:eq(1)").data("id", elementItem.parent().find("input").length / 2);
        item.insertAfter($(".manager-config-window .manager-id-template-menu-item:last"));

        valElementLink.val("");
        valElementName.val("");

        //#endregion
    }

    OMConfig.SaveMenu();
});
$(".manager-id-template-menu-item .manager-trash").live("click", function (e)
{
    var id = $(this).parent().find("input").data("id");

    var set = ManagerAddsSystem.OrkutManager.UserSettingsObject["MenuDD"];
    set.splice(id, 1);
    ManagerAddsSystem.OrkutManager.UserSettingsObject["MenuDD"] = set;
    ManagerAddsSystem.OrkutManager.SetSetting("MenuDD", set);

    $(this).parent().fadeOut(500, function () { $(this).remove(); });
});

//#endregion

$(".manager-config-window .manager-edit").live("click", function (e)
{
    e.preventDefault();
    var p = $(this).parent().get(0);
    var f = p.querySelector("input");
    if (!f) f = p.querySelector("textarea");

    if (!f) return;

    f.focus();
});

//#endregion Events
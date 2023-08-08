/// <reference path="../bin/jquery-1.7.1.min.js" />

window.addEventListener("DOMNodeInserted", function(e) {
    if (e && e.target && e.target.tagName)
    {
        var postTitle = document.querySelector("a[href^='#CommMsgs?cmm=']");
        if (!postTitle || !postTitle.tagName) return;

        var commandController = $(postTitle).parent().next("div").get(0);
        if (commandController)
            commandController = commandController.firstChild;
        if (!commandController || !commandController.getAttribute || commandController.getAttribute("manager-parsed")) return;
        commandController.setAttribute("manager-parsed", true);

        var commandBars = document.querySelectorAll("." + commandController.className);
        var topCommandBar = commandBars[0];
        var bottomCommandBar = commandBars[1];
        var viewAllTopics = bottomCommandBar.querySelector("a[href^='#CommTopics?cmm=']");

        //#region Refresh button

        var refresh = document.createElement("a");
        refresh.className = "manager-parsed";
        refresh.innerHTML = ManagerAddsSystem.OrkutManager.Resource("refresh");
        refresh.style.padding = "0 6px";
        refresh.setAttribute("href", window.location.href);

        bottomCommandBar.appendChild(refresh);

        //#endregion

        //#region Delete multiple posts
        
        var postTitle = document.querySelector("a[href^='#CommMsgs?cmm=']");
        if (postTitle)
        {
            var modButtons = postTitle.parentNode.querySelectorAll("span button");
            var isModerator = modButtons.length >= 3;

            if (isModerator)
            {
                var modSetMod = document.createElement("button");
                var modDeleteAll = document.createElement("button");
                var modCheckAll = document.createElement("input");
                var modDeleteSelected = document.createTextNode(" " + ManagerAddsSystem.OrkutManager.Resource("Delete"));

                modSetMod.innerHTML = "Mod";
                modSetMod.addEventListener("click", function (e)
                {
                    if (confirm(ManagerAddsSystem.OrkutManager.Resource("Set post as moderation log?")))
                    {
                        var cmm = window.QueryString["cmm"];
                        var tid = window.QueryString["tid"];

                        ManagerAddsSystem.OrkutManager.PushUniqueSetting("ModTopics", { Cmm: cmm, Tid: tid }, function (v) { return v.Cmm == cmm });
                    }
                });

                modDeleteAll.addEventListener("click", function(ce) {
                    [].forEach.call(document.querySelectorAll(".manager-checkbox[title]:checked"), function(el) {
                        $(el.parentNode.querySelector(".manager-trash-button")).mclick();
                    });
                }, false);

                modCheckAll.setAttribute("type", "checkbox");
                modCheckAll.className = "manager-checkbox manager-checkbox-delete-all";
                modCheckAll.addEventListener("click", function(ce) {
                    ce.stopImmediatePropagation();

                    var checked = modCheckAll.checked;
                    [].forEach.call(document.querySelectorAll(".manager-checkbox[title]"), function(el) {
                        el.checked = checked;
                    });
                }, false);

                modDeleteAll.appendChild(modCheckAll);
                modDeleteAll.appendChild(modDeleteSelected);

                modButtons[0].parentNode.appendChild(modDeleteAll);

                var s = ManagerAddsSystem.OrkutManager.UserSettingsObject["ModTopics"] || [];
                if (!s.filter(function(v) { return v.Tid == window.QueryString["tid"]; }).length)
                    modButtons[0].parentNode.appendChild(modSetMod);
            }
        }

        //#endregion

    }
}, false);
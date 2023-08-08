/// <reference path="../bin/jquery-1.7.1.min.js" />

if (ManagerAddsSystem.OrkutManager.UserSettingsObject["Features"]["MenuDropdown"])
{
    window.addEventListener("DOMNodeInserted", function(e) {
        if (e && e.target && e.target.tagName && e.target.tagName == "DIV")
        {
            var logo = document.querySelector("a[href*='#Home']:not([id]):not([class])");
            if (!logo) return;
            if (logo.className && logo.className.length > 2) return;

            logo.className += " manager-parsed manager-logo";

            logo.setAttribute("href", "");
            logo.style.cursor = "pointer";
            document.addEventListener("click", function(ce) {
                var menu = document.querySelector(".manager-menu-dropdown");
                if (menu)
                    menu.parentNode.removeChild(menu);
            }, false);
            logo.addEventListener("click", function(ce) {
                ce.preventDefault();
                ce.stopImmediatePropagation();
                ce.stopPropagation();

                if (logo.parentNode.querySelector(".manager-menu-dropdown")) return;

                var menuContainer = document.createElement("div");
                menuContainer.className = "manager-menu-dropdown";
                menuContainer.style.top = $(logo).offset().top + "px";
            
                var ddMenus = ManagerAddsSystem.OrkutManager.UserSettingsObject["MenuDD"] || [];

                ddMenus.forEach(function(menu) {
                    var item = document.createElement("a");

                    item.innerHTML = menu.Name;
                    item.setAttribute("href", menu.Link);

                    menuContainer.appendChild(item);
                });
            
                logo.parentNode.appendChild(menuContainer);
            }, false);
        }
    }, false);
}
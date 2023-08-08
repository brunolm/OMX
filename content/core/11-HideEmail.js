/// <reference path="../bin/jquery-1.7.1.min.js" />

if (ManagerAddsSystem.OrkutManager.UserSettingsObject["Features"]["HideEmail"])
{
    window.addEventListener("DOMNodeInserted", function(e) {
        if (e && e.target && e.target.tagName && e.target.tagName == "DIV")
        {
            var logout = document.querySelector("a.gwt-Anchor[href$='cmd=logout']");
            if (!logout) return;
        
            var rightMenuContainer = logout.parentNode;
        
            var email = rightMenuContainer.querySelector("span");

            if (/manager-parsed/i.test(email.className)) return;

            email.className += " manager-user-email manager-parsed";
            setTimeout(function() {
                email.setAttribute("title", email.innerHTML);
                email.setAttribute("data-hidden", true);
                email.innerHTML = email.innerHTML.substring(0, 2) + "...";
                email.addEventListener("click", function(ce) {
                    if (email.getAttribute("data-hidden") == "true")
                    {
                        email.setAttribute("data-hidden", null);
                        email.innerHTML = email.getAttribute("title");
                    }
                    else
                    {
                        email.setAttribute("data-hidden", true);
                        email.innerHTML = email.innerHTML.substring(0, 2) + "...";
                    }
                }, false);
            }, 200);
        }
    }, false);
}
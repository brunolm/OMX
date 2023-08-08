/// <reference path="03-Pages.js" />
/// <reference path="../bin/jquery-1.7.1.min.js" />

$.HideBox = function ()
{
    var overlay = document.querySelector(".manager-overlay");
    if (overlay)
        overlay.style.display = "none";
    [].forEach.call(document.querySelectorAll(".manager-layered"), function(el) { el.style.display = "none"; });
    [].forEach.call(document.querySelectorAll(".manager-layered-remove,.manager-box-remove"), function(el) { try { el.parentNode.removeChild(el); } catch (ex) { } });
};

// Close boxes
$(window).kb(
{
    Callback: function() {
    // manager-box-remove manager-addons-helpbox
        $.HideBox();
    },
    Keys: ["esc"]
});
$(".manager-box-remove,.manager-box-hide").live("click", $.HideBox);

if (ManagerAddsSystem.OrkutManager.UserSettingsObject["Features"]["Shortcut"])
{

    //#region Navigation

    $(window).kb(
        {
            Callback:
                function()
                {
                    unsafeWindow.location.href = window.Pages.Home;
                },
            Keys: ["g", "h"],
            Activation: $.kb.Activation.NoInputOnly
        }
    );

    $(window).kb(
        {
            Callback:
                function()
                {
                    unsafeWindow.location.href = window.Pages.Profile;
                },
            Keys: ["g", "p"],
            Activation: $.kb.Activation.NoInputOnly
        }
    );

    $(window).kb(
        {
            Callback:
                function()
                {
                    unsafeWindow.location.href = window.Pages.Scraps;
                },
            Keys: ["g", "s"],
            Activation: $.kb.Activation.NoInputOnly
        }
    );
    
    $(window).kb(
        {
            Callback:
                function()
                {
                    unsafeWindow.location.href = window.Pages.Communities;
                },
            Keys: ["g", "c"],
            Activation: $.kb.Activation.NoInputOnly
        }
    );

    $(window).kb(
        {
            Callback:
                function()
                {
                    unsafeWindow.location.href = window.Pages.Notifications;
                },
            Keys: ["g", "u"],
            Activation: $.kb.Activation.NoInputOnly
        }
    );
    
    $(window).kb(
        {
            Callback:
                function()
                {
                    unsafeWindow.location.href = window.Pages.Conversations;
                },
            Keys: ["g", "o"],
            Activation: $.kb.Activation.NoInputOnly
        }
    );
    
    $(window).kb(
        {
            Callback:
                function()
                {
                    unsafeWindow.location.href = window.Pages.Reminders;
                },
            Keys: ["g", "r"],
            Activation: $.kb.Activation.NoInputOnly
        }
    );
    
    $(window).kb(
        {
            Callback:
                function()
                {
                    unsafeWindow.location.href = window.Pages.Birthdays;
                },
            Keys: ["g", "b"],
            Activation: $.kb.Activation.NoInputOnly
        }
    );
    
    $(window).kb(
        {
            Callback:
                function()
                {
                    unsafeWindow.location.href = window.Pages.Photos;
                },
            Keys: ["g", "f"],
            Activation: $.kb.Activation.NoInputOnly
        }
    );
    
    $(window).kb(
        {
            Callback:
                function()
                {
                    unsafeWindow.location.href = window.Pages.Videos;
                },
            Keys: ["g", "v"],
            Activation: $.kb.Activation.NoInputOnly
        }
    );
    
    $(window).kb(
        {
            Callback:
                function()
                {
                    unsafeWindow.location.href = window.Pages.Testimonials;
                },
            Keys: ["g", "t"],
            Activation: $.kb.Activation.NoInputOnly
        }
    );
    
    $(window).kb(
        {
            Callback:
                function()
                {
                    unsafeWindow.location.href = window.Pages.Applications;
                },
            Keys: ["g", "a"],
            Activation: $.kb.Activation.NoInputOnly
        }
    );
    
    $(window).kb(
        {
            Callback:
                function()
                {
                    unsafeWindow.location.href = window.Pages.Promote;
                },
            Keys: ["g", "m"],
            Activation: $.kb.Activation.NoInputOnly
        }
    );

    //#endregion

    //#region Commands
    
    $(window).kb(
        {
            Callback:
                function()
                {
                    var visible = $(document.querySelector(".manager-editor-iframe")).parent().is(":visible");
                    if (visible) return;
                    document.querySelector(".manager-post-submit").click();
                },
            Keys: ["r"],
            Activation: $.kb.Activation.NoInputOnly
        }
    );

    $(window).kb(
        {
            Callback:
                function(e)
                {
                    if (e.altKey) return;

                    var pageLink = document.querySelector("[href^='#CommMsgs'][href*=nid]");
                    if (!pageLink) return;
                    var paginator = pageLink.parentNode;
                    var first = paginator.children[0];
                    var prev = paginator.children[1];

                    if (e.ctrlKey && first.tagName == "A")
                    {
                        window.location.href = first.href;
                    }
                    else if (!e.ctrlKey && prev.tagName == "A")
                    {
                        window.location.href = prev.href;
                    }
                },
            Keys: ["left"],
            Activation: $.kb.Activation.NoInputOnly
        }
    );
    $(window).kb(
        {
            Callback:
                function(e)
                {
                    if (e.altKey) return;

                    var pageLink = document.querySelector("[href^='#CommMsgs'][href*=nid]");
                    if (!pageLink) return;
                    var paginator = pageLink.parentNode;
                    var next = paginator.children[3];
                    var last = paginator.children[4];
                    
                    if (e.ctrlKey && last.tagName == "A")
                    {
                        window.location.href = last.href;
                    }
                    else if (!e.ctrlKey && next.tagName == "A")
                    {
                        window.location.href = next.href;
                    }
                },
            Keys: ["right"],
            Activation: $.kb.Activation.NoInputOnly
        }
    );

    $(window).kb(
        {
            Callback:
                function()
                {
                    //$.HideBox();
                    //$("#manager-addons-help-shortcuts").remove();
                    $("<div />").attr("id", "manager-addons-helpbox")
                        .addClass("manager-box-remove manager-addons-helpbox")
                        .html(ManagerAddsSystem.OrkutManager.TranslateTemplate($(".manageraddons.helpbox").html()))
                        .prependTo($("body"));
                },
            Keys: ["?"],
            Activation: $.kb.Activation.NoInputOnly
        }
    );

    //#endregion
}

window.addEventListener("keydown", function(e) {
    if (e.ctrlKey && e.shiftKey && e.keyCode == 112) // ctrl-shift-f1
    {
        e.preventDefault();
        var url = window.location.protocol + "//" + window.location.host + "/Main#OMConfig";

        if (gBrowser)
        {
            content.open(url);
        }
        else
        {
            unsafeWindow.open(url);
        }
    }
}, false);
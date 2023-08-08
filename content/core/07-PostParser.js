/// <reference path="../bin/jquery-1.7.1.min.js" />

window.addEventListener("DOMNodeInserted", function(e) {
    if (e && e.target && e.target.tagName && e.target.tagName == "DIV")
    {
        var postTitle = document.querySelector("a[href^='#CommMsgs?cmm=']");
        if (!postTitle || !postTitle.tagName) return;


        var bts = document.querySelector("a[href^='#CommMsgs?cmm=']").parentNode.parentNode.querySelectorAll("button[class][type='button']");
        var post = bts[bts.length - 1];
        var cancel;
        if (post && !/manager-post-submit/i.test(post.className))
        {
            post.className += " manager-post-submit";

            cancel = $(post).next("button").get(0);
            if (cancel)
                cancel.className += " manager-post-cancel";
        }


        var isModerator = postTitle.parentNode.querySelectorAll("span button").length >= 3;

        //#region Moderation
        var qs = window.QueryString;
        if ((qs["cmm"] && qs["tid"] && qs["action"] == "mod")
            && ManagerAddsSystem.OrkutManager.UserSettingsObject["_Mod"])
        {
            if (cancel)
            {
                if (!$(cancel).data("manager-mod-clicked"))
                {
                    setTimeout(function ()
                    {
                        $(cancel).mclick();
                    }, 300);
                }

                $(cancel).data("manager-mod-clicked", true);
            }
        }
        //#endregion


        var postContainer = $(postTitle).parent().next("div").find(">div:eq(1)").get(0);
        if (!postContainer) return;
        //if (/manager-stream-container/i.test(postContainer.className)) return;

        if (!/manager-stream-container/i.test(postContainer.className))
            postContainer.className += " manager-stream-container";
        
        var isPostContainerParent = /manager-stream-container/i.test(e.target.parentNode.className);
        if (postContainer || isPostContainerParent)
        {
            var posts = document.querySelectorAll(".manager-stream-container > div:not([class*='manager-parsed'])");
            [].forEach.call(posts, function(el, i) {
                if (!/manager-parsed/i.test(el.className))
                {
                    el.className += " manager-stream-item manager-parsed";

                    //#region Quote button
                    if (ManagerAddsSystem.OrkutManager.UserSettingsObject["Features"]["Quote"])
                    {
                        var quoteButton = el.querySelectorAll("a");
                        quoteButton = quoteButton[quoteButton.length - 1];
                    
                        var quoteClone = unsafeWindow.document.createElement("a");
                        quoteClone.className = "manager-quote-button";
                        quoteClone.title = "OM: " + quoteButton.innerText;
                        quoteClone.innerHTML = quoteButton.innerHTML + " (OM) ";
                        quoteClone.style.marginRight = "10px";

                        quoteButton.parentNode.insertBefore(quoteClone, quoteButton);
                        //quoteButton.parentNode.removeChild(quoteButton);
                    }
                    //#endregion

                    var postIndex = parseInt(window.GetQueryString(window.location.hash.substring(1)).post);
                    postIndex = postIndex == -1 ? 10 : postIndex;
                    if ((i + 1) == postIndex)
                    {
                        el.className += " manager-stream-item-selected";
                        setTimeout(function() {
                            var p = el;
                            var t = 0;
                            while (p.parentNode){
                               t += p.offsetTop;
                               p = p.parentNode;
                            }
                            unsafeWindow.scrollTo(0, t - 160);
                        }, 200);
                    }

                    var postContent = el.querySelectorAll("div[class]");
                    postContent = postContent[postContent.length - 1];

                    postContent.innerHTML = postContent.innerHTML.replace(/<wbr>/gi, "");
                
                    var links = postContent.querySelectorAll("span[title*='om-link']");

                    [].forEach.call(links, function(fakeLink) {
                        if (/^https?/i.test(fakeLink.innerHTML))
                        {
                            var link = document.createElement("a");
                            var href = fakeLink.innerHTML.replace(/&nbsp;&nbsp;/i, ":").replace(/&nbsp;/gi, ".");
                            link.setAttribute("href", href);
                            link.setAttribute("title", fakeLink.getAttribute("title").replace("om-link", ""));
                            link.innerHTML = href;
                            fakeLink.parentNode.replaceChild(link, fakeLink);
                        }
                    });

                    var optionsButton = el.querySelector("a[id][class][href^='javascript']");

                    var trashButton = el.querySelector("div[class] > div[id][class][title]");
                    trashButton.className += " manager-trash-button";

                    //#region Moderator specific

                    if (ManagerAddsSystem.OrkutManager.UserSettingsObject["Features"]["MultiDelete"])
                    {
                        if (isModerator)
                        {
                            //#region Delete
                            var trashCheckBox = document.createElement("input");
                            trashCheckBox.setAttribute("type", "checkbox");
                            trashCheckBox.setAttribute("title", "delete");
                            trashCheckBox.style.float = "right";
                            trashCheckBox.style.margin = "0 0 0 4px";
                            trashCheckBox.className = "manager-checkbox";
                            //#endregion

                            //#region Moderate post

                            var modTopic = (ManagerAddsSystem.OrkutManager.UserSettingsObject.ModTopics || [])
                                        .filter(function (e) { return e.Cmm == window.QueryString["cmm"] });
                            if (modTopic.length > 0)
                            {
                                modTopic = modTopic[0];

                                var mod = document.createElement("button");
                                mod.innerHTML = "mod";
                                mod.className = "manager-mod-button";
                                mod.addEventListener("click", function (e)
                                {
                                    var divContainer = $(this).closest("div").get(0);
                                    var userElement = divContainer.querySelector("a[href*='Profile?uid='][class]");

                                    //#region Templating
                                    // TODO: repeated code, create a function
                                    var userName = userElement.innerHTML;
                                    var userLink = userElement.getAttribute("href");
                                    userLink = userLink.replace(/^Main/i, "");
                                    var userImage = divContainer.parentNode.querySelector("a[href*='#Profile?uid'] div").innerHTML;
                                    var userID = userLink.replace(/[^\d]/g, "");
                                    var timeString = divContainer.querySelector("span[id][class][title]").getAttribute("title");
                                    var time = new Date(timeString);
                                    if (isNaN(time.getDate()))
                                    {
                                        time = new Date(timeString.replace(/(\d{2})\/(\d{2})\/(\d{4}).*/, "$2/$1/$3"));
                                    }
                                    time = ManagerAddsSystem.OrkutManager.DateHelper.Format(time, ManagerAddsSystem.OrkutManager.UserSettingsObject.TimeFormat);

                                    var topicUrl = $(".manager-link-topic:first").attr("href");
                                    var postUrl = window.location.href;
                                    var currentDate = ManagerAddsSystem.OrkutManager.DateHelper.Format(new Date(), ManagerAddsSystem.OrkutManager.UserSettingsObject.TimeFormat);
                                    var subject = $(userElement).nextAll("div");
                                    if (subject.length == 3)
                                    {
                                        subject = subject.first().text();
                                    }
                                    else
                                    {
                                        subject = "";
                                    }
                                    var contents = $(divContainer).find(">div:not([class*='manager-'])");
                                    var content = contents.get(0).innerHTML;


                                    var modal = document.createElement("div");
                                    var w = 720;
                                    var h = 450;

                                    $(".manager-modal").remove();


                                    modal.className = "manager-modal manager-layered-remove manager-moderation-panel";
                                    OrkutEditor.CenterElement(modal, w, h);


                                    var modalContainer = $("<div>");

                                    $("<h3>").html("Mod " + userName + " (" + userID + ") - " + subject).appendTo(modalContainer);

                                    //#region Moderation Actions

                                    var actionsFieldset = $("<fieldset>").addClass("manager-moderation-actions");
                                    var actionsLegend = $("<legend>").html(ManagerAddsSystem.OrkutManager.Resource("Actions"));
                                    var actionsContainer = $("<div>");

                                    actionsLegend.appendTo(actionsFieldset);
                                    actionsContainer.appendTo(actionsFieldset);
                                    actionsFieldset.appendTo(modalContainer);


                                    function GetOrkutModPopup(e)
                                    {
                                        if (e && e.target && e.target && $(e.target).css("left") && $(e.target).css("top") && $(e.target).css("visibility"))
                                        {
                                            $(e.target).css({ position: "inherit", left: 0, top: 0 }).appendTo(actionsContainer);

                                            document.removeEventListener("DOMNodeInserted", GetOrkutModPopup, !1);
                                        }
                                    }

                                    document.addEventListener("DOMNodeInserted", GetOrkutModPopup, false);
                                    $(mod).parent().find("a[href*=javascript]:first").get(0).click();

                                    //#endregion

                                    //#region Moderation Reasons

                                    //var actionsChkDeletePost = $("<input type='checkbox'>").attr("name", "ModDeletePost");


                                    var reasonsFieldset = $("<fieldset>").addClass("manager-moderation-reasons");
                                    var reasonsLegend = $("<legend>").html(ManagerAddsSystem.OrkutManager.Resource("Log")).appendTo(reasonsFieldset);
                                    var reasonsContainer = $("<div>");

                                    var actionsChkDeletePost = $("<input type='checkbox' name='ModActionDeletePost' />").prependTo($("<label>").text(" " + ManagerAddsSystem.OrkutManager.Resource("Deleted post"))).parent();
                                    var actionsChkClosePost = $("<input type='checkbox' name='ModActionClosePost' />").prependTo($("<label>").text(" " + ManagerAddsSystem.OrkutManager.Resource("Closed post"))).parent();
                                    var actionsChkMovePost = $("<input type='checkbox' name='ModActionMovePost' />").prependTo($("<label>").text(" " + ManagerAddsSystem.OrkutManager.Resource("Moved post"))).parent();
                                    var actionsChkRemoveUser = $("<input type='checkbox' name='ModActionRemoveUser' />").prependTo($("<label>").text(" " + ManagerAddsSystem.OrkutManager.Resource("Removed user"))).parent();
                                    var actionsChkBanUser = $("<input type='checkbox' name='ModActionBanUser' />").prependTo($("<label>").text(" " + ManagerAddsSystem.OrkutManager.Resource("Banned user"))).parent();

                                    var reasonsTextTitle = $("<button>" + ManagerAddsSystem.OrkutManager.Resource("Bad title") + "</button>");
                                    var reasonsTextOffTopic = $("<button>" + ManagerAddsSystem.OrkutManager.Resource("Off topic") + "</button>");
                                    var reasonsTextOfensive = $("<button>" + ManagerAddsSystem.OrkutManager.Resource("Ofensive") + "</button>");
                                    var reasonsTextSpam = $("<button>" + ManagerAddsSystem.OrkutManager.Resource("Spam") + "</button>");


                                    function setReason(e)
                                    {
                                        var text = $(e.target).html();

                                        $(e.target).parent().find("textarea").val(text);
                                    }

                                    actionsChkDeletePost.appendTo(reasonsContainer);
                                    actionsChkClosePost.appendTo(reasonsContainer);
                                    actionsChkMovePost.appendTo(reasonsContainer);
                                    actionsChkRemoveUser.appendTo(reasonsContainer);
                                    actionsChkBanUser.appendTo(reasonsContainer);

                                    var reasonsInput = $("<textarea>").attr("id", "manager-mod-reasonsInput");

                                    reasonsInput.data("actions", []);
                                    reasonsContainer.find(":checkbox").click(function (ce)
                                    {
                                        var actions = reasonsInput.data("actions") || [];
                                        var labelText = $(this).parent().text();

                                        if ($(this).is(":checked"))
                                        {
                                            actions.push(labelText);
                                        }
                                        else
                                        {
                                            actions.splice(actions.indexOf(labelText), 1);
                                        }

                                        reasonsInput.data("actions", actions);
                                    });



                                    $("<br>").appendTo(reasonsContainer);

                                    reasonsTextTitle.click(setReason);
                                    reasonsTextOffTopic.click(setReason);
                                    reasonsTextOfensive.click(setReason);
                                    reasonsTextSpam.click(setReason);

                                    reasonsTextTitle.appendTo(reasonsContainer);
                                    reasonsTextOffTopic.appendTo(reasonsContainer);
                                    reasonsTextOfensive.appendTo(reasonsContainer);
                                    reasonsTextSpam.appendTo(reasonsContainer);
                                    reasonsInput.appendTo(reasonsContainer);

                                    reasonsContainer.appendTo(reasonsFieldset);

                                    reasonsFieldset.appendTo(modalContainer);

                                    //#endregion


                                    var modalActionsContainer = $("<div>").css("text-align", "right");
                                    var btnModPost = $("<button>").html(ManagerAddsSystem.OrkutManager.Resource("Post")).click(function ()
                                    {
                                        var modMessage = ManagerAddsSystem.OrkutManager.UserSettingsObject["ModerationText"];

                                        //#region Template

                                        modMessage = ManagerAddsSystem.OrkutManager.ParseTextTemplate(modMessage
                                            , userName
                                            , userLink
                                            , userImage
                                            , userID
                                            , time
                                            , content
                                            , topicUrl
                                            , postUrl
                                            , currentDate
                                            , subject);

                                        //modMessage = modMessage
                                        //    .replace(/\{UserName\}/ig, userName)
                                        //    .replace(/\{UserLink\}/ig, userLink)
                                        //    .replace(/\{UserImageFull\}/ig, userImage.replace(/small/i, "medium"))
                                        //    .replace(/\{UserImage\}/ig, userImage)
                                        //    .replace(/\{UserID\}/ig, userID)
                                        //    .replace(/\{Time\}/ig, time)
                                        //    .replace(/\{Content\}/ig, content)
                                        //    .replace(/\{TopicURL\}/ig, topicUrl)
                                        //    .replace(/\{PostURL\}/ig, postUrl)
                                        //    .replace(/\{CurrentDate\}/ig, currentDate)
                                        //    .replace(/\{Subject\}/ig, subject)
                                        //;
                                        //#endregion

                                        var modInput = $("#manager-mod-reasonsInput");
                                        var modActions = (modInput.data("actions") || []).join(", ");
                                        var modReasons = modInput.get(0).value || "";

                                        modMessage = modMessage
                                            .replace(/\{ModActions\}/ig, modActions)
                                            .replace(/\{ModReasons\}/ig, modReasons);

                                        ManagerAddsSystem.OrkutManager.SetSetting("_Mod", modMessage);
                                        window.open("/Main#CommMsgs?cmm=" + modTopic.Cmm + "&tid=" + modTopic.Tid + "&na=2&action=mod");
                                    });
                                    var btnModCancel = $("<button>").html(ManagerAddsSystem.OrkutManager.Resource("Close")).click(function ()
                                    {
                                        unsafeWindow.Manager.Overlay.click();
                                    });

                                    btnModPost.appendTo(modalActionsContainer);
                                    btnModCancel.appendTo(modalActionsContainer);
                                    modalActionsContainer.appendTo(modalContainer);

                                    modalContainer.appendTo(modal);

                                    unsafeWindow.Manager.Overlay.style.display = "";
                                    document.body.appendChild(modal);


                                    //unsafeWindow.Manager.Overlay.style.display = "none";
                                    //if (modal && modal.parentNode)
                                    //    modal.parentNode.removeChild(modal);

                                }, !1);

                                trashButton.parentNode.insertBefore(mod, trashButton.nextSibling);
                            }
                            //#endregion

                            trashButton.parentNode.insertBefore(trashCheckBox, trashButton.nextSibling);
                        }
                    }

                    //#endregion
                }

            });
        }
    }
}, false);



//#region Quote
                
if (ManagerAddsSystem.OrkutManager.UserSettingsObject["Features"]["Quote"])
{
    $(".manager-stream-item .manager-quote-button").live("mousedown", function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
        var quoteButton = this.parentNode.parentNode;
        var $this = $(this);

        var bts = document.querySelector("a[href^='#CommMsgs?cmm=']").parentNode.parentNode.querySelectorAll("button[class][type='button']");
        var post = bts[bts.length-1];
        
        var visible = $(document.querySelector(".manager-editor-iframe")).parent().is(":visible");

        if (!visible)
        {
            document.querySelector(".manager-post-submit").click();
        }

        setTimeout(function() {
            var iframe = document.querySelector(".manager-editor-iframe");
            var editor = iframe.contentDocument;
            var tas = iframe.parentNode.querySelectorAll("textarea");

            iframe.focus();


            var userElement = quoteButton.querySelector("a[href*='Profile?uid='][class]");

            var userName = userElement.innerHTML;
            var userLink = userElement.getAttribute("href");
            userLink = userLink.replace(/^Main/i, "");
            var userImage = quoteButton.parentNode.parentNode.querySelector("a[href*='#Profile?uid'] div").innerHTML;
            var userID = userLink.replace(/[^\d]/g, "");
            var timeString = quoteButton.parentNode.querySelector("span[id][class][title]").getAttribute("title");
            var time = new Date(timeString);
            var topicUrl = $(".manager-link-topic:first").attr("href");
            var postUrl = window.location.href;
            var currentDate = ManagerAddsSystem.OrkutManager.DateHelper.Format(new Date(), ManagerAddsSystem.OrkutManager.UserSettingsObject.TimeFormat);
            var subject = $(userElement).nextAll("div");
            if (subject.length == 3)
            {
                subject = subject.first().text();
            }
            else
            {
                subject = "";
            }



            if (isNaN(time.getDate()))
            {
                time = new Date(timeString.replace(/(\d{2})\/(\d{2})\/(\d{4}).*/, "$2/$1/$3"));
            }
            time = ManagerAddsSystem.OrkutManager.DateHelper.Format(new Date(timeString), ManagerAddsSystem.OrkutManager.UserSettingsObject.TimeFormat);

            var contents = $(quoteButton).find(">div:not([class*='manager-'])");
            var content = "";
            
            if (!e.altKey)
            {
                content = contents.get(0).innerHTML || "";
                if (!contents.get(1).querySelector("[id*='gwt']"))
                {
                    content += "<br>" + contents.get(1).innerHTML;
                }
            }
            else // e.altKey (partial quote)
            {
                var selectionPost = $(window.getSelection().anchorNode).closest("div[class]").parent();
                var isOwned = selectionPost.find($this).length > 0;
                if (!isOwned)
                {
                    return;
                }

                content = window.getSelection().toString();
            }


            var quoteMessage = ManagerAddsSystem.OrkutManager.UserSettingsObject["TemplateQuote"];

            //#region Template

            quoteMessage = ManagerAddsSystem.OrkutManager.ParseTextTemplate(quoteMessage
                , userName
                , userLink
                , userImage
                , userID
                , time
                , content
                , topicUrl
                , postUrl
                , currentDate
                , subject);

            //quoteMessage = quoteMessage
            //    .replace(/\{UserName\}/ig, userName)
            //    .replace(/\{UserLink\}/ig, userLink)
            //    .replace(/\{UserImageFull\}/ig, userImage.replace(/small/i, "medium"))
            //    .replace(/\{UserImage\}/ig, userImage)
            //    .replace(/\{UserID\}/ig, userID)
            //    .replace(/\{Time\}/ig, time)
            //    .replace(/\{Content\}/ig, content)
            //    .replace(/\{TopicURL\}/ig, topicUrl)
            //    .replace(/\{PostURL\}/ig, postUrl)
            //    .replace(/\{CurrentDate\}/ig, currentDate)
            //    .replace(/\{Subject\}/ig, subject)
            //;
            //#endregion

            // changes the editor height to accomodate extra text
            var quoteHeightCalculator = $("<div>").css("display", "none").html(quoteMessage).css("width", iframe.offsetWidth);
            quoteHeightCalculator.appendTo($("body"));
            var height = quoteHeightCalculator.height();
            quoteHeightCalculator.remove();
            iframe.style.height = (parseInt(height) + 50) + "px";


            editor.body.focus();
            if (!quoteMessage || quoteMessage.length < 1) quoteMessage = ".";
            editor.execCommand("insertHTML", false, quoteMessage);
            editor.body.focus();

            setTimeout(function() {
                tas[tas.length-1].focus();
                iframe.focus();
                editor.body.focus();
            }, 250);

        }, 320);
    });
}
//#endregion

//#region Post parsing

$(".manager-post-submit").live("mousedown keydown", function(e) {
    if (e.type == "keydown" && e.keyCode != 13) return;

    var ifr = document.querySelector(".manager-editor-iframe");
    var idc = ifr.contentDocument;
    var ibd = idc.body;

    var c = " " + ibd.innerHTML + " ";

    c = c.replace(/(https?:\/\/[^ ]+)/gi, function(m) {
        if (/(jpg|gif|png|bmp)$/i.test(m))
        {
            var isInternal = /ggpht/i.test(m);

            if (isInternal)
                return m;

            return  "http://www.orkut.com.br/Interstitial?u=" + m;
        }

        return m; 
    });

    ManagerAddsSystem.OrkutManager.UserSettingsObject["IconCollection"].forEach(function(el, i) {
        var isInternal = /ggpht/i.test(el.Link);

        var metacharacters = /(\[|\]|\\|\^|\$|\.|\||\?|\*|\+|\(|\))/g;
        var code = "(^| |>)" + el.Code.replace(metacharacters, "\\$1") + "(<| |$)";

        var re = new RegExp(code, "gm");

        if (isInternal)
        {
            c = c.replace(re, "$1" + "<img alt='om' src='" + el.Link + "'>" + "$2");
        }
        else
        {
            c = c.replace(re, "$1" + el.Link + "$2");
        }
    });

    ibd.innerHTML = c.substring(1, c.length - 1);
});

//#endregion

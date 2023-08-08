/// <reference path="../bin/jquery-1.7.1.min.js" />

if (ManagerAddsSystem.OrkutManager.UserSettingsObject["Features"]["Favorites"])
{

var Favorite = {};

Favorite.Type = { Community: 1, Topic: 2 };

Favorite.RE = {};
Favorite.RE.IsCommunity = new RegExp("#Community\\?cmm=(\\d+)", "i");
Favorite.RE.IsTopic = new RegExp("#CommMsgs\\?cmm=\\d+\\&tid=(\\d+)", "i");

Favorite.GetValAtPropIndex = function(fav, index)
{
    var keys = GetKeys(fav);
    return fav[keys[index]];
};

Favorite.GetList = function(searchList)
{
    var list = [];

    var fav = ManagerAddsSystem.OrkutManager.UserSettingsObject["Favorites"];

    if (searchList)
    {
        fav = $(fav).filter(function(i, e) {
            return e[searchList];
        })[0];

        if (typeof(fav) != "undefined")
            fav = [ fav ];
        else
            fav = [];
    }

    fav.forEach(function(f) {
        list = list.concat(Favorite.GetValAtPropIndex(f, 0));
    });

    list = (function(array,param) {
        var i, x, test, testArray = [array[0]];
        for (i = 0; i < array.length; i++) {
            test = 0;
            for (x = 0; x < testArray.length; x++) {
                if (array[i][param] == testArray[x][param]) {
                    test = 1;
                }
            } 
            if (test === 1) {
                test = 0;
            } else {
                if(array[i][param] !== ''){
                    testArray.push(array[i]);
                }
            }
        }
        return testArray;
    })(list, "Link");

    list = Array.prototype.sort.call($.unique(list), function(l, r) { return l.Name > r.Name; });

    return list;
};
Favorite.GetCommunities = function(searchList)
{
    var favorites = Favorite.GetList(searchList);
    var favs = $(favorites).Where(function(o) { return o && !/&tid=\d+/i.test(o.Link); });

    return $.makeArray(favs);
};
Favorite.GetTopics = function(cmm)
{
    var re = new RegExp("cmm=" + cmm, "i");
    var favorites = Favorite.GetList();
    var favs = $(favorites).Where(function(o) { return /&tid=\d+/i.test(o.Link) && (!cmm || re.test(o.Link)); });

    return $.makeArray(favs);
};

Favorite.Add = function(link, listName, img)
{
    var fav = ManagerAddsSystem.OrkutManager.UserSettingsObject["Favorites"];
    var list = fav[$(fav).IndexOf(function(el) { return el[listName]; })];
    var keys = GetKeys(list);
    list = list[keys[0]];
    
    var text = "";

    if (link.querySelector("img"))
    {
        var lastLink = link.parentNode.querySelectorAll("a");
        if (lastLink.length > 1)
        {
            lastLink = lastLink[lastLink.length - 1];
            text = lastLink.innerHTML;
        }
        else
        {
            // get page title
            var joinButton = document.querySelector("#gwtPanel button[class][id][type='button'] img[src*='plus']");
            if (!joinButton) return;

            joinButton = joinButton.parentNode;

            text = joinButton.parentNode.parentNode.querySelector("span").innerHTML;
        }
    }
    else
    {
        text = link.innerHTML;
    }

    var setg = {Name: text, Link: link.getAttribute("href")};

    if (img)
    {
        var s = $("<img>");
        s.attr("src", img.getAttribute("src"));
        setg.Image = s.wrap("<div>").parent().html();
    }

    list.push(setg);
    
    ManagerAddsSystem.OrkutManager.UserSettingsObject["Favorites"] = fav;
    ManagerAddsSystem.OrkutManager.SetSetting("Favorites", fav);
    
    var favIcon = link.previousSibling;
    favIcon.className = favIcon.className.replace(/manager-o(n|ff)/gi, "") + " manager-on";
};
Favorite.Del = function(link, listName)
{
    var fav = ManagerAddsSystem.OrkutManager.UserSettingsObject["Favorites"];
    var list = fav[$(fav).IndexOf(function(el) { return el[listName]; })];
    var keys = GetKeys(list);
    list = list[keys[0]];
    var deleteIndex = $(list).IndexOf(function(el) { return link.getAttribute("href").toLowerCase().indexOf(el.Link.toLowerCase()) != -1; });
    
    if (deleteIndex == -1) return;

    list = list.splice(deleteIndex, 1);

    ManagerAddsSystem.OrkutManager.UserSettingsObject["Favorites"] = fav;
    ManagerAddsSystem.OrkutManager.SetSetting("Favorites", fav);

    var id;

    id = link.getAttribute("href").match(Favorite.RE.IsCommunity);
    if (id && id.length >= 2) id = id[1];

    if (!Favorite.IsFavorite(id))
    {
        var favIcon = link.previousSibling;
        favIcon.className = favIcon.className.replace(/manager-o(n|ff)/gi, "") + " manager-off";
    }
};

Favorite.IsFavoriteOn = function(id, list)
{
    var isFav = list.some(
        function(el)
        {
            var m;
            
            m = el.Link.match(Favorite.RE.IsTopic);
            if (!m) m = el.Link.match(Favorite.RE.IsCommunity);

            if (m && m.length >= 2 && parseInt(m[1], 10) == parseInt(id, 10))
            {
                return true;
            }

            return false;
        });
    
    return isFav;
};
Favorite.IsFavorite = function(id)
{
    return ManagerAddsSystem.OrkutManager.UserSettingsObject["Favorites"].some(
        function(favorite)
        {
            for (var i in favorite)
            {
                return Favorite.IsFavoriteOn(id, favorite[i]);
            }
        });
};

Favorite.AddButton = function(to, img)
{
    var fav = document.createElement("span");

    var cmm;
    var tid;

    cmm = to.getAttribute("href").match(/\?cmm=(\d+)/)[1];
    tid = to.getAttribute("href").match(/&tid=(\d+)/i);
    if (tid && tid.length >= 2) tid = tid[1];

    fav.className = "manager-favorite ";

    if (tid)
    {
        fav.className += "manager-favorite-topic";
    }
    else
    {
        fav.className += "manager-favorite-cmm";
    }

    var favorites = ManagerAddsSystem.OrkutManager.UserSettingsObject["Favorites"];
    if (Favorite.IsFavorite(tid || cmm))
    {
        fav.className += " manager-on";
    }
    else
    {
        fav.className += " manager-off";        
    }

    function RemoveFavoriteSelector()
    {
        [].forEach.call(document.querySelectorAll(".manager-favorite-selector"), function(el) {
            if (!ManagerAddsSystem.OrkutManager.Firefox)
                $(el).fadeOut(250, function() {
                    $(this).remove();
                });
            else
                el.parentNode.removeChild(el);
        });
    }

    var showFavTimeout;
    fav.addEventListener("mouseover", function(e) {
        showFavTimeout = setTimeout(function() {
            RemoveFavoriteSelector();
            var favoriteSelector = document.createElement("div");
            favoriteSelector.className = "manager-favorite-selector manager-favorite-dropdown";

            //#region Modal events

            favoriteSelector.addEventListener("mousewheel", function(e) {
                var delta = e.wheelDelta || e.detail;
                favoriteSelector.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
                e.preventDefault();
            });

            if (!ManagerAddsSystem.OrkutManager.Firefox)
                $(favoriteSelector).mouseleave(function() { setTimeout(RemoveFavoriteSelector, 50); });
            else
            {
                favoriteSelector.addEventListener("mouseout", function(e) {
                    if (/manager-favorite-selector/i.test(e.target.className))
                    {
                        setTimeout(RemoveFavoriteSelector, 50);
                    }
                }, false);
            }

            //#endregion

            favoriteSelector.style.left = ($(fav).offset().left - 4) + "px";
            favoriteSelector.style.top = ($(fav).offset().top - 4) + "px";

            var favorites = ManagerAddsSystem.OrkutManager.UserSettingsObject["Favorites"];
            favorites.forEach(function(favoriteElement) {
                for (var i in favoriteElement)
                {
                    var container = document.createElement("div");
                    var chk = document.createElement("input");
                    var label = document.createElement("label");
                    var labelText = document.createTextNode(" " + i);

                    chk.setAttribute("type", "checkbox");
                    chk.setAttribute("data-list-name", i);
                    chk.setAttribute("data-cmm", cmm);
                    if (tid) chk.setAttribute("data-tid", tid);
                    if (Favorite.IsFavoriteOn(tid || cmm, favoriteElement[i]))
                    {
                        chk.setAttribute("checked", "checked");
                    }
                    chk.addEventListener("change", function(el) {
                        if (chk.checked)
                        {
                            Favorite.Add(to, chk.getAttribute("data-list-name"), img);
                        }
                        else
                        {
                            Favorite.Del(to, chk.getAttribute("data-list-name"));
                        }
                    });

                    label.appendChild(chk);
                    label.appendChild(labelText);

                    container.appendChild(label);
                    favoriteSelector.appendChild(container);
                }
            });

            favoriteSelector.style.display = "none";
            document.body.appendChild(favoriteSelector);

            if (!ManagerAddsSystem.OrkutManager.Firefox)
                $(favoriteSelector).fadeIn(200);
            else
                favoriteSelector.style.display = "block";
        }, 175);
    });

    $(fav).mouseleave(function(e) {
        clearTimeout(showFavTimeout);
    });

    to.parentNode.insertBefore(fav, to);
};

Favorite.BuildPageCmm = function(contentContainer)
{
    contentContainer.empty();

    var content = $("<div>").css("margin", "10px");
    content.appendTo(contentContainer);

    var cmmListcontainer = $("<div>").css("padding", "10px");
    var select = $("<select>");

    $("<option>").val("").html("All").appendTo(select);

    var favorites = ManagerAddsSystem.OrkutManager.UserSettingsObject["Favorites"];
    favorites.forEach(function(favoriteElement) {
        for (var i in favoriteElement)
        {
            $("<option>").val(i).text(i).appendTo(select);
        }
    });

    function BuildCommunities()
    {
        cmmListcontainer.empty();

        var selectedList = select.val();
        var communities = selectedList
            ? Favorite.GetCommunities(selectedList)
            : Favorite.GetCommunities();

        communities.forEach(function(community) {
            var d = $("<div>").css("display", "inline-block").css("position", "relative");
            var img = $("<a>")
                .attr("title", community.Name)
                .attr("href", community.Link)
                .html(community.Image);

            img.find("img").css({ width: "128px", height: "128px", margin: "10px" });
            img.appendTo(d);
            d.appendTo(cmmListcontainer);
        });
    }

    BuildCommunities();
    select.change(function() {
        BuildCommunities();
    });
    select.appendTo(content);
    cmmListcontainer.appendTo(content);
};

    window.addEventListener("DOMNodeInserted", function(e) {
        if (e && e.target && e.target.tagName)
        {
        
            // Build community links
            setTimeout(function() {
                var communityLinks = document.querySelectorAll("a[href*='#Community?cmm=']:not(.manager-parsed) img");

                [].forEach.call(communityLinks, function(el) {
                    var img = el;
                    el = el.parentNode;
                    if (el.tagName != "A") el = el.parentNode;

                    if (!/manager-parsed/i.test(el.className))
                    {
                        el.className += " manager-link-cmm manager-parsed";

                        Favorite.AddButton(el, img);
                    }
                });
            }, 100);
        
            // Build topic links
            setTimeout(function() {
                var topicLinks = document.querySelectorAll("a[href*='#CommMsgs?cmm=']:not(.manager-parsed):not([href*='na=2']):not([href*='&nid']):not([href*='&sort'])");

                [].forEach.call(topicLinks, function(el) {
                    if (!/manager-parsed/i.test(el.className))
                    {
                        el.className += " manager-link-topic manager-parsed";

                        Favorite.AddButton(el);
                    }
                });
            }, 100);

            // Build community favorite block
            if (/#Community/i.test(window.location.hash))
            setTimeout(function() {
                var container = $(e.target).closest("div[style*='zoom'][style*='position'][style*='overflow'][:not([class])");

                if (!container.length)
                {
                    container = $(e.target).closest("div[style*='overflow'][style*='position'][style*='height'][:not([class])");
                }

                if (container.length && !container.hasClass("manager-parsed") && !document.getElementById("manager-fav-box-cmm"))
                {
                    container.addClass("manager-parsed manager-box");

                    container = container.closest("div[id]").parent();
                
                    var favCmmBlock = container.find(">div:not([class*='manager'])").eq(0).clone();
                    var favCmmBlockTitle = favCmmBlock.find("span:first");
                    var favCmmList = favCmmBlock.find("a:eq(1)").closest("div[style*='height']");
                    var favCmmItem = favCmmList.find("a:first").parent();
                
                    favCmmItem = favCmmItem.clone();
                    favCmmItem.css({ width: "64px", height: "64px" });
                    favCmmItem.addClass("manager-fav-item-cmm");

                    favCmmList.addClass("manager-fav-list-box");
                    favCmmItem.addClass("manager-fav-list-box-item");

                    favCmmBlock.find("a:first").remove();
                    favCmmList.empty();
                    favCmmItem.empty();

                    favCmmBlock.attr("id", "manager-fav-box-cmm");

                    favCmmBlock.addClass("manager-fav-box-cmm");

                    favCmmBlockTitle.html("Favorite communities");

                    var tmp = favCmmItem.clone();
                    Favorite.GetCommunities().forEach(function(el) {
                        var link = document.createElement("a");
                        link.setAttribute("href", el.Link);
                        link.setAttribute("title", el.Name);
                        link.innerHTML = el.Image;

                        favCmmItem.append(link);
                        favCmmList.append(favCmmItem);
                        favCmmItem = tmp.clone();
                    });

                    favCmmBlock.insertBefore(container.find(">div:last"));


                    setTimeout(function() {
                        favCmmBlock.find("img[src*='close-x-']").remove();
                    }, 600);
                    setTimeout(function() {
                        favCmmBlock.find("img[src*='close-x-']").remove();
                    }, 1200);
                }
            }, 260);

            // Build topic favorite block
            if (/#Community/i.test(window.location.hash))
            {
                setTimeout(function() {
                    var container = $("a[href*='#CommTopics?cmm=']", e.target);
                    if (container.length >= 2) { container = container.eq(1); }
                    else return;

                    if (container.length && !container.hasClass("manager-parsed") && !document.getElementById("manager-fav-box-topic"))
                    {
                        container.addClass("manager-parsed");

                        var topicBlock = container.closest("div[id]");
                        var favTopicBlock = topicBlock.clone();
                        var favTopicList = favTopicBlock.find(">div:eq(1)");
                        favTopicBlock.attr("id", "manager-fav-box-topic");

                        favTopicBlock.find("button:eq(0)").remove();
                    
                        favTopicList.empty();
                        favTopicList.addClass("manager-fav-topic-list");

                        Favorite.GetTopics(window.QueryString["cmm"]).forEach(function(el, i) {
                            var c = $("<div>");
                            var link = $("<a>");
                            link.attr("href", el.Link);
                            link.html(el.Name);

                            var last = link.clone();
                            last.attr("href", last.attr("href") + "&na=2&post=-1");
                            last.html("(last)");
                            last.addClass("manager-item-last");

                            c.addClass("manager-fav-item-topic manager-item-hover manager-alt" + (i & 1 == 1));
                            c.append(last);
                            c.append(link);
                            favTopicList.append(c);
                        });

                        favTopicBlock.insertAfter(topicBlock);
                    }
                }, 270);
            }

            if (/#Communities/i.test(window.location.hash))
            {
                setTimeout(function() {
                    var gwtPanel = $eid("gwtPanel");
                    if (!gwtPanel) return;

                    var menuContainer = $(gwtPanel).find("div[id] a[href*='#Communities?tab=']:first").parent();

                    if (menuContainer.hasClass("manager-parsed")) return;
                    menuContainer.addClass("manager-parsed");
                    
                    var link = menuContainer.find("[href*='Comm']").first().clone(true);

                    var menuStateClass =
                    {
                        Active: menuContainer.find("[href^=javascript]:first").attr("class"),
                        Inactive: link.attr("class")
                    };

                    link
                        .attr("href", "javascript:void(0);")
                        .html("favorites" + " (" + Favorite.GetCommunities().length + ")")
                        .click(function() {
                            menuContainer.find("a").removeClass().addClass(menuStateClass.Inactive);
                            $(this).removeClass().addClass(menuStateClass.Active);
                            var contentContainer = menuContainer.next("div");
                            Favorite.BuildPageCmm(contentContainer);
                        })
                        .appendTo(menuContainer);
                }, 380);
            }
        }
    }, false);
}

if (ManagerAddsSystem.OrkutManager.UserSettingsObject["Features"]["Share"])
{
    window.addEventListener("DOMNodeInserted", function(e) {
        if (e && e.target && e.target.tagName)
        {
            // Build share option
            if (/#Community/i.test(window.location.hash))
            {
                setTimeout(function() {
                    if (document.getElementById("manager-share-cmm")) return;

                    var joinButton = document.querySelector("#gwtPanel button[class][id][type='button'] img[src*='plus']");
                    if (!joinButton) return;

                    joinButton = joinButton.parentNode;

                    var cmmNameElement = joinButton.parentNode.parentNode.querySelector("span");

                    var shareElement = document.createElement("a");
                    
                    shareElement.setAttribute("title", ManagerAddsSystem.OrkutManager.Resource("Share"));
                    shareElement.setAttribute("data-url", window.location.href);
                    shareElement.setAttribute("data-title", cmmNameElement.innerHTML);
                    shareElement.setAttribute("href", "javascript:void(0);");
                    shareElement.setAttribute("id", "manager-share-cmm");
                    shareElement.className = "manager-share";
                    shareElement.innerHTML = "&nbsp;";

                    cmmNameElement.parentNode.insertBefore(shareElement, cmmNameElement.nextSibling);

                    $(document.getElementById("manager-share-topic")).remove();
                }, 350);
            }
            else if (/#CommMsgs/i.test(window.location.hash))
            {
                setTimeout(function() {
                    if (document.getElementById("manager-share-topic")) return;
                    
                    var postTitle = document.querySelector("a[href^='#CommMsgs?cmm=']");
                    if (!postTitle || !postTitle.tagName) return;

                    var shareElement = document.createElement("a");

                    shareElement.setAttribute("title", ManagerAddsSystem.OrkutManager.Resource("Share"));
                    shareElement.setAttribute("data-url", window.location.href);
                    shareElement.setAttribute("data-title", postTitle.innerHTML);
                    shareElement.setAttribute("href", "javascript:void(0);");
                    shareElement.setAttribute("id", "manager-share-topic");
                    shareElement.className = "manager-share";
                    shareElement.innerHTML = "&nbsp;";

                    postTitle.parentNode.insertBefore(shareElement, postTitle.nextSibling);
                    $(document.getElementById("manager-share-cmm")).remove();
                }, 350);
            }
        }
    }, false);
}
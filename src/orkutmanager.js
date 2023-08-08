/**
 ___  _ __ ___  
 / _ \| '_ ` _ \
 | (_) | | | | | |
 \___/|_| |_| |_|
 
 Orkut Manager for google Chrome
 by Bruno Leonardo Michels, André Steinn
 
 
 Orkut Manager
 Copyright (c) 2010 - 2011, Orkut Manager team
 
 */

/* last page after reply*/
if ((/&na=4/).test(window.location.href) && !(/&nid=\d+/).test(window.location.href))
    window.location.href = window.location.href.replace(/&na=4/, "&na=2") + "&scroll=-1";

var IncludeRe = new RegExp("^https?:\/\/[^/]+orkut.*", "i");
var ExcludeRE = new RegExp("^https?:\/\/[^/]+(orkut.*\/(Main#|xpc)|orkut.gmodules.*)", "i");
var isOrkut = (IncludeRe).test(window.location.href.replace("/Main#", "/"))
var isMain = (ExcludeRE).test(window.location.href);

if (isOrkut && !isMain) {
    if ((/.*?Interstitial.*?/i).test(window.location.href) && (/t=/).test(window.location.href))
        window.location.href = unescape(window.location.href.match(/u=(.+)\&t=/)[1]);
    chrome.extension.sendRequest({
        type: "transfer-itens"
    }, function(r) {
        $(function() {
            $(window.document).unload(function() {
                $("*").unbind().die();
            });
            var Window = OMSystem.OrkutManager.Util.Window;
            var Orkut = OMSystem.OrkutManager.Util.Orkut;
            var OMUtil = OMSystem.OrkutManager.Util.OMUtil;
            var PrefManager = OMSystem.OrkutManager.PrefManager;
            PrefManager.DefaultVar(r);
            r = undefined;
            var Language = OMSystem.OrkutManager.Language.Get();

            /** Fix Orkut Links removing Main# / _linkInterstitial / report_spam / formating tips / $pid **/
            var thisHref;
            setTimeout(function() {
                $("a").each(function() {
                    thisHref = $(this).attr("href");
                    if (thisHref === undefined)
                        return;
                    if ((/photos/i).test(thisHref))
                        return;
                    if ((/.*?Interstitial.*?/i).test(thisHref)) {
                        $(this).attr("href", unescape(thisHref.match(/u=(.+)\&t=/)[1]));
                    }
                });
            }, 500);

            // @TODO Move It to utils, wtf is doing here
            getTags = function() {
                var tags = '';
                var SavedTags = OMSystem.OrkutManager.PrefManager.Get("TagList", "");
                SavedTags = SavedTags.split("|");
                var SavedTagsLength = SavedTags.length;
                for (var llp = 0; llp < SavedTagsLength; llp++)
                {
                    if (SavedTags[llp].length) {
                        tags += "<option value='" + unescape(SavedTags[llp]) + "'>" + unescape(SavedTags[llp]) + "</option>";
                    }
                }
                return tags;
            };

            if (PrefManager.Get("OrkutSize", "0") && PrefManager.Get("OrkutSize", "0") !== 0)
                $("#headerin, #container").css("max-width", PrefManager.Get("OrkutSize", "85.5") + "% !important;");

            if (PrefManager.Get("omShowPromote", "true") === "false" && $("#app_content_0").length === 1)
                $("#rbox table:eq(0)").remove();

            //@Todo This will be a function
            try {
                if (!PrefManager.Get("omOLDemoticons", "true") === "true")
                    throw "";
                emoticons = document.evaluate("//img[contains(@src, '/smiley')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                ailength = emoticons.snapshotLength;
                for (ai = 0; ai < ailength; ai++) {
                    emoticon = emoticons.snapshotItem(ai);
                    emoticon.src = emoticon.src.replace('/smiley', '');
                    emoticon.src = emoticon.src.replace(/r_cool.png/i, 'i_cool.gif');
                    emoticon.src = emoticon.src.replace(/r_smile.png/i, 'i_smile.gif');
                    emoticon.src = emoticon.src.replace(/(r_cry.png|r_slant.png|r_frown.png)/i, 'i_sad.gif');
                    emoticon.src = emoticon.src.replace(/r_wink.png/i, 'i_wink.gif');
                    emoticon.src = emoticon.src.replace(/(r_bigsmile.png|r_grin.png)/i, 'i_bigsmile.gif');
                    emoticon.src = emoticon.src.replace(/(r_funny.png|r_tongue.png)/i, 'i_funny.gif');
                    emoticon.src = emoticon.src.replace(/r_confuse.png/i, 'i_confuse.gif');
                    emoticon.src = emoticon.src.replace(/(r_surprise.png|r_shocked.png|r_straightface.png)/i, 'i_surprise.gif');
                    emoticon.src = emoticon.src.replace(/r_angry.png/i, 'i_angry.gif');
                    emoticon.src = emoticon.src.replace(/r_heart.png/i, 'smiley/r_heart.png');
                    emoticon.src = emoticon.src.replace(/r_devil.png/i, 'smiley/r_devil.png');
                    emoticon.removeAttribute('width');
                    emoticon.removeAttribute('height');
                }
                ai = undefined;
            } catch (ex) {
            }

            // @TODO top of the file
            // Request objects
            var oUpdate = undefined;
            var oUpdateCmmInterval = undefined;
            var oUpdateTidInterval = undefined;

            function sto(f, d)
            {
                // td: manage memory
                return window.setTimeout(f, d);
            }

            function sint(f, d)
            {
                // td: manage memory
                return window.setInterval(f, d);
            }

            /** Memory release **/
            window.addEventListener("unload", function()
            {
                oUpdate = undefined;
                window.clearInterval(oUpdateCmmInterval);
                window.clearInterval(oUpdateTidInterval);
                oUpdateCmmInterval = undefined;
                oUpdateTidInterval = undefined;
                PrefManager.r = undefined;
                Window = undefined;
                Orkut = undefined;
                Window = undefined;
                Orkut = undefined;
                SpecialCharacters = undefined;
                OMUtil = undefined;
                Updater = undefined;
                User = undefined;
                Bookmark = undefined;
                PrefManager = undefined;
                Language = undefined;
                Toolbar = undefined;
                User = undefined;
                $(".bkOff, bkOn, .buttonLupaPreview,.omLastLinks, .OMQuickReplyContainer, .OMToolbar").remove();
            }, false);

            // POST_TOKEN | signature
            var orkutPOST_TOKEN = 0;
            var orkutsignature = 0;
            orkutsignature = encodeURIComponent($("input[name='signature']").val());
            orkutPOST_TOKEN = encodeURIComponent($("input[name='POST_TOKEN']").val());

            /** Menus DD & HD **/
            try {
                document.getElementsByClassName("menu")[0].id = "OMMenuContainer";
                var OMMenu = JSON.parse(PrefManager.Get("MenuDD", ""));
                IsEnabledMenuDD = (PrefManager.Get("omEnableMenuDD", "true") === "true");
                if (OMMenu.length > 1 && IsEnabledMenuDD)
                {
                    OMMenulength = OMMenu.length;
                    for (i = 0; i < OMMenulength; i++)
                    {
                        var menuIt = OMMenu[i];
                        if (!menuIt)
                            continue;
                        menuIt = menuIt.split("|");
                        var Name = unescape(menuIt[0]);
                        var Link = unescape(menuIt[1]);
                        if (Name === "-")
                            Name = "";
                        Orkut.GetMenuDD(window, Name, Link);
                    }
                }

                OMMenu = JSON.parse(PrefManager.Get("MenuHD", ""));
                IsEnabledMenuHD = (PrefManager.Get("omEnableMenuHeader", "true") === "true");
                if (OMMenu.length > 1 && IsEnabledMenuHD)
                {
                    MyUid = $("#headerin .menu:eq(0) li:eq(2) a:eq(0)").attr("href");
                    MyUid = MyUid.match(/uid=(\d+)/i) ? "" + MyUid.match(/uid=(\d+)/i)[1] : "";
                    try {
                        if (PrefManager.Get("MenuHDClear", false))
                            throw "";
                        var lis = document.getElementById("OMMenuContainer").getElementsByTagName("li");
                        var liParent = lis[0].parentNode;
                        var liLength = lis.length;
                        for (i = 0; i < liLength; i++)
                            liParent.removeChild(lis[1]);
                    } catch (ex) {
                    }

                    OMMenuLength = OMMenu.length;
                    for (i = 0; i < OMMenuLength; i++)
                    {
                        var menuIt = OMMenu[i];
                        if (!menuIt)
                            continue;
                        menuIt = menuIt.split("|");
                        var Name = unescape(menuIt[0]);
                        var Link = unescape(menuIt[1]);
                        if (Link.match(/Profile$/i))
                            Link += "?uid=" + MyUid;
                        Orkut.GetMenuHD(window, Name, Link);
                    }
                }
            } catch (ex) {
            }

            //Check if the user is logged or not
            if ($("#headerin").length === 1 && $("#headerin .useremail").length === 0 && Window.IsPage("/(Community|CommMsgs|CommTopics)", window)) {
                if (confirm(Language.loginAgain)) {
                    window.location.href = "https://www.google.com/accounts/ServiceLogin?service=orkut&rm=false&continue=http://www.orkut.com/RedirLogin?msg%3D0%26page%3D" + unescape(window.location.href) + "&cd=BR&passive=true&skipvpage=true&sendvemail=false"
                }
            }

            /** Topbar email hide && Member approve **/
            try
            {
                if (PrefManager.Get("omEmailHide", true)) {
                    var exp = document.createElement("span");
                    exp.style.fontSize = "16px";
                    exp.style.color = "white";
                    exp.style.cursor = "pointer";
                    exp.innerHTML = "&nbsp;" + String.fromCharCode(171) + "&nbsp;";
                    exp.addEventListener("click",
                            function() {
                                if (this.innerHTML === "&nbsp;" + String.fromCharCode(171) + "&nbsp;") {
                                    this.nextSibling.style.display = "";
                                    this.innerHTML = "&nbsp;" + String.fromCharCode(187) + "&nbsp;";
                                } else {
                                    this.nextSibling.style.display = "none";
                                    this.innerHTML = "&nbsp;" + String.fromCharCode(171) + "&nbsp;";
                                }
                            }, false);
                    document.getElementsByClassName("useremail")[0].style.display = "none";
                    document.getElementsByClassName("useremail")[0].parentNode.insertBefore(exp, document.getElementsByClassName("useremail")[0].parentNode.firstChild);
                }
            }
            catch (ex) {
            }

            $("#goToNewLabel").attr('onclick', '').click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                alert('              ORKUT MANAGER - ATENÇÃO                \n\nVocê estará desativando o ForceOld Orkut e indo para o novo Orkut!! \n\nPara voltar a vizualizar o orkut antigo, visite as configurações e ative novamente.\nVocê pode também clicar no Logo do OM no lado da barra de endereços para poder ativar novamente!!');
                con = confirm('Para ir ao Novo orkut, confirme que você leu e entendeu a mensagem anterior, clicando em "Ok"');
                if (con) {
                    PrefManager.Set("oldOrkut", "disabled");
                    window.open(window.location.href.replace('Main#', ''));
                    window.close();
                }
                return false;
            });
            /** Scroll **/
            try
            {
                var scroll = 0;
                scroll = window.location.href.match(/&scroll=(-?\d+)/i)[1];
                scroll = (scroll < 0) ? (parseInt(document.body.scrollHeight) + 9999) : scroll;
                if (scroll)
                    window.scrollBy(0, scroll);
            } catch (ex) {
            }

            /** Clear Setup Prefs (Quote | Moderation) **/
            try
            {
                if (!Window.IsPage("/CommMsgPost", window))
                {
                    PrefManager.Clear("Quote");
                    PrefManager.Clear("Moderation");
                }
            }
            catch (ex) {
            }

            /** Left Box menus **/
            try
            {
                var sep = function() {
                    var sep = document.createElement("div");
                    sep.className = "userinfodivi";
                    sep.innerHTML = "&nbsp;";
                    return sep;
                };
                var menuleft = document.getElementById("lbox").getElementsByTagName("table")[0].getElementsByClassName("boxmid")[0];
                menuleft.appendChild(sep());
                var a = document.createElement("a");
                a.href = "/Community?cmm=90840394";
                a.innerHTML = "Orkut Manager";
                menuleft.appendChild(document.createElement("center")).appendChild(a);
                menuleft.appendChild(sep());
                menuleft.appendChild(document.createElement("br"));
            }
            catch (ex) {
            }

            //Fix search button
            $("#h_search a").bind('click', function() {
                $("#h_search").submit();
            });
            /** Pages Manager *****/

            // #region Home
            try
            {
                if (!Window.IsPage("/Home", window))
                    throw "!Home";

                $('.boxmidlrg .promobg:contains(Internet Explorer 6)').remove();
                MyUid = $("#headerin .menu:eq(0) li:eq(2) a:eq(0)").attr("href");
                MyUid = MyUid.match(/uid=(\d+)/i) ? "" + MyUid.match(/uid=(\d+)/i)[1] : "";

                var friendlist;
                try {
                    friendlist = JSON.parse(OMSystem.OrkutManager.PrefManager.Get("omFriendAddList", ""));
                } catch (ex) {
                    friendlist = new Array();
                }
                var con = document.getElementById("mbox");
                var frms = con.getElementsByTagName("form");
                var frmslength = frms.length;
                for (i = 0; i < frmslength; i++)
                {
                    var f = frms[i];
                    if (!f || (f && !f.id))
                        continue;
                    if (f.id && (/friendRequestAction/i).test(f.id))
                    {
                        var uid = f.id.match(/\d+/)[0];
                        if (!friendlist.inArray(uid))
                        {
                            y++;
                            friendlist.push(uid);
                        }
                        OMSystem.OrkutManager.PrefManager.Set("omFriendAddList", JSON.stringify(friendlist));
                        var c = f;
                        do
                        {
                            c = c.parentNode;
                        } while (c.tagName.toLowerCase() != "table");
                        con = c.getElementsByClassName("headernote")[0];
                        break;
                    }
                }

                if (con && !con.id)
                {
                    var btn = Orkut.GetButton(window, Language.AcceptAll, function()
                    {
                        var Ajax = OMSystem.OrkutManager.Util.Ajax;
                        var iSec = -1;
                        var frms = document.getElementsByTagName("form");
                        var frmsLength = frms.length;
                        for (i2 = 0; i2 < frmsLength; i2++)
                        {
                            var f = frms[i2];
                            if (!f || (f && !f.id))
                                continue;
                            if (!f.id || !(/friendRequestAction/i).test(f.id))
                                continue;
                            var uid = f.id.match(/\d+/)[0];
                            ++iSec;

                            var url = {
                                "Action.acceptFriend": "Submit+Query",
                                "-groupName": "",
                                "groupSelection.submitted": "1"
                            };

                            url.POST_TOKEN = $("input[name='POST_TOKEN']").val();
                            url.signature = $("input[name='signature']").val();
                            url.friendRequestUserId = uid;
                            url.sec = iSec;
                            url.cache = Math.random();
                            $.post("/Home?" + "&cache=" + (Math.random() + "cacheee").substring(2, 7), url, function() {
                                window.location.reload();
                            });
                        }
                    }, "click");

                    var btnD = Orkut.GetButton(window, Language.DenyAll, function()
                    {
                        var Ajax = OMSystem.OrkutManager.Util.Ajax;
                        var iSec = -1;
                        var frms = document.getElementsByTagName("form");
                        var frmslength = frms.length;
                        for (i3 = 0; i3 < frmslength; i3)
                        {
                            var f = frms[i3];
                            if (!f || (f && !f.id))
                                continue;
                            if (!f.id || !(/friendRequestAction/i).test(f.id))
                                continue;
                            var uid = f.id.match(/\d+/)[0];
                            ++iSec;

                            var url = {
                                "-groupName": "",
                                "groupSelection.submitted": "1",
                                "friendRequestUserId": uid,
                                "Action.declineFriend": "Submit+Query"
                            }
                            url.POST_TOKEN = $("input[name='POST_TOKEN']").val();
                            url.signature = $("input[name='signature']").val();
                            url.sec = iSec;
                            url.cache = (Math.random());
                            $.post("Home?" + "&cache=" + (Math.random() + "cacheee").substring(2, 7), url, function() {
                                window.location.reload();
                            });
                        }
                    }, "click");
                    con.appendChild(btn);
                    con.appendChild(btnD);
                }
                try {
                    var testemonialList;
                    try {
                        testemonialList = JSON.parse(OMSystem.OrkutManager.PrefManager.Get("omTestemonialList", ""));
                    } catch (ex) {
                        testemonialList = new Array();
                    }
                    var con = document.getElementById("mbox");
                    var frms = con.getElementsByTagName("form");
                    var frmsLength = frms.length;
                    for (i = 0; i < frmsLength; i++)
                    {
                        var f = frms[i];
                        if (!f || (f && !f.id))
                            continue;
                        if (f.id && f.id.match(/acceptTestimonial/i))
                        {
                            try {
                                var uid = f.id.match(/\d+/)[0];
                                if (!testemonialList.inArray(uid))
                                {
                                    y++;
                                    testemonialList.push(uid);
                                }
                            } catch (e) {

                            }
                        }
                    }
                } catch (ex) {
                }
                if (!(/uid=\d+/i).test(window.location.href) ||
                        ((/uid=\d+/i).test(window.location.href) && window.location.href.match(/uid=(\d+)/i)[1] === MyUid))
                {
                    // Check spam
                    $.get("/UserSpamFolder?" + "&cache=" + (Math.random() + "cacheee").substring(2, 7),
                            function(o)
                            {
                                var value = 0;
                                try
                                {
                                    value = $("input.normcheck", o).length;
                                }
                                catch (ex) {
                                    value = 0;
                                }

                                tb = document.getElementById("lbox");
                                tb = tb.getElementsByClassName("userbutton_text");
                                tb = tb[tb.length - 1];
                                tb.innerHTML += "(" + value + ")";

                                tb = undefined;
                            });
                }
                if (!PrefManager.Get("omShowPromote", true)) {
                    if (document.getElementById('app_content_0')) {
                        el = document.getElementById('rbox');
                        el.removeChild(el.getElementsByTagName("table")[0]);

                    }
                }
            }
            catch (ex) {
            }
            // #endregion

            // #region Logout
            try {
                if (window.location.href.match('Logout?msg=0'))
                    throw "!Logout?msg=0";
                    $("#adblock").html('<iframe width="800" height="440" frameborder="0" scrolling="no" src="http://manageraddons.com/ads/800x440/?nopop&utm_source=OMChrome1.2.9.1&utm_campaign=Logout" marginheight="0" marginwidth="0" hspace="0" vspace="0" border="0" id="ad-iframe"></iframe>');
            } catch (ex) {
                alert(ex);
            }

            // #region Scrapbook
            try
            {
                if (!Window.IsPage("/Scrapbook", window))
                    throw "!Scrapbook";
                MyUid = $("#headerin .menu:eq(0) li:eq(2) a:eq(0)").attr("href");
                MyUid = (/uid=(\d+)/i).test(MyUid) ? "" + MyUid.match(/uid=(\d+)/i)[1] : "";
                var Toolbar = OMSystem.OrkutManager.Toolbar.Get();
                var User = OMSystem.OrkutManager.Util.User;
                User.Load();

                var scraplist;
                try {
                    scraplist = JSON.parse(OMSystem.OrkutManager.PrefManager.Get("omNotifyScrapList", ""));
                } catch (ex) {
                    scraplist = new Array();
                }
                try {
                    var scrap_inputs = document.getElementById("mboxfull").getElementsByClassName("editcheck");
                    var scrap_inputsLength = scrap_inputs.length;

                    for (var l = 0; l < scrap_inputsLength; l++)
                    {
                        var value = scrap_inputs[l].value;
                        if (!scraplist.inArray(value))
                        {
                            y++;
                            scraplist.push(value);
                        }
                    }
                    OMSystem.OrkutManager.PrefManager.Set("omNotifyScrapList", JSON.stringify(scraplist));
                } catch (ex) {
                }


                // Display fullnames
                var blocks = document.getElementById("mboxfull").getElementsByClassName("listitemchk");
                blocksLength = blocks.length;
                for (i = 0; i < blocksLength; i++)
                {
                    var block = blocks[i];
                    if (!block)
                        return;
                    var name = block.getElementsByTagName("img")[0].getAttribute("title");
                    if (!name)
                        name = block.getElementsByTagName("img")[1].getAttribute("title");
                    var namec = block.getElementsByTagName("h3")[0].getElementsByTagName("a")[0];
                    namec.innerHTML = name;

                    var scrapl = document.createElement("a");
                    scrapl.href = "/Scrapbook?uid=" + (namec.href.match(/uid=(\d+)/)[1]);
                    scrapl.innerHTML = "<small>scrap&nbsp;" + String.fromCharCode(187) + "</small>";

                    namec.parentNode.appendChild(scrapl);
                }

                // Toolbar: Scrapbook
                if (PrefManager.Get("omToolbarScrapBook", true)) {
                    document.getElementById("scrapText").removeAttribute("prompt");
                    $("#scrapText").val("").attr("rows", "6");
                    document.getElementById("scrapText").focus();

                    var mode = document.getElementById("gsjs_writeTestimonial");
                    mode = (mode) ? 1 : 0;
                    if (!(/uid=\d+/i).test(window.location.href) ||
                            ((/uid=\d+/i).test(window.location.href) && window.location.href.match(/uid=(\d+)/i)[1] === MyUid))
                    {
                        mode = 1;
                    }
                    try
                    {
                        Toolbar.Create("scrapText", mode, window);
                    }
                    catch (ex) {
                    }
                }
                // Scraps replies
                for (var ScrapIndex = 1; ScrapIndex <= 30; ++ScrapIndex)
                {
                    var ScrapTextI = document.getElementById(("scrapText_" + ScrapIndex));
                    if (!ScrapTextI)
                        break;
                    ScrapTextI.parentNode.parentNode.style.width = "100%";
                    try
                    {
                        if (PrefManager.Get("omToolbarScrapBook", true)) {
                            Toolbar.Create("scrapText_" + (ScrapIndex), 0, window);
                        }
                        var ta = document.getElementById("scrapText_" + (ScrapIndex));

                        ta.addEventListener("keydown", function(e)
                        {
                            var keys = OMUtil.GetSendKeys(e);
                            if (e.keyCode === 13 && keys)
                            {
                                var oc = document.getElementById("scrap_" + (this.id.split("_")[1]))
                                        .getElementsByClassName("grabtn")[0]
                                        .getElementsByTagName("a")[0]
                                        .getAttribute("onclick");
                                window.location.href = "javascript: " + oc.replace("return false;", "");
                                e.preventDefault();
                            }
                        }, false);

                        function PreviewSmallScrap(ta)
                        {
                            ta.parentNode.lastChild.innerHTML = Orkut.Preview(ta.value, true);
                        }
                        var paneId = Orkut.CreatePreviewPane(window, ta.parentNode, unescape(Language.ShowHide), true);
                        ta.addEventListener("focus", function() {
                            PreviewSmallScrap(this);
                        }, false);
                        ta.addEventListener("keyup", function() {
                            PreviewSmallScrap(this);
                        }, false);
                        ta.addEventListener("blur", function() {
                            PreviewSmallScrap(this);
                        }, false);

                        var button = document.getElementById(("reply_link_" + ScrapIndex));
                        button.removeAttribute("onclick");
                        button.addEventListener("click", function()
                        {
                            var id = this.id.match(/[^\d]+(\d+)/)[1];
                            if (document.getElementById(("scrap_" + id)).style.display === "none")
                                document.getElementById(("scrap_" + id)).style.display = "";
                            else
                                document.getElementById(("scrap_" + id)).style.display = "none";

                            var post = document.getElementById(("scrapText_" + id));
                            post.selectionStart = post.selectionEnd = (post.value.length - (User.SColorE.length + User.SSignature.length));
                            post.focus();
                        }, false);
                    }
                    catch (ex) {
                    }
                }

                // Scrapbook Preview
                function PreviewScrap()
                {
                    var preview = document.getElementById("previewContainer");
                    if (preview.style.display === "none")
                        document.getElementById("previewContainer").style.display = "";
                    document.getElementById("previewContent").innerHTML =
                            Orkut.Preview(document.getElementById("scrapText").value, 1);
                }

                sto(function() {
                    document.getElementById("previewContainer").style.display = "";
                    document.getElementById("previewContent").innerHTML = Orkut.Preview(document.getElementById("scrapText").value, 1);
                }, 100);

                try {
                    document.getElementById("OMToolBarscrapText").addEventListener("click", PreviewScrap, true);
                } catch (ex) {
                }
                document.getElementById("scrapText").addEventListener("keyup", PreviewScrap, false);
                document.getElementById("scrapText").addEventListener("focus", PreviewScrap, false);
                document.getElementById("scrapText").addEventListener("blur", PreviewScrap, false);
                document.getElementById("scrapText").addEventListener("click", PreviewScrap, false);

                // Fix send button
                var sendScrap = document.getElementById("scrapInputContainer").getElementsByClassName("parabtns")[0].getElementsByTagName("a")[0];
                sendScrap.title = OMUtil.GetSendKeysText() + "-Enter";
                sendScrap.setAttribute("onclick", "");
                sendScrap.addEventListener("click", function()
                {
                    document.getElementById("scrapText").value = Orkut.FixPost(document.getElementById("scrapText").value, mode);
                    window.location.href = "javascript: with(window){ _writeScrap(); }; void(0);";
                }, false);
                // - shortcut
                try
                {
                    document.getElementById("scrapText").addEventListener("keydown", function(e)
                    {
                        var keys = OMUtil.GetSendKeys(e);
                        if (e.keyCode === 13 && keys)
                        {
                            window.location.href = "javascript: with(this.orkutFrame||window) _writeScrap();";
                            e.preventDefault();
                        }
                    }, false);
                }
                catch (ex) {
                }

                // Check spam
                if (!(/uid=\d+/i).test(window.location.href) ||
                        ((/uid=\d+/i).test(window.location.href) && window.location.href.match(/uid=(\d+)/i)[1] === MyUid))
                {
                    // Check spam
                    $.get("/UserSpamFolder?" + "&cache=" + (Math.random() + "cacheee").substring(2, 7), function(o)
                    {
                        var value = 0;
                        try
                        {
                            value = $("input.normcheck", o).length;
                        }
                        catch (ex) {
                            value = 0;
                        }

                        var tb = document.getElementById("mboxfull");
                        tb = tb.getElementsByClassName("module")[2];
                        tb = tb.getElementsByTagName("h1")[0];
                        tb.innerHTML += "- <a href='/UserSpamFolder?'>Spam(" + value + ")</a>";

                        tb = document.getElementById("lbox");
                        tb = tb.getElementsByClassName("userbutton_text");
                        tb = tb[tb.length - 1];
                        tb.innerHTML += "(" + value + ")";

                        tb = undefined;
                    });
                }

                //Select Clicked Scrap
                OMUtil.BindSelectItem(window, 'listitemchk');

                //Keyboard Shortcuts
                window.addEventListener('keydown', function(e) {
                    if ((e.target.tagName).toLowerCase() != "html" && (e.target.tagName).toLowerCase() != "body")
                        return;
                    if ((e.target.tagName).toLowerCase() === "textarea")
                        return;
                    switch (e.keyCode) {
                        case 74: //J - Próximo
                            OMUtil.SelectItem("next", window, "listitemchk");
                            break;
                        case 75: //K - Anterior
                            OMUtil.SelectItem("previous", window, "listitemchk");
                            break;
                        case 82: //R - Reply
                            var selected = OMUtil.GetSelectedItem(window);
                            selected.getElementsByClassName('para')[0]
                                    .getElementsByTagName('a')[0].click();
                            e.preventDefault();
                            e.stopPropagation();
                            break;
                        case 68: //D - Delete
                            var selected = OMUtil.GetSelectedItem(window);
                            var rftde = selected.getElementsByClassName('rfdte');
                            if (rftde)
                                if (confirm(Language.DeleteScrap))
                                    rftde[0].getElementsByTagName('a')[0].click();
                            break;
                    }
                }, true)
            }
            catch (ex) {
            }
            // #endregion

            // #region EditSocial | EditProfessional | EditPersonal
            try
            {
                if (!Window.IsPage("/Edit(Social|Professional|Personal)", window))
                    throw "!Edit(Social|Professional|Personal)";
                if (PrefManager.Get("omToolbarEdit"))
                    throw "!noToolbar";
                var Toolbar = OMSystem.OrkutManager.Toolbar.Get();

                var tas = document.getElementById("mboxfull").getElementsByClassName("boxmidlrg")[0];
                tas = tas.getElementsByTagName("textarea");
                var tasLength = tas.length;
                for (i = 0; i < tasLength; i++)
                {
                    var ta = tas[i];
                    ta.style.height = "130px";
                    Toolbar.Create(ta.id, 0, window, true);
                }

            }
            catch (ex) {
            }
            // #endregion

            // #region TestimonialWrite
            try
            {
                if (!Window.IsPage("/TestimonialWrite", window))
                    throw "!TestimonialWrite";
                var Toolbar = OMSystem.OrkutManager.Toolbar.Get();

                Toolbar.Create("countedTextbox", 0, window, true);

                var ta = document.getElementById("countedTextbox");
                var paneId = Orkut.CreatePreviewPane(window, ta.parentNode, unescape(Language.ShowHide), false);
                function PreviewTestimonialText()
                {
                    document.getElementById(paneId).innerHTML = Orkut.Preview(ta.value);
                }
                ta.addEventListener("focus", PreviewTestimonialText, false);
                ta.addEventListener("keyup", PreviewTestimonialText, false);
                ta.addEventListener("blur", PreviewTestimonialText, false);
            }
            catch (ex) {
            }
            // #endregion

            /** Comm **/
            // #region Comm (exclude Communities)
            try
            {
                if (!Window.IsPage("/Comm", window) || Window.IsPage("/Communities", window))
                    throw "!Comm";

                var cmm = 0;
                if ((tmp = window.location.href.match(/cmm=(\d+)/i)) != null)
                    cmm = tmp[1];

                var menuleft = document.getElementById("lbox").getElementsByTagName("table")[0].getElementsByClassName("boxmid")[0];

                if (PrefManager.Get("omEnableMod", "false") === "true") {
                    var modId = OMUtil.GetModTopic(cmm);
                    if (modId)
                    {
                        // Add left button to unset MOD
                        var buttonUnsetMod = Orkut.GetButton(window, unescape(Language.ModUnsetAs), function()
                        {
                            var vals = JSON.parse(PrefManager.Get("ModerationTopic", "[]"));
                            var val = OMUtil.GetFromArrPref(PrefManager.Get("ModerationTopic", "[]"), cmm);
                            if (val)
                            {
                                vals.splice(vals.indexOf(val), 1);
                                PrefManager.Set("ModerationTopic", JSON.strinfy(vals));
                            }
                            window.location.reload();
                        }, "click");

                        var div2 = MenuLeftGetDiv();
                        div2.appendChild(buttonUnsetMod);
                        menuleft.appendChild(div2);
                    }
                }

                // Bookmark
                if (PrefManager.Get("omEnableBookmarks", "true") === "true") {
                    var Bookmark = OMSystem.OrkutManager.Util.Bookmark;
                    Bookmark.BuildSingle(window, document.getElementsByClassName("username")[0].getElementsByTagName("a")[0], "Bookmarks");
                    var br = document.createElement("div");
                    br.style.height = "6px";
                    document.getElementsByClassName("username")[0].insertBefore(br, document.getElementsByClassName("username")[0].getElementsByTagName("br")[0]);
                    document.getElementsByClassName("username")[0].removeChild(document.getElementsByClassName("username")[0].getElementsByTagName("br")[0]);
                }
            }
            catch (ex) {
            }
            // #endregion

            // #region Communities
            try {
                if (!Window.IsPage("/Communities", window))
                    throw "!Communities";

                var cmm = 0;
                if ((tmp = window.location.href.match(/cmm=(\d+)/i)) != null)
                    cmm = tmp[1];

                $("body").addClass("Communities");
                try {
                    window.addEventListener("keydown", function(event) {
                        switch (event.keyCode) {
                            case 74: // J
                                OMUtil.SelectTopic("next", window);
                                break;
                            case 75: // K
                                OMUtil.SelectTopic("previous", window);
                                break;
                            case 13: //Enter
                                var selected = OMUtil.GetSelectedItem(window);
                                if (selected) {
                                    var a = selected.getElementsByTagName('a')[1].href;
                                    if (event.ctrlKey)
                                        gBrowser.addTab(a)
                                    else
                                        window.location.href = a;
                                }
                                break;
                            case 77: //M - Marca pra unjoin
                                var selected = OMUtil.GetSelectedItem(window);
                                if (selected) {
                                    var input = selected.getElementsByTagName('input')[0];
                                    input.checked = !input.checked;
                                }
                                break;
                            case 70: //F - Fórum
                                var selected = OMUtil.GetSelectedItem(window);
                                if (selected) {
                                    var a = selected.getElementsByTagName('a')[0].href;
                                    if (event.ctrlKey)
                                        gBrowser.addTab(a)
                                    else
                                        window.location.href = a;
                                }
                                break;
                        }
                        if (!event.ctrlKey)
                            return;
                        var Trs = document.getElementById("subPage0");
                        Trs = Trs.getElementsByTagName("table")[0];
                        Trs = Trs.getElementsByTagName("tr");

                        var Url = [];
                        for (i = 0; i < 10; ++i) {
                            Url[i] = "javascript:;";
                        }
                        var i = 0;
                        TrsLength = Trs.length;
                        for (index = 0; index < TrsLength; index++) {
                            var Tr = Trs[index];
                            if (!Tr)
                                continue;
                            var a = Tr.getElementsByTagName("a");
                            if (a.length >= 2)
                                a = a[1];
                            else
                                continue;
                            Url[i] = a.href.replace("/Main#", "/");
                            cmmUid = Url[i].match(/cmm=(\d+)/)[1];

                            if (event.altKey)
                                Url[i] = "/Community.aspx?cmm=" + cmmUid;
                            else
                                Url[i] = "/CommTopics.aspx?cmm=" + cmmUid;
                            ++i;
                            if (i >= 10)
                                break;
                        }
                        switch (event.keyCode) {
                            case 49:
                            case 97:
                                window.location.href = Url[0];
                                event.preventDefault();
                                return false;
                            case 98:
                            case 50:
                                window.location.href = Url[1];
                                event.preventDefault();
                                return false;
                            case 99:
                            case 51:
                                window.location.href = Url[2];
                                event.preventDefault();
                                return false;
                            case 100:
                            case 52:
                                window.location.href = Url[3];
                                event.preventDefault();
                                return false;
                            case 101:
                            case 53:
                                window.location.href = Url[4];
                                event.preventDefault();
                                return false;
                            case 102:
                            case 54:
                                window.location.href = Url[5];
                                event.preventDefault();
                                return false;
                            case 103:
                            case 55:
                                window.location.href = Url[6];
                                event.preventDefault();
                                return false;
                            case 104:
                            case 56:
                                window.location.href = Url[7];
                                event.preventDefault();
                                return false;
                            case 105:
                            case 57:
                                window.location.href = Url[8];
                                event.preventDefault();
                                return false;
                            case 48:
                            case 96:
                                window.location.href = Url[9];
                                event.preventDefault();
                                return false;
                        }

                    }, false);
                } catch (ex) {
                }
                var IsEnabledBk = (PrefManager.Get("omEnableBookmarks", "true") === "true");
                var IsEnabledForum = (PrefManager.Get("omEnableForum", "true") === "true");

                if (IsEnabledBk) {
                    var Bookmark = OMSystem.OrkutManager.Util.Bookmark;
                    // Bookmarks
                    try
                    {
                        // Tab Buttons
                        var before = document.getElementById("divBody0").getElementsByTagName("div")[1];
                        var bookmarks = document.createElement("a");
                        bookmarks.setAttribute("onclick", "_displaySubPage(3); return false;");
                        bookmarks.addEventListener("click", function()
                        {
                            document.getElementById("subPage3").innerHTML = "";
                            Bookmark.BuildTabCmm(window, 3);
                            Bookmark.Build(window, document.getElementById("subPage3").getElementsByTagName("table")[0], "Bookmarks", true, IsEnabledForum, IsEnabledBk);
                        }, false);
                        bookmarks.href = "javascript:  void(0);";
                        bookmarks.innerHTML = unescape(Language.Bookmarks);
                        before.parentNode.insertBefore(document.createTextNode(" - "), before);
                        before.parentNode.insertBefore(bookmarks, before);

                        var bookmarksT = document.createElement("a");
                        bookmarksT.setAttribute("onclick", "_displaySubPage(4); return false;");
                        bookmarksT.addEventListener("click", function()
                        {
                            $("#subPage4 table:eq(0)").remove();
                            Bookmark.BuildTabTopic(window, 4);
                            Bookmark.Build(window, document.getElementById("subPage4").getElementsByTagName("table")[0], "Bookmarks.Topic", true, IsEnabledForum, IsEnabledBk);
                        }, false);
                        bookmarksT.href = "javascript: void(0);";
                        bookmarksT.innerHTML = unescape(Language.BookmarksT);

                        before.parentNode.insertBefore(document.createTextNode(" - "), before);
                        before.parentNode.insertBefore(bookmarksT, before);

                        // New tables
                        // subPage2
                        var before = document.getElementById("subPage2").nextSibling;
                        var getTab = function(index) {
                            var div = document.createElement("div");
                            div.id = "subPage" + index;
                            div.style.display = "none";
                            before.parentNode.insertBefore(div, before);
                        };
                        getTab(3);
                        getTab(4);
                        Bookmark.BuildTabCmm(window, 3);
                        Bookmark.BuildTabTopic(window, 4);
                    }
                    catch (ex3) {
                    }
                }
                if (IsEnabledBk || IsEnabledForum) {
                    var Bookmark = OMSystem.OrkutManager.Util.Bookmark;
                    Bookmark.Build(window, document.getElementById("subPage0").getElementsByTagName("table")[0], "Bookmarks", true, IsEnabledForum, IsEnabledBk);
                }
                // Auto-update cmm list
                //@TODO Util2
                UpdateStart = function()
                {
                    var Updater = OMSystem.OrkutManager.Util.Updater;
                    try {
                        oUpdateCmmInterval = sint(function() {
                            if (!oUpdate)
                                Updater.Update(window, "Communities", "");
                        }, (1000 * PrefManager.Get("Update.Delay", 10)));
                    } catch (ex) {
                    }
                };

                if (PrefManager.Get("Update.Communities", "true") === "true")
                    UpdateStart();

                var container = document.getElementById("mbox").getElementsByClassName("topl_lrg")[0];
                //@TODO Util2
                var buttonUpdate = function()
                {
                    var t = (PrefManager.Get("Update.Communities", "true") === "true") ? unescape(Language.Stop) : unescape(Language.Start);
                    t += " " + unescape(Language.Update);
                    return Orkut.GetButton(window, t, function()
                    {
                        if (!oUpdateCmmInterval)
                        {
                            UpdateStart();
                            this.getElementsByTagName("a")[0].innerHTML = unescape(Language.Stop) + " " + unescape(Language.Update);
                        }
                        else
                        {
                            window.clearInterval(oUpdateCmmInterval);
                            oUpdateCmmInterval = undefined;
                            this.getElementsByTagName("a")[0].innerHTML = unescape(Language.Start) + " " + unescape(Language.Update);
                        }
                    }, "click");
                };
                //@TODO Util2
                var buttonUpdateDo = function()
                {
                    var Updater = OMSystem.OrkutManager.Util.Updater;
                    return Orkut.GetButton(window, unescape(Language.Update), function() {
                        Updater.Update(window, "Communities");
                        var text = this.getElementsByTagName("a")[0];
                        OMUtil.LoaderForText(window, text);
                    }, "click");
                };

                if (PrefManager.Get("MassUnjoin.Show", "true") === "true") {
                    orkutsignature = encodeURIComponent(document.getElementsByName('signature')[0].value);
                    orkutPOST_TOKEN = encodeURIComponent(document.getElementsByName('POST_TOKEN')[0].value);
                    var buttonUnjoin = function()
                    {
                        button = Orkut.GetButton(window, unescape(Language.UnjoinSelected), function()
                        {
                            //@TODO lol (?)
                        }, "click");
                        $('a', button).attr('id', 'idSair');
                        return button;
                    };
                }
                var upd = document.createElement("div");
                upd.style.cssFloat = "right";
                upd.appendChild(buttonUpdate());
                upd.appendChild(buttonUpdateDo());

                var sep = document.createElement("span");
                sep.innerHTML = " - ";
                upd.appendChild(sep);
                try {
                    upd.appendChild(buttonUnjoin());
                } catch (ex) {
                }
                container.insertBefore(upd, container.firstChild.nextSibling.nextSibling);

                //@TODO Util2
                $("#idSair").click(function() {
                    $(this).text(Language.unjoiningMsg)
                            .unbind()
                            .bind('click', function() {
                        alert(Language.unjoinBind);
                    });

                    Length = $("input[name='omChk']:checked").length - 1;
                    if (Length > 50)
                        alert(Language.MassUnjoinCmmWarn);

                    $("input[name='omChk']:checked").each(function(i, chk) {
                        var cid = chk.parentNode.getElementsByTagName("a")[0].href.match(/cmm=(\d+)/i)[1];
                        var url = "/Communityunjoin?cmm=" + cid + "&POST_TOKEN=" + (orkutPOST_TOKEN) + "&signature=" + (orkutsignature) + "&Action.unjoin" + "&cache=" + (Math.random() + "cacheee").substring(2, 7);
                        if (chk.checked)
                            $.post(url, function(d) {
                                if (Length === i || i > 50) {
                                    window.location.reload();
                                }
                            });
                    });
                });
            } catch (ex) {
            }
            // #endregion

            // #region Community
            try {
                if (!Window.IsPage("/Community", window) || Window.IsPage("/CommunityList", window))
                    throw "!Community";

                try {
                    MyUid = $("#headerin .menu:eq(0) li:eq(2) a:eq(0)").attr("href");
                    MyUid = (/uid=(\d+)/i).test(MyUid) ? "" + MyUid.match(/uid=(\d+)/i)[1] : "";
                } catch (ex) {
                    MyUid = 0;
                }
                var cmm = 0;
                if ((tmp = window.location.href.match(/cmm=(\d+)/i)) != null)
                    cmm = tmp[1];

                $("body").addClass("Community");

                //Tweet Button
                try {
                    if (!PrefManager.Get("omtweetButton", false))
                        throw "";
                    var script = document.createElement("script");
                    script.type = 'text/javascript';
                    script.src = "http://s7.addthis.com/js/250/addthis_widget.js#pubid=ra-4e7b33235a8c676c";

                    var button = document.createElement("div");
                    button.style.marginTop = "20px";
                    button.className = "addthis_toolbox addthis_default_style";
                    button.innerHTML = '<a class="addthis_button_orkut"></a>\n\
                                <a fb:like:layout="button_count" fb:like:action="recommend" class="addthis_button_facebook"></a>\n\
                                <a tw:via="orkutmanager" class="addthis_button_tweet"></a>\n\
                                <a class="addthis_button_google_plusone"></a>';
                    document.getElementById("mbox").getElementsByTagName("h1")[0].appendChild(button);
                    document.getElementById("mbox").getElementsByTagName("h1")[0].appendChild(script);
                } catch (ex) {
                }

                // Build Bookmarks
                var IsEnabledBk = (PrefManager.Get("omEnableBookmarks", "true") === "true");
                var IsEnabledLast = (PrefManager.Get("omEnableLast", "true") === "true");
                try
                {
                    var Bookmark = OMSystem.OrkutManager.Util.Bookmark;
                    var bkTb = document.getElementsByName("topicsForm")[0].getElementsByTagName("table")[0];
                    Bookmark.Build(window, bkTb, "Bookmarks.Topic", false, IsEnabledLast, IsEnabledBk);
                }
                catch (ex) {
                }

                if (IsEnabledBk) {
                    var Bookmark = OMSystem.OrkutManager.Util.Bookmark;
                    // - panel
                    try
                    {
                        var bkTb = document.getElementsByName("topicsForm")[0];
                        while (bkTb.tagName.toLowerCase() != "table") {
                            bkTb = bkTb.parentNode;
                        }

                        var sel = document.createElement("select");
                        sel.id = "OMBkTopicSel";
                        sel.style.display = "none";
                        var opt = document.createElement("option");
                        opt.value = cmm;
                        opt.innerHTML = cmm;
                        sel.appendChild(opt);
                        document.body.appendChild(sel);

                        var panel = Orkut.GetPanel(window, "<h2 style='margin:5px 0 6px 10px;font-size:15px;font-family:tahoma;line-height:21px;'>" +
                                unescape(Language.Bookmarks).toLowerCase() + "</h2>", "");
                        var contentId = panel.id + "_PanelContent";
                        panel.id = "OMBookmarksT";
                        panel.style.position = "";
                        panel.style.width = "100%";
                        bkTb.parentNode.insertBefore(panel, bkTb.nextSibling);

                        Bookmark.BuildTabTopic(window, contentId);
                        Bookmark.Build(window, document.getElementById(contentId).getElementsByTagName("table")[0], "Bookmarks.Topic", false, IsEnabledLast, IsEnabledBk);
                    }
                    catch (ex) {
                    }
                }

                window.addEventListener("keydown", function(event) {
                    if (!event.ctrlKey)
                        return;
                    var Trs = document.getElementById("mbox");
                    Trs = Trs.getElementsByClassName("displaytable")[0];
                    try {
                        Trs = Trs.getElementsByTagName("tr");
                    } catch (ex) {
                    }

                    var Url = [];
                    for (i = 0; i < 10; ++i) {
                        Url[i] = "javascript:;";
                    }
                    var i = 0;
                    TrsLength = Trs.length;
                    for (index = 0; index < TrsLength; index++) {
                        var Tr = Trs[index];
                        var a = Tr.getElementsByTagName("a");
                        if (a.length >= 2)
                            a = a[1];
                        else
                            continue;
                        Url[i] = a.href.replace("/Main#", "/");
                        ++i;
                        if (i >= 5)
                            break;
                    }

                    switch (event.keyCode) {
                        case 49:
                        case 97:
                            window.location.href = Url[0];
                            event.preventDefault();
                            return false;
                        case 98:
                        case 50:
                            window.location.href = Url[1];
                            event.preventDefault();
                            return false;
                        case 99:
                        case 51:
                            window.location.href = Url[2];
                            event.preventDefault();
                            return false;
                        case 100:
                        case 52:
                            event.preventDefault();
                            return false;
                        case 101:
                        case 53:
                            event.preventDefault();
                            return false;
                    }
                }, false);

                try {
                    // Set isMod
                    var isMod = false;
                    var links = document.getElementById("list_facts").getElementsByTagName("a");
                    for (l = 0; l < links.length; l++)
                    {
                        var link = links[l];
                        if ((/uid=\d+/i).test(link.href))
                        {
                            var uid = "" + link.href.match(/uid=(\d+)/i)[1];
                            if (uid === MyUid)
                            {
                                isMod = true;
                                break;
                            }
                        }
                    }

                } catch (ex) {
                }

                // Join / Unjoin faster
                try
                {
                    var buttonJU = document.getElementById("gsjs_join") || document.getElementById("gsjs_unjoin");
                    buttonJU.href = "javascript:;";
                    buttonJU.addEventListener("click", function()
                    {
                        var action = this.id.match(/unjoin/i) ? "unjoin" : "join";
                        if (action === "unjoin")
                            action = confirm(unescape(Language.UnjoinConfirm)) ? action : undefined;
                        if (!action)
                            return;
                        if (action === "join") {

                            Orkut.Join(window, cmm, orkutPOST_TOKEN, orkutsignature, null);
                        } else {
                            var frm = document.createElement("form");
                            frm.style.display = "none";
                            frm.method = "post";
                            frm.action = "/Community" + action + "?cmm=" + cmm + "&POST_TOKEN=" + (orkutPOST_TOKEN) +
                                    "&signature=" + (orkutsignature) + "&Action." + action;
                            document.body.appendChild(frm);
                            frm.submit();
                        }
                    }, false);
                }
                catch (ex) {
                }

                // Show Pending
                if (isMod)
                {
                    try
                    {
                        var container = document.getElementsByClassName("parabtns")[2];
                        var link = document.createElement("a");
                        var linkhref = "/CommMembers?cmm=" + cmm + "&tab=4&";
                        link.href = linkhref;
                        link.innerHTML = unescape(Language.PendingMember) + "(<span id='OMPendingCmmMember'>0</span>)";

                        container.insertBefore(link, container.firstChild);

                        $.get(linkhref + "&cache=" + (Math.random() + "cacheee").substring(2, 7), function(o)
                        {
                            var value = 0;

                            try
                            {
                                value = (o.match(/id=.mboxfull.((.+|\n+)+)/im))[1];
                                value = value.match(/class=.listitem./gi);
                                value = value.length;
                            }
                            catch (ex) {
                                value = 0;
                            }

                            document.getElementById("OMPendingCmmMember").innerHTML = value;

                            tb = undefined;
                        });
                    }
                    catch (ex) {
                    }
                }

                // Relate community
                try
                {
                    var container = document.getElementById("rbox").getElementsByClassName("module")[1].getElementsByClassName("parabtns")[0];
                    var buttonRelate = Orkut.GetButton(window, unescape(Language.AddRelated), function()
                    {
                        var id = window.prompt(Language.AddRelatedInsertId, "90840394");
                        if (id.match("cmm="))
                            id = id.match(/cmm=(.*)/i)[1];
                        if (!id || !id.match(/^\d+$/))
                            return;
                        var url = {
                            "Action.addRelated": 1
                        }
                        url.POST_TOKEN = $("input[name='POST_TOKEN']").val();
                        url.signature = $("input[name='signature']").val();
                        url.cmm = cmm;
                        url.relatedId = id;

                        $.post("CommunitySearch?" + "&cache=" + (Math.random() + "cacheee").substring(2, 7), url, function() {
                            window.location.reload();
                        });
                    }, "click");

                    container.appendChild(buttonRelate);
                }
                catch (ex) {
                }

                var container = document.getElementsByName("topicsForm")[0].parentNode.getElementsByClassName("parabtns")[0];
                var buttonUpdateDo = function()
                {
                    var Updater = OMSystem.OrkutManager.Util.Updater;
                    return Orkut.GetButton(window, unescape(Language.Update), function() {
                        Updater.Update(window, "Community", cmm);
                        var text = this.getElementsByTagName("a")[0];
                        OMUtil.LoaderForText(window, text);
                    }, "click");
                };

                var PreviewText;
                if (JSON.parse(PrefManager.Get("enablePreviewTopics", false))) {
                    PreviewText = Language.DisablePreviewTopic;
                    OMUtil.previewEvents(window);
                } else {
                    PreviewText = Language.EnablePreviewTopic;
                }

                var buttonPreviewTopics = function() {
                    return Orkut.GetButton(window, unescape(PreviewText), function() {
                        check = JSON.parse(PrefManager.Get("enablePreviewTopics", false));
                        if (check) {
                            PrefManager.Set("enablePreviewTopics", JSON.stringify(false));
                            $(".buttonLupaPreview").remove();
                            this.getElementsByTagName("a")[0].innerHTML = Language.EnablePreviewTopic;
                        } else {
                            PrefManager.Set("enablePreviewTopics", JSON.stringify(true));
                            OMUtil.previewEvents(window);
                            this.getElementsByTagName("a")[0].innerHTML = Language.DisablePreviewTopic;
                        }
                    }, "click");
                };
                container.appendChild(buttonUpdateDo());
                container.appendChild(buttonPreviewTopics());

                // Novo tópico quick reply 
                try {
                    functionQr = function() {
                        var User = OMSystem.OrkutManager.Util.User;
                        User.Load(window);
                        $("#OMerror").hide();
                        if (!document.getElementById("OMQuickReplyContainer")) {
                            var Toolbar = OMSystem.OrkutManager.Toolbar.Get();
                            previewEvent = function() {
                                text = document.getElementById('OMQuickReply').value;
                                text = Orkut.Preview(text, document.body.getAttribute("OMIsHtml"));
                                document.getElementById("OMLeftCharQReply").textContent = 2048 - parseFloat(text.length);
                                document.getElementById('OMPreviewHtm').innerHTML = text;
                            }
                            var qr = document.createElement("textarea");
                            qr.id = "OMQuickReply";
                            qr.style.width = "100%";
                            qr.style.height = "200px";
                            qr.setAttribute("maxlength", "2048");
                            qr.addEventListener("keyup", previewEvent, false);
                            qr.addEventListener("focus", previewEvent, false);
                            qr.addEventListener("blur", previewEvent, false);
                            qr.addEventListener("click", previewEvent, false);

                            qr.addEventListener("keydown", function(e) {
                                var keys = OMUtil.GetSendKeys(e);
                                if (e.keyCode === 13 && keys) {
                                    Orkut.QuickReply(window, "OMQuickReply", window.location.href.match(/cmm=(\d+)/)[1], 0, encodeURIComponent(window.document.getElementsByName('POST_TOKEN')[0].value), encodeURIComponent(window.document.getElementsByName('signature')[0].value), document.getElementById("subject").value, '', Language.Sending);
                                    previewEvent();
                                    e.preventDefault();
                                }
                            }, false);

                            var newDiv = document.createElement("div");
                            newDiv.id = "OMQuickReplyContainer";
                            newDiv.style.margin = "4px 0px";
                            newDiv.appendChild(qr);

                            var buttonSend = Orkut.GetButton(window, unescape(Language.Reply), function() {
                                try {
                                    Orkut.QuickReply(window, "OMQuickReply", window.location.href.match(/cmm=(\d+)/)[1], 0, encodeURIComponent(window.document.getElementsByName('POST_TOKEN')[0].value), encodeURIComponent(window.document.getElementsByName('signature')[0].value), document.getElementById("subject").value, '', Language.Sending);
                                }
                                catch (ex) {
                                }
                            }, "click");

                            buttonSend.id = "QreplyButtonSend";
                            buttonSend.setAttribute("title", OMUtil.GetSendKeysText() + "-Enter");
                            newDiv.appendChild(buttonSend);

                            var divCharLeft = document.createElement("div");
                            divCharLeft.id = "OMLeftCharQReply";
                            divCharLeft.style.cssFloat = "right";
                            divCharLeft.style.fontWeight = "bold";
                            divCharLeft.textContent = "2048";
                            newDiv.appendChild(divCharLeft);

                            var preview = document.createElement("div");
                            preview.setAttribute("class", "listitem");
                            preview.innerHTML = '<span class="listfl" style="width: 100px;">Preview: </span> <div class="listp" style="word-wrap: break-word;" id="OMPreviewHtm"></div></div>';
                            newDiv.appendChild(preview);

                            return newDiv
                        } else {
                            var qr = document.getElementById("OMQuickReplyContainer");
                            if (qr.style.display === "none")
                                qr.style.display = "";
                            else
                                qr.parentNode.removeChild(qr)

                            var removeUnload = document.createElement('script');
                            removeUnload.innerHTML = 'window.onbeforeunload = null';
                            document.body.appendChild(removeUnload);
                        }
                    };
                    var el = document.getElementsByName('topicsForm')[0]
                            .parentNode.getElementsByClassName('parabtns')[0]
                            .getElementsByClassName('btn')[0];
                    el.href = 'javascript:void(0);';
                    el.addEventListener('click', function() {
                        jQuery("form[name=topicsForm]").parent().find('.parabtns:eq(0)').after(functionQr)
                        try {
                            $.get("/CommMsgPost?cmm=" + cmm + "&tid=0&", function(o) {
                                var m = o.match(/id=.charCount.(.+)/i)[1];
                                m = m.match(/HTML.{10,}\.\s*$/i);
                                var IsHtml = (m != null);

                                document.body.setAttribute("OMIsHtml", IsHtml ? 1 : 0);
                                Toolbar = OMSystem.OrkutManager.Toolbar.Get();
                                if (PrefManager.Get("omToolbarqReply")) {
                                    Toolbar.Create("OMQuickReply", document.body.getAttribute("OMIsHtml"), window);
                                }
                                var subjectArea = document.createElement("div");
                                subjectArea.innerHTML = '<div style="width: 5% !important;" class="listfl"></div><select name="OMtagSelect"><option value="">TAG</option>' + getTags() + '</select><div class="listp">Assunto:<input type="text" value="" size="50" maxlength="50" name="subjectText" id="subject" gtbfieldid="1"></div>';
                                var el = document.getElementById('OMQuickReply');
                                el.parentNode.insertBefore(subjectArea, el);
                                el.focus();
                                try {
                                    document.getElementById("OMQuickReplyContainer").insertBefore(subjectArea, document.getElementById("OMQuickReply"));
                                    $("[name='OMtagSelect']").change(function() {
                                        var val = $("[name='OMtagSelect'] option:selected").val();
                                        document.getElementById('subject').value = val + ' ' + document.getElementById('subject').value;
                                    });
                                } catch (ex) {
                                }
                                if (PrefManager.Get('omWarninLeave', true)) {
                                    var newScript = document.createElement('script');
                                    newScript.innerHTML = 'window.onbeforeunload=function(){return "Deseja mesmo sair da página?"}';
                                    document.getElementsByTagName('head')[0].appendChild(newScript);
                                }
                            });
                        } catch (ex) {
                        }
                    }, true);
                } catch (ex) {
                }
            } catch (ex) {
            }
            // #endregion

            try {
                if (!Window.IsPage("/CommPolls", window))
                    throw "";
                //Check if is Mod
                if ($(".displaytable .ac.nw").length === 0)
                    return;

                //Set as Selected when clicking on the tr
                var trs = window.document.getElementsByClassName('displaytable')[0]
                        .getElementsByTagName('tr');
                for (var i = 1; i < trs.length; i++) {
                    trs[i].addEventListener('click', function() {
                        OMUtil.SelectObject(this.getElementsByTagName('td')[0], window);
                    }, true)
                }

                //Key down
                window.addEventListener("keydown", function(event) {
                    switch (event.keyCode) {
                        case 74://j
                            OMUtil.SelectTopic("next", window);
                            break;
                        case 75: //k
                            OMUtil.SelectTopic("previous", window)
                            break;
                        case 13: //enter
                            var selected = OMUtil.GetSelectedItem(window);
                            if (!selected)
                                break;
                            var a = selected.parentNode.getElementsByTagName('a')[0].href;
                            if (event.ctrlKey)
                                gBrowser.addTab(a);
                            else
                                window.location.href = a;
                            break;
                        case 83: //s
                            var selected = OMUtil.GetSelectedItem(window);
                            var item = selected.getElementsByClassName('normcheck')[0]
                            item.checked = !item.checked;
                            break;
                    }
                }, true);

                buttonDeleteAll = Orkut.GetButton(window, unescape(Language.deleteAllPolls), function() {
                    $("a", this).text(Language.deletingAllPolls).unbind();
                    var chks = $(".delcheck .normcheck:checked:enabled").length;
                    $(".delcheck .normcheck:checked:enabled").each(function(i) {
                        var val = $(this).val()
                        val = val.split("_");
                        var pct = val[0];
                        var pid = val[1];
                        $.ajax({
                            type: "POST",
                            url: window.location.href + "&cache="
                                    + (Math.random() + "cacheee").substring(2, 7),
                            data: "&POST_TOKEN=" + orkutPOST_TOKEN +
                                    "&signature=" + orkutsignature + "&pid=" + pid
                                    + "&pct=" + pct + "&Action.delete_poll=Submit",
                            success: function(newdoc, textStatus, o)
                            {
                                if (i === chks - 1)
                                    window.location.reload();
                            }
                        });
                    });
                }, "click");
                $("[name=pollsForm] .parabtns").append(buttonDeleteAll);
            } catch (ex) {
            }
            // #region Community | CommPollResults
            try
            {
                if (!Window.IsPage("/Community", window) && !Window.IsPage("/CommPollResults", window))
                    throw "!Community | CommPollResults";
                // Pool meter styles
                var cmm = 0;
                if ((tmp = window.location.href.match(/cmm=(\d+)/i)) != null)
                    cmm = tmp[1];

                var pcs = document.getElementsByClassName("percentbarinner");
                var pcsLength = pcs.length;
                for (var p = 0; p < pcsLength; p++) {
                    var pc = pcs[p];
                    if (!pc || !pc.style)
                        continue;
                    // red | gold | #00CC33
                    var width = parseInt(pc.style.width.replace(/px|\%/i, ""));

                    if (width < 15)
                    {
                        pc.parentNode.style.border = "1px solid silver";
                        pc.style.backgroundColor = "red";
                    }
                    else if (width < 25)
                    {
                        pc.parentNode.style.border = "1px solid silver";
                        pc.style.backgroundColor = "orange";
                    }
                    else if (width < 50)
                    {
                        pc.parentNode.style.border = "1px solid silver";
                        pc.style.backgroundColor = "gold";
                    }
                }
            }
            catch (ex) {
            }

            // #region CommMsgs
            try {
                if (!Window.IsPage("/CommMsgs", window))
                    throw "!CommMsgs";

                var cmm = 0;
                if ((tmp = window.location.href.match(/cmm=(\d+)/i)) != null)
                    cmm = tmp[1];
                var tid = 0;
                if ((tmp = window.location.href.match(/tid=(\d+)/i)) != null)
                    tid = tmp[1];

                var User = OMSystem.OrkutManager.Util.User;
                User.Load();

                $("body").addClass("CommMsgs");

                //Handle Errors
                try {
                    var divError = document.getElementById("mboxfullr").getElementsByClassName("promobg");
                    var HasErrors = divError.length;
                    if (HasErrors > 0) {
                        var newLinks = document.createElement("div");
                        var cmmUrl = window.location.href.match(/cmm=(\d+)?/)[1];
                        newLinks.innerHTML = "<br /> <a href='" + window.location.href + "'>Recarregar</a> <br /><a href='http://www.orkut.com.br/Main#Community?cmm=" + cmmUrl + "'>Voltar para comunidade</a><br /> <a href='http://www.orkut.com.br/Main#CommTopics?cmm=" + cmmUrl + "'>Fórum da comunidade</a>"
                        divError[0].appendChild(newLinks);
                    }
                } catch (ex) {
                }

                // Lastpage after reply
                try
                {
                    var goLast = (window.location.href.match(/&na=4/) && !window.location.href.match(/&nid=\d+/));
                    var nav = document.getElementsByClassName("boxmidlrg")[0].getElementsByTagName('span')[0].getElementsByTagName('a');
                    if (goLast && nav.length === 2)
                        window.location.href = window.location.href.replace(/&na=4/, "&na=2") + "&scroll=-1";
                    else if (goLast)
                        sto(function() {
                            window.scrollBy(0, (parseInt(document.body.scrollHeight) + 9999));
                        }, 700);
                }
                catch (ex) {
                }

                try {
                    var imgs = document.getElementById('mboxfull').getElementsByClassName('listimg');
                    imgsl = imgs.length;
                    for (i = 0; i < imgsl; i++) {
                        img = imgs[i];
                        img.addEventListener('mouseover', function(e) {
                            PreviewProfileInter = setTimeout(function() {
                                OMUtil.ProfilePreview(e, window);
                            }, 1000);
                        }, true);
                        img.addEventListener('mouseout', function() {
                            clearTimeout(PreviewProfileInter);
                            setTimeout(function() {
                                if (JSON.parse(localStorage["omEnableClosePreview"]))
                                    window.document.getElementById("omPreViewTopic").style.display = "none";
                            }, 550);
                        }, true);

                    }
                } catch (ex) {
                }
                //Select Post on click
                OMUtil.BindSelectItem(window, 'listitem');

                /*Keyboard shortcuts*/
                window.addEventListener("keydown", function(event) {
                    if (event.altKey && event.keyCode === 77) {
                        window.location.href = window.location.href.replace(/&refresh=([^$]+|[^&]+)/i, "") + "&refresh=" + Math.random();
                        return;
                    }
                    if ((event.target.tagName).toLowerCase() != "html" && (event.target.tagName).toLowerCase() != "body")
                        return;
                    if ((event.target.tagName).toLowerCase() === "textarea")
                        return;

                    if (!event.altKey) {
                        //J, K, D, S                
                        switch (event.keyCode) {
                            case 74: //J - Next
                                OMUtil.SelectItem('next', window, "listitem");
                                break;
                            case 75: //K - Previous
                                OMUtil.SelectItem('previous', window, "listitem");
                                break;
                            case 68: //D - Deletar
                                if (!IsMod)
                                    break;
                                var selected = OMUtil.GetSelectedItem(window);
                                if (!selected)
                                    break;
                                if (confirm(Language.deletePostConfirm))
                                    selected.getElementsByClassName('rfdte')[0]
                                            .getElementsByTagName('form')[0]
                                            .getElementsByTagName('a')[0].click()
                                break;
                            case 81: //Q - Quota
                                var selected = OMUtil.GetSelectedItem(window);
                                selected.getElementsByClassName('rfdte')[0]
                                        .getElementsByClassName('om_quote_btn')[0]
                                        .getElementsByTagName('span')[1].click()
                                e.preventDefault();
                                e.stopPropagation();
                                break;
                            case 77:// M - Marca pra deletar
                                if (!IsMod)
                                    break;
                                var selected = OMUtil.GetSelectedItem(window);

                                var item = selected.getElementsByClassName("mass_delete_posts")[0];
                                item.checked = !item.checked
                                break;
                        }
                    }
                    //event.target.nodeName
                    if (event.shiftKey)
                        return;
                    var ControlNavigation = document.getElementById("mboxfull");
                    if (!ControlNavigation)
                        return;
                    var KeyUp = 38;
                    var KeyDown = 40;
                    var KeyLeft = 37;
                    var KeyRight = 39;
                    if (event.shiftKey)
                        return;
                    var ControlNavigation = document.getElementById("mboxfull");
                    if (!ControlNavigation)
                        return;
                    ControlNavigation = ControlNavigation.getElementsByTagName("table")[0];
                    ControlNavigation = ControlNavigation.getElementsByTagName("tr")[1];
                    ControlNavigation = ControlNavigation.getElementsByTagName("span")[0];
                    var Links = ControlNavigation.getElementsByTagName("a");
                    if (Links.length === 4) {
                        NavFirst = Links[0].href;
                        NavPrev = Links[1].href;
                        NavForw = Links[2].href;
                        NavLast = Links[3].href;
                    }
                    else if (ControlNavigation.firstChild.nextSibling.tagName.toLowerCase() != "span") {
                        NavFirst = Links[0].href;
                        NavPrev = Links[1].href;
                    }
                    else {
                        try {
                            NavForw = Links[0].href;
                        } catch (ex) {
                        }
                        try {
                            NavLast = Links[1].href;
                        } catch (ex) {
                        }
                    }

                    switch (event.keyCode) {
                        case KeyLeft:
                            window.location.href = NavPrev;
                            return;
                        case KeyRight:
                            window.location.href = NavForw;
                            return;
                        case KeyUp:
                            window.location.href = NavFirst;
                            return;
                        case KeyDown:
                            window.location.href = NavLast;
                            return;
                    }
                }, false);

                // Top buttons
                var container = document.getElementById('mboxfull').getElementsByClassName('topl_g')[0];
                var containerdiv = document.createElement("div");
                containerdiv.style.cssFloat = "right";

                // - Moderation control
                if (PrefManager.Get("omEnableMod", "false") === "true") {
                    var IsMod = document.getElementById('mboxfull').getElementsByClassName('icnmanage').length > 0;
                    if (!IsMod)
                        IsMod = document.getElementById('mboxfull').getElementsByClassName('boxmidlrg')[0].getElementsByClassName('listitem').length === 0;


                    var hasModTopic = false;
                    var check = JSON.parse(PrefManager.Get("ModerationTopic", "[]"));
                    var vals = JSON.parse(PrefManager.Get("ModerationTopic", "[]"));
                    check = (OMUtil.GetModTopic(cmm) > 0);
                    hasModTopic = check;

                    if (IsMod)
                    {
                        var check = JSON.parse(PrefManager.Get("ModerationTopic", "[]"));
                        check = (check.indexOf(cmm + "|" + tid) != -1);
                        var buttonModSetText = check ? unescape(Language.ModUnsetAs) : unescape(Language.ModSetAs);
                        var buttonModSet = Orkut.GetButton(window, buttonModSetText, function()
                        {
                            // cmm|tid
                            var vals = JSON.parse(PrefManager.Get("ModerationTopic", "[]"));
                            var check = JSON.parse(PrefManager.Get("ModerationTopic", "[]"));
                            check = (check.indexOf(cmm + "|" + tid) != -1);

                            for (v = 0; v < vals.length; v++)
                            {
                                var val = vals[v];
                                if (!val || !val.split)
                                    continue;
                                var block = val.split("|");
                                if (block[0] === cmm)
                                {
                                    vals.splice(vals.indexOf(val), 1);
                                    PrefManager.Set("ModerationTopic", JSON.stringify(vals));
                                }
                            }

                            if (!check)
                            {
                                vals.push(cmm + "|" + tid);
                                PrefManager.Set("ModerationTopic", JSON.stringify(vals));
                            }

                            this.getElementsByTagName("a")[0].innerHTML = (check ? unescape(Language.ModSetAs) : unescape(Language.ModUnsetAs));
                        }, "click");
                        buttonModSet.style.cssFloat = "right";
                        buttonModSet.id = "OMButtonModSetAs";

                        // ModDo
                        if (!check)
                        {
                            var buttonMod = Orkut.GetButton(window, unescape(Language.ModDo), function()
                            {
                                var tid2 = OMUtil.GetModTopic(cmm);

                                var u = document.getElementsByClassName("smller")[0].getElementsByTagName("a")[0];
                                var SpecialCharacters = OMSystem.OrkutManager.Util.SpecialCharacters;

                                var user = escape(u.innerHTML.replace(String.fromCharCode(SpecialCharacters.RevertText), " ", "g"));
                                var uid = u.href.match(/uid=(\d+)/i)[1];
                                var userLink = u.href.match(/uid=(\d+)/i)[0];
                                var title = escape(document.getElementById("mboxfull").getElementsByTagName("h1")[0].innerHTML);
                                var msg = escape(document.getElementsByClassName("para")[0].innerHTML);

                                var node = user + "|" + userLink + "|" + title + "|" + msg;
                                PrefManager.Set("Moderation", node);

                                window.open(window.location.href.match(/^https?:\/\/.*?\//) + "/Main#CommMsgPost?cmm=" + cmm + "&tid=" + tid2 + "&mt=1");

                                if (PrefManager.Get("ModerationOnModUserManage", "true") === "true")
                                    window.open(window.location.href.match(/^https?:\/\/.*?\//) + "/Main#CommMemberManage?cmm=" + cmm + "&uid=" + uid + "&s=om");

                                if (PrefManager.Get("ModerationOnModDelete", "true") === "true")
                                {
                                    var confirm = true;

                                    if (confirm)
                                    {
                                        $("form[name='topicsForm']").parent().find("form:eq(1) span a").click();
                                    }
                                }
                            }, "click");
                            buttonMod.style.clear = "both";
                            buttonMod.style.cssFloat = "right";

                            containerdiv.insertBefore(buttonMod, containerdiv.firstChild);
                            containerdiv.insertBefore(document.createElement("br"), buttonMod);
                        }
                        containerdiv.insertBefore(buttonModSet, containerdiv.firstChild);
                    }
                }

                //Button Notify
                var TpcName = document.getElementById("mboxfull");
                TpcName = TpcName.getElementsByTagName("table")[0].getElementsByClassName("topl_g")[0];
                TpcName = TpcName.getElementsByTagName("h1")[0].textContent;
                var Tpctid = window.location.href.match(/tid=(\d+)/i)[1];
                check = JSON.parse(PrefManager.Get("omNotifyTpcsMarked", "[]"));
                var isSet = (check.indexOf(cmm + "|" + Tpctid + "|" + TpcName) != -1);
                var Notify_text = isSet ? Language.UnMarkNotify : Language.MarkNotify;
                var buttonNotify = Orkut.GetButton(window, Notify_text, function() {
                    var TpcName = document.getElementById("mboxfull");
                    TpcName = TpcName.getElementsByTagName("table")[0].getElementsByClassName("topl_g")[0];
                    TpcName = TpcName.getElementsByTagName("h1")[0].textContent;
                    var Tpctid = window.location.href.match(/tid=(\d+)/i)[1];
                    var check = JSON.parse(PrefManager.Get("omNotifyTpcsMarked", "[]"));
                    var isSet = (check.indexOf(cmm + "|" + Tpctid + "|" + TpcName) != -1);
                    if (isSet) {
                        for (vc = 0; vc < check.length; vc++)
                        {
                            var val = check[vc];
                            if (!val || !val.split)
                                continue;
                            var block = val.split("|");
                            if (block[1] === Tpctid)
                            {
                                check.splice(check.indexOf(val), 1);
                                PrefManager.Set("omNotifyTpcsMarked", JSON.stringify(check));
                            }
                        }
                        document.getElementById("omSetNotify").getElementsByTagName("a")[0].textContent = Language.MarkNotify;
                    } else {
                        var Tpctid = window.location.href.match(/tid=(\d+)/i)[1];
                        var TpcPosts = document.getElementById("mboxfull").getElementsByClassName("rf")[0].parentNode.getElementsByTagName("b")[1].innerHTML;
                        OMSystem.OrkutManager.PrefManager.Set("omNotifyTpc" + cmm + Tpctid, TpcPosts.replace(".", "").replace(",", ""));
                        var TpcName = document.getElementById("mboxfull");
                        TpcName = TpcName.getElementsByTagName("table")[0].getElementsByClassName("topl_g")[0];
                        TpcName = TpcName.getElementsByTagName("h1")[0].textContent;
                        check.push(cmm + "|" + tid + "|" + TpcName);
                        PrefManager.Set("omNotifyTpcsMarked", JSON.stringify(check));
                        document.getElementById("omSetNotify").getElementsByTagName("a")[0].textContent = Language.UnMarkNotify;
                    }
                }, "click");
                buttonNotify.style.cssFloat = "right";
                buttonNotify.id = "omSetNotify";
                containerdiv.insertBefore(buttonNotify, containerdiv.firstChild);

                //Check if the topic is set to Notifications, update total posts for no repeated warnings
                if (isSet) {
                    var TpcPosts = document.getElementById("mboxfull").getElementsByClassName("rf")[0].parentNode.getElementsByTagName("b")[1].innerHTML;
                    TpcPosts = TpcPosts.replace(".", "").replace(",", "");
                    OMSystem.OrkutManager.PrefManager.Set("omNotifyTpc" + cmm + Tpctid, TpcPosts);
                }

                // - end top buttons
                var h1 = document.getElementById('mboxfull').getElementsByClassName('topl_g')[0].getElementsByTagName('h1')[0];
                container.insertBefore(containerdiv, h1);


                var isInCmm = document.getElementsByClassName("disabledtext");
                isInCmm = !(isInCmm.length > 0);

                // Messages Box
                // Fix Messages
                var msgs = document.getElementById('mboxfull').getElementsByClassName('para');

                for (i = 0; i < msgs.length; i++) {
                    var msg = msgs[i];
                    if (!msg || (msg && !msg.innerHTML))
                        continue;
                    msge = msg.innerHTML.replace(/<wbr.?>/g, "");
                    msge = msg.innerHTML.replace(/&lt;br&gt;/g, "<br />");
                    msg.innerHTML = msge;
                }

                // Delete button for moderation
                if (IsMod && (PrefManager.Get("ModerationOnDeleteModPost", "true") === "true") && (PrefManager.Get("omEnableMod", "false") === "true"))
                {
                    var buttons = document.getElementsByClassName("btn");
                    for (i = 0; i < buttons.length; i++)
                    {
                        var button = buttons[i];
                        if (!button || (button && !button.getAttribute))
                            continue;
                        var click = button.getAttribute("onclick");
                        if (click && click.indexOf("_submitForm(this, 'delete', '');") != -1)
                        {

                            button.parentNode.addEventListener("click", function()
                            {
                                var SpecialCharacters = OMSystem.OrkutManager.Util.SpecialCharacters;

                                var u = this.parentNode.parentNode.parentNode.getElementsByClassName("smller")[0].getElementsByTagName("a")[0];
                                var user = escape(u.innerHTML.replace(String.fromCharCode(SpecialCharacters.RevertText), " ", "g"));
                                var uid = u.href.match(/uid=(\d+)/i)[1];
                                var userLink = u.href.match(/uid=(\d+)/i)[0];
                                var title = escape(document.getElementById("mboxfull").getElementsByTagName("h1")[0].innerHTML);
                                var msg = escape(this.parentNode.parentNode.parentNode.getElementsByClassName("para")[0].innerHTML);


                                var node = user + "|" + userLink + "|" + title + "|" + msg;

                                var confirm = (PrefManager.Get("ModerationOnDeleteModPost", "true") === "true");
                                if (PrefManager.Get("ModerationOnModModConfirm", "true") === "true")
                                    confirm = window.confirm(unescape(Language.ModConfirm));

                                PrefManager.Set("Moderation", node);
                                if (confirm)
                                {
                                    var vals = JSON.parse(PrefManager.Get("ModerationTopic", ""));

                                    var tid = 0;
                                    for (v = 0; v < vals.length; v++)
                                    {
                                        var val = vals[v];
                                        if (!val || !val.split)
                                            continue;
                                        var block = val.split("|");
                                        if (block[0] === cmm)
                                        {
                                            tid = block[1];
                                            break;
                                        }
                                    }
                                    window.open(window.location.href.match(/^https?:\/\/.*?\//) + "/Main#CommMsgPost?cmm=" + cmm + "&tid=" + tid + "&mt=1");
                                    if (PrefManager.Get("ModerationOnModUserManage", "true") === "true")
                                        window.open(window.location.href.match(/^https?:\/\/.*?\//) + "/Main#CommMemberManage?cmm=" + cmm + "&uid=" + uid + "&s=om");
                                }
                            }, false);
                        }
                    }
                }

                // Quote
                var postMenus = document.getElementsByClassName("boxmidlrg")[0];
                postMenus = postMenus.getElementsByClassName("rfdte");
                for (i = 0; i < postMenus.length; i++)
                {
                    var postMenu = postMenus[i];
                    if (!postMenu || (postMenu && !postMenu.insertBefore))
                        continue;
                    var buttext = isInCmm ? unescape(Language.Quote) : "<span class='disabledtext'>" + unescape(Language.Quote) + "</span>";
                    var buttonQuote =
                            Orkut.GetButton(window, buttext, function(e)
                    {
                        if (!isInCmm)
                            return;
                        PrefManager.Clear("SavedText");
                        var userid = this.parentNode.parentNode.getElementsByTagName("a");
                        if (userid) {
                            try {
                                if (userid[2]) {
                                    userid = userid[2].href;
                                } else {
                                    userid = userid[1].href;
                                }
                                userid = userid.match(/uid=(\d+)/i)[1]
                            } catch (ex) {
                            }
                        } else {
                            userid = 0;
                        }
                        var uimg = (this.parentNode.parentNode.getElementsByClassName("listimg")[0]).src;
                        var userName = this.parentNode.parentNode.getElementsByTagName("h3")[0];
                        userName = userName.getElementsByTagName("a")[0];
                        userName = userName.innerHTML ? userName.innerHTML : (userName.parentNode.parentNode.getElementsByTagName("img")[0]).title;
                        var re = new RegExp(String.fromCharCode("8238"), "g");
                        userName = userName.replace(re, "");
                        var time = this.parentNode.innerHTML.replace(/<(.+)>/g, "").replace(/\n/g, " ").replace(/\s*$/, "").replace(/^\s*/, "");
                        var msgsubject;
                        try {
                            msgsubject = this.parentNode.parentNode.getElementsByTagName("h3")[1].textContent;
                        } catch (ex) {
                            msgsubject = "";
                        }
                        try {
                            cmm = window.location.href.match(/cmm=(\d+)/)[1];
                        } catch (ex) {
                            tid = 0;
                        }
                        try {
                            tid = window.location.href.match(/tid=(\d+)/)[1];
                        } catch (ex) {
                            tid = 0;
                        }
                        var tpcurl = '/CommMsgs?cmm=' + cmm + "&tid=" + tid;
                        var posturl = jQuery('a:last', this.parentNode).attr('href');
                        var msg;
                        window.getSelection().removeAllRanges();
                        msg = this.parentNode.parentNode.lastChild.previousSibling.innerHTML.substr(1);

                        if (!msg)
                            return;

                        var el = this.getElementsByTagName("span")[1];
                        el.innerHTML = (check ? unescape(Language.Quote) : unescape(Language.QuoteMarked));

                        functionQr();

                        var i = 0;

                        i++;
                        var IsHtml = $("body").attr("omishtml");
                        var fullimg = uimg.replace(/small/, 'medium');
                        msg = Orkut.HandleQuote(IsHtml, msg);
                        var currentdate = OMUtil.omTime(OMSystem.OrkutManager.PrefManager.Get("TimeFormat"), Language);

                        try {
                            userName = userName.replace(/text-shadow:\s/ig, 'text shadow');
                        } catch (ex) {
                        }
                        try {
                            msg = msg.replace(/text-shadow:\s/ig, '');
                        } catch (ex) {
                        }
                        if (IsHtml) {

                            if (tid === "5539170806300943845" || tid === "5490085033684148933") {
                                User.QuoteTextHtml = "$USER$ @ $TIME$";
                                User.HQuoteHeaderB = '<div style="padding:2px 5px;background:#87CEFA;font-size:75%;margin-top:4px">Quote (';
                                User.HQuoteHeaderE = ")</div>";
                                User.HQuoteMessageB = '<div style="border:2px solid #87CEFA;padding:2px 3px;background:#C8E1FF;font-size:90%">';
                                User.HQuoteMessageE = "<div align='right'>[link=/Community?cmm=90840394]Orkut Manager[/link]</div></div>";

                                var tmp = document.createElement("div");
                                msg = msg.replace(/<br.*?>/g, String.fromCharCode(160) + "\n");
                                tmp.innerHTML = msg;
                                msg = tmp.textContent;
                            }
                            var quoteText = User.QuoteTextHtml.replace(/\$USER\$/g, userName)
                                    .replace(/\$TIME\$/g, time)
                                    .replace(/\$UID\$/g, userid)
                                    .replace(/\$CURRENTDATE\$/g, currentdate)
                                    .replace(/\$FUIMG\$/g, fullimg)
                                    .replace(/\$RAND\$/g, "[gray]" + Math.random() + "[/gray]")
                                    .replace(/\$SUBJ\$/g, msgsubject)
                                    .replace(/\$POSTURL\$/g, posturl)
                                    .replace(/\$TPCURL\$/g, tpcurl)
                                    .replace(/\$UIMG\$/g, uimg);

                            User.HQuoteHeaderB = User.HQuoteHeaderB.replace(/\$USER\$/g, userName)
                                    .replace(/\$TIME\$/g, time)
                                    .replace(/\$UID\$/g, userid)
                                    .replace(/\$CURRENTDATE\$/g, currentdate)
                                    .replace(/\$FUIMG\$/g, fullimg)
                                    .replace(/\$RAND\$/g, "[gray]" + Math.random() + "[/gray]")
                                    .replace(/\$SUBJ\$/g, msgsubject)
                                    .replace(/\$POSTURL\$/g, posturl)
                                    .replace(/\$TPCURL\$/g, tpcurl)
                                    .replace(/\$UIMG\$/g, uimg);

                            User.HQuoteHeaderE = User.HQuoteHeaderE.replace(/\$USER\$/g, userName)
                                    .replace(/\$TIME\$/g, time)
                                    .replace(/\$UID\$/g, userid)
                                    .replace(/\$CURRENTDATE\$/g, currentdate)
                                    .replace(/\$FUIMG\$/g, fullimg)
                                    .replace(/\$RAND\$/g, "[gray]" + Math.random() + "[/gray]")
                                    .replace(/\$SUBJ\$/g, msgsubject)
                                    .replace(/\$POSTURL\$/g, posturl)
                                    .replace(/\$TPCURL\$/g, tpcurl)
                                    .replace(/\$UIMG\$/g, uimg);

                            User.HQuoteMessageB = User.HQuoteMessageB.replace(/\$USER\$/g, userName)
                                    .replace(/\$TIME\$/g, time)
                                    .replace(/\$UID\$/g, userid)
                                    .replace(/\$CURRENTDATE\$/g, currentdate)
                                    .replace(/\$FUIMG\$/g, fullimg)
                                    .replace(/\$RAND\$/g, "[gray]" + Math.random() + "[/gray]")
                                    .replace(/\$SUBJ\$/g, msgsubject)
                                    .replace(/\$POSTURL\$/g, posturl)
                                    .replace(/\$TPCURL\$/g, tpcurl)
                                    .replace(/\$UIMG\$/g, uimg);

                            User.HQuoteMessageE = User.HQuoteMessageE.replace(/\$USER\$/g, userName)
                                    .replace(/\$TIME\$/g, time)
                                    .replace(/\$UID\$/g, userid)
                                    .replace(/\$CURRENTDATE\$/g, currentdate)
                                    .replace(/\$FUIMG\$/g, fullimg)
                                    .replace(/\$RAND\$/g, "[gray]" + Math.random() + "[/gray]")
                                    .replace(/\$SUBJ\$/g, msgsubject)
                                    .replace(/\$POSTURL\$/g, posturl)
                                    .replace(/\$TPCURL\$/g, tpcurl)
                                    .replace(/\$UIMG\$/g, uimg);

                            if (msg.substring(msg.length - 4).toLowerCase() === "<br>")
                                msg = msg.substring(0, msg.length - 4);

                            setTimeout(function() {
                                var valA = "";
                                if (User.omNameShadow.length > 1) {
                                    valA = User.omNameShadow + "\n";
                                }
                                valA = valA + User.HQuoteHeaderB + quoteText + User.HQuoteHeaderE +
                                        User.HQuoteMessageB + msg + User.HQuoteMessageE + "\n" + User.HColorB;
                                var valB = User.HColorE + "\n" + User.HSignature;
                                $("#OMQuickReply").val(valA + valB).setCursorPosition(valA.length);

                                window.scrollBy(0, (parseInt(document.body.scrollHeight) + 9999));
                            }, 50);
                        } else {
                            /// @Todo: Função repetida, colocar no utils (verificar onde mais é chamada)
                            var quoteText = User.QuoteText.replace(/\$USER\$/g, userName)
                                    .replace(/\$TIME\$/g, time)
                                    .replace(/\$CURRENTDATE\$/g, currentdate)
                                    .replace(/\$RAND\$/g, "[gray]" + Math.random() + "[/gray]")
                                    .replace(/\$SUBJ\$/g, msgsubject)
                                    .replace(/\$POSTURL\$/g, posturl)
                                    .replace(/\$TPCURL\$/g, tpcurl)
                                    .replace(/\$UID\$/g, userid);

                            User.HQuoteHeaderB = User.HQuoteHeaderB.replace(/\$USER\$/g, userName)
                                    .replace(/\$TIME\$/g, time)
                                    .replace(/\$CURRENTDATE\$/g, currentdate)
                                    .replace(/\$RAND\$/g, "[gray]" + Math.random() + "[/gray]")
                                    .replace(/\$SUBJ\$/g, msgsubject)
                                    .replace(/\$POSTURL\$/g, posturl)
                                    .replace(/\$TPCURL\$/g, tpcurl)
                                    .replace(/\$UID\$/g, userid);

                            User.HQuoteHeaderE = User.HQuoteHeaderE.replace(/\$USER\$/g, userName)
                                    .replace(/\$TIME\$/g, time)
                                    .replace(/\$CURRENTDATE\$/g, currentdate)
                                    .replace(/\$RAND\$/g, "[gray]" + Math.random() + "[/gray]")
                                    .replace(/\$SUBJ\$/g, msgsubject)
                                    .replace(/\$POSTURL\$/g, posturl)
                                    .replace(/\$TPCURL\$/g, tpcurl)
                                    .replace(/\$UID\$/g, userid);

                            User.HQuoteMessageB = User.HQuoteMessageB.replace(/\$USER\$/g, userName)
                                    .replace(/\$TIME\$/g, time)
                                    .replace(/\$CURRENTDATE\$/g, currentdate)
                                    .replace(/\$RAND\$/g, "[gray]" + Math.random() + "[/gray]")
                                    .replace(/\$SUBJ\$/g, msgsubject)
                                    .replace(/\$POSTURL\$/g, posturl)
                                    .replace(/\$TPCURL\$/g, tpcurl)
                                    .replace(/\$UID\$/g, userid);

                            User.HQuoteMessageE = User.HQuoteMessageE.replace(/\$USER\$/g, userName)
                                    .replace(/\$TIME\$/g, time)
                                    .replace(/\$CURRENTDATE\$/g, currentdate)
                                    .replace(/\$RAND\$/g, "[gray]" + Math.random() + "[/gray]")
                                    .replace(/\$SUBJ\$/g, msgsubject)
                                    .replace(/\$POSTURL\$/g, posturl)
                                    .replace(/\$TPCURL\$/g, tpcurl)
                                    .replace(/\$UID\$/g, userid);

                            setTimeout(function() {
                                var valA = User.QuoteHeaderB + quoteText + User.QuoteHeaderE + "\n" + User.QuoteMessageB +
                                        msg + User.QuoteMessageE + "\n" + User.ColorB;
                                var valB = User.ColorE + "\n" + User.Signature;
                                $("#OMQuickReply").val(valA + valB).setCursorPosition(valA.length);

                                window.scrollBy(0, (parseInt(document.body.scrollHeight) + 9999));
                            }, 50);
                        }

                    }, "click", "shift+click", true);

                    buttonQuote.addEventListener("mouseover", function()
                    {
                        var sel = window.getSelection();
                        if (!sel)
                            return;
                        var o = sel.anchorNode;
                        if (!o)
                            return;
                        do
                        {
                            try {
                                o = o.parentNode;
                                if (o.tagName && o.tagName.toLowerCase() === "div" && o.className.toLowerCase() === "para")
                                    break;
                            } catch (ex) {
                            }
                        } while (o);
                        if (o.className && o.className === "para")
                        {
                            this.setAttribute("name", "OMTempName");
                            var els = o.parentNode.getElementsByTagName("span");
                            for (i = 0; i < els.length; i++)
                            {
                                var el = els[i];

                                if (!el || (el && !el.getAttribute))
                                    continue;

                                if (el.getAttribute("name") === "OMTempName")
                                {
                                    this.setAttribute("Sel", sel);
                                    break;
                                }
                            }
                            this.removeAttribute("name");
                        }
                    }, false);

                    postMenu.insertBefore(buttonQuote, postMenu.firstNode);
                }


                // Button container (bottom)
                var container = document.getElementsByClassName("parabtns")[2];

                var buttonReply = (container.getElementsByClassName("grabtn"));
                var cType = buttonReply.length;
                buttonReply = cType === 3 ? buttonReply[2] : (cType === 1 ? buttonReply[0] : buttonReply[1]);
                buttonReply.addEventListener("click", function() {
                    PrefManager.Clear("SavedText");
                }, false);
                window.addEventListener("keydown", function(e)
                {
                    if (e.keyCode === 82 && !e.ctrlKey && e.altKey && !e.shiftKey)
                    {
                        window.location.href = (buttonReply.getElementsByTagName("a")[0]).href;
                        PrefManager.Clear("SavedText");
                    }
                }, false);

                if (document.body.getAttribute("OMIsHtml") === null)
                {
                    tid = window.location.href.match(/tid=(\d+)/i)[1];
                    $.get("/CommMsgPost?cmm=" + cmm + "&tid=" + tid + "&" + "&cache=" + (Math.random() + "cacheee").substring(2, 7), function(o)
                    {
                        var m = $("#charCount", o).parent().parent().html();
                        m = m.match(/id=.charCount.(.+)/i)[1];
                        m = m.match(/HTML.{10,}\.\s*$/i);
                        var IsHtml = (m != null);

                        document.body.setAttribute("OMIsHtml", IsHtml ? 1 : 0);
                    });
                }

                var functionQr = function()
                {
                    $("#OMerror").hide();
                    if (!document.getElementById("OMQuickReplyContainer"))
                    {
                        previewEvent = function() {
                            text = document.getElementById('OMQuickReply').value;
                            text = Orkut.Preview(text, document.body.getAttribute("OMIsHtml"));
                            document.getElementById("OMLeftCharQReply").textContent = 2048 - parseFloat(text.length);
                            document.getElementById('OMPreviewHtm').innerHTML = text;
                        }

                        var qr = document.createElement("textarea");
                        qr.id = "OMQuickReply";
                        qr.style.width = "100%";
                        qr.style.height = "200px";
                        qr.setAttribute("maxlength", "2048");
                        qr.addEventListener("keyup", previewEvent, false);
                        qr.addEventListener("focus", previewEvent, false);
                        qr.addEventListener("blur", previewEvent, false);
                        qr.addEventListener("click", previewEvent, false);

                        qr.addEventListener("keydown", function(e)
                        {
                            previewEvent();
                            var keys = OMUtil.GetSendKeys(e);
                            if (e.keyCode === 13 && keys)
                            {
                                Orkut.QuickReply(window, "OMQuickReply", cmm, tid, orkutPOST_TOKEN, orkutsignature, document.getElementById("subject").value, '', Language.Sending);

                                e.preventDefault();
                            }
                        }, false);

                        var newDiv = document.createElement("div");
                        newDiv.id = "OMQuickReplyContainer";
                        newDiv.style.margin = "4px 0px";
                        newDiv.appendChild(qr);

                        var buttonSend = Orkut.GetButton(window, unescape(Language.Reply), function()
                        {
                            Orkut.QuickReply(window, "OMQuickReply", window.location.href.match(/cmm=(\d+)/)[1], window.location.href.match(/tid=(\d+)/)[1], orkutPOST_TOKEN, orkutsignature, document.getElementById("subject").value, '', Language.Sending);
                        }, "click"
                                );
                        buttonSend.id = "QreplyButtonSend";
                        buttonSend.setAttribute("title", OMUtil.GetSendKeysText() + "-Enter");
                        newDiv.appendChild(buttonSend);

                        var divCharLeft = document.createElement("div");
                        divCharLeft.id = "OMLeftCharQReply";
                        divCharLeft.style.cssFloat = "right";
                        divCharLeft.style.fontWeight = "bold";
                        divCharLeft.textContent = "2048";
                        newDiv.appendChild(divCharLeft);

                        var preview = document.createElement("div");
                        preview.setAttribute("class", "listitem");
                        preview.innerHTML = '<span class="listfl" style="width: 100px;">Preview: </span> <div class="listp" style="word-wrap: break-word;" id="OMPreviewHtm"></div></div>';
                        newDiv.appendChild(preview);

                        var container = document.getElementsByClassName("parabtns")[2];
                        container.appendChild(newDiv);

                        if (PrefManager.Get("omToolbarqReply")) {
                            var Toolbar = OMSystem.OrkutManager.Toolbar.Get();
                            Toolbar.Create("OMQuickReply", document.body.getAttribute("OMIsHtml"), window);
                        }
                        var subjectArea = document.createElement("div");
                        subjectArea.innerHTML = '<div style="width: 5% !important; padding: 3px;" class="listfl">' + Language.subject + ':</div><div class="listp" style="margin:3px;"><input type="text" value="" size="50" maxlength="50" name="subjectText" id="subject" gtbfieldid="1"></div>';
                        document.getElementById("OMQuickReplyContainer").insertBefore(subjectArea, document.getElementById("OMQuickReply"));
                    }
                    else
                    {
                        var qr = document.getElementById("OMQuickReplyContainer");
                        if (qr.style.display === "none")
                            qr.style.display = "";
                        else
                            qr.style.display = "none";
                    }
                    document.getElementById("OMQuickReply").focus();
                    window.scrollBy(0, document.body.scrollHeight);

                };
                var buttext = isInCmm ? unescape(Language.QReply) : "<span class='disabledtext'>" + unescape(Language.QReply) + "</span>";
                var buttonQr = Orkut.GetButton(window, buttext, functionQr, "click");
                buttonQr.setAttribute("title", "alt+q");
                if (isInCmm) {
                    window.addEventListener("keydown", function(e)
                    {
                        if (e.keyCode === 81 && !e.ctrlKey && e.altKey && !e.shiftKey)
                            functionQr();
                    }, false);
                }
                container.insertBefore(buttonQr, (buttonReply));

                // - Refresh button
                container.insertBefore(Orkut.GetButton(window, unescape(Language.Refresh), function()
                {
                    window.location.href = window.location.href.replace(/&refresh=([^$]+|[^&]+)/i, "") + "&refresh=" + Math.random();
                }, "click"
                        ), buttonQr);


                // Bookmark
                var IsEnabledBk = (PrefManager.Get("omEnableBookmarks", "true") === "true");
                if (IsEnabledBk) {
                    var Bookmark = OMSystem.OrkutManager.Util.Bookmark;
                    Bookmark.BuildSingle(window, document.getElementById("mboxfull").getElementsByTagName("h1")[0], "Bookmarks.Topic");
                    document.getElementById("mboxfull").getElementsByTagName("h1")[0].previousSibling.style.marginTop = "12px";
                }

                //Tweet Button
                try {
                    if (!JSON.parse(PrefManager.Get("omtweetButton", false)))
                        throw "";
                    var script = document.createElement("script");
                    script.type = 'text/javascript';
                    script.src = "http://s7.addthis.com/js/250/addthis_widget.js#pubid=ra-4e7b33235a8c676c";

                    var button = document.createElement("div");
                    button.style.marginTop = "20px";
                    button.className = "addthis_toolbox addthis_default_style";
                    button.innerHTML = '<a class="addthis_button_orkut"></a>\n\
                                <a fb:like:layout="button_count" fb:like:action="recommend" class="addthis_button_facebook"></a>\n\
                                <a tw:via="orkutmanager" class="addthis_button_tweet"></a>\n\
                                <a class="addthis_button_google_plusone"></a>';
                    $("#mboxfull .topl_g div:first-child").after(button);
                    document.getElementById("mboxfull").getElementsByTagName("h1")[0].previousSibling.appendChild(script);
                } catch (ex) {
                }


                var IsMod = document.getElementById('mboxfull').getElementsByClassName('icnmanage').length > 0;
                if (!IsMod)
                    IsMod = document.getElementById('mboxfull').getElementsByClassName('boxmidlrg')[0].getElementsByClassName('listitem').length === 0;
                if (IsMod) {
                    //Mass delete posts
                    try {
                        if (!JSON.parse(PrefManager.Get("omMassDelete", "false")))
                            throw "";
                        var IsMod = document.getElementById('mboxfull').getElementsByClassName('icnmanage').length > 0;
                        if (!IsMod)
                            IsMod = document.getElementById('mboxfull').getElementsByClassName('boxmidlrg')[0].getElementsByClassName('listitem').length === 0;

                        if (IsMod) {
                            $("#mboxfull .boxmidlrg:eq(0) .rf:eq(0)").append("<input type='checkbox' id='mass_delete_check_all' title='check all posts' style='margin-left: 5px;' />");
                            $("#mass_delete_check_all").change(function() {
                                $(".mass_delete_posts").attr("checked", $(this).attr("checked"));
                            });

                            $("#mboxfull .boxmidlrg:eq(0) .listitem").each(function() {
                                $(".rfdte:eq(0)", this).append("<input class='mass_delete_posts' type='checkbox' style='margin-right: 2px;' />");
                            });
                            $("form[name='topicsForm'] .grabtn:eq(0)").before('<span id="MassDeleteTopicsButton" style="cursor: pointer;" class="grabtn"><a class="btn href="javascript:void(0);">' + Language.MassdelTopics + '</a></span><span class="btnboxr"><img src="http://static1.orkut.com/img/b.gif" alt="" height="1" width="5"></span>')

                            $("#MassDeleteTopicsButton").click(function() {
                                if (confirm(Language.MassdelTopicsConfirm)) {
                                    var Length = ($(".mass_delete_posts:checked").length - 1);
                                    $(".mass_delete_posts:checked").each(function(i) {
                                        post = $(this).parent().find('form:eq(0)').serializeJSON();
                                        post["Action.delete"] = "Submit Query";
                                        try {
                                            $.post("/CommMsgs?cmm=" + cmm + "&tid=" + tid, post, function(e) {
                                                if (i >= Length) {
                                                    window.location.reload();
                                                }
                                            });
                                        } catch (ex) {
                                        }
                                    });
                                }
                            });
                            try {
                                window.addEventListener("keydown", function(e) {
                                    if (!e.altKey)
                                        return;
                                    if (e.keyCode != 46)
                                        return;
                                    delPosts();
                                }, true);
                                $("#MassDeleteTopicsButton").click(delPosts);
                            } catch (ex) {
                            }
                        }
                    } catch (ex) {
                    }
                }
                try {
                    if (!JSON.parse(PrefManager.Get("omFixPost", false)))
                        throw "";
                    //FixPosts
                    $("#mboxfull .boxmidlrg:eq(0) .listitem", window.document).each(function(i) {
                        $(".rfdte:eq(0)", this).append("<a href='" + window.location.href + "&post=" + Math.floor(i + 1) + "'><b><small>#" + Math.floor(i + 1) + "</small></b></a>");
                    });
                    if (tmp = window.location.href.match(/post=(\d+)/)) {
                        p = tmp[1];
                        p = Math.floor(p - 1);
                        $('html, body', window.document).scrollTop($("#mboxfull .boxmidlrg:eq(0) .listitem:eq(" + p + ")").offset().top);
                    }
                } catch (ex) {
                }
            }
            catch (ex) {
            }
            // #endregion

            // #region CommMsgPost
            try
            {
                if (!Window.IsPage("/CommMsgPost", window))
                    throw "!CommMsgPost";

                var User = OMSystem.OrkutManager.Util.User;
                User.Load();
                var cmm = 0;
                if ((tmp = window.location.href.match(/cmm=(\d+)/i)) != null)
                    cmm = tmp[1];

                var tid = 0;
                if ((tmp = window.location.href.match(/tid=(\d+)/i)) != null)
                    tid = tmp[1];

                $("body").addClass("CommMsgPost");

                var cmmName = document.getElementsByClassName("username")[0].getElementsByTagName("b")[0].innerHTML;
                cmmName = cmmName.replace("&amp;", "&");
                document.title = unescape(Language.Reply) + " " + cmmName;
                cmmName = undefined;

                var IsHtml = document.getElementById("charCount").parentNode.parentNode.innerHTML.match(/HTML.{10,}\.\s*$/i);
                IsHtml = (IsHtml != null);
                var ta = document.getElementById("messageBody");

                // Moderation

                if ((/&mt=\d/).test(window.location.href) && (PrefManager.Get("omEnableMod", "false") === "true"))
                {
                    try
                    {
                        var block = PrefManager.Get("Moderation", "");
                        block = block.split("|");
                        var userName = unescape(block[0].replace(/\[|\]/g, ""));
                        var userLink = unescape(block[1].replace(/\[|\]/g, ""));
                        var title = unescape(block[2].replace(/\[|\]/g, ""));
                        var message = unescape(block[3].replace(/\[|\]/g, ""));
                        try {
                            var uimg = unescape(block[4].replace(/\[|\]/g, ""));
                        } catch (ex) {
                            var uimg = '';
                        }

                        message = Orkut.HandleQuote(IsHtml, message);
                        if (!IsHtml)
                        {
                            message = message.replace(/https?:\/\/[^\s]+/gi, "[]");
                        }
                        else
                        {
                            message = message.replace(/(<a.*?>).*?(<\/a>)/gi, "[]");
                        }

                        message = message.replace(/<br.*?>/gi, "\n");
                        message = message.replace(/<.*?>/g, "");

                        message = message.length > 50 ? message.substr(0, 50) + "..." : message;

                        var moderationTemplate = IsHtml ? User.HModerationT : User.ModerationT;

                        currentdate = OMUtil.omTime(OMSystem.OrkutManager.PrefManager.Get("TimeFormat"), Language);

                        document.getElementById("messageBody").value =
                                moderationTemplate.replace(/\$USER\$/g, userName)
                                .replace(/\$USERLINK\$/g, userLink)
                                .replace(/\$TITLE\$/g, title)
                                .replace(/\$RAND\$/g, Math.random())
                                .replace(/\$CURRENTDATE\$/g, currentdate)
                                .replace(/\$MESSAGE\$/g, message);
                    }
                    catch (ex) {
                    }
                }
                // Moderation User
                if (window.location.href.match(/&mu=\d/) && (PrefManager.Get("omEnableMod", "false") === "true"))
                {
                    var User = OMSystem.OrkutManager.Util.User;
                    User.Load();
                    try
                    {
                        var block = PrefManager.Get("Moderation", "");
                        block = block.split("|");
                        var userName = unescape(block[0].replace(/\[|\]/g, ""));
                        var userLink = unescape(block[1].replace(/\[|\]/g, ""));
                        var uimg = unescape(block[2].replace(/\[|\]/g, ""));

                        var moderationTemplate = IsHtml ? User.HModerationU : User.ModerationU;

                        currentdate = OMUtil.omTime(OMSystem.OrkutManager.PrefManager.Get("TimeFormat"), Language);
                        if (IsHtml) {
                            moderationTemplate = moderationTemplate.replace(/\$UIMG\$/g, uimg);
                        }
                        document.getElementById("messageBody").value =
                                moderationTemplate.replace(/\$USER\$/g, userName)
                                .replace(/\$CURRENTDATE\$/g, currentdate)
                                .replace(/\$RAND\$/g, Math.random())
                                .replace(/\$USERLINK\$/g, userLink);
                    }
                    catch (ex) {
                    }
                }
                $("textarea[name='bodyText']").parent().find("a:eq(0)").remove();
                // Toolbar
                if (PrefManager.Get("omToolbarPost")) {
                    var Toolbar = OMSystem.OrkutManager.Toolbar.Get();
                    Toolbar.Create("messageBody", (IsHtml ? 1 : 0), window,
                            (document.referrer.match(/\/CommMsgPost/i)));
                }
                // Text control ::
                // - move buttons container up
                document.getElementById("mboxfull").getElementsByClassName("parabtns")[0].id = "PostControls";
                document.getElementById("PostControls").parentNode.insertBefore(
                        document.getElementById("PostControls"),
                        ta.parentNode.parentNode.nextSibling.nextSibling);

                // - preview
                var preview = document.getElementById("PostControls").nextSibling;
                if (preview.className != "listdark")
                    preview.className = "listdark";
                preview.innerHTML = "<div class='listfl'>Preview:</div><div class='listp' style='word-wrap:break-word;' id='OMPreviewPost'>&nbsp;</div>";
                preview.style.display = "";
                var previewEvent = function()
                {
                    // char count
                    try {
                        document.getElementById("charCount").innerHTML = 2048 - (this.value.replace(/\n/g, "").length + (this.value.match(/\n/)).length * 3);
                    } catch (ex) {
                    }

                    // Preview ::
                    var preview = document.getElementById("PostControls").nextSibling;
                    if (preview.className != "listdark")
                        preview.className = "listdark";
                    var text = this.value;

                    text = Orkut.Preview(text, IsHtml);

                    preview.innerHTML = "<div class='listfl'>Preview:</div><div class='listp' id='OMPreviewPost' style='word-wrap:break-word;'>" + text + "</div>";
                };
                ta.addEventListener("keyup", previewEvent, false);
                ta.addEventListener("focus", previewEvent, false);
                ta.addEventListener("blur", previewEvent, false);
                ta.addEventListener("click", previewEvent, false);

                sto(function() {
                    var text = Orkut.Preview(ta.value, IsHtml);
                    document.getElementById("OMPreviewPost").innerHTML = text;
                }, 500);

                // - send button
                document.getElementById("PostControls").getElementsByClassName("grabtn")[0].id = "QreplyButtonSend";
                document.getElementById("PostControls").getElementsByClassName("btn")[0].removeAttribute('onclick');
                if (document.getElementById("PostControls").getElementsByClassName("btn")[0])
                    document.getElementById("PostControls").getElementsByClassName("btn")[0].title = OMUtil.GetSendKeysText() + "-Enter";
                document.getElementById("PostControls").getElementsByClassName("btn")[0].addEventListener("click", function()
                {
                    document.getElementById("messageBody").value = Orkut.FixPost(document.getElementById("messageBody").value, IsHtml);
                    document.getElementById("messageBody").name = "bodyText2";
                    Orkut.QuickReply(window, "messageBody", cmm, tid, orkutPOST_TOKEN, orkutsignature, '', '', Language.Sending);
                }, false);

                window.addEventListener("keydown", function(e)
                {
                    var keys = OMUtil.GetSendKeys(e);
                    if (e.keyCode === 13 && keys)
                    {
                        document.getElementById("messageBody").value = Orkut.FixPost(document.getElementById("messageBody").value, IsHtml);
                        document.getElementById("messageBody").name = "bodyText2";
                        Orkut.QuickReply(window, "messageBody", cmm, tid, orkutPOST_TOKEN, orkutsignature, '', '', Language.Sending);
                        e.preventDefault();
                    }
                }, false);

                document.getElementById("PostControls").getElementsByClassName("btn")[1].removeAttribute('onclick');
                document.getElementById("PostControls").getElementsByClassName("btn")[1].title = "preview";
                document.getElementById("PostControls").getElementsByClassName("btn")[1].addEventListener("click", function() {
                    document.getElementById("messageBody").focus();
                }, false);

                // - Back button
                Backhref = window.location.href.match(/^http.+orkut[^\/]+/i) + "/CommTopics?cmm=" + window.location.href.match(/cmm=(\d+)/)[1];
                var Back0 = document.createElement('span');
                Back0.setAttribute('class', 'grabtn');
                Back0.innerHTML = '<a class="btn" href="' + Backhref + '" id="OMback" href="javascript:void(0);" title="' + Language.Back + '">' + Language.Back + '</a>';

                var Back1 = document.createElement('span');
                Back1.setAttribute('class', "btnboxr");
                Back1.innerHTML = '<img width="5" height="1" alt="" src="http://static1.orkut.com/img/b.gif"></img>';

                document.getElementById("PostControls").appendChild(Back0);
                document.getElementById("PostControls").appendChild(Back1);

                // Page save text
                // - page unload
                window.addEventListener("unload", function()
                {
                    PrefManager.Set("SavedText", ta.value);
                }, false);

                // - load text
                try {
                    if (window.history.length >= 2
                            && window.history[window.history.length - 1]
                            && window.history[window.history.length - 1].match(/\/CommMsgs/))
                    {
                        if (PrefManager.Get("SavedText"))
                        {
                            var q = JSON.parse(PrefManager.Get("Quote", "[]"));
                            var q2 = JSON.parse(PrefManager.Get("Moderation", "[]"));
                            if (!q.length && !window.location.href.match(/&m(t|u)=\d/))
                                ta.value = PrefManager.Get("SavedText");
                            if (!q2.length && !window.location.href.match(/&q=\d/))
                                ta.value = PrefManager.Get("SavedText");
                        }
                    }
                }
                catch (ex) {
                }
                // Last page preview for reply
                if (cmm && tid) {
                    $.get("/CommMsgs?cmm=" + cmm + "&tid=" + tid + "&na=2", function(d) {
                        var mbox = $('#mboxfull', d);

                        // Remove buttons
                        $("form, .rf, .grabtn", mbox).remove();

                        var pane = document.createElement("div");
                        pane.id = "OMLastPagePreview";
                        pane.innerHTML = $(mbox).html();

                        var container = document.getElementById("PostControls").parentNode;
                        var sep = document.createElement("div");
                        sep.className = "listdivi ln";
                        sep.innerHTML = "&nbsp";
                        container.insertBefore(document.createElement("br"), container.lastChild);
                        container.insertBefore(sep, container.lastChild);
                        container.insertBefore(pane, container.lastChild);
                        $("#OMParser").remove();
                    });
                }
            }
            catch (ex) {
            }
            // #endregion


            // #region CommTopics
            try {
                if (!Window.IsPage("/CommTopics", window))
                    throw "!CommTopics";
                $("body").addClass("CommTopics");
                var cmm = 0;
                if ((tmp = window.location.href.match(/cmm=(\d+)/i)) != null)
                    cmm = tmp[1];
                var tid = 0;
                if ((tmp = window.location.href.match(/tid=(\d+)/i)) != null)
                    tid = tmp[1];

                cmmName = document.getElementsByClassName("username")[0].getElementsByTagName("b")[0].innerHTML;
                cmmName = cmmName.replace("&amp;", "&");
                document.title = "Orkut - " + unescape(Language.Forum) + " " + cmmName;
                cmmName = undefined;

                if ((/&q=(.*)/).test(window.location.href)) {
                    $("form[name='topicsForm'] h3.smller").each(function() {
                        var link = $("a", this).attr("href");
                        var last = '<span style="font-size: 75%;"><a href="/Main#CommMsgs?cmm=' + (link.match(/cmm=(\d+)/i)[1]) + '&tid=' + (link.match(/tid=(\d+)/i)[1]) + '&na=2&scroll=-1">(' + unescape(Language.Last).toLowerCase() + ')</a></span>';
                        $(this).append(last);
                    });
                }

                //Set as Selected when clicking on the tr                
                var trs = window.document.getElementsByName('topicsForm')[0]
                        .getElementsByClassName('displaytable')[0]
                        .getElementsByTagName('tr');
                for (var i = 1; i < trs.length; i++) {
                    trs[i].addEventListener('click', function() {
                        OMUtil.SelectObject(this.getElementsByTagName('td')[0], window);
                    }, true)
                }

                try {
                    window.addEventListener("keydown", function(event) {
                        if ((event.target.tagName).toLowerCase() != "html" && (event.target.tagName).toLowerCase() != "body")
                            return;
                        if ((event.target.tagName).toLowerCase() === "input")
                            return;

                        // j + k + Enter Events
                        switch (event.keyCode) {
                            case 74: //J
                                OMUtil.SelectTopic('next', window);
                                break;
                            case 75: //K
                                OMUtil.SelectTopic('previous', window);
                                break;
                            case 83: //S
                                var selected = OMUtil.GetSelectedItem(window);
                                if (selected) {
                                    var el = selected.getElementsByClassName('normcheck')[0];
                                    if (el.checked)
                                        el.checked = false;
                                    else
                                        el.checked = "checked";
                                }
                                break;
                            case 13:
                                var selected = OMUtil.GetSelectedItem(window); //Return false if none                            
                                if (selected) {
                                    var a = selected.parentNode.getElementsByTagName('a')[0].getAttribute('href');
                                    var Acmm = a.match(/cmm=(\d+)/)[1];
                                    var Atid = a.match(/tid=(\d+)/)[1];
                                    var href = "/CommMsgs?cmm=" + Acmm + "&tid=" + Atid
                                    var lasthref = href + "&na=2&scroll=-1";
                                    if (event.shiftKey)
                                        link = lasthref;
                                    else
                                        link = href;

                                    if (event.ctrlKey)
                                        window.open(link)
                                    else
                                        window.location.href = link;
                                }
                        }
                        if (!event.ctrlKey)
                            return;
                        var Tb = document.getElementById("mboxfull");
                        Tb = (Tb.getElementsByTagName("table")[0]).getElementsByTagName("table")[0];
                        var Trs = Tb.getElementsByTagName("tr");
                        var Url = [];
                        for (i = 0; i < 10; ++i) {
                            Url[i] = "javascript:;";
                        }
                        var i = 0;
                        for (index = 0; index < Trs.length; index++) {
                            var Tr = Trs[index];
                            if (!Tr || (Tr && !Tr.getElementsByTagName))
                                continue;
                            var a = Tr.getElementsByTagName("a");
                            if (a.length >= 2)
                                a = a[1];
                            else
                                continue;
                            Url[i] = a.href.replace("/Main#", "/");
                            if (event.altKey)
                                Url[i] = Url[i] + "&na=2&scroll=-1";

                            ++i;
                            if (i >= 10)
                                break;
                        }
                        switch (event.keyCode) {
                            case 49:
                            case 97:
                                window.location.href = Url[0];
                                event.preventDefault();
                                return false;
                            case 98:
                            case 50:
                                window.location.href = Url[1];
                                event.preventDefault();
                                return false;
                            case 99:
                            case 51:
                                window.location.href = Url[2];
                                event.preventDefault();
                                return false;
                            case 100:
                            case 52:
                                window.location.href = Url[3];
                                event.preventDefault();
                                return false;
                            case 101:
                            case 53:
                                window.location.href = Url[4];
                                event.preventDefault();
                                return false;
                            case 102:
                            case 54:
                                window.location.href = Url[5];
                                event.preventDefault();
                                return false;
                            case 103:
                            case 55:
                                window.location.href = Url[6];
                                event.preventDefault();
                                return false;
                            case 104:
                            case 56:
                                window.location.href = Url[7];
                                event.preventDefault();
                                return false;
                            case 105:
                            case 57:
                                window.location.href = Url[8];
                                event.preventDefault();
                                return false;
                            case 48:
                            case 96:
                                window.location.href = Url[9];
                                event.preventDefault();
                                return false;
                        }

                    }, false);
                } catch (ex) {
                }

                // Build Bookmarks
                var IsEnabledBk = (PrefManager.Get("omEnableBookmarks", "true") === "true");
                var IsEnabledLast = (PrefManager.Get("omEnableLast", "true") === "true");
                if (IsEnabledLast || IsEnabledBk) {
                    var Bookmark = OMSystem.OrkutManager.Util.Bookmark;
                    var bkTb = document.getElementById("mboxfull").getElementsByTagName("table")[0].getElementsByTagName("table")[0];
                    try {
                        Bookmark.Build(window, bkTb, "Bookmarks.Topic", false, IsEnabledLast, IsEnabledBk);
                    } catch (ex) {
                    }
                }

                // Auto-update topic list
                function UpdateStart()
                {
                    var Updater = OMSystem.OrkutManager.Util.Updater;
                    oUpdateTidInterval = sint(function() {
                        if (!oUpdate)
                            Updater.Update(window, "CommTopics", cmm);
                    }, (1000 * PrefManager.Get("Update.Delay", 10)));
                }

                if (PrefManager.Get("Update.Topics", "true") === "true")
                    UpdateStart();

                var container = document.getElementById("mboxfull").getElementsByClassName("parabtns");
                var buttonUpdate = function()
                {
                    var t = (PrefManager.Get("Update.Topics", "true") === "true") ? unescape(Language.Stop) : unescape(Language.Start);
                    t += " " + unescape(Language.Update);
                    return Orkut.GetButton(window, t, function()
                    {
                        if (!oUpdateTidInterval)
                        {
                            UpdateStart();
                            this.getElementsByTagName("a")[0].innerHTML = unescape(Language.Stop) + " " + unescape(Language.Update);
                        }
                        else
                        {
                            window.clearInterval(oUpdateTidInterval);
                            oUpdateTidInterval = undefined;
                            this.getElementsByTagName("a")[0].innerHTML = unescape(Language.Start) + " " + unescape(Language.Update);
                        }
                    }, "click");
                };
                var buttonUpdateDo = function()
                {
                    var Updater = OMSystem.OrkutManager.Util.Updater;
                    return Orkut.GetButton(window, unescape(Language.Update), function() {
                        Updater.Update(window, "CommTopics", cmm);
                        var text = this.getElementsByTagName("a")[0];
                        OMUtil.LoaderForText(window, text);
                    }, "click");
                };

                var PreviewText;
                if (JSON.parse(PrefManager.Get("enablePreviewTopics", false))) {
                    PreviewText = Language.DisablePreviewTopic;
                    OMUtil.previewEvents(window);
                } else {
                    PreviewText = Language.EnablePreviewTopic;
                }

                var buttonPreviewTopics = function() {
                    return Orkut.GetButton(window, unescape(PreviewText), function() {
                        check = JSON.parse(PrefManager.Get("enablePreviewTopics", false));
                        if (check) {
                            PrefManager.Set("enablePreviewTopics", JSON.stringify(false));
                            this.getElementsByTagName("a")[0].innerHTML = Language.EnablePreviewTopic;
                            $(".buttonLupaPreview").remove();
                        } else {
                            PrefManager.Set("enablePreviewTopics", JSON.stringify(true));
                            OMUtil.previewEvents(window);
                            this.getElementsByTagName("a")[0].innerHTML = Language.DisablePreviewTopic;
                        }
                    }, "click");
                };

                container[0].appendChild(buttonUpdate());
                container[0].appendChild(buttonUpdateDo());
                container[1].appendChild(buttonUpdate());
                container[1].appendChild(buttonUpdateDo());
                container[0].appendChild(buttonPreviewTopics());
                container[1].appendChild(buttonPreviewTopics());
                try {
                    functionQr = function() {
                        $("#OMerror").hide();
                        var User = OMSystem.OrkutManager.Util.User;
                        User.Load(window);
                        if (!document.getElementById("OMQuickReplyContainer")) {
                            var Toolbar = OMSystem.OrkutManager.Toolbar.Get();
                            previewEvent = function() {
                                text = document.getElementById('OMQuickReply').value;
                                text = Orkut.Preview(text, document.body.getAttribute("OMIsHtml"));
                                document.getElementById("OMLeftCharQReply").textContent = 2048 - parseFloat(text.length);
                                document.getElementById('OMPreviewHtm').innerHTML = text;
                            }
                            var qr = document.createElement("textarea");
                            qr.id = "OMQuickReply";
                            qr.style.width = "100%";
                            qr.style.height = "200px";
                            qr.setAttribute("maxlength", "2048");
                            qr.addEventListener("keyup", previewEvent, false);
                            qr.addEventListener("focus", previewEvent, false);
                            qr.addEventListener("blur", previewEvent, false);
                            qr.addEventListener("click", previewEvent, false);

                            qr.addEventListener("keydown", function(e) {
                                var keys = OMUtil.GetSendKeys(e);
                                if (e.keyCode === 13 && keys) {
                                    Orkut.QuickReply(window, "OMQuickReply", window.location.href.match(/cmm=(\d+)/)[1], 0, encodeURIComponent(window.document.getElementsByName('POST_TOKEN')[0].value), encodeURIComponent(window.document.getElementsByName('signature')[0].value), document.getElementById("subject").value, '', Language.Sending);
                                    previewEvent();
                                    e.preventDefault();
                                }
                            }, false);

                            var newDiv = document.createElement("div");
                            newDiv.id = "OMQuickReplyContainer";
                            newDiv.style.margin = "4px 0px";
                            newDiv.appendChild(qr);

                            var buttonSend = Orkut.GetButton(window, unescape(Language.Reply), function() {
                                Orkut.QuickReply(window, "OMQuickReply", window.location.href.match(/cmm=(\d+)/)[1], 0, encodeURIComponent(window.document.getElementsByName('POST_TOKEN')[0].value), encodeURIComponent(window.document.getElementsByName('signature')[0].value), document.getElementById("subject").value, '', Language.Sending);
                            }, "click");
                            buttonSend.id = "QreplyButtonSend";
                            buttonSend.setAttribute("title", OMUtil.GetSendKeysText() + "-Enter");
                            newDiv.appendChild(buttonSend);

                            var divCharLeft = document.createElement("div");
                            divCharLeft.id = "OMLeftCharQReply";
                            divCharLeft.style.cssFloat = "right";
                            divCharLeft.style.fontWeight = "bold";
                            divCharLeft.textContent = "2048";
                            newDiv.appendChild(divCharLeft);

                            var preview = document.createElement("div");
                            preview.setAttribute("class", "listitem");
                            preview.innerHTML = '<span class="listfl" style="width: 100px;">Preview: </span> <div class="listp" style="word-wrap: break-word;" id="OMPreviewHtm"></div></div>';
                            newDiv.appendChild(preview);

                            return newDiv
                        } else {
                            var qr = document.getElementById("OMQuickReplyContainer");
                            if (qr.style.display === "none")
                                qr.style.display = "";
                            else
                                qr.parentNode.removeChild(qr);
                            var removeUnload = document.createElement('script');
                            removeUnload.innerHTML = 'window.onbeforeunload = null';
                            document.body.appendChild(removeUnload);
                        }
                    };

                    var el = document.getElementsByName('topicsForm')[0]
                            .getElementsByClassName('parabtns')[0]
                            .getElementsByClassName('btn')[0]
                    el.href = 'javascript:void(0)';
                    el.addEventListener('click', function() {
                        jQuery('[name=topicsForm] .listdivi:eq(1)').before(functionQr)
                        try {
                            $.get("/CommMsgPost?cmm=" + cmm + "&tid=0&", function(o) {
                                var m = o.match(/id=.charCount.(.+)/i)[1];
                                m = m.match(/HTML.{10,}\.\s*$/i);
                                var IsHtml = (m != null);

                                document.body.setAttribute("OMIsHtml", IsHtml ? 1 : 0);
                                Toolbar = OMSystem.OrkutManager.Toolbar.Get();
                                if (PrefManager.Get("omToolbarqReply")) {
                                    Toolbar.Create("OMQuickReply", document.body.getAttribute("OMIsHtml"), window);
                                }
                                var subjectArea = document.createElement("div");
                                subjectArea.innerHTML = '<div style="width: 5% !important;" class="listfl">Assunto:</div><select style="float:right" name="OMtagSelect"><option value="">TAG</option>' + getTags() + '</select><div class="listp"><input type="text" value="" size="50" maxlength="50" name="subjectText" id="subject" gtbfieldid="1"></div>';
                                var el = document.getElementById('OMQuickReply');
                                el.parentNode.insertBefore(subjectArea, el);
                                el.focus()
                                try {
                                    document.getElementById("OMQuickReplyContainer").insertBefore(subjectArea, document.getElementById("OMQuickReply"));
                                    $("[name='OMtagSelect']").change(function() {
                                        var val = $("[name='OMtagSelect'] option:selected").val();
                                        document.getElementById('subject').value = val + ' ' + document.getElementById('subject').value;
                                    });
                                } catch (ex) {
                                }
                                if (PrefManager.Get('omWarninLeave', true)) {
                                    var newScript = document.createElement('script');
                                    newScript.innerHTML = 'window.onbeforeunload=function(){return "Deseja mesmo sair da página?"}';
                                    document.getElementsByTagName('head')[0].appendChild(newScript);
                                }
                            });
                        } catch (ex) {
                        }
                    }, true);
                } catch (ex) {
                }
            } catch (ex) {
            }
            // #endregion

            // #region CommMembers
            try
            {
                if (!Window.IsPage("/CommMembers", window) && !window.location.href.match(/tab=4/i))
                    throw "!CommMembers &tab=4";

                var cmm = 0;
                if ((tmp = window.location.href.match(/cmm=(\d+)/i)) != null)
                    cmm = tmp[1];
                var tid = 0;
                if ((tmp = window.location.href.match(/tid=(\d+)/i)) != null)
                    tid = tmp[1];

                var container = document.getElementById("mboxfull").getElementsByClassName("boxmidlrg")[0];

                if (container.getElementsByClassName("listitem").length === 0)
                    throw "";

                var buttons = document.createElement("div");
                buttons.className = "parabtns";

                var buttonAcceptAll = Orkut.GetButton(window, unescape(Language.AcceptAll), function()
                {
                    var memId = 0;
                    var members = document.getElementById("mboxfull").getElementsByTagName("input");
                    for (i = 0; i < members.length; i++)
                    {
                        var member = members[i];
                        if (!member)
                            continue;
                        if (member.name != "memberId")
                            continue;
                        else
                            memId = member.value;
                        try
                        {
                            var url = {
                                "Action.acceptPending": 1
                            }
                            url.POST_TOKEN = $("input[name='POST_TOKEN']").val();
                            url.signature = $("input[name='signature']").val();
                            url.tab = "4";
                            url.memberId = memId;
                            $.post("/CommMembers?cmm=" + cmm + "&tab=4" + "&cache=" + (Math.random() + "cacheee").substring(2, 7), url, function() {
                                window.location.reload();
                            });
                        }
                        catch (ex) {
                        }
                    }
                }, "click");

                buttons.appendChild(buttonAcceptAll);

                var divisor = document.createElement("div");
                divisor.innerHTML = "&nbsp;";
                divisor.className = "listdivi ln";
                container.appendChild(divisor);
                container.appendChild(buttons);
            }
            catch (ex) {
            }
            // #endregion

            // #region CommMemberManage
            try {
                if (PrefManager.Get("omEnableMod", "true") === "true") {

                    var container = document.getElementsByClassName("listdivi divider")[1];

                    var buttonMod = Orkut.GetButton(window, unescape(Language.ModDo), function()
                    {
                        var u = document.getElementsByClassName("smller")[0].getElementsByTagName("a")[0];
                        var userName = escape(u.innerHTML);
                        var userLink = escape(u.href.match(/uid=(.*)/i)[0]);
                        var uimg = (this.parentNode.parentNode.getElementsByTagName("img")[0]).src;

                        PrefManager.Set("Moderation", userName + "|" + userLink + "|" + uimg);

                        var vals = JSON.parse(PrefManager.Get("ModerationTopic", ""));

                        var tid = 0;
                        for (i = 0; i < vals.length; i++)
                        {
                            var val = vals[i];
                            if (!val || !val.split)
                                continue;
                            var block = val.split("|");
                            if (block[0] === cmm)
                            {
                                tid = block[1];
                                break;
                            }
                        }

                        window.location.href = "/CommMsgPost.aspx?cmm=" + cmm + "&tid=" + tid + "&mu=1";
                    }, "click");

                    container.parentNode.insertBefore(buttonMod, container);
                }
            } catch (ex) {
            }
            // #endregion

            // #region CommunityEdit
            try
            {
                if (Window.IsPage("/CommunityEdit", window))
                {
                    document.getElementById("description").style.height = "320px";
                    var Toolbar = OMSystem.OrkutManager.Toolbar.Get();
                    Toolbar.Create("description", 0, window, true);

                    var pane = Orkut.CreatePreviewPane(window, document.getElementById("description").parentNode, unescape(Language.ShowHide), true);
                    pane = document.getElementById(pane);
                    pane.innerHTML = Orkut.Preview(document.getElementById("description").value, 0);

                    function PreviewDescriptionEdit()
                    {
                        pane.innerHTML = Orkut.Preview(document.getElementById("description").value, 0);
                    }
                    document.getElementById("description").addEventListener("keyup", PreviewDescriptionEdit, false);
                    document.getElementById("description").addEventListener("focus", PreviewDescriptionEdit, false);
                    document.getElementById("description").addEventListener("blur", PreviewDescriptionEdit, false);
                    document.getElementById("description").addEventListener("click", PreviewDescriptionEdit, false);

                    // re-setup
                    if (window.location.href.match(/(\?|&)mode=create/i))
                    {
                        document.getElementById("catId").selectedIndex = 8;
                        document.getElementById("moderation0").checked = true;
                        document.getElementById("enableHtmlForum").checked = true;
                        document.getElementById("toggleFeatureevents1").checked = true;
                    }
                }
            }
            catch (ex) {
            }
            // #endregion

            // #region CommPollResults
            try
            {
                if (Window.IsPage("/CommPollResults", window))
                {
                    var post = document.getElementById("postText");
                    var Toolbar = OMSystem.OrkutManager.Toolbar.Get();
                    Toolbar.Create("postText", 0, window);

                    var replyContainer = document.getElementById("replyTopicForm");
                    replyContainer.style.visibility = "";
                    replyContainer.style.display = "";
                }
            }
            catch (ex) {
            }
            // #endregion

            // #region CommPollVote | CommPollResults
            try
            {
                if (Window.IsPage("/CommPoll(Vote|Results)", window) && (PrefManager.Get("omEnableMod", "false") === "true"))
                {
                    var cmm = window.location.href.match(/cmm=(\d+)/i)[1];

                    var container = document.getElementById("mboxfull").getElementsByClassName("topl_g")[0];

                    var script = document.createElement("script");
                    script.type = 'text/javascript';
                    script.src = "http://s7.addthis.com/js/250/addthis_widget.js#pubid=ra-4e7b33235a8c676c";

                    var button = document.createElement("div");
                    button.style.marginTop = "20px";
                    button.className = "addthis_toolbox addthis_default_style";
                    button.innerHTML = '<a class="addthis_button_orkut"></a>\n\
                                <a fb:like:layout="button_count" fb:like:action="recommend" class="addthis_button_facebook"></a>\n\
                                <a tw:via="orkutmanager" class="addthis_button_tweet"></a>\n\
                                <a class="addthis_button_google_plusone"></a>';
                    button.appendChild(script);
                    container.insertBefore(button, container.firstChild);

                    if (OMUtil.GetModTopic(cmm))
                    {
                        var buttonMod = Orkut.GetButton(window, unescape(Language.ModDo), function()
                        {
                            var tid2 = OMUtil.GetModTopic(cmm);

                            var SpecialCharacters = OMSystem.OrkutManager.Util.SpecialCharacters;

                            var u2 = window.document.getElementById("mboxfull");
                            var u = u2.getElementsByClassName('nor')[0];
                            u = u.getElementsByTagName("a")[0];

                            var user = escape(u.innerHTML.replace(String.fromCharCode(SpecialCharacters.RevertText), " ", "g"));
                            var uid = u.href.match(/uid=(\d+)/i)[1];

                            var userLink = escape(u.href.match(/\/(Main#)?Profile.+/i));
                            var title = (document.getElementById("mboxfull").getElementsByTagName("h2")[0].innerHTML);
                            title = escape(title.replace(/\n/g, "").replace(/<.*?>/g, ""));
                            var msg = escape(document.getElementById("mboxfull").getElementsByClassName("boxmidlrg")[0].getElementsByTagName("span")[0].innerHTML);

                            var node = user + "|" + userLink + "|" + title + "|" + msg;
                            PrefManager.Set("Moderation", node);

                            window.open(window.location.href.match(/^https?:\/\/.*?\//) + "/Main#CommMsgPost?cmm=" + cmm + "&tid=" + tid2 + "&mt=1");

                            if (PrefManager.Get("ModerationOnModUserManage", "true") === "true")
                                window.open(window.location.href.match(/^https?:\/\/.*?\//) + "/Main#CommMemberManage?cmm=" + cmm + "&uid=" + uid + "&s=om");

                            if (PrefManager.Get("ModerationOnModDelete", "true") === "true")
                            {
                                $("input[name='pct']").parent().find("span:eq(0) a").click();
                            }
                        }, "click");

                        buttonMod.style.cssFloat = "right";
                        container.insertBefore(buttonMod, container.firstChild);
                    }
                }
            }
            catch (ex) {
            }

            try {
                $("#rhs_ads").remove();

                setTimeout(function() {

                    var now = new Date();
                    var saved = localStorage['saved2'];

                    if (now > saved || !(saved)) {
                        localStorage['saved2'] = now.setSeconds(now.getSeconds() + 30);
                    } else {
                        return;
                    }
                    if (i = window.location.href.match(/Community|Home|Profile|FullProfile|Communities/i)) {
                        try {
                            table = document.getElementById("rbox").getElementsByTagName("table")[0];
                            NewDiv = document.createElement("div");
                            NewDiv.id = "rhs_ads";
                            NewDiv.innerHTML = '<table cellspacing="0" cellpadding="0" border="0" class="module">' +
                                    '<tbody><tr><td class="topl_g"><h2 style="margin-bottom: 0pt;">' + Language.adversiment + '</h2></td><td class="topr_g"></td></tr>' +
                                    '<tr><td class="boxmid"><center>' +
                                    '<iframe width="300" height="265" frameborder="0" scrolling="no" src="http://manageraddons.com/ads/300x250/?&nopop&ad3&utm_source=OMChrome1.2.8&utm_campaign=' + i[0] + '" marginheight="0" marginwidth="0" hspace="0" vspace="0" border="0" id="ad-iframe"></iframe>' +
                                    '</center>' +
                                    '</td><td class="boxmidr"></td></tr></tr>' +
                                    '<tr><td class="botl"></td><td class="botr"></td></tr></tbody></table>';
                            table.parentNode.insertBefore(NewDiv, table);
                        } catch (ex) {
                        }
                    }
                }, 2000);
                if (window.location.href.match(/AlbumZoom/i)) {
                    if (el = window.document.getElementById("ad-iframe")) {
                        el.src = "http://manageraddons.com/ads/728x90/?nopop&ad3&utm_source=OMChrome1.2.8&utm_campaign=AdTopAlbum;"
                    }
                }
            } catch (ex) {
            }
            // #endregion

        });
    });
}


$(document).kb("keydown", {
    Modifiers: ["ctrl", "shift"],
    Keys: ["f1"]
},
function() {
    window.open(chrome.extension.getURL("configs.html"));
});

if ((/orkutmanager\.net/i).test(window.location.href))
{
    $(".quoteinstall").die();
    $(".quoteinstall").live("click", function(ev) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        var preview = $(this).closest(".quote-preview");
        chrome.extension.sendRequest({
            type: "post",
            Itens: ["QuoteTextHtml", "HQuoteHeaderB", "HQuoteHeaderE", "HQuoteMessageB", "HQuoteMessageE"],
            Values: [preview.find("[name^=quotetext]").val(), preview.find("[name^=quoteprefix]").val(), preview.find("[name^=quotesufix]").val(), preview.find("[name^=textprefix]").val(), preview.find("[name^=textsufix]").val()]
        }, function(r) {
            alert("Instalado");
        });
    });

    $('.userbar').live('click', function(e) {
        var bar = $(this).closest(".userbar-view").find(":hidden").val();

        if (!confirm("Deseja instalar a Userbar: " + $(this).attr('alt') +
                "? \nLink:" + $(this).attr('src')))
            return;
        chrome.extension.sendRequest({
            type: "post",
            Itens: ["HSignature"],
            Values: [bar]
        }, function(r) {
            alert("Userbar Instalada");
        });
        e.preventDefault();
    });
}

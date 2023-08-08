if (!OMSystem)
    var OMSystem = {};
if (!OMSystem.OrkutManager)
    OMSystem.OrkutManager = {};
if (!OMSystem.OrkutManager.PrefManager)
    OMSystem.OrkutManager.PrefManager = {};

if (!OMSystem.OrkutManager.Util)
    OMSystem.OrkutManager.Util = {};

OMSystem.OrkutManager.Util =
        {
            Window:
                    {
                        /// <summary>
                        /// Check if the page matches the search
                        /// </summary>
                        /// <param name="Url">Page search for regex</param>
                        IsPage: function(Url, window) {
                            var re = new RegExp("^https?:\/\/[^/]+" + Url + ".*", "i");
                            return (re).test(window.location.href.replace("/Main#", "/"));
                        }
                    },
            Orkut:
                    {
                        /// <summary>
                        /// Returns text fixed to post
                        /// </summary>
                        /// <param name="Text">Text</param>
                        /// <param name="IsHtml">IsHtml</param>
                        /// <returns>string</returns>
                        FixPost:
                                function(Text, IsHtml)
                                {
                                    if (IsHtml) {
                                        Text = Text.replace(/\[code\]([^]*?)\[\/code\]/gi, function(match, p1) {
                                            return p1.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ /g, String.fromCharCode(160)).replace(/\[(\/?)(.+)\]/g, "[$1$2[b][/b]]");
                                        });
                                        Text = Text.replace(/https:\/\/(.*)\.googleusercontent/ig, 'http://$1.google')
                                        try {
                                            if (!(/\[(.+)\]/ig).test(Text))
                                                throw "";
                                            var EmoteList = JSON.parse(OMSystem.OrkutManager.PrefManager.Get("EmoticonsList", "{}"));
                                            var Emote = Text.match(/\[(.+?)\]/g);
                                            EmoteL = Emote.length;
                                            for (i = 0; i < EmoteL; i++) {
                                                Emot = Emote[i].replace("[", "").replace("]", "");
                                                if (EmoteList[Emot])
                                                    Text = Text.replace("[" + Emot + "]", "<img src='" + unescape(EmoteList[Emot]).replace(/\s/g, "%20") + "' alt='" + Emot + "' />");
                                            }
                                        } catch (lol) {
                                        }
                                    } else
                                        Text = Text.replace(/\[code\]([^]*?)\[\/code\]/gi, function(match, p1) {
                                            return p1.replace(/ /g, String.fromCharCode(160)).replace(/\[(\/?)(b|i|u)\]/g, "[$1$2[b][/b]]");
                                        });

                                    if (IsHtml)
                                        Text = Text.replace(/\n/g, "<br>");
                                    else
                                    {
                                        Text = Text.replace(/\n/g, String.fromCharCode(160) + "\n");
                                    }
                                    return Text;
                                },
                                /// <summary>
                                /// Returns text fixed to preview
                                /// </summary>
                                /// <param name="Text">Text</param>
                                /// <param name="IsHtml">IsHtml</param>
                                /// <returns>string</returns>
                                Preview:
                                        function(Text, IsHtml)
                                        {
                                            Text = Text.replace(/\[code\]([^]*?)\[\/code\]/gi, function(match, p1) {
                                                return p1.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ /g, String.fromCharCode(160)).replace(/\n/g, "<br/>").replace(/\[(\/?)(.+)\]/g, "[$1$2[b][/b]]");
                                            });

                                            if (!IsHtml)
                                                Text = Text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

                                            var str = String.fromCharCode(160);
                                            var tab = "";
                                            for (var i = 0; i < 9; i++) {
                                                tab += str;
                                            }
                                            Text = Text.replace(/\t/g, tab);

                                            // Links and images
                                            Text = Text.replace(/\[link=(.*?)\]([^$]*?)\[\/link\]/ig, "<a href='$1'>$2</a>");
                                            Text = Text.replace(/\[link\]((\n|.)*?)\[\/link\]/ig, "<a href='$1'>$1</a>");


                                            if (IsHtml)
                                            {
                                                Text = Text.replace(/(https?\:\/\/([-\w._\/]+)([^-\w._\/]|$))/ig,
                                                        function(p1, p2, p3, p4)
                                                        {
                                                            var ext = p3.substring(p3.lastIndexOf(".") + 1);

                                                            if (/['"]/.test(p4))
                                                                return p1;

                                                            if (!isNaN(p4.charCodeAt(0)))
                                                            {
                                                                p2 = p2.substring(0, p2.length - 1);
                                                            }

                                                            switch (ext)
                                                            {
                                                                case "png":
                                                                case "jpg":
                                                                case "gif":
                                                                case "bmp":
                                                                    return "<img src='" + p2 + "' />" + p4;
                                                            }

                                                            return "<a href='" + p2 + "'>" + p2 + "</a>" + p4;
                                                        });
                                                        try {
                                                            if (!(/\[(.+)\]/ig).test(Text))
                                                                throw "";
                                                            var EmoteList = JSON.parse(OMSystem.OrkutManager.PrefManager.Get("EmoticonsList", "{}"));
                                                            var Emote = Text.match(/\[(.+?)\]/g);
                                                            EmoteL = Emote.length;
                                                            for (i = 0; i < EmoteL; i++) {
                                                                Emot = Emote[i].replace("[", "").replace("]", "");
                                                                if (EmoteList[Emot])
                                                                    Text = Text.replace("[" + Emot + "]", "<img src='" + unescape(EmoteList[Emot]).replace(/\s/g, "%20") + "' alt='" + Emot + "' />");
                                                            }
                                                        } catch (lol) {
                                                        }
                                                    }
                                                    else
                                                    {
                                                        Text = Text.replace(/((<[^>]*?>.*?<\/.*?>)|(https?:\/\/.*?)(\s|$))/ig,
                                                                function(match, p2)
                                                                {
                                                                    var p1 = match;
                                                                    if (p1[0] != "<")
                                                                    {
                                                                        var has = (p1.indexOf("\n") > 0 || p1.indexOf(" ") > 0);
                                                                        if (has)
                                                                            return "<a href='" + p1.substr(0, p1.length - 1) + "'>" + p1 + "</a>";
                                                                        else
                                                                            return "<a href='" + p1 + "'>" + p1 + "</a>";
                                                                    }
                                                                    else
                                                                        return p1;
                                                                });
                                                            }
                                                    // - emoticons
                                                    Text = Text.replace(/\[:\)\]/g, "<img alt='' src='http://static1.orkut.com/img/smiley/i_smile.gif' />");
                                                    Text = Text.replace(/\[;\)\]/g, "<img alt='' src='http://static1.orkut.com/img/smiley/i_wink.gif' />");
                                                    Text = Text.replace(/\[:D\]/g, "<img alt='' src='http://static1.orkut.com/img/smiley/i_bigsmile.gif' />");
                                                    Text = Text.replace(/\[:P\]/g, "<img alt='' src='http://static1.orkut.com/img/smiley/i_funny.gif' />");
                                                    Text = Text.replace(/\[\/\)\]/g, "<img alt='' src='http://static1.orkut.com/img/smiley/i_confuse.gif' />");
                                                    Text = Text.replace(/\[8\)\]/g, "<img alt='' src='http://static1.orkut.com/img/smiley/i_cool.gif' />");
                                                    Text = Text.replace(/\[:o\]/g, "<img alt='' src='http://static1.orkut.com/img/smiley/i_surprise.gif' />");
                                                    Text = Text.replace(/\[:\(\]/g, "<img alt='' src='http://static1.orkut.com/img/smiley/i_sad.gif' />");
                                                    Text = Text.replace(/\[:x\]/g, "<img alt='' src='http://static1.orkut.com/img/smiley/i_angry.gif' />");

                                                    // - formatting & colors
                                                    Text = Text.replace(/\[(maroon|red|orange|navy|blue|aqua|teal|green|lime|olive|gold|yellow|gray|silver|purple|fuchsia|violet|pink)\]/ig, "<span style='color: $1'>");
                                                    Text = Text.replace(/\[\/(maroon|red|orange|navy|blue|aqua|teal|green|lime|olive|gold|yellow|gray|silver|purple|fuchsia|violet|pink)\]/ig, "</span>");
                                                    Text = Text.replace(/\[(b|i|u)\]/ig, "<$1>");
                                                    Text = Text.replace(/\[\/(b|i|u)\]/ig, "</$1>");

                                                    Text = Text.replace(/\n/g, "<br>");

                                                    if (/bodyText=/i.test(window.location.search || window.location.hash))
                                                    {
                                                        Text = Text.replace(/\bon([A-Z]{3,})\b/ig, "")
                                                                .replace(/<(applet|body|embed|frame|script|frameset|html|iframe|img|style|layer|link|ilayer|meta|object)/ig, "&lt;$1")
                                                                .replace(/\bjavascript\b/ig, "");
                                                    }
                                                    return Text;
                                                },
                                                CreatePreviewPane:
                                                        function(window, container, text, hidden)
                                                        {
                                                            var document = window.document;
                                                            var pane = document.createElement("div");
                                                            var paneId = "OMPreviewPane" + ((Math.random() * container.innerHTML.length) + "").replace(".", "");
                                                            pane.id = paneId;
                                                            pane.className = "listdark";
                                                            if (hidden)
                                                                pane.style.display = "none";
                                                            container.appendChild(document.createElement("br"));
                                                            container.appendChild(pane);
                                                            var collapser = OMSystem.OrkutManager.Util.Orkut.GetButton(window, text,
                                                                    function()
                                                                    {
                                                                        var p = document.getElementById(paneId);
                                                                        p.style.display = (p.style.display == "none" ? "" : "none");
                                                                    }, "click");
                                                                    container.insertBefore(collapser, pane);
                                                                    return paneId;
                                                                },
                                                        /// <summary>
                                                        /// Create Button
                                                        /// </summary>
                                                        /// <param name="window">window</param>
                                                        /// <param name="Text">Button text</param>
                                                        /// <param name="Func">Button function object</param>
                                                        /// <param name="Event">Function event name</param>
                                                        /// <param name="Tooltip">Tooltip</param>
                                                        /// <returns>Span Element</returns>
                                                        GetButton:
                                                                function(window, Text, Func, Event, Tooltip, AsSpan)
                                                                {
                                                                    var ButtonContainer = window.document.createElement("span");
                                                                    var ButtonPlaceHolder = window.document.createElement("span");
                                                                    ButtonPlaceHolder.className = "grabtn";
                                                                    if (!AsSpan)
                                                                    {
                                                                        var Button = window.document.createElement("a");
                                                                        Button.id = "id" + Text + (Math.random() + "").replace(".", "");
                                                                        Button.innerHTML = Text;
                                                                        Button.className = "btn";
                                                                        Button.href = "javascript:;";
                                                                    }
                                                                    else
                                                                    {
                                                                        var Button = window.document.createElement("span");
                                                                        Button.id = "id" + Text + (Math.random() + "").replace(".", "");
                                                                        Button.innerHTML = Text;
                                                                        Button.style.color = "#02679C";
                                                                        Button.style.cursor = "pointer";
                                                                        Button.addEventListener("mouseover", function() {
                                                                            this.style.textDecoration = "underline";
                                                                            this.style.color = "#00344F";
                                                                        }, false);
                                                                        Button.addEventListener("mouseout", function() {
                                                                            this.style.textDecoration = "";
                                                                            this.style.color = "#02679C";
                                                                        }, false);
                                                                    }
                                                                    ButtonPlaceHolder.appendChild(Button);
                                                                    ButtonContainer.appendChild(ButtonPlaceHolder);
                                                                    var BorderRight = window.document.createElement("span");
                                                                    BorderRight.className = "btnboxr";
                                                                    var PixImg = window.document.createElement("img");
                                                                    PixImg.height = "1";
                                                                    PixImg.width = "5";
                                                                    PixImg.src = "http://img1.orkut.com/img/b.gif";
                                                                    PixImg.alt = "";
                                                                    if (Tooltip)
                                                                        ButtonContainer.title = Tooltip;
                                                                    BorderRight.appendChild(PixImg);
                                                                    ButtonContainer.appendChild(BorderRight);
                                                                    if (Func)
                                                                        ButtonContainer.addEventListener(Event, Func, false);
                                                                    return ButtonContainer;
                                                                },
                                                                /// <summary>
                                                                /// Create orkut panel
                                                                /// </summary>
                                                                /// <param name="window">window</param>
                                                                /// <param name="Title">Title</param>
                                                                /// <param name="Content">Content</param>
                                                                /// <param name="cHeight">Content height</param>
                                                                /// <returns>Div Element</returns>
                                                                GetPanel:
                                                                        function(window, title, content)
                                                                        {
                                                                            var document = window.document;

                                                                            var panel = document.createElement("div");
                                                                            panel.id = "OMPanel" + Math.ceil((Math.random() * (title.length + content.length + 150 * Math.random())));
                                                                            panel.style.width = "143px";
                                                                            panel.style.position = "absolute";

                                                                            var table = document.createElement("table");
                                                                            table.className = "ommodule";
                                                                            table.style.width = "100%";
                                                                            table.cellSpacing = "0";
                                                                            table.cellPadding = "0";

                                                                            // Top
                                                                            var toptr = document.createElement("tr");
                                                                            var topl = document.createElement("td");
                                                                            var topr = document.createElement("td");
                                                                            topl.className = (title ? "omtopl_g" : "omtopl");
                                                                            var titleH = document.createElement("div");
                                                                            titleH.innerHTML = title;
                                                                            if (title)
                                                                            {
                                                                                titleH.style.height = "21px";
                                                                                titleH.style.lineHeight = "21px";
                                                                            }
                                                                            topl.appendChild(titleH);
                                                                            topr.className = (title ? "omtopr_g" : "omtopr");
                                                                            topr.innerHTML = "";
                                                                            topl.style.width = "99%";
                                                                            topr.style.width = "8px";

                                                                            // Content
                                                                            var tr = document.createElement("tr");
                                                                            var l = document.createElement("td");
                                                                            var r = document.createElement("td");
                                                                            l.className = "omboxmidlrg";
                                                                            l.id = panel.id + "_PanelContent";
                                                                            r.className = "omboxmidr";
                                                                            r.innerHTML = "&nbsp;";
                                                                            l.innerHTML = (content || "&nbsp;");

                                                                            // Bot
                                                                            var bottr = document.createElement("tr");
                                                                            var botl = document.createElement("td");
                                                                            var botr = document.createElement("td");
                                                                            botl.className = "ombotl";
                                                                            botl.innerHTML = "&nbsp;";
                                                                            botr.className = "ombotr";
                                                                            botr.innerHTML = "&nbsp;";
                                                                            botr.style.backgroundRepeat = "no-repeat";

                                                                            // Build
                                                                            toptr.appendChild(topl);
                                                                            toptr.appendChild(topr);
                                                                            tr.appendChild(l);
                                                                            tr.appendChild(r);
                                                                            bottr.appendChild(botl);
                                                                            bottr.appendChild(botr);

                                                                            table.appendChild(toptr);
                                                                            table.appendChild(tr);
                                                                            table.appendChild(bottr);

                                                                            panel.appendChild(table);

                                                                            return panel;
                                                                        },
                                                                        /// <summary>
                                                                        /// Create Menu
                                                                        /// </summary>
                                                                        /// <param name="window">window</param>
                                                                        /// <param name="Name">Name</param>
                                                                        /// <param name="Link">Link</param>
                                                                        GetMenuDD:
                                                                                function(window, Text, Link)
                                                                                {
                                                                                    var document = window.document;
                                                                                    var Menu = document.getElementById("OMMenuDD");

                                                                                    var Container = document.getElementById("OMMenuContainer");
                                                                                    var MenuButton = Container.getElementsByTagName("li")[0].getElementsByTagName("a")[0];

                                                                                    if (!Menu)
                                                                                    {
                                                                                        MenuButton.href = "javascript:;";
                                                                                        MenuButton.addEventListener("click",
                                                                                                function()
                                                                                                {
                                                                                                    var Menu = document.getElementById("OMMenuDD");
                                                                                                    if (Menu.style.display == "none")
                                                                                                        Menu.style.display = "";
                                                                                                    else
                                                                                                        Menu.style.display = "none";
                                                                                                }, false);
                                                                                                Menu = document.createElement("div");
                                                                                                Menu.id = "OMMenuDD";
                                                                                                Menu.style.backgroundColor = "#5888C6";
                                                                                                Menu.style.border = "2px solid white";
                                                                                                Menu.style.color = "white";
                                                                                                Menu.style.padding = "5px";
                                                                                                Menu.style.overflow = "hidden";

                                                                                                Menu.style.display = "none";
                                                                                                Menu.style.position = "absolute";
                                                                                                Menu.style.top = "30px";
                                                                                                Menu.style.zIndex = "500";
                                                                                                Menu.style.width = "200px";
                                                                                                document.getElementById("container").appendChild(Menu);
                                                                                            }

                                                                                    var Item = document.createElement("a");
                                                                                    if (Text)
                                                                                    {
                                                                                        Item.style.color = "white";
                                                                                        Item.style.fontSize = "11px";
                                                                                        Item.href = Link;
                                                                                        Text = (OMSystem.OrkutManager.Util.Window.IsPage(Link, window) ? "<b>" + Text + "</b>" : Text);
                                                                                        Item.innerHTML = "- " + Text;
                                                                                        Menu.appendChild(Item);
                                                                                        Menu.appendChild(document.createElement("br"));
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                        var Sep = document.createElement("div");
                                                                                        Sep.style.borderTop = "1px solid #DEEFFF";
                                                                                        Sep.style.margin = "5px 2px 5px 2px";
                                                                                        Sep.style.fontSize = "0px";
                                                                                        Sep.innerHTML = "&nbsp;";
                                                                                        Menu.appendChild(Sep);
                                                                                    }
                                                                                },
                                                                                /// <summary>
                                                                                /// Create Menu Header
                                                                                /// </summary>
                                                                                /// <param name="window">window</param>
                                                                                /// <param name="Name">Name</param>
                                                                                /// <param name="Link">Link</param>
                                                                                GetMenuHD:
                                                                                        function(window, Text, Link)
                                                                                        {
                                                                                            var document = window.document;
                                                                                            var Container = document.getElementById("OMMenuContainer");
                                                                                            if (!Container.getAttribute("Cleared") && OMSystem.OrkutManager.PrefManager.Get("MenuHDClear", false))
                                                                                            {
                                                                                                var lis = Container.getElementsByTagName("li");
                                                                                                lisLength = lis.length;
                                                                                                for (l = 0; l < lisLength; l++)
                                                                                                {
                                                                                                    var li = lis[l];
                                                                                                    if (!li)
                                                                                                        continue;
                                                                                                    if (!li.className)
                                                                                                        continue;
                                                                                                    if (li.className == "logobg")
                                                                                                        continue;
                                                                                                    li.style.display = "none";
                                                                                                }
                                                                                            }
                                                                                            Container.setAttribute("Cleared", "1");

                                                                                            var sep = document.createElement("span");
                                                                                            sep.innerHTML = "&nbsp;|&nbsp;"
                                                                                            var li = document.createElement("li");
                                                                                            var a = document.createElement("a");
                                                                                            a.innerHTML = Text;
                                                                                            a.href = Link;

                                                                                            li.appendChild(a);
                                                                                            li.appendChild(sep);
                                                                                            Container.appendChild(li);
                                                                                        },
                                                                                        Join:
                                                                                                function(window, cmm, POST_TOKEN, signature, cs) {
                                                                                                    var document = window.document;
                                                                                                    var params = "cs=" + cs + "&POST_TOKEN=" + POST_TOKEN + "&signature=" + signature + "&Action.join=1";
                                                                                                    $.post("/CommunityJoin.aspx?cmm=" + cmm + "&cache=" + (Math.random() + "cacheee").substring(2, 7), params,
                                                                                                            function(newdoc)
                                                                                                            {
                                                                                                                try {
                                                                                                                    var blocked = newdoc.getElementById("mbox").getElementsByClassName("listlight")[0];
                                                                                                                } catch (ex) {
                                                                                                                    var blocked = false;
                                                                                                                }

                                                                                                                if ($("#captchaTextbox", newdoc).length >= 1)
                                                                                                                {
                                                                                                                    var cap = document.createElement("div");
                                                                                                                    var capI = document.createElement("img");
                                                                                                                    var capT = document.createElement("input");
                                                                                                                    var capB = document.createElement("input");
                                                                                                                    var canB = document.createElement("input");
                                                                                                                    cap.id = "OMCaptcha";
                                                                                                                    cap.setAttribute("style", "z-index: 500000; position:absolute; width: 450px; height: 75px; background-color: white; border: 1px solid silver; padding: 3px;");
                                                                                                                    capI.setAttribute("style", "float:left;");
                                                                                                                    capI.setAttribute("title", "Clique na imagem para trocar");
                                                                                                                    capI.setAttribute("id", "imgcapctha");
                                                                                                                    capI.src = "https://lh4.googleusercontent.com/-nRzd4__CpSw/TaucTa5z7xI/AAAAAAAAAOk/8bjjXuUuIjU/s288/loading.jpg";
                                                                                                                    capT.type = "text";
                                                                                                                    capT.name = "cs";
                                                                                                                    capT.id = "cs";
                                                                                                                    capT.setAttribute("style", "margin-top:30px;");
                                                                                                                    capB.type = "button";
                                                                                                                    capB.value = " " + String.fromCharCode(187) + " ";
                                                                                                                    canB.type = "button";
                                                                                                                    canB.value = " x ";
                                                                                                                    canB.addEventListener("click", function() {
                                                                                                                        document.getElementById("OMCaptcha").style.display = "none";
                                                                                                                    }, false);
                                                                                                                    capT.addEventListener("keydown",
                                                                                                                            function(e)
                                                                                                                            {
                                                                                                                                if (e.keyCode != 13)
                                                                                                                                    return;
                                                                                                                                e.preventDefault();
                                                                                                                                var cs = document.getElementById("cs").value;
                                                                                                                                var c = document.getElementById("OMCaptcha");
                                                                                                                                c.parentNode.removeChild(c);
                                                                                                                                OMSystem.OrkutManager.Util.Orkut.Join(window, cmm, POST_TOKEN, signature, cs);
                                                                                                                            }, false);
                                                                                                                            capB.addEventListener("click",
                                                                                                                                    function()
                                                                                                                                    {
                                                                                                                                        var cs = document.getElementById("cs").value;
                                                                                                                                        var c = document.getElementById("OMCaptcha");
                                                                                                                                        c.parentNode.removeChild(c);
                                                                                                                                        OMSystem.OrkutManager.Util.Orkut.Join(window, cmm, POST_TOKEN, signature, cs);
                                                                                                                                    }, false);
                                                                                                                                    cap.appendChild(capI);
                                                                                                                                    cap.appendChild(document.createTextNode("Captcha: "));
                                                                                                                                    cap.appendChild(capT);
                                                                                                                                    cap.appendChild(capB);
                                                                                                                                    cap.appendChild(canB);
                                                                                                                                    document.getElementById("mbox").getElementsByClassName("module")[1].parentNode.insertBefore(cap, document.getElementById("mbox").getElementsByClassName("module")[1]);
                                                                                                                                    capT.focus();
                                                                                                                                    setTimeout(function() {
                                                                                                                                        document.getElementById("imgcapctha").src = "/CaptchaImage?xid=" + Math.random();
                                                                                                                                    }, '2000');
                                                                                                                                } else if (blocked) {
                                                                                                                            window.location.href = "/CommunityJoin.aspx?cmm=" + cmm;
                                                                                                                        }
                                                                                                                        else {
                                                                                                                            window.location.href = "/Community.aspx?cmm=" + cmm;
                                                                                                                        }

                                                                                                                    });
                                                                                                                },
                                                                                                        /// <summary>
                                                                                                        /// Create Button
                                                                                                        /// </summary>
                                                                                                        /// <param name="window">window</param>
                                                                                                        /// <param name="Field">Text Field Id</param>
                                                                                                        /// <param name="cmm">cmm</param>
                                                                                                        /// <param name="tid">tid</param>
                                                                                                        /// <param name="POST_TOKEN">POST_TOKEN</param>
                                                                                                        /// <param name="signature">signature</param>
                                                                                                        /// <param name="title">msg title</param>
                                                                                                        /// <param name="cs">capcha</param>
                                                                                                        QuickReply:
                                                                                                                function(window, fieldId, cmm, tid, POST_TOKEN, signature, title, cs, sendText)
                                                                                                                {
                                                                                                                    var document = window.document;
                                                                                                                    var removeUnload = document.createElement('script');
                                                                                                                    removeUnload.innerHTML = 'window.onbeforeunload = null';
                                                                                                                    document.body.appendChild(removeUnload);
                                                                                                                    if (!fieldId)
                                                                                                                        fieldId = "OMQuickReply";
                                                                                                                    var Area = window.document.getElementById(fieldId);
                                                                                                                    var OLDText = document.getElementById("QreplyButtonSend").getElementsByTagName("a")[0].innerHTML;
                                                                                                                    document.getElementById("QreplyButtonSend").getElementsByTagName("a")[0].innerHTML = "<span style='padding-top: 5px;'>" + sendText + " </span><img style='border:0 none;text-align:left;vertical-align:top;' src='http://static3.orkut.com/img/gwt/loading_dots.gif' alt='Loading' />";
                                                                                                                    var Text;
                                                                                                                    if (!Area)
                                                                                                                        return;
                                                                                                                    Text = Area.value;
                                                                                                                    Text = OMSystem.OrkutManager.Util.Orkut.FixPost(Text, (window.document.body.getAttribute("OMIsHtml") == "1"));
                                                                                                                    if (Text.replace(/\s|\n|\r/g, "") == "")
                                                                                                                        return;
                                                                                                                    if (!title)
                                                                                                                    {
                                                                                                                        title = document.getElementById("subject");
                                                                                                                        if (title)
                                                                                                                            title = title.value;
                                                                                                                        else
                                                                                                                            title = "";
                                                                                                                    }
                                                                                                                    title = encodeURIComponent(title);
                                                                                                                    var cache = (Math.random() + "cacheee").substring(2, 7);
                                                                                                                    var o;
                                                                                                                    $.ajax({
                                                                                                                        type: "POST",
                                                                                                                        url: "CommMsgPost?cmm=" + cmm + "&tid=" + tid + "&cache=" + (Math.random() + "cacheee").substring(2, 7),
                                                                                                                        data: "cs=" + cs + "&POST_TOKEN=" + POST_TOKEN + "&signature=" + signature + "&subjectText=" + title + "&bodyText=" + encodeURIComponent(Text) + "&Action.submit=Submit%20Query",
                                                                                                                        success: function(newdoc, textStatus, o)
                                                                                                                        {
                                                                                                                            try {
                                                                                                                                if ($("#captchaTextbox", newdoc).length >= 1)
                                                                                                                                {
                                                                                                                                    try {
                                                                                                                                        c = document.getElementById("OMCaptcha");
                                                                                                                                        c.parentNode.removeChild(c);
                                                                                                                                    } catch (ex) {
                                                                                                                                    }
                                                                                                                                    var cap = document.createElement("div");
                                                                                                                                    var capI = document.createElement("img");
                                                                                                                                    var capT = document.createElement("input");
                                                                                                                                    var capB = document.createElement("input");
                                                                                                                                    var canB = document.createElement("input");
                                                                                                                                    cap.id = "OMCaptcha";
                                                                                                                                    cap.setAttribute("style", "z-index: 500000; position:absolute; width: 450px; height: 75px; background-color: white; border: 1px solid silver; padding: 3px;");
                                                                                                                                    capI.setAttribute("style", "float:left;");
                                                                                                                                    capI.setAttribute("title", "Clique na imagem para trocar");
                                                                                                                                    capI.setAttribute("id", "imgcapctha");
                                                                                                                                    capI.src = "https://lh4.googleusercontent.com/_RY-bdZyvsZo/TaucTa5z7xI/AAAAAAAAAOk/bwYSLs0bUHA/loading.jpg";
                                                                                                                                    capI.addEventListener("click", function() {
                                                                                                                                        document.getElementById("imgcapctha").src = "/CaptchaImage?xid=" + Math.random();
                                                                                                                                    }, false);
                                                                                                                                    capT.type = "text";
                                                                                                                                    capT.name = "cs";
                                                                                                                                    capT.id = "cs";
                                                                                                                                    capT.setAttribute("style", "margin-top:30px;");
                                                                                                                                    capB.type = "button";
                                                                                                                                    capB.value = " " + String.fromCharCode(187) + " ";
                                                                                                                                    canB.type = "button";
                                                                                                                                    canB.value = " x ";
                                                                                                                                    canB.addEventListener("click", function() {
                                                                                                                                        document.getElementById("OMCaptcha").style.display = "none";
                                                                                                                                    }, false);
                                                                                                                                    capT.addEventListener("keydown",
                                                                                                                                            function(e)
                                                                                                                                            {
                                                                                                                                                if (e.keyCode != 13)
                                                                                                                                                    return;
                                                                                                                                                var cs = document.getElementById("cs").value;
                                                                                                                                                title = decodeURIComponent(title);
                                                                                                                                                OMSystem.OrkutManager.Util.Orkut.QuickReply(window, fieldId, cmm, tid, POST_TOKEN, signature, title, cs, sendText);
                                                                                                                                                try {
                                                                                                                                                    var c = document.getElementById("OMCaptcha");
                                                                                                                                                    c.parentNode.removeChild(c);
                                                                                                                                                } catch (ex) {
                                                                                                                                                }
                                                                                                                                            }, false);
                                                                                                                                            capB.addEventListener("click",
                                                                                                                                                    function()
                                                                                                                                                    {
                                                                                                                                                        var cs = document.getElementById("cs").value;
                                                                                                                                                        title = decodeURIComponent(title);
                                                                                                                                                        OMSystem.OrkutManager.Util.Orkut.QuickReply(window, fieldId, cmm, tid, POST_TOKEN, signature, title, cs, sendText);
                                                                                                                                                        try {
                                                                                                                                                            var c = document.getElementById("OMCaptcha");
                                                                                                                                                            c.parentNode.removeChild(c);
                                                                                                                                                        } catch (ex) {
                                                                                                                                                        }
                                                                                                                                                    }, false);
                                                                                                                                                    cap.appendChild(capI);
                                                                                                                                                    cap.appendChild(document.createTextNode("Captcha: "));
                                                                                                                                                    cap.appendChild(capT);
                                                                                                                                                    cap.appendChild(capB);
                                                                                                                                                    cap.appendChild(canB);
                                                                                                                                                    document.getElementById(fieldId).parentNode.insertBefore(cap, document.getElementById(fieldId).parentNode.firstChild);
                                                                                                                                                    capT.focus();
                                                                                                                                                    setTimeout(function() {
                                                                                                                                                        document.getElementById("imgcapctha").src = "/CaptchaImage?xid=" + Math.random();
                                                                                                                                                    }, '2000');
                                                                                                                                                } else if ($("#statusMsg", newdoc).css("display") == "block") {
                                                                                                                                            try {
                                                                                                                                                c = document.getElementById("OMCaptcha");
                                                                                                                                                c.parentNode.removeChild(c);
                                                                                                                                            } catch (ex) {
                                                                                                                                            }
                                                                                                                                            try {
                                                                                                                                                var Language = OMSystem.OrkutManager.Language.Get();
                                                                                                                                                alert(Language.errorSendindMsg);
                                                                                                                                                var cap = document.createElement("div");
                                                                                                                                                var Errook = document.createElement("input");
                                                                                                                                                cap.id = "OMerror";
                                                                                                                                                Errook.type = "button";
                                                                                                                                                Errook.value = "Fechar";
                                                                                                                                                Errook.setAttribute("style", "float:left;");
                                                                                                                                                Errook.addEventListener("click", function() {
                                                                                                                                                    document.getElementById("OMerror").style.display = "none";
                                                                                                                                                }, false);
                                                                                                                                                cap.innerHTML = "<br><span style='color: red;'><b>Erro:</b></span>" + $("#statusMsgBody", newdoc).html() + "<br>";
                                                                                                                                                cap.setAttribute("style", "z-index: 500000; position:absolute; width: 450px; height: 75px; background-color: white; border: 1px solid silver; padding: 3px;");
                                                                                                                                                cap.appendChild(Errook);
                                                                                                                                                $("#" + fieldId).parent().before(cap);
                                                                                                                                            } catch (ex) {
                                                                                                                                                //alert(ex);
                                                                                                                                            }
                                                                                                                                        } else {
                                                                                                                                            if (tid)
                                                                                                                                                window.location.href = "/CommMsgs.aspx?cmm=" + cmm + "&tid=" + tid + "&na=2&scroll=-1&c=" + Math.random();
                                                                                                                                            else {
                                                                                                                                                try {
                                                                                                                                                    var res = o.responseText.match(/CommMsgPost\?cmm=(\d+)&tid=(\d+)/);

                                                                                                                                                    window.location.href = "/CommMsgs.aspx?cmm=" + res[1] + "&tid=" + res[2];
                                                                                                                                                } catch (ex) {
                                                                                                                                                    alert(ex);
                                                                                                                                                    window.location.href = "/Community.aspx?cmm=" + cmm + "&c=" + Math.random();
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                    } catch (ex) {
                                                                                                                                    }
                                                                                                                                    document.getElementById("QreplyButtonSend").getElementsByTagName("a")[0].innerHTML = OLDText;
                                                                                                                                }
                                                                                                                            });
                                                                                                                        },
                                                                                                                /// <summary>
                                                                                                                /// Fix Quote Message
                                                                                                                /// </summary>
                                                                                                                /// <param name="IsHtml">Is Html enabled</param>
                                                                                                                /// <param name="Msg">Message</param>
                                                                                                                HandleQuote:
                                                                                                                        function(IsHtml, Msg)
                                                                                                                        {
                                                                                                                            Msg = Msg.replace(/<wbr>/g, "");
                                                                                                                            Msg = Msg.replace(/\&nbsp\;/g, String.fromCharCode(160))

                                                                                                                            Msg = Msg.replace(/(<img[^>]*?src=.http[^>]*?orkut.com[^>]*?smiley.)(i_smile)([^>]*?>)/gi, "[:)]");
                                                                                                                            Msg = Msg.replace(/(<img[^>]*?src=.http[^>]*?orkut.com[^>]*?smiley.)(i_wink)([^>]*?>)/gi, "[;)]");
                                                                                                                            Msg = Msg.replace(/(<img[^>]*?src=.http[^>]*?orkut.com[^>]*?smiley.)(i_bigsmile)([^>]*?>)/gi, "[:D]");
                                                                                                                            Msg = Msg.replace(/(<img[^>]*?src=.http[^>]*?orkut.com[^>]*?smiley.)(i_cool)([^>]*?>)/gi, "[8)]");
                                                                                                                            Msg = Msg.replace(/(<img[^>]*?src=.http[^>]*?orkut.com[^>]*?smiley.)(i_funny)([^>]*?>)/gi, "[:P]");
                                                                                                                            Msg = Msg.replace(/(<img[^>]*?src=.http[^>]*?orkut.com[^>]*?smiley.)(i_confuse)([^>]*?>)/gi, "[/)]");
                                                                                                                            Msg = Msg.replace(/(<img[^>]*?src=.http[^>]*?orkut.com[^>]*?smiley.)(i_surprise)([^>]*?>)/gi, "[:o]");
                                                                                                                            Msg = Msg.replace(/(<img[^>]*?src=.http[^>]*?orkut.com[^>]*?smiley.)(i_sad)([^>]*?>)/gi, "[:(]");
                                                                                                                            Msg = Msg.replace(/(<img[^>]*?src=.http[^>]*?orkut.com[^>]*?smiley.)(i_angry)([^>]*?>)/gi, "[:x]");

                                                                                                                            if (!IsHtml)
                                                                                                                            {
                                                                                                                                Msg = Msg.replace(/<br.*?>/g, String.fromCharCode(160) + "\n");
                                                                                                                                Msg = Msg.replace(/<(\/?[(b|i|u)])>/gi, "[$1]");
                                                                                                                                Msg = Msg.replace(/<.*?>/g, "");
                                                                                                                            }
                                                                                                                            else
                                                                                                                            {
                                                                                                                                Msg = Msg.replace(/\s?-moz-[^;]+;/g, "");
                                                                                                                                Msg = Msg.replace(/(<.[^>]*?)\s?none repeat scroll 0% 0%([^>]*?>)/g, "$1$2");
                                                                                                                                Msg = Msg.replace(/<br.*?>/g, String.fromCharCode(160) + "\n");
                                                                                                                                Msg = Msg.replace(/(<a[^>]*?)\s?onclick=../g, "$1");
                                                                                                                                Msg = Msg.replace(/(<img.*?)(\s?border=.?0.?)/gi, "$1");
                                                                                                                            }

                                                                                                                            return Msg;
                                                                                                                        },
                                                                                                                        /// <summary>
                                                                                                                        /// Load text to status container
                                                                                                                        /// </summary>
                                                                                                                        /// <param name="window">window</param>
                                                                                                                        /// <param name="text">text</param>
                                                                                                                        /// <param name="text">"none"|""</param>
                                                                                                                        StatusLoad:
                                                                                                                                function(window, text, display)
                                                                                                                                {
                                                                                                                                    var document = window.document;
                                                                                                                                    document.getElementById("statusMsg").style.display = display;
                                                                                                                                    if (document.getElementById("statusMsgBody").innerHTML.replace(/\s|\n/g, "") != "")
                                                                                                                                        document.getElementById("statusMsgBody").innerHTML += '<div class="listdivi ln tabdivi">&nbsp;</div>';
                                                                                                                                    document.getElementById("statusMsgBody").innerHTML += text;
                                                                                                                                }
                                                                                                                            },
                                                                                                                    Ajax:
                                                                                                                            {
                                                                                                                                CreatePane:
                                                                                                                                        function(window, text)
                                                                                                                                        {
                                                                                                                                            var document = window.document;
                                                                                                                                            var paneValue = text.replace(/<script.*?>([^$]*?)<\/script>/gi, "");
                                                                                                                                            var parseId = ((Math.random() * text.length) + "").replace(".", "");
                                                                                                                                            var xml = document.createElement("div");
                                                                                                                                            xml.id = "OMParser_" + parseId;
                                                                                                                                            xml.style.display = "none";
                                                                                                                                            xml.innerHTML = paneValue.replace(/<([^\s]+)([^$]*?)id="([^"]*?)"([^$]*?)>/gi, "<$1 $2 id=\"$3" + parseId + "\" $4>");
                                                                                                                                            document.body.appendChild(xml);
                                                                                                                                            return xml;
                                                                                                                                        }
                                                                                                                                    },
                                                                                                                            SpecialCharacters:
                                                                                                                                    {
                                                                                                                                        // Revert Text
                                                                                                                                        RevertText: "8238" // String.fromCharCode("8238");
                                                                                                                                    },
                                                                                                                            Encode:
                                                                                                                                    function(str)
                                                                                                                                    {
                                                                                                                                        return str;
                                                                                                                                    },
                                                                                                                                    OMUtil:
                                                                                                                                            {
                                                                                                                                                ProfilePreview: function(e, window) {
                                                                                                                                                    var hasPreview = window.document.getElementById("omPreViewTopic");
                                                                                                                                                    if (!hasPreview || hasPreview.length == 0) {
                                                                                                                                                        var newdoc = window.document.createElement("div");
                                                                                                                                                        newdoc.id = "omPreViewTopic";
                                                                                                                                                        newdoc.addEventListener("mouseover", function() {
                                                                                                                                                            OMSystem.OrkutManager.PrefManager.Set("omEnableClosePreview", false);
                                                                                                                                                        }, true);
                                                                                                                                                        window.document.body.addEventListener("click", function() {
                                                                                                                                                            window.document.getElementById("omPreViewTopic").style.display = "none";
                                                                                                                                                        }, true);
                                                                                                                                                        newdoc.innerHTML = "<div id='omPreViewtopicContent'><img style='position: relative; margin-left: 250px; top 50px' src=http://static3.orkut.com/img/castro/loading4.png /></div><div class='omPreViewTopic-border'></div><div class='omPreViewTopic-arrow'></div><div id='previewReplyButton'>";
                                                                                                                                                        hasPreview = newdoc;
                                                                                                                                                        window.document.body.appendChild(newdoc);
                                                                                                                                                    }
                                                                                                                                                    hasPreview.style.top = e.pageY - 40;
                                                                                                                                                    hasPreview.style.left = e.pageX;
                                                                                                                                                    hasPreview.style.display = 'block';
                                                                                                                                                    var url = e.target.parentNode.href.replace('Main#', '');
                                                                                                                                                    $.get(url, function(newdoc) {
                                                                                                                                                        try {
                                                                                                                                                            var content = "";
                                                                                                                                                            var profileImg = $(".userimg:eq(0) img:eq(0)", newdoc).attr('src');
                                                                                                                                                            var UserNome = $(".username:eq(0) b:eq(1)", newdoc).text();
                                                                                                                                                            var UserRatings = '<div class="userratings">';
                                                                                                                                                            $(".userratings:eq(0) .ht", newdoc).each(function() {
                                                                                                                                                                UserRatings += '<a href="' + $(this).attr('href') + '" class="ht">' + $(this).html() + '</a>';
                                                                                                                                                            })
                                                                                                                                                            UserRatings += '</div>';

                                                                                                                                                            content = '<img src="' + profileImg + '" style="max-width: 150px; max-height:150px; float:left" />';
                                                                                                                                                            content += '<div style="float:left">\n\
                                <h1>' + UserNome + '</h1>\n\
                                ' + UserRatings + '</div>';

                                                                                                                                                            $("#omPreViewtopicContent").html(content);
                                                                                                                                                        } catch (ex) {
                                                                                                                                                        }
                                                                                                                                                    }, 'html');
                                                                                                                                                },
                                                                                                                                                previewEvents: function(window) {
                                                                                                                                                    if (window.location.href.match("Communities"))
                                                                                                                                                        return;
                                                                                                                                                    if ($("#omPreViewTopic", window.document).length == 0)
                                                                                                                                                        $("body", window.document)
                                                                                                                                                                .append("<div id='omPreViewTopic'><div id='omPreViewtopicContent'><img style='position: relative; margin-left: 250px; top 50px' src=http://static3.orkut.com/img/castro/loading4.png /></div><div class='omPreViewTopic-border'></div><div class='omPreViewTopic-arrow'></div><div id='previewReplyButton'></div>");

                                                                                                                                                    $(".buttonLupaPreview", window.document).remove();
                                                                                                                                                    buttonLupaPreview = function(a) {
                                                                                                                                                        var button = window.document.createElement("div");
                                                                                                                                                        button.className = "buttonLupaPreview";
                                                                                                                                                        if (a)
                                                                                                                                                            button.style.marginRight = "3px";
                                                                                                                                                        if (a)
                                                                                                                                                            button.style.cssFloat = "left";
                                                                                                                                                        else
                                                                                                                                                            button.style.cssFloat = "right";
                                                                                                                                                        return button;
                                                                                                                                                    }
                                                                                                                                                    $("#OMBookmarksT .displaytable tr,form[name='topicsForm'] .displaytable tr", window.document).each(function() {
                                                                                                                                                        var el = $(this).parent().parent().parent();
                                                                                                                                                        if (el.attr("name") == "pollsForm")
                                                                                                                                                            return;
                                                                                                                                                        $(this).find("td:eq(1) a:eq(1)").before(buttonLupaPreview(true));
                                                                                                                                                        $(this).find("td:eq(1) div:eq(0) a:eq(0)").before(buttonLupaPreview(false));
                                                                                                                                                        $(this).find("td:eq(1) div:eq(0) a:eq(0)").css("margin-right", "3px").css("float", "right");
                                                                                                                                                    });
                                                                                                                                                    startPreview = function(pos) {
                                                                                                                                                        if ($("#omPreViewTopic", window.document).css("display") == "none") {
                                                                                                                                                            if (JSON.parse(OMSystem.OrkutManager.PrefManager.Get("enablePreviewTopics", false))) {
                                                                                                                                                                try {
                                                                                                                                                                    if ($(pos.target).css('float') == 'right') {
                                                                                                                                                                        pos.pageX = pos.pageX - 225;
                                                                                                                                                                        pos.pageY = pos.pageY + 15;
                                                                                                                                                                        $('.omPreViewTopic-arrow').addClass('omPreViewTopic-arrow-top');
                                                                                                                                                                        $('.omPreViewTopic-border').addClass('omPreViewTopic-border-top');
                                                                                                                                                                    } else {
                                                                                                                                                                        pos.pageX = pos.pageX + 25;
                                                                                                                                                                        pos.pageY = pos.pageY - 50;
                                                                                                                                                                        $('.omPreViewTopic-arrow').eq(0).removeClass('omPreViewTopic-arrow-top');
                                                                                                                                                                        $('.omPreViewTopic-border').eq(0).removeClass('omPreViewTopic-border-top');
                                                                                                                                                                    }
                                                                                                                                                                    try {
                                                                                                                                                                        var link = pos.target.nextSibling;
                                                                                                                                                                        link = link.getAttribute("href").replace("/Main#", "/");
                                                                                                                                                                    } catch (ex) {
                                                                                                                                                                        link = pos.target.previousSibling;
                                                                                                                                                                        link = link.getAttribute("href").replace("/Main#", "/");
                                                                                                                                                                    }
                                                                                                                                                                    try {
                                                                                                                                                                        cmm = link.match(/cmm=(\d+)/i)[1];
                                                                                                                                                                        tid = link.match(/tid=(\d+)/i)[1];
                                                                                                                                                                    } catch (ex) {
                                                                                                                                                                    }
                                                                                                                                                                    $.get(link, function(d) {
                                                                                                                                                                        var content = "";
                                                                                                                                                                        if ((/na=2/i).test(link)) {
                                                                                                                                                                            var post = $(".listitem", d).last().html();
                                                                                                                                                                        } else {
                                                                                                                                                                            var post = $(".listitem", d).first().html();
                                                                                                                                                                        }
                                                                                                                                                                        content = "<div class='listitem'>" + post + "</div><div class='listdivi'>";
                                                                                                                                                                        var reply = $(".parabtns:eq(1) .grabtn", d);
                                                                                                                                                                        if (reply.length == 3) {
                                                                                                                                                                            reply = $(".parabtns:eq(1) .grabtn", d).eq(2).html();
                                                                                                                                                                        } else {
                                                                                                                                                                            reply = $(".parabtns:eq(1) .grabtn", d).eq(1).html();
                                                                                                                                                                        }
                                                                                                                                                                        content += reply;
                                                                                                                                                                        window.document.getElementById("omPreViewtopicContent").innerHTML = content;
                                                                                                                                                                        window.document.getElementById("previewReplyButton").innerHTML = '<span class="grabtn">' + reply + '</span><span class="btnboxr"><img height="1" width="5" src="http://img1.orkut.com/img/b.gif" alt=""></span>';
                                                                                                                                                                        window.document.getElementById("omPreViewtopicContent").getElementsByTagName("form")[0].action = "/CommMsgs.aspx?cmm=" + cmm + "&tid=" + tid;
                                                                                                                                                                        $(".buttonLupaPreview").removeClass("waiting");
                                                                                                                                                                    });
                                                                                                                                                                } catch (ex) {
                                                                                                                                                                }
                                                                                                                                                                $("#omPreViewTopic", window.document).css("top", pos.pageY + "px").css("left", pos.pageX + "px").css("display", "block");
                                                                                                                                                            }
                                                                                                                                                        } else {
                                                                                                                                                            $("#omPreViewTopic", window.document).css("display", "none");
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                    if (!JSON.parse(OMSystem.OrkutManager.PrefManager.Get("omPreviewClick", true))) {
                                                                                                                                                        $(".buttonLupaPreview", window.document).hover(function(e) {
                                                                                                                                                            $(this).addClass('waiting');
                                                                                                                                                            PreviewInter = setTimeout(function() {
                                                                                                                                                                startPreview(e);
                                                                                                                                                                $(this).removeClass('waiting');
                                                                                                                                                            }, 2000);
                                                                                                                                                        }, function() {
                                                                                                                                                            $(this).removeClass('waiting');
                                                                                                                                                            clearTimeout(PreviewInter);
                                                                                                                                                            setTimeout(function() {
                                                                                                                                                                var check = localStorage["omEnableClosePreview"];
                                                                                                                                                                if (!check)
                                                                                                                                                                    check = "true";

                                                                                                                                                                if (JSON.parse(check))
                                                                                                                                                                    window.document.getElementById("omPreViewTopic").style.display = "none";
                                                                                                                                                            }, 250);
                                                                                                                                                        });
                                                                                                                                                        $("#omPreViewTopic", window.document).hover(function() {
                                                                                                                                                            localStorage["omEnableClosePreview"] = JSON.stringify(false);
                                                                                                                                                        }, function() {
                                                                                                                                                            clearTimeout(PreviewInter);
                                                                                                                                                            $(this).removeClass('waiting');
                                                                                                                                                            window.document.getElementById("omPreViewTopic").style.display = "none";
                                                                                                                                                            localStorage["omEnableClosePreview"] = JSON.stringify(true);
                                                                                                                                                        });
                                                                                                                                                    } else {
                                                                                                                                                        $(".buttonLupaPreview", window.document).click(startPreview);
                                                                                                                                                    }
                                                                                                                                                },
                                                                                                                                                ShortenUrl: function(url) {
                                                                                                                                                    chrome.extension.sendRequest({
                                                                                                                                                        type: "shorten-url",
                                                                                                                                                        Url: url
                                                                                                                                                    }, function(r) {
                                                                                                                                                    });
                                                                                                                                                },
                                                                                                                                                LeadZero: function(v) {
                                                                                                                                                    return (v < 10 ? '0' + v : v);
                                                                                                                                                },
                                                                                                                                                YearLeap: function(y) {
                                                                                                                                                    if ((y % 4) == 0) {
                                                                                                                                                        if ((y % 100) == 0)
                                                                                                                                                            return ((y % 400) == 0) ? 1 : 0;
                                                                                                                                                        else
                                                                                                                                                            return 1;
                                                                                                                                                    }
                                                                                                                                                    else
                                                                                                                                                        return 0;
                                                                                                                                                },
                                                                                                                                                omTime: function(format, Language) {
                                                                                                                                                    format = escape(format);
                                                                                                                                                    format = unescape(format);
                                                                                                                                                    var date = new Date();
                                                                                                                                                    var d = OMSystem.OrkutManager.Util.OMUtil.LeadZero(date.getDate());
                                                                                                                                                    var j = date.getDate();
                                                                                                                                                    var w = date.getDay();
                                                                                                                                                    var l;
                                                                                                                                                    switch (w) {
                                                                                                                                                        case 0:
                                                                                                                                                            l = Language.DateTimeDays[0];
                                                                                                                                                            break;
                                                                                                                                                        case 1:
                                                                                                                                                            l = Language.DateTimeDays[1];
                                                                                                                                                            break;
                                                                                                                                                        case 2:
                                                                                                                                                            l = Language.DateTimeDays[2];
                                                                                                                                                            break;
                                                                                                                                                        case 3:
                                                                                                                                                            l = Language.DateTimeDays[3];
                                                                                                                                                            break;
                                                                                                                                                        case 4:
                                                                                                                                                            l = Language.DateTimeDays[4];
                                                                                                                                                            break;
                                                                                                                                                        case 5:
                                                                                                                                                            l = Language.DateTimeDays[5];
                                                                                                                                                            break;
                                                                                                                                                        case 6:
                                                                                                                                                        default:
                                                                                                                                                            l = Language.DateTimeDays[6];
                                                                                                                                                            break;
                                                                                                                                                    }
                                                                                                                                                    ;
                                                                                                                                                    var D = l.substring(0, 3);
                                                                                                                                                    var m = OMSystem.OrkutManager.Util.OMUtil.LeadZero(date.getMonth() + 1);
                                                                                                                                                    var n = (date.getMonth() + 1);
                                                                                                                                                    var F;
                                                                                                                                                    switch ((n - 1)) {
                                                                                                                                                        case 0:
                                                                                                                                                            F = Language.DateTimeMonths[0];
                                                                                                                                                            break;
                                                                                                                                                        case 1:
                                                                                                                                                            F = Language.DateTimeMonths[1];
                                                                                                                                                            break;
                                                                                                                                                        case 2:
                                                                                                                                                            F = Language.DateTimeMonths[2];
                                                                                                                                                            break;
                                                                                                                                                        case 3:
                                                                                                                                                            F = Language.DateTimeMonths[3];
                                                                                                                                                            break;
                                                                                                                                                        case 4:
                                                                                                                                                            F = Language.DateTimeMonths[4];
                                                                                                                                                            break;
                                                                                                                                                        case 5:
                                                                                                                                                            F = Language.DateTimeMonths[5];
                                                                                                                                                            break;
                                                                                                                                                        case 6:
                                                                                                                                                            F = Language.DateTimeMonths[6];
                                                                                                                                                            break;
                                                                                                                                                        case 7:
                                                                                                                                                            F = Language.DateTimeMonths[7];
                                                                                                                                                            break;
                                                                                                                                                        case 8:
                                                                                                                                                            F = Language.DateTimeMonths[8];
                                                                                                                                                            break;
                                                                                                                                                        case 9:
                                                                                                                                                            F = Language.DateTimeMonths[9];
                                                                                                                                                            break;
                                                                                                                                                        case 10:
                                                                                                                                                            F = Language.DateTimeMonths[10];
                                                                                                                                                            break;
                                                                                                                                                        case 11:
                                                                                                                                                        default:
                                                                                                                                                            F = Language.DateTimeMonths[11];
                                                                                                                                                            break;
                                                                                                                                                    }
                                                                                                                                                    ;
                                                                                                                                                    var M = F.substring(0, 3);
                                                                                                                                                    var Y = date.getFullYear() + '';
                                                                                                                                                    var y = Y.substring(2);
                                                                                                                                                    var L = OMSystem.OrkutManager.Util.OMUtil.YearLeap(Y);
                                                                                                                                                    var H = date.getHours();
                                                                                                                                                    var h = (H > 12) ? (H - 12) : (H);
                                                                                                                                                    var G = H;
                                                                                                                                                    var g = h;
                                                                                                                                                    var A = (H > 12) ? 'PM' : 'AM';
                                                                                                                                                    var a = A.toLowerCase();
                                                                                                                                                    H = OMSystem.OrkutManager.Util.OMUtil.LeadZero(H);
                                                                                                                                                    h = OMSystem.OrkutManager.Util.OMUtil.LeadZero(h);
                                                                                                                                                    var i = OMSystem.OrkutManager.Util.OMUtil.LeadZero(date.getMinutes());
                                                                                                                                                    var s = OMSystem.OrkutManager.Util.OMUtil.LeadZero(date.getSeconds());
                                                                                                                                                    var B = date.getMilliseconds();
                                                                                                                                                    return format.replace(/%d/g, d).replace(/%j/g, j).replace(/%w/, w).replace(/%l/g, l).replace(/%D/g, D).replace(/%m/g, m).replace(/%n/g, n).replace(/%F/g, F).replace(/%M/g, M).replace(/%Y/g, Y).replace(/%y/g, y).replace(/%L/g, L).replace(/%H/g, H).replace(/%h/g, h).replace(/%G/g, G).replace(/%g/g, g).replace(/%A/g, A).replace(/%a/g, a).replace(/%i/g, i).replace(/%s/g, s).replace(/%B/g, B);
                                                                                                                                                },
                                                                                                                                                GetFromArrPref:
                                                                                                                                                        function(values, key)
                                                                                                                                                        {
                                                                                                                                                            var vals = JSON.parse(values);

                                                                                                                                                            var ret = 0;
                                                                                                                                                            var valsLength = vals.length;
                                                                                                                                                            for (v = 0; v < valsLength; v++)
                                                                                                                                                            {
                                                                                                                                                                var val = vals[v];
                                                                                                                                                                if (!val || !val.split)
                                                                                                                                                                    continue;
                                                                                                                                                                var block = val.split("|");
                                                                                                                                                                if (block[0] == key)
                                                                                                                                                                {
                                                                                                                                                                    ret = block[1];
                                                                                                                                                                    break;
                                                                                                                                                                }
                                                                                                                                                            }

                                                                                                                                                            return ret;
                                                                                                                                                        },
                                                                                                                                                        GetChatTopic:
                                                                                                                                                                function(cmm)
                                                                                                                                                                {
                                                                                                                                                                    return OMSystem.OrkutManager.Util.OMUtil.GetFromArrPref(OMSystem.OrkutManager.PrefManager.Get("Chat", "[]"), cmm);
                                                                                                                                                                },
                                                                                                                                                                GetModTopic:
                                                                                                                                                                        function(cmm)
                                                                                                                                                                        {
                                                                                                                                                                            return OMSystem.OrkutManager.Util.OMUtil.GetFromArrPref(OMSystem.OrkutManager.PrefManager.Get("ModerationTopic", "[]"), cmm);
                                                                                                                                                                        },
                                                                                                                                                                        GetSendKeys:
                                                                                                                                                                                function(e)
                                                                                                                                                                                {
                                                                                                                                                                                    if (OMSystem.OrkutManager.PrefManager.Get("ShortcutPost", "1") == "1") {
                                                                                                                                                                                        return !e.altKey && !e.ctrlKey && e.shiftKey;
                                                                                                                                                                                    } else {
                                                                                                                                                                                        return e.altKey && !e.ctrlKey && !e.shiftKey;
                                                                                                                                                                                    }
                                                                                                                                                                                },
                                                                                                                                                                                GetSendKeysText:
                                                                                                                                                                                        function()
                                                                                                                                                                                        {
                                                                                                                                                                                            if (OMSystem.OrkutManager.PrefManager.Get("ShortcutPost", "1") == "1")
                                                                                                                                                                                                return "Shift";
                                                                                                                                                                                            else
                                                                                                                                                                                                return "Alt";
                                                                                                                                                                                        },
                                                                                                                                                                                        LoaderForText:
                                                                                                                                                                                                function(window, el)
                                                                                                                                                                                                {
                                                                                                                                                                                                    if (el.getAttribute("omOnDelay") == "true")
                                                                                                                                                                                                        return;
                                                                                                                                                                                                    el.style.color = "red";

                                                                                                                                                                                                    window.setTimeout(function() {
                                                                                                                                                                                                        el.style.color = "green";
                                                                                                                                                                                                    }, 8000);
                                                                                                                                                                                                    window.setTimeout(function() {
                                                                                                                                                                                                        el.style.color = "";
                                                                                                                                                                                                        el.setAttribute("omOnDelay", "");
                                                                                                                                                                                                    }, 10000);

                                                                                                                                                                                                    el.setAttribute("omOnDelay", "true");
                                                                                                                                                                                                },
                                                                                                                                                                                                SelectObject: function(obj, window) {
                                                                                                                                                                                                    $(".om_item_selected").removeClass("om_item_selected");
                                                                                                                                                                                                    $(obj).addClass("om_item_selected");
                                                                                                                                                                                                },
                                                                                                                                                                                                SelectTopic: function(pos, window) {
                                                                                                                                                                                                    var div = window.document.getElementsByClassName('om_item_selected');
                                                                                                                                                                                                    if (!div.length) {
                                                                                                                                                                                                        this.SelectObject(window.document.getElementsByClassName('displaytable')[0]
                                                                                                                                                                                                                .getElementsByTagName('tr')[1]
                                                                                                                                                                                                                .getElementsByTagName('td')[0], window);
                                                                                                                                                                                                        return;
                                                                                                                                                                                                    }

                                                                                                                                                                                                    var parent = div[0].parentNode;
                                                                                                                                                                                                    if (pos == "previous") {
                                                                                                                                                                                                        var previous = parent.previousSibling;
                                                                                                                                                                                                        while (previous && previous.nodeType != 1) {
                                                                                                                                                                                                            previous = previous.previousSibling
                                                                                                                                                                                                        }
                                                                                                                                                                                                        if (!previous)
                                                                                                                                                                                                            return;
                                                                                                                                                                                                        this.SelectObject(previous.getElementsByTagName('td')[0], window);
                                                                                                                                                                                                    } else {
                                                                                                                                                                                                        var next = parent.nextSibling;
                                                                                                                                                                                                        while (next && next.nodeType != 1) {
                                                                                                                                                                                                            next = next.nextSibling
                                                                                                                                                                                                        }
                                                                                                                                                                                                        if (!next)
                                                                                                                                                                                                            return;
                                                                                                                                                                                                        this.SelectObject(next.getElementsByTagName('td')[0], window);
                                                                                                                                                                                                    }
                                                                                                                                                                                                    var scroll = window.document
                                                                                                                                                                                                            .getElementsByClassName('om_item_selected')[0].offsetTop;
                                                                                                                                                                                                    window.scrollTo(0, scroll)
                                                                                                                                                                                                },
                                                                                                                                                                                                SelectItem: function(pos, window, defaultClass) {
                                                                                                                                                                                                    var div = window.document.getElementsByClassName('om_item_selected');
                                                                                                                                                                                                    if (!div.length) {
                                                                                                                                                                                                        this.SelectObject(window.document.getElementById('mboxfull')
                                                                                                                                                                                                                .getElementsByClassName(defaultClass)[0], window);
                                                                                                                                                                                                        return;
                                                                                                                                                                                                    }
                                                                                                                                                                                                    if (pos == "previous") {
                                                                                                                                                                                                        var previous = div[0].previousSibling;
                                                                                                                                                                                                        while (previous && previous.nodeType != 1) {
                                                                                                                                                                                                            previous = previous.previousSibling
                                                                                                                                                                                                            if (!$(previous).hasClass(defaultClass))
                                                                                                                                                                                                                previous = previous.previousSibling
                                                                                                                                                                                                        }
                                                                                                                                                                                                        if (!previous)
                                                                                                                                                                                                            return;
                                                                                                                                                                                                        this.SelectObject(previous, window);
                                                                                                                                                                                                    } else {
                                                                                                                                                                                                        var next = div[0].nextSibling
                                                                                                                                                                                                        while (next && next.nodeType != 1) {
                                                                                                                                                                                                            next = next.nextSibling
                                                                                                                                                                                                            if (!$(next).hasClass(defaultClass))
                                                                                                                                                                                                                next = next.nextSibling

                                                                                                                                                                                                        }
                                                                                                                                                                                                        if (!next)
                                                                                                                                                                                                            return;
                                                                                                                                                                                                        this.SelectObject(next, window);
                                                                                                                                                                                                    }
                                                                                                                                                                                                    var scroll = window.document
                                                                                                                                                                                                            .getElementsByClassName('om_item_selected')[0].offsetTop;
                                                                                                                                                                                                    window.scrollTo(0, scroll)
                                                                                                                                                                                                },
                                                                                                                                                                                                GetSelectedItem: function(window) {
                                                                                                                                                                                                    var div = window.document.getElementsByClassName('om_item_selected');
                                                                                                                                                                                                    if (!div.length)
                                                                                                                                                                                                        return false;
                                                                                                                                                                                                    return div[0];
                                                                                                                                                                                                },
                                                                                                                                                                                                BindSelectItem: function(window, className) {
                                                                                                                                                                                                    var listitemchk = window.document.getElementsByClassName(className);
                                                                                                                                                                                                    for (var i = 0; i < listitemchk.length; i++)
                                                                                                                                                                                                        listitemchk[i].addEventListener('click', function() {
                                                                                                                                                                                                            OMSystem.OrkutManager.Util.OMUtil.SelectObject(this, window);
                                                                                                                                                                                                        }, true);
                                                                                                                                                                                                },
                                                                                                                                                                                            },
                                                                                                                                                                                    // User manage
                                                                                                                                                                                    User:
                                                                                                                                                                                            {
                                                                                                                                                                                                // Language
                                                                                                                                                                                                Language: "",
                                                                                                                                                                                                // Textarea
                                                                                                                                                                                                ColorB: "",
                                                                                                                                                                                                ColorE: "",
                                                                                                                                                                                                // Textarea Html
                                                                                                                                                                                                HColorB: "",
                                                                                                                                                                                                HColorE: "",
                                                                                                                                                                                                // Textarea Scrap
                                                                                                                                                                                                SColorB: "",
                                                                                                                                                                                                SColorE: "",
                                                                                                                                                                                                // Textarea Scrap HTML
                                                                                                                                                                                                SHColorB: "",
                                                                                                                                                                                                SHColorE: "",
                                                                                                                                                                                                // Textarea Signature
                                                                                                                                                                                                Signature: "",
                                                                                                                                                                                                // Textarea Signature Html
                                                                                                                                                                                                HSignature: "",
                                                                                                                                                                                                // Textarea Signature Scrap
                                                                                                                                                                                                SSignature: "",
                                                                                                                                                                                                // Textarea Signature Scrap HTML
                                                                                                                                                                                                SHSignature: "",
                                                                                                                                                                                                // Quote
                                                                                                                                                                                                QuoteText: "",
                                                                                                                                                                                                // Quote Header
                                                                                                                                                                                                QuoteHeaderB: "",
                                                                                                                                                                                                QuoteHeaderE: "",
                                                                                                                                                                                                // Quote Header Html
                                                                                                                                                                                                HQuoteHeaderB: "",
                                                                                                                                                                                                HQuoteHeaderE: "",
                                                                                                                                                                                                // Quote Msg
                                                                                                                                                                                                QuoteMessageB: "",
                                                                                                                                                                                                QuoteMessageE: "",
                                                                                                                                                                                                // Quote Msg Html
                                                                                                                                                                                                HQuoteMessageB: "",
                                                                                                                                                                                                HQuoteMessageE: "",
                                                                                                                                                                                                // Moderation Topic
                                                                                                                                                                                                ModerationT: "",
                                                                                                                                                                                                // Moderation Topic Html
                                                                                                                                                                                                HModerationT: "",
                                                                                                                                                                                                // Moderation User
                                                                                                                                                                                                ModerationU: "",
                                                                                                                                                                                                omNameShadow: "",
                                                                                                                                                                                                QuoteTextHtml: "",
                                                                                                                                                                                                // Moderation User
                                                                                                                                                                                                HModerationU: "",
                                                                                                                                                                                                Load:
                                                                                                                                                                                                        function()
                                                                                                                                                                                                        {
                                                                                                                                                                                                            var Util = OMSystem.OrkutManager.Util;
                                                                                                                                                                                                            var User = Util.User;

                                                                                                                                                                                                            User.Language = OMSystem.OrkutManager.PrefManager.Get("Language", "en-US");

                                                                                                                                                                                                            User.omNameShadow = Util.Encode(OMSystem.OrkutManager.PrefManager.Get("NameShadow"));
                                                                                                                                                                                                            User.ColorB = Util.Encode(OMSystem.OrkutManager.PrefManager.Get("ColorB"));
                                                                                                                                                                                                            User.ColorE = Util.Encode(OMSystem.OrkutManager.PrefManager.Get("ColorE"));
                                                                                                                                                                                                            User.HColorB = Util.Encode(OMSystem.OrkutManager.PrefManager.Get("HColorB"));
                                                                                                                                                                                                            User.HColorE = Util.Encode(OMSystem.OrkutManager.PrefManager.Get("HColorE"));
                                                                                                                                                                                                            User.SColorB = Util.Encode(OMSystem.OrkutManager.PrefManager.Get("SColorB"));
                                                                                                                                                                                                            User.SColorE = Util.Encode(OMSystem.OrkutManager.PrefManager.Get("SColorE"));
                                                                                                                                                                                                            User.SHColorB = Util.Encode(OMSystem.OrkutManager.PrefManager.Get("SHColorB"));
                                                                                                                                                                                                            User.SHColorE = Util.Encode(OMSystem.OrkutManager.PrefManager.Get("SHColorE"));

                                                                                                                                                                                                            User.Signature = Util.Encode(OMSystem.OrkutManager.PrefManager.Get("Signature"));
                                                                                                                                                                                                            User.HSignature = Util.Encode(OMSystem.OrkutManager.PrefManager.Get("HSignature"));
                                                                                                                                                                                                            User.SSignature = Util.Encode(OMSystem.OrkutManager.PrefManager.Get("SSignature"));
                                                                                                                                                                                                            User.SHSignature = Util.Encode(OMSystem.OrkutManager.PrefManager.Get("SHSignature"));

                                                                                                                                                                                                            if ((User.HSignature).length > 1) {
                                                                                                                                                                                                                var PrefPos = OMSystem.OrkutManager.PrefManager.Get("SignaturePosition", 3);
                                                                                                                                                                                                                if (PrefPos == 1) {
                                                                                                                                                                                                                    User.HSignature = "<center>" + User.HSignature + "</center>";
                                                                                                                                                                                                                } else if (PrefPos == 2) {
                                                                                                                                                                                                                    User.HSignature = "<div style='text-align:right'>" + User.HSignature + "</div>";
                                                                                                                                                                                                                }
                                                                                                                                                                                                            }
                                                                                                                                                                                                            User.HSignature = User.HSignature.replace(/\$RAND\$/g, "[gray]" + Math.random() + "[/gray]");
                                                                                                                                                                                                            User.Signature = User.Signature.replace(/\$RAND\$/g, "[gray]" + Math.random() + "[/gray]");
                                                                                                                                                                                                            User.SSignature = User.SSignature.replace(/\$RAND\$/g, "[gray]" + Math.random() + "[/gray]");
                                                                                                                                                                                                            User.SHSignature = User.SHSignature.replace(/\$RAND\$/g, "[gray]" + Math.random() + "[/gray]");

                                                                                                                                                                                                            function omTime(format) {
                                                                                                                                                                                                                format = unescape(format);
                                                                                                                                                                                                                var Language = OMSystem.OrkutManager.Language.Get();
                                                                                                                                                                                                                function LeadZero(v) {
                                                                                                                                                                                                                    return (v < 10 ? '0' + v : v);
                                                                                                                                                                                                                }
                                                                                                                                                                                                                var date = new Date();
                                                                                                                                                                                                                var d = LeadZero(date.getDate());
                                                                                                                                                                                                                var j = date.getDate();
                                                                                                                                                                                                                var w = date.getDay();
                                                                                                                                                                                                                var l;
                                                                                                                                                                                                                switch (w) {
                                                                                                                                                                                                                    case 0:
                                                                                                                                                                                                                        l = Language.DateTimeDays[0];
                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                    case 1:
                                                                                                                                                                                                                        l = (Language.DateTimeDays[1]);
                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                    case 2:
                                                                                                                                                                                                                        l = (Language.DateTimeDays[2]);
                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                    case 3:
                                                                                                                                                                                                                        l = (Language.DateTimeDays[3]);
                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                    case 4:
                                                                                                                                                                                                                        l = (Language.DateTimeDays[4]);
                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                    case 5:
                                                                                                                                                                                                                        l = (Language.DateTimeDays[5]);
                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                    case 6:
                                                                                                                                                                                                                    default:
                                                                                                                                                                                                                        l = (Language.DateTimeDays[6]);
                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                }
                                                                                                                                                                                                                ;
                                                                                                                                                                                                                var D = l.substring(0, 3);
                                                                                                                                                                                                                var m = LeadZero(date.getMonth() + 1);
                                                                                                                                                                                                                var n = (date.getMonth() + 1);
                                                                                                                                                                                                                var F;
                                                                                                                                                                                                                switch ((n - 1)) {
                                                                                                                                                                                                                    case 0:
                                                                                                                                                                                                                        F = (Language.DateTimeMonths[0]);
                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                    case 1:
                                                                                                                                                                                                                        F = (Language.DateTimeMonths[1]);
                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                    case 2:
                                                                                                                                                                                                                        F = (Language.DateTimeMonths[2]);
                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                    case 3:
                                                                                                                                                                                                                        F = (Language.DateTimeMonths[3]);
                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                    case 4:
                                                                                                                                                                                                                        F = (Language.DateTimeMonths[4]);
                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                    case 5:
                                                                                                                                                                                                                        F = (Language.DateTimeMonths[5]);
                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                    case 6:
                                                                                                                                                                                                                        F = (Language.DateTimeMonths[6]);
                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                    case 7:
                                                                                                                                                                                                                        F = (Language.DateTimeMonths[7]);
                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                    case 8:
                                                                                                                                                                                                                        F = (Language.DateTimeMonths[8]);
                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                    case 9:
                                                                                                                                                                                                                        F = (Language.DateTimeMonths[9]);
                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                    case 10:
                                                                                                                                                                                                                        F = (Language.DateTimeMonths[10]);
                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                    case 11:
                                                                                                                                                                                                                    default:
                                                                                                                                                                                                                        F = (Language.DateTimeMonths[11]);
                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                }
                                                                                                                                                                                                                ;
                                                                                                                                                                                                                var M = F.substring(0, 3);
                                                                                                                                                                                                                function YearLeap(y) {
                                                                                                                                                                                                                    if ((y % 4) == 0) {
                                                                                                                                                                                                                        if ((y % 100) == 0)
                                                                                                                                                                                                                            return ((y % 400) == 0) ? 1 : 0;
                                                                                                                                                                                                                        else
                                                                                                                                                                                                                            return 1;
                                                                                                                                                                                                                    } else
                                                                                                                                                                                                                        return 0;
                                                                                                                                                                                                                }
                                                                                                                                                                                                                var Y = date.getFullYear() + '';
                                                                                                                                                                                                                var y = Y.substring(2);
                                                                                                                                                                                                                var L = YearLeap(Y);
                                                                                                                                                                                                                var H = date.getHours();
                                                                                                                                                                                                                var h = (H > 12) ? (H - 12) : (H);
                                                                                                                                                                                                                var G = H;
                                                                                                                                                                                                                var g = h;
                                                                                                                                                                                                                var A = (H > 12) ? 'PM' : 'AM';
                                                                                                                                                                                                                var a = A.toLowerCase();
                                                                                                                                                                                                                H = LeadZero(H);
                                                                                                                                                                                                                h = LeadZero(h);
                                                                                                                                                                                                                var i = LeadZero(date.getMinutes());
                                                                                                                                                                                                                var s = LeadZero(date.getSeconds());
                                                                                                                                                                                                                var B = date.getMilliseconds();
                                                                                                                                                                                                                return format.replace(/%d/g, d).replace(/%j/g, j).replace(/%w/, w).replace(/%l/g, l).replace(/%D/g, D).replace(/%m/g, m).replace(/%n/g, n).replace(/%F/g, F).replace(/%M/g, M).replace(/%Y/g, Y).replace(/%y/g, y).replace(/%L/g, L).replace(/%H/g, H).replace(/%h/g, h).replace(/%G/g, G).replace(/%g/g, g).replace(/%A/g, A).replace(/%a/g, a).replace(/%i/g, i).replace(/%s/g, s).replace(/%B/g, B);
                                                                                                                                                                                                            }
                                                                                                                                                                                                            var TimeForm = OMSystem.OrkutManager.PrefManager.Get("TimeFormat");
                                                                                                                                                                                                            var currentDate = omTime(TimeForm);
                                                                                                                                                                                                            try {
                                                                                                                                                                                                                var tpcurl = window.location.href;
                                                                                                                                                                                                                User.HSignature = User.HSignature.replace(/\$RAND\$/g, "[gray]" + Math.random() + "[/gray]").replace(/\$TPCURL\$/, tpcurl).replace(/\$CURENTDATE\$/g, currentDate);
                                                                                                                                                                                                                User.Signature = User.Signature.replace(/\$RAND\$/g, "[gray]" + Math.random() + "[/gray]").replace(/\$TPCURL\$/, tpcurl).replace(/\$CURENTDATE\$/g, currentDate);
                                                                                                                                                                                                            } catch (ex) {
                                                                                                                                                                                                            }

                                                                                                                                                                                                            User.SSignature = User.SSignature.replace(/\$RAND\$/g, "[gray]" + Math.random() + "[/gray]").replace(/\$CURENTDATE\$/g, currentDate);
                                                                                                                                                                                                            User.SHSignature = User.SHSignature.replace(/\$RAND\$/g, "[gray]" + Math.random() + "[/gray]").replace(/\$CURENTDATE\$/g, currentDate);

                                                                                                                                                                                                            User.QuoteText = Util.Encode(OMSystem.OrkutManager.PrefManager.Get("QuoteText"));
                                                                                                                                                                                                            User.QuoteTextHtml = Util.Encode(OMSystem.OrkutManager.PrefManager.Get("QuoteTextHtml"));
                                                                                                                                                                                                            User.QuoteHeaderB = Util.Encode(OMSystem.OrkutManager.PrefManager.Get("QuoteHeaderB"));
                                                                                                                                                                                                            User.QuoteHeaderE = Util.Encode(OMSystem.OrkutManager.PrefManager.Get("QuoteHeaderE"));
                                                                                                                                                                                                            User.HQuoteHeaderB = Util.Encode(OMSystem.OrkutManager.PrefManager.Get("HQuoteHeaderB"));
                                                                                                                                                                                                            User.HQuoteHeaderE = Util.Encode(OMSystem.OrkutManager.PrefManager.Get("HQuoteHeaderE"));
                                                                                                                                                                                                            User.QuoteMessageB = Util.Encode(OMSystem.OrkutManager.PrefManager.Get("QuoteMessageB"));
                                                                                                                                                                                                            User.QuoteMessageE = Util.Encode(OMSystem.OrkutManager.PrefManager.Get("QuoteMessageE"));
                                                                                                                                                                                                            User.HQuoteMessageB = Util.Encode(OMSystem.OrkutManager.PrefManager.Get("HQuoteMessageB"));
                                                                                                                                                                                                            User.HQuoteMessageE = Util.Encode(OMSystem.OrkutManager.PrefManager.Get("HQuoteMessageE"));

                                                                                                                                                                                                            User.ModerationT = Util.Encode(OMSystem.OrkutManager.PrefManager.Get("ModerationT"));
                                                                                                                                                                                                            User.HModerationT = Util.Encode(OMSystem.OrkutManager.PrefManager.Get("HModerationT"));
                                                                                                                                                                                                            User.ModerationU = Util.Encode(OMSystem.OrkutManager.PrefManager.Get("ModerationU"));
                                                                                                                                                                                                            User.HModerationU = Util.Encode(OMSystem.OrkutManager.PrefManager.Get("HModerationU"));
                                                                                                                                                                                                        }
                                                                                                                                                                                                    },
                                                                                                                                                                                            Bookmark:
                                                                                                                                                                                                    {
                                                                                                                                                                                                        Build:
                                                                                                                                                                                                                function(window, table, prefName, incChk, IsEnabledLinks, IsEnabledBk)
                                                                                                                                                                                                                {
                                                                                                                                                                                                                    var document = window.document;

                                                                                                                                                                                                                    var MassUnjoinOn = false;
                                                                                                                                                                                                                    if (prefName == "Bookmarks")
                                                                                                                                                                                                                        MassUnjoinOn = (OMSystem.OrkutManager.PrefManager.Get("MassUnjoin.Show", "true") == "true");

                                                                                                                                                                                                                    if (MassUnjoinOn)
                                                                                                                                                                                                                    {
                                                                                                                                                                                                                        incChk = false;
                                                                                                                                                                                                                        var chkAll = document.createElement("input");
                                                                                                                                                                                                                        chkAll.type = "checkbox";
                                                                                                                                                                                                                        chkAll.setAttribute("sel", "false");
                                                                                                                                                                                                                        chkAll.setAttribute("class", "omCheckAll");
                                                                                                                                                                                                                        chkAll.setAttribute("style", "margin-top: 3px; margin-right: 25px;");
                                                                                                                                                                                                                        chkAll.setAttribute("onclick", "var chks = this.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('input'); this.setAttribute('sel', (this.getAttribute('sel') == 'true' ? 'false' : 'true')); for(var c in chks) { var chk = chks[c]; if (!chk || !chk.getAttribute || chk.getAttribute('type').toLowerCase() != 'checkbox') continue; chk.checked = (this.getAttribute('sel') == 'true'); }");
                                                                                                                                                                                                                        if ($(".omCheckAll").length == 0)
                                                                                                                                                                                                                            $("th:eq(0)", table).append(chkAll);

                                                                                                                                                                                                                    }

                                                                                                                                                                                                                    $("td", table).each(function()
                                                                                                                                                                                                                    {
                                                                                                                                                                                                                        var has = $("a", this);
                                                                                                                                                                                                                        if (has.length > 0)
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                            var hasLink = has.attr("href");
                                                                                                                                                                                                                            var hasMatch;
                                                                                                                                                                                                                            try {
                                                                                                                                                                                                                                hasMatch = hasLink.match(/cmm=(\d+)/i);
                                                                                                                                                                                                                            } catch (ex) {
                                                                                                                                                                                                                                hasMatch = false;
                                                                                                                                                                                                                            }
                                                                                                                                                                                                                            var checkLast = $(this).parent().find(".omLastLinks").length;
                                                                                                                                                                                                                            if (hasMatch && hasLink && checkLast == 0) {
                                                                                                                                                                                                                                var Language = OMSystem.OrkutManager.Language.Get();
                                                                                                                                                                                                                                if (IsEnabledBk) {
                                                                                                                                                                                                                                    // Bookmarks
                                                                                                                                                                                                                                    var bk = document.createElement("span");
                                                                                                                                                                                                                                    var check;
                                                                                                                                                                                                                                    if (prefName == "Bookmarks")
                                                                                                                                                                                                                                    {
                                                                                                                                                                                                                                        check = OMSystem.OrkutManager.Util.OMUtil.GetFromArrPref(OMSystem.OrkutManager.PrefManager.Get(prefName, "[]"), hasMatch[1]);
                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                    else if (prefName == "Bookmarks.Topic")
                                                                                                                                                                                                                                    {
                                                                                                                                                                                                                                        check = OMSystem.OrkutManager.Util.OMUtil.GetFromArrPref(OMSystem.OrkutManager.PrefManager.Get(prefName, "[]"),
                                                                                                                                                                                                                                                (hasLink.match(/cmm=(\d+)/i)[1] + "~" + hasLink.match(/&tid=(\d+)/i)[1])
                                                                                                                                                                                                                                                );
                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                    bk.className = (check) ? "bkOn" : "bkOff";
                                                                                                                                                                                                                                    bk.addEventListener("click",
                                                                                                                                                                                                                                            function()
                                                                                                                                                                                                                                            {
                                                                                                                                                                                                                                                var vals = JSON.parse(OMSystem.OrkutManager.PrefManager.Get(prefName, "[]"));
                                                                                                                                                                                                                                                var node = $(this).next();
                                                                                                                                                                                                                                                var nodeClass = $(this).next().attr("class");
                                                                                                                                                                                                                                                if (nodeClass == "buttonLupaPreview") {
                                                                                                                                                                                                                                                    var nextS = $(this).next().next();
                                                                                                                                                                                                                                                    nextS.href = $(this).next().next().attr("href");
                                                                                                                                                                                                                                                } else {
                                                                                                                                                                                                                                                    var nextS = $(this).next();
                                                                                                                                                                                                                                                    nextS.href = $(this).next().attr("href");
                                                                                                                                                                                                                                                }


                                                                                                                                                                                                                                                var check;

                                                                                                                                                                                                                                                if (prefName == "Bookmarks")
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                    check = (OMSystem.OrkutManager.Util.OMUtil.GetFromArrPref(OMSystem.OrkutManager.PrefManager.Get(prefName, "[]"), nextS.href.match(/cmm=(\d+)/i)[1]));
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                else if (prefName == "Bookmarks.Topic")
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                    check = (OMSystem.OrkutManager.Util.OMUtil.GetFromArrPref(OMSystem.OrkutManager.PrefManager.Get(prefName, "[]"),
                                                                                                                                                                                                                                                            nextS.href.match(/cmm=(\d+)/i)[1] + "~" + nextS.href.match(/&tid=(\d+)/i)[1]
                                                                                                                                                                                                                                                            ));
                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                if (check)
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                    if (prefName == "Bookmarks")
                                                                                                                                                                                                                                                    {
                                                                                                                                                                                                                                                        vals.splice(vals.indexOf(nextS.href.match(/cmm=(\d+)/i)[1] + "|" + check), 1);
                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                    else if (prefName == "Bookmarks.Topic")
                                                                                                                                                                                                                                                    {
                                                                                                                                                                                                                                                        vals.splice(
                                                                                                                                                                                                                                                                vals.indexOf(nextS.href.match(/cmm=(\d+)/i)[1] + "~" +
                                                                                                                                                                                                                                                                nextS.href.match(/&tid=(\d+)/i)[1] + "|" + check),
                                                                                                                                                                                                                                                                1);
                                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                                    this.className = "bkOff";
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                else
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                    var cmm, cmmId, tid, tidId;
                                                                                                                                                                                                                                                    var node;
                                                                                                                                                                                                                                                    if (prefName == "Bookmarks")
                                                                                                                                                                                                                                                    {
                                                                                                                                                                                                                                                        cmm = escape(nextS.text());
                                                                                                                                                                                                                                                        cmmId = nextS.href.match(/cmm=(\d+)/i)[1];
                                                                                                                                                                                                                                                        node = cmmId + "|" + cmm;
                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                    else if (prefName == "Bookmarks.Topic")
                                                                                                                                                                                                                                                    {
                                                                                                                                                                                                                                                        cmm = $(".username:eq(0) a:eq(0)").text();
                                                                                                                                                                                                                                                        cmm = escape(cmm.replace(/<[^>]*?>/g, ""));
                                                                                                                                                                                                                                                        cmmId = nextS.href.match(/cmm=(\d+)/i)[1];
                                                                                                                                                                                                                                                        tidId = nextS.href.match(/&tid=(\d+)/i)[1];
                                                                                                                                                                                                                                                        tid = escape(nextS.text());
                                                                                                                                                                                                                                                        node = cmmId + "~" + tidId + "|" + cmm + "~" + tid;
                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                    vals.push(node);
                                                                                                                                                                                                                                                    this.className = "bkOn";
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                OMSystem.OrkutManager.PrefManager.Set(prefName, JSON.stringify(vals));
                                                                                                                                                                                                                                            }, false);

                                                                                                                                                                                                                                            $(":first-child", this).before(bk);
                                                                                                                                                                                                                                            $(".bkOn, .bkOff").css("background-image", 'url(' + chrome.extension.getURL('img/toolbar.png') + ')').css("background-repeat", "no-repeat");
                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                if (MassUnjoinOn)
                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                    var omChk = document.createElement("input");
                                                                                                                                                                                                                                    omChk.type = "checkbox";
                                                                                                                                                                                                                                    omChk.setAttribute("style", "float: left; margin-right: 5px; margin-top:3px;");
                                                                                                                                                                                                                                    omChk.name = "omChk";
                                                                                                                                                                                                                                    $(":first-child", this).before(omChk);
                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                if (IsEnabledLinks) {
                                                                                                                                                                                                                                    // Last | Forum  (links)
                                                                                                                                                                                                                                    var divNode = document.createElement("div");
                                                                                                                                                                                                                                    divNode.setAttribute("class", "omLastLinks");
                                                                                                                                                                                                                                    divNode.style.cssFloat = "right";
                                                                                                                                                                                                                                    divNode.style.fontSize = "80%";

                                                                                                                                                                                                                                    var divNodeA = document.createElement("a");
                                                                                                                                                                                                                                    if (prefName == "Bookmarks")
                                                                                                                                                                                                                                    {

                                                                                                                                                                                                                                        divNodeA.href = "/Main#CommTopics?cmm=" + (hasLink.match(/cmm=(\d+)/i)[1]) + "&scroll=0";
                                                                                                                                                                                                                                        divNodeA.innerHTML = "(" + unescape(Language.Forum).toLowerCase() + ")";
                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                    else if (prefName == "Bookmarks.Topic")
                                                                                                                                                                                                                                    {
                                                                                                                                                                                                                                        divNodeA.innerHTML = "(" + unescape(Language.Last).toLowerCase() + ")";
                                                                                                                                                                                                                                        divNodeA.href = '/Main#CommMsgs?cmm=' + (hasLink.match(/cmm=(\d+)/i)[1]) + '&tid=' + (hasLink.match(/tid=(\d+)/i)[1]) + "&na=2&scroll=-1";
                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                    divNode.appendChild(divNodeA);
                                                                                                                                                                                                                                    $(":first-child", this).before(divNode);
                                                                                                                                                                                                                                }
                                                                                                                                                                                                                            }
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                    });
                                                                                                                                                                                                                },
                                                                                                                                                                                                                BuildSingle:
                                                                                                                                                                                                                        function(window, node, prefName)
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                            var document = window.document;

                                                                                                                                                                                                                            var has = window.location;

                                                                                                                                                                                                                            var bk = document.createElement("span");
                                                                                                                                                                                                                            var check;
                                                                                                                                                                                                                            if (prefName == "Bookmarks")
                                                                                                                                                                                                                            {
                                                                                                                                                                                                                                check = OMSystem.OrkutManager.Util.OMUtil.GetFromArrPref(OMSystem.OrkutManager.PrefManager.Get(prefName, "[]"), has.href.match(/cmm=(\d+)/i)[1]);
                                                                                                                                                                                                                            }
                                                                                                                                                                                                                            else if (prefName == "Bookmarks.Topic")
                                                                                                                                                                                                                            {
                                                                                                                                                                                                                                check = OMSystem.OrkutManager.Util.OMUtil.GetFromArrPref(OMSystem.OrkutManager.PrefManager.Get(prefName, "[]"),
                                                                                                                                                                                                                                        (has.href.match(/cmm=(\d+)/i)[1] + "~" + has.href.match(/&tid=(\d+)/i)[1])
                                                                                                                                                                                                                                        );
                                                                                                                                                                                                                            }
                                                                                                                                                                                                                            bk.className = (check) ? "bkOn" : "bkOff";

                                                                                                                                                                                                                            bk.addEventListener("click",
                                                                                                                                                                                                                                    function()
                                                                                                                                                                                                                                    {
                                                                                                                                                                                                                                        try {
                                                                                                                                                                                                                                            var vals = JSON.parse(OMSystem.OrkutManager.PrefManager.Get(prefName, "[]"));
                                                                                                                                                                                                                                            var check;
                                                                                                                                                                                                                                            var has = window.location;
                                                                                                                                                                                                                                            if (prefName == "Bookmarks")
                                                                                                                                                                                                                                            {
                                                                                                                                                                                                                                                check = OMSystem.OrkutManager.Util.OMUtil.GetFromArrPref(OMSystem.OrkutManager.PrefManager.Get(prefName, "[]"), has.href.match(/cmm=(\d+)/i)[1]);
                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                            else if (prefName == "Bookmarks.Topic")
                                                                                                                                                                                                                                            {
                                                                                                                                                                                                                                                check = OMSystem.OrkutManager.Util.OMUtil.GetFromArrPref(OMSystem.OrkutManager.PrefManager.Get(prefName, "[]"),
                                                                                                                                                                                                                                                        (has.href.match(/cmm=(\d+)/i)[1] + "~" + has.href.match(/&tid=(\d+)/i)[1])
                                                                                                                                                                                                                                                        );
                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                            if (check)
                                                                                                                                                                                                                                            {
                                                                                                                                                                                                                                                if (prefName == "Bookmarks")
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                    vals.splice(vals.indexOf(has.href.match(/cmm=(\d+)/i)[1] + "|" + check), 1);
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                else if (prefName == "Bookmarks.Topic")
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                    vals.splice(
                                                                                                                                                                                                                                                            vals.indexOf(has.href.match(/cmm=(\d+)/i)[1] + "~" +
                                                                                                                                                                                                                                                            has.href.match(/&tid=(\d+)/i)[1] + "|" + check),
                                                                                                                                                                                                                                                            1);
                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                this.className = "bkOff";
                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                            else
                                                                                                                                                                                                                                            {
                                                                                                                                                                                                                                                var cmm, cmmId, tid, tidId;
                                                                                                                                                                                                                                                var node;
                                                                                                                                                                                                                                                if (prefName == "Bookmarks")
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                    cmm = escape(this.nextSibling.innerHTML.replace(/<[^>]*?>/g, ""));
                                                                                                                                                                                                                                                    cmmId = has.href.match(/cmm=(\d+)/i)[1];
                                                                                                                                                                                                                                                    node = cmmId + "|" + cmm;
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                else if (prefName == "Bookmarks.Topic")
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                    cmm = document.getElementsByClassName("username")[0].getElementsByTagName("a")[0];
                                                                                                                                                                                                                                                    cmm = escape(cmm.innerHTML.replace(/<[^>]*?>/g, ""));
                                                                                                                                                                                                                                                    cmmId = has.href.match(/cmm=(\d+)/i)[1];
                                                                                                                                                                                                                                                    tidId = has.href.match(/&tid=(\d+)/i)[1];
                                                                                                                                                                                                                                                    tid = escape(this.nextSibling.innerHTML.replace(/<[^>]*?>/g, ""));
                                                                                                                                                                                                                                                    node = cmmId + "~" + tidId + "|" + cmm + "~" + tid;
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                vals.push(node);
                                                                                                                                                                                                                                                this.className = "bkOn";
                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                            OMSystem.OrkutManager.PrefManager.Set(prefName, JSON.stringify(vals));
                                                                                                                                                                                                                                        } catch (ex) {
                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                    }, false);

                                                                                                                                                                                                                                    node.parentNode.insertBefore(bk, node);
                                                                                                                                                                                                                                    $(".bkOn, .bkOff").css("background-image", 'url(' + chrome.extension.getURL('img/toolbar.png') + ')');
                                                                                                                                                                                                                                },
                                                                                                                                                                                                                        Sort:
                                                                                                                                                                                                                                function(cmm, topic)
                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                    if (cmm)
                                                                                                                                                                                                                                    {
                                                                                                                                                                                                                                        var vals = JSON.parse(OMSystem.OrkutManager.PrefManager.Get("Bookmarks"));

                                                                                                                                                                                                                                        function BkSort(l, r)
                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                            var e1 = unescape(l.split("|")[1]);
                                                                                                                                                                                                                                            var e2 = unescape(r.split("|")[1]);
                                                                                                                                                                                                                                            return e1 > e2;
                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                        vals.sort(BkSort);
                                                                                                                                                                                                                                        return vals;
                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                    else if (topic)
                                                                                                                                                                                                                                    {
                                                                                                                                                                                                                                        var vals = JSON.parse(OMSystem.OrkutManager.PrefManager.Get("Bookmarks.Topic"));

                                                                                                                                                                                                                                        function BkSort(l, r)
                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                            var e1 = unescape(l.split("|")[1]);
                                                                                                                                                                                                                                            var e2 = unescape(r.split("|")[1]);
                                                                                                                                                                                                                                            return e1 > e2;
                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                        vals.sort(BkSort);
                                                                                                                                                                                                                                        return vals;
                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                    return;
                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                BuildTabCmm:
                                                                                                                                                                                                                                        function(window, tab)
                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                            var document = window.document;
                                                                                                                                                                                                                                            var table = document.createElement("table");
                                                                                                                                                                                                                                            table.cellSpacing = "0";
                                                                                                                                                                                                                                            table.className = "displaytable";

                                                                                                                                                                                                                                            var vals = OMSystem.OrkutManager.Util.Bookmark.Sort(true);

                                                                                                                                                                                                                                            var colors = new Array("listdark", "listlight");
                                                                                                                                                                                                                                            var colorI = 0;
                                                                                                                                                                                                                                            var valsLength = vals.length;
                                                                                                                                                                                                                                            for (b = 0; b < valsLength; b++)
                                                                                                                                                                                                                                            {
                                                                                                                                                                                                                                                var bk = vals[b];
                                                                                                                                                                                                                                                if (!bk)
                                                                                                                                                                                                                                                    continue;
                                                                                                                                                                                                                                                if (!bk.split)
                                                                                                                                                                                                                                                    continue;
                                                                                                                                                                                                                                                var tr = document.createElement("tr");
                                                                                                                                                                                                                                                var td = document.createElement("td");
                                                                                                                                                                                                                                                var td2 = document.createElement("td");
                                                                                                                                                                                                                                                td.style.width = "70%";
                                                                                                                                                                                                                                                td2.style.width = "30%";

                                                                                                                                                                                                                                                tr.className = colors[colorI % 2];
                                                                                                                                                                                                                                                ++colorI;

                                                                                                                                                                                                                                                var id = bk.split("|")[0];
                                                                                                                                                                                                                                                var name = unescape(bk.split("|")[1]);

                                                                                                                                                                                                                                                var a = document.createElement("a");
                                                                                                                                                                                                                                                a.href = "/Community.aspx?cmm=" + id;
                                                                                                                                                                                                                                                a.innerHTML = name;

                                                                                                                                                                                                                                                td2.innerHTML = id;

                                                                                                                                                                                                                                                td.appendChild(a);
                                                                                                                                                                                                                                                tr.appendChild(td);
                                                                                                                                                                                                                                                tr.appendChild(td2);
                                                                                                                                                                                                                                                table.appendChild(tr);
                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                            document.getElementById("subPage" + tab).appendChild(table);
                                                                                                                                                                                                                                        },
                                                                                                                                                                                                                                        BuildTabTopic:
                                                                                                                                                                                                                                                function(window, tab)
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                    var document = window.document;
                                                                                                                                                                                                                                                    var table = document.createElement("table");
                                                                                                                                                                                                                                                    table.cellSpacing = "0";
                                                                                                                                                                                                                                                    table.className = "displaytable";
                                                                                                                                                                                                                                                    table.style.width = "100%";

                                                                                                                                                                                                                                                    var cid = (/^\d+$/).test(String(tab)) ? ("subPage" + tab) : tab;

                                                                                                                                                                                                                                                    var vals = OMSystem.OrkutManager.Util.Bookmark.Sort(false, true);

                                                                                                                                                                                                                                                    var sel = document.getElementById("OMBkTopicSel");
                                                                                                                                                                                                                                                    if (!sel)
                                                                                                                                                                                                                                                    {
                                                                                                                                                                                                                                                        sel = document.createElement("select");
                                                                                                                                                                                                                                                        sel.id = "OMBkTopicSel";

                                                                                                                                                                                                                                                        if (cid != tab)
                                                                                                                                                                                                                                                            sel.addEventListener("change",
                                                                                                                                                                                                                                                                    function()
                                                                                                                                                                                                                                                                    {
                                                                                                                                                                                                                                                                        document.getElementById(cid).removeChild(document.getElementById(cid).getElementsByTagName("table")[0]);
                                                                                                                                                                                                                                                                        OMSystem.OrkutManager.Util.Bookmark.BuildTabTopic(window, tab);
                                                                                                                                                                                                                                                                        OMSystem.OrkutManager.Util.Bookmark.Build(window, document.getElementById(cid).getElementsByTagName("table")[0], "Bookmarks.Topic");
                                                                                                                                                                                                                                                                    }, false);

                                                                                                                                                                                                                                                                var inc = [];
                                                                                                                                                                                                                                                                var valslength = vals.length;
                                                                                                                                                                                                                                                                for (b = 0; b < valslength; b++)
                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                    var bk = vals[b];
                                                                                                                                                                                                                                                                    if (!bk)
                                                                                                                                                                                                                                                                        continue;
                                                                                                                                                                                                                                                                    if (!bk.split)
                                                                                                                                                                                                                                                                        continue;
                                                                                                                                                                                                                                                                    var cmmId = (bk.split("|")[0].split("~")[0]);
                                                                                                                                                                                                                                                                    if (inc.indexOf(cmmId) != -1)
                                                                                                                                                                                                                                                                        continue;

                                                                                                                                                                                                                                                                    var opt = document.createElement("option");
                                                                                                                                                                                                                                                                    opt.value = cmmId;
                                                                                                                                                                                                                                                                    opt.innerHTML = unescape(bk.split("|")[1].split("~")[0]);
                                                                                                                                                                                                                                                                    sel.appendChild(opt);
                                                                                                                                                                                                                                                                    inc.push(cmmId);
                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                document.getElementById(cid).insertBefore(sel, document.getElementById(cid).firstChild);
                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                    var colors = new Array("listdark", "listlight");
                                                                                                                                                                                                                                                    var colorI = 0;
                                                                                                                                                                                                                                                    var valsLength = vals.length;
                                                                                                                                                                                                                                                    for (b = 0; b < valsLength; b++)
                                                                                                                                                                                                                                                    {
                                                                                                                                                                                                                                                        var bk = vals[b];
                                                                                                                                                                                                                                                        if (!bk)
                                                                                                                                                                                                                                                            continue;
                                                                                                                                                                                                                                                        if (!bk.split)
                                                                                                                                                                                                                                                            continue;
                                                                                                                                                                                                                                                        var cmmId = bk.split("|")[0].split("~")[0];
                                                                                                                                                                                                                                                        if (sel.selectedIndex < 0)
                                                                                                                                                                                                                                                            continue;
                                                                                                                                                                                                                                                        if (sel.selectedIndex >= 0 && sel.options[sel.selectedIndex].value != cmmId)
                                                                                                                                                                                                                                                            continue;
                                                                                                                                                                                                                                                        var tr = document.createElement("tr");
                                                                                                                                                                                                                                                        var td = document.createElement("td");
                                                                                                                                                                                                                                                        var td2 = document.createElement("td");
                                                                                                                                                                                                                                                        td.style.width = "70%";
                                                                                                                                                                                                                                                        td2.style.width = "30%";

                                                                                                                                                                                                                                                        tr.className = colors[colorI % 2];
                                                                                                                                                                                                                                                        ++colorI;

                                                                                                                                                                                                                                                        var id = bk.split("|")[0];
                                                                                                                                                                                                                                                        var name = unescape(bk.split("|")[1]);

                                                                                                                                                                                                                                                        var a = document.createElement("a");
                                                                                                                                                                                                                                                        a.href = "/CommMsgs.aspx?cmm=" + id.replace("~", "&tid=");
                                                                                                                                                                                                                                                        a.innerHTML = name.split("~")[1];

                                                                                                                                                                                                                                                        td2.innerHTML = "<span title='" + (id.split("~")[0]) + "'>" + (id.split("~")[1]) + "</span>";

                                                                                                                                                                                                                                                        td.appendChild(a);
                                                                                                                                                                                                                                                        tr.appendChild(td);
                                                                                                                                                                                                                                                        tr.appendChild(td2);
                                                                                                                                                                                                                                                        table.appendChild(tr);
                                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                                    document.getElementById(cid).appendChild(table);
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                            },
                                                                                                                                                                                                                                            Updater:
                                                                                                                                                                                                                                                    {
                                                                                                                                                                                                                                                        Update:
                                                                                                                                                                                                                                                                function(w, url, cmm)
                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                    function Index(name, time, count)
                                                                                                                                                                                                                                                                    {
                                                                                                                                                                                                                                                                        this.name = name;
                                                                                                                                                                                                                                                                        this.time = time;
                                                                                                                                                                                                                                                                        this.count = count;
                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                    var i;

                                                                                                                                                                                                                                                                    var type = 0;
                                                                                                                                                                                                                                                                    var otherparams = "";
                                                                                                                                                                                                                                                                    url = url.toLowerCase();
                                                                                                                                                                                                                                                                    if (url == "communities") {
                                                                                                                                                                                                                                                                        i = new Index(0, 1, 2);
                                                                                                                                                                                                                                                                        type = 0;
                                                                                                                                                                                                                                                                    } else if (url == "community") {
                                                                                                                                                                                                                                                                        i = new Index(1, 3, 2);
                                                                                                                                                                                                                                                                        type = 1;
                                                                                                                                                                                                                                                                    } else if (url == "commtopics") {
                                                                                                                                                                                                                                                                        i = new Index(1, 4, 3);
                                                                                                                                                                                                                                                                        type = 2;
                                                                                                                                                                                                                                                                        if ((tmp = url.match(/&nid=(\d+)/i)) != null)
                                                                                                                                                                                                                                                                            otherparams = "&na=" + window.location.href.match(/na=(\d+)/i)[1] +
                                                                                                                                                                                                                                                                                    "&nid=" + tmp[1];
                                                                                                                                                                                                                                                                        tmp = undefined;
                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                    $.get("/" + url + "?cmm=" + cmm + otherparams + "&cache=" + (Math.random() + "cacheee").substring(2, 7),
                                                                                                                                                                                                                                                                            function(xml)
                                                                                                                                                                                                                                                                            {
                                                                                                                                                                                                                                                                                $(".bkOff, bkOn,.omLastLinks").remove();
                                                                                                                                                                                                                                                                                var oldTb;
                                                                                                                                                                                                                                                                                var newTb;
                                                                                                                                                                                                                                                                                if (type == 0) {
                                                                                                                                                                                                                                                                                    oldTb = $("#subPage0 table:eq(0)");
                                                                                                                                                                                                                                                                                    newTb = $(".displaytable:eq(0)", xml);
                                                                                                                                                                                                                                                                                } else if (type == 2 || type == 1) {
                                                                                                                                                                                                                                                                                    oldTb = $("form[name='topicsForm'] table.displaytable:eq(0)");
                                                                                                                                                                                                                                                                                    newTb = $("form[name='topicsForm'] table.displaytable:eq(0)", xml);
                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                if (!oldTb || !newTb)
                                                                                                                                                                                                                                                                                    return; //Cannot continue without those

                                                                                                                                                                                                                                                                                // Check for changes
                                                                                                                                                                                                                                                                                try
                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                    function Block()
                                                                                                                                                                                                                                                                                    {
                                                                                                                                                                                                                                                                                        this.cmm = 0;
                                                                                                                                                                                                                                                                                        this.tid = 0;
                                                                                                                                                                                                                                                                                        this.time = 0;
                                                                                                                                                                                                                                                                                        this.memb = 0;
                                                                                                                                                                                                                                                                                        this.isNew = false;
                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                    var blocks = [];
                                                                                                                                                                                                                                                                                    $("tr", oldTb).each(function(i, t)
                                                                                                                                                                                                                                                                                    {
                                                                                                                                                                                                                                                                                        if (i == 0)
                                                                                                                                                                                                                                                                                            return;
                                                                                                                                                                                                                                                                                        var obj = new Block();
                                                                                                                                                                                                                                                                                        var urlTpc = $("td a:eq(0)", t).attr('href');
                                                                                                                                                                                                                                                                                        obj.cmm = urlTpc.match(/cmm=(\d+)/i)[1];
                                                                                                                                                                                                                                                                                        if ((tmp = urlTpc.match(/&tid=(\d+)/i)) != null)
                                                                                                                                                                                                                                                                                            obj.tid = tmp[1];
                                                                                                                                                                                                                                                                                        tmp = undefined;

                                                                                                                                                                                                                                                                                        if (type == 1) {
                                                                                                                                                                                                                                                                                            obj.posts = $("td:eq(2)", t).text();
                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                        var innerTime;
                                                                                                                                                                                                                                                                                        if (type == 0)
                                                                                                                                                                                                                                                                                            innerTime = $("td:eq(1)", t).text();
                                                                                                                                                                                                                                                                                        else
                                                                                                                                                                                                                                                                                            innerTime = $("td:eq(4)").text();
                                                                                                                                                                                                                                                                                        obj.time = innerTime.replace(/\s/g, "");

                                                                                                                                                                                                                                                                                        var memberHtml;
                                                                                                                                                                                                                                                                                        if (type == 0)
                                                                                                                                                                                                                                                                                            memberHtml = $("td:eq(2)", t).text();
                                                                                                                                                                                                                                                                                        else
                                                                                                                                                                                                                                                                                            memberHtml = $("td:eq(3)", t).text();
                                                                                                                                                                                                                                                                                        obj.memb = memberHtml.replace(/^\s|\s$/g, "").replace(/\.|,/g, "");
                                                                                                                                                                                                                                                                                        obj.isNew = ($(".omNew", t).length > 0);
                                                                                                                                                                                                                                                                                        blocks.push(obj);
                                                                                                                                                                                                                                                                                    });
                                                                                                                                                                                                                                                                                    $("tr", newTb).each(function(i, nt)
                                                                                                                                                                                                                                                                                    {
                                                                                                                                                                                                                                                                                        if (i == 0)
                                                                                                                                                                                                                                                                                            return;
                                                                                                                                                                                                                                                                                        var newobj = new Block();
                                                                                                                                                                                                                                                                                        var urlTpc = $("td a:eq(0)", nt).attr('href');
                                                                                                                                                                                                                                                                                        newobj.cmm = urlTpc.match(/cmm=(\d+)/i)[1];
                                                                                                                                                                                                                                                                                        if ((tmp = urlTpc.match(/&tid=(\d+)/i)) != null)
                                                                                                                                                                                                                                                                                            newobj.tid = tmp[1];
                                                                                                                                                                                                                                                                                        tmp = undefined;

                                                                                                                                                                                                                                                                                        if (type == 1) {
                                                                                                                                                                                                                                                                                            newobj.posts = $("td:eq(2)", nt).text();
                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                        var innerTime;
                                                                                                                                                                                                                                                                                        if (type == 0)
                                                                                                                                                                                                                                                                                            innerTime = $("td:eq(1)", nt).text();
                                                                                                                                                                                                                                                                                        else
                                                                                                                                                                                                                                                                                            innerTime = $("td:eq(4)", nt).text();
                                                                                                                                                                                                                                                                                        newobj.time = innerTime.replace(/\s/g, "");

                                                                                                                                                                                                                                                                                        var memberHtml;
                                                                                                                                                                                                                                                                                        if (type == 0)
                                                                                                                                                                                                                                                                                            memberHtml = $("td:eq(2)", nt).text();
                                                                                                                                                                                                                                                                                        else
                                                                                                                                                                                                                                                                                            memberHtml = $("td:eq(3)", nt).text();
                                                                                                                                                                                                                                                                                        newobj.memb = memberHtml.replace(/^\s|\s$/g, "").replace(/\.|,/g, "");

                                                                                                                                                                                                                                                                                        var oldobj = blocks.filter(
                                                                                                                                                                                                                                                                                                function(o)
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                    if (type == 0)
                                                                                                                                                                                                                                                                                                        return (o.cmm == newobj.cmm)
                                                                                                                                                                                                                                                                                                    else
                                                                                                                                                                                                                                                                                                        return (o.tid == newobj.tid);
                                                                                                                                                                                                                                                                                                });
                                                                                                                                                                                                                                                                                                var hasOld = false;
                                                                                                                                                                                                                                                                                                if (oldobj.length > 0)
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                    hasOld = true;
                                                                                                                                                                                                                                                                                                    oldobj = oldobj[0];
                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                // Time watch
                                                                                                                                                                                                                                                                                                var isNew = false;

                                                                                                                                                                                                                                                                                                if (hasOld)
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                    if (type == 0)
                                                                                                                                                                                                                                                                                                    {
                                                                                                                                                                                                                                                                                                        var newTimeblock = newobj.time.match(/(\d{1,2}):(\d{1,2})\s?(am|pm)?/i);
                                                                                                                                                                                                                                                                                                        var oldTimeblock = oldobj.time.match(/(\d{1,2}):(\d{1,2})\s?(am|pm)?/i);
                                                                                                                                                                                                                                                                                                        if (newTimeblock)
                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                            isNew = oldobj.isNew;
                                                                                                                                                                                                                                                                                                            if (oldTimeblock && !isNew)
                                                                                                                                                                                                                                                                                                            {
                                                                                                                                                                                                                                                                                                                var newHour = (newTimeblock.length == 4 && (("" + newTimeblock[3]).toLowerCase()) == "pm") ?
                                                                                                                                                                                                                                                                                                                        (newTimeblock[1] + 12) :
                                                                                                                                                                                                                                                                                                                        newTimeblock[1];
                                                                                                                                                                                                                                                                                                                var newMinute = newTimeblock[2];

                                                                                                                                                                                                                                                                                                                var oldHour = (oldTimeblock.length == 4 && (("" + oldTimeblock[3]).toLowerCase()) == "pm") ?
                                                                                                                                                                                                                                                                                                                        (oldTimeblock[1] + 12) :
                                                                                                                                                                                                                                                                                                                        oldTimeblock[1];
                                                                                                                                                                                                                                                                                                                var oldMinute = oldTimeblock[2];

                                                                                                                                                                                                                                                                                                                var newDt = new Date();
                                                                                                                                                                                                                                                                                                                newDt.setHours(newHour);
                                                                                                                                                                                                                                                                                                                newDt.setMinutes(newMinute);
                                                                                                                                                                                                                                                                                                                var oldDt = new Date();
                                                                                                                                                                                                                                                                                                                oldDt.setHours(oldHour);
                                                                                                                                                                                                                                                                                                                oldDt.setMinutes(oldMinute);

                                                                                                                                                                                                                                                                                                                if ((newDt - oldDt) > 0)
                                                                                                                                                                                                                                                                                                                    isNew = true;
                                                                                                                                                                                                                                                                                                                newHour = undefined;
                                                                                                                                                                                                                                                                                                                newMinute = undefined;
                                                                                                                                                                                                                                                                                                                oldHour = undefined;
                                                                                                                                                                                                                                                                                                                oldMinute = undefined;
                                                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                                                            else
                                                                                                                                                                                                                                                                                                                isNew = true;
                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                    else
                                                                                                                                                                                                                                                                                                    {
                                                                                                                                                                                                                                                                                                        if (type == 1) {
                                                                                                                                                                                                                                                                                                            isNew = (newobj.tid != oldobj.tid || newobj.posts > oldobj.posts);
                                                                                                                                                                                                                                                                                                            if (!isNew)
                                                                                                                                                                                                                                                                                                                isNew = oldobj.isNew;
                                                                                                                                                                                                                                                                                                        } else {

                                                                                                                                                                                                                                                                                                            isNew = (newobj.memb > oldobj.memb);
                                                                                                                                                                                                                                                                                                            if (!isNew)
                                                                                                                                                                                                                                                                                                                isNew = oldobj.isNew;
                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                else
                                                                                                                                                                                                                                                                                                    isNew = true;

                                                                                                                                                                                                                                                                                                if (isNew) {
                                                                                                                                                                                                                                                                                                    if (type == 0)
                                                                                                                                                                                                                                                                                                        $("td:eq(0)", nt).append("<span style=' background: url(" + chrome.extension.getURL('img/omnew.gif') + ")' class='omNew'>&nbsp;</span>");
                                                                                                                                                                                                                                                                                                    else
                                                                                                                                                                                                                                                                                                        $("td:eq(1)", nt).append("<span style=' background: url(" + chrome.extension.getURL('img/omnew.gif') + ")'  class='omNew'>&nbsp;</span>");

                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                if (hasOld)
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                    if (type == 0)
                                                                                                                                                                                                                                                                                                    {
                                                                                                                                                                                                                                                                                                        // Member count
                                                                                                                                                                                                                                                                                                        if (newobj.memb > parseInt(oldobj.memb))
                                                                                                                                                                                                                                                                                                            $("td:eq(2)", nt).append("<span style='color:green;'>(+)</span>");
                                                                                                                                                                                                                                                                                                        else if (newobj.memb < parseInt(oldobj.memb))
                                                                                                                                                                                                                                                                                                            $("td:eq(2)", nt).append("<span style='color:red;'>(-)</span>");
                                                                                                                                                                                                                                                                                                        else
                                                                                                                                                                                                                                                                                                            $("td:eq(2)", nt).append(oldobj.memb.match(/<span[^$]+/i) || "");
                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                            });
                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                catch (ex) {
                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                oldTb.html(newTb.html());

                                                                                                                                                                                                                                                                                var prefName = (type == 0 ? "Bookmarks" : "Bookmarks.Topic");
                                                                                                                                                                                                                                                                                var IsEnabledBk = (OMSystem.OrkutManager.PrefManager.Get("omEnableBookmarks", "false") == "true");
                                                                                                                                                                                                                                                                                var IsEnabledLF = (type == 0 ? (OMSystem.OrkutManager.PrefManager.Get("omEnableLast", "false") == "true") : (OMSystem.OrkutManager.PrefManager.Get("omEnableForum", "false") == "true"));

                                                                                                                                                                                                                                                                                try {
                                                                                                                                                                                                                                                                                    OMSystem.OrkutManager.Util.Bookmark.Build(window, oldTb, prefName, (type == 0), IsEnabledLF, IsEnabledBk);
                                                                                                                                                                                                                                                                                } catch (ex) {
                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                if (JSON.parse(OMSystem.OrkutManager.PrefManager.Get("enablePreviewTopics", "false"))) {
                                                                                                                                                                                                                                                                                    OMSystem.OrkutManager.Util.OMUtil.previewEvents(window);
                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                $('.omNew').die().click(function() {
                                                                                                                                                                                                                                                                                    $(this).remove();
                                                                                                                                                                                                                                                                                })
                                                                                                                                                                                                                                                                                for (x in blocks) {
                                                                                                                                                                                                                                                                                    delete blocks[x];
                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                blocks = undefined;
                                                                                                                                                                                                                                                                                obj = undefined;
                                                                                                                                                                                                                                                                                newobj = undefined;
                                                                                                                                                                                                                                                                                oldTb = undefined;
                                                                                                                                                                                                                                                                                prefName = undefined;
                                                                                                                                                                                                                                                                                IsEnabledBk = undefined;
                                                                                                                                                                                                                                                                                IsEnabledLF = undefined;
                                                                                                                                                                                                                                                                                i = undefined;
                                                                                                                                                                                                                                                                                type = undefined;
                                                                                                                                                                                                                                                                                nid = undefined;
                                                                                                                                                                                                                                                                                xml = undefined;
                                                                                                                                                                                                                                                                                newTb = undefined;
                                                                                                                                                                                                                                                                                innerTime = undefined;
                                                                                                                                                                                                                                                                                urlTpc = undefined;
                                                                                                                                                                                                                                                                                memberHtml = undefined;
                                                                                                                                                                                                                                                                                oldobj = undefined;
                                                                                                                                                                                                                                                                                hasOld = undefined;
                                                                                                                                                                                                                                                                                isNew = undefined;
                                                                                                                                                                                                                                                                                nt = undefined;
                                                                                                                                                                                                                                                                            });
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                };
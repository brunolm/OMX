/// <reference path="../bin/jquery-1.7.1.min.js" />

var OrkutEditor = function(){};

OrkutEditor.CenterElement = function(modal, w, h)
{
    modal.style.width = w + "px";
    modal.style.height = h + "px";

    modal.style.left = (window.screen.availWidth / 2 - (w/2)) + "px";
    modal.style.top = ((window.screen.availHeight / 2 - (h/2)) + window.pageYOffset) + "px";    
};

OrkutEditor.prototype.AddEvents =
    function()
    {
        var orkutEditor = this;

        orkutEditor.iframe.contentDocument.addEventListener("keydown", function(ke) {
            if (ke.which == 9)
            {
                ke.preventDefault();
                var buttons = orkutEditor.editorArea.querySelectorAll("button");
                var send   = buttons[buttons.length - 2];
                var cancel = buttons[buttons.length - 1];

                send.focus();
                if (!send.getAttribute("parsed"))
                {
                    send.addEventListener("click", function() {
                        this.blur();
                    }, false);
                }
                send.setAttribute("parsed", true);
            }
        }, false);

        if (!unsafeWindow.Manager.Overlay)
            unsafeWindow.Manager.Overlay = document.querySelector("#manager-overlay");

        orkutEditor.iframe.contentDocument.addEventListener("keydown", function(ke) {
            if (unsafeWindow.Manager.SaveHistoryTimer) return;

            var historyTimer = parseInt((ManagerAddsSystem.OrkutManager.UserSettingsObject.HistoryTimer * 1000) || 10000);

            function saveHistory()
            {
                if (orkutEditor.iframe.contentDocument.body.innerHTML.length > 15)
                {
                    var history = ManagerAddsSystem.OrkutManager.UserSettingsObject["History"];
                    history = history || [];

                    if (history.length == 0 || history[0].length != orkutEditor.iframe.contentDocument.body.innerHTML.length)
                    {
                        history.unshift(orkutEditor.iframe.contentDocument.body.innerHTML);
                        var historiesToSave = parseInt(ManagerAddsSystem.OrkutManager.UserSettingsObject.HistoriesToSave || 10);
                        if (historiesToSave < 1) historiesToSave = 10;
                        history = history.slice(0, historiesToSave);
                        ManagerAddsSystem.OrkutManager.SetSetting("History", history);

                        console.log("Orkut Manager: History saved");
                    }
                }
                clearTimeout(unsafeWindow.Manager.SaveHistoryTimer);
                unsafeWindow.Manager.SaveHistoryTimer = null;
            }

            unsafeWindow.Manager.SaveHistoryTimer = setTimeout(saveHistory, historyTimer);
        }, false);
    };

var Toolbar = function(){};

Toolbar.prototype.AddButton =
    function (className, tooltip, fn, index)
    {
        if (!ManagerAddsSystem.OrkutManager.UserSettingsObject["Features"]["Toolbar"]) return;
        var toolbar = this;

        if (!toolbar || !toolbar.container || !toolbar.container.firstChild)
            return;

        var button = toolbar.container.firstChild.cloneNode(true, true);

        if (!fn)
        {
            while (button.firstChild)
            {
                button.removeChild(button.firstChild);
            }
            if (className == "/")
            {
                button.style.float = "none";
            }
            else
            {
                var sep = document.createElement("sub");
                sep.innerHTML = " | ";
                sep.style.padding = "0 10px";
                button.appendChild(sep);
            }
            button.setAttribute("title", "");
        }
        else
        {
            var buttonLayout = button.querySelector("div");
            var remImg = buttonLayout.querySelector("img");
            if (remImg)
                buttonLayout.removeChild(remImg);
            buttonLayout.className += " manager-toolbar-" + className;

            button.setAttribute("title", tooltip);
            button.addEventListener("click", function() {
                var tas = toolbar.iframe.parentNode.querySelectorAll("textarea");
                fn(button);
                if (!/^bg$/i.test(className))
                {
                    tas[tas.length-1].focus();
                    toolbar.iframe.focus();
                }
            }, false);
        }

        var lastButton = toolbar.container.querySelectorAll("div[tabindex]");
        lastButton = index
            ? lastButton[index]
            : lastButton[lastButton.length - 1];
        toolbar.container.insertBefore(button, lastButton);
    };

    window.addEventListener("DOMNodeInserted", function (e) {
        if (e && e.target && e.target.tagName == "DIV")
        {
            if (/#Communities/i.test(window.location.hash)) return;

            // Editor settings
            setTimeout(function () {
                var iframe = e.target.querySelector("iframe");
                var len = e.target.querySelectorAll("textarea").length;

                if (iframe && len) {
                    iframe.className += " manager-editor-iframe";
                    e.target.className += " manager-editor-area";

                    var orkutEditor = new OrkutEditor();
                    orkutEditor.iframe = iframe;
                    orkutEditor.editorArea = e.target.parentNode.parentNode;
                    orkutEditor.editorContainer = e.target;

                    orkutEditor.editorArea.className += " manager-editorarea";
                    orkutEditor.AddEvents();

                    setTimeout(function ()
                    {
                        if (orkutEditor.iframe && orkutEditor.iframe.contentDocument && orkutEditor.iframe.contentDocument.body)
                        {
                            setTimeout(function ()
                            {
                                var qs = window.QueryString;

                                if ((qs["cmm"] && qs["tid"] && qs["action"] == "mod")
                                    && ManagerAddsSystem.OrkutManager.UserSettingsObject["_Mod"])
                                {
                                    //#region Moderation

                                    var modText = ManagerAddsSystem.OrkutManager.UserSettingsObject["_Mod"];
                                    ManagerAddsSystem.OrkutManager.SetSetting("_Mod", null);

                                    modText = modText.replace(/\n/gi, "<br>");
                                    
                                    $(orkutEditor.editorContainer).find("textarea:first").each(function () { this.innerHTML = modText; });
                                    orkutEditor.iframe.contentDocument.execCommand("insertHTML", false, modText.replace(/\{\|\}/, "<span id='manager-ifr-sel'></span>"));

                                    //#endregion
                                }
                                else
                                {
                                    var template = ManagerAddsSystem.OrkutManager.UserSettingsObject["TemplateText"];

                                    // prevent bogus behavior
                                    template = template.replace(/\n/gi, "<br>");

                                    orkutEditor.iframe.contentDocument.execCommand("insertHTML", false, template.replace(/\{\|\}/, "<span id='manager-ifr-sel'></span>"));
                                }

                                var caretElement = orkutEditor.iframe.contentDocument.getElementById("manager-ifr-sel");
                                if (caretElement) {
                                    var idoc = orkutEditor.iframe.contentDocument;
                                    var sel = orkutEditor.iframe.contentDocument.getSelection();
                                    var range = idoc.createRange();

                                    range.setStart(caretElement, 0);
                                    range.setEnd(caretElement, 0);

                                    sel.removeAllRanges();
                                    sel.addRange(range);
                                    caretElement.parentNode.removeChild(caretElement);
                                }
                            }, 450);
                        }
                    }, 100);
                }
            }, 0);

            // Toolbar
            setTimeout(function () {
                if (e.target.className && e.target.style) {
                    if (e.target.querySelectorAll("div[tabindex='0'][class][title]").length > 6) {
                        e.target.className += " manager-editor-toolbar";

                        if (!e.target || !e.target.nextSibling)
                            return;

                        var toolbar = new Toolbar();
                        toolbar.container = e.target;
                        toolbar.iframe = e.target.nextSibling.querySelector("iframe");
                        toolbar.editor = toolbar.iframe.contentDocument;

                        var misteriousElement = e.target.querySelector("select");
                        misteriousElement.parentNode.removeChild(misteriousElement);

                        [ ].forEach.call(e.target.querySelectorAll("[style*='none']"), function (el) {
                            el.style.display = "";
                        });

                        //#region Toolbar Elements

                        toolbar.AddButton("s", ManagerAddsSystem.OrkutManager.Resource("Strike"), function () {
                            toolbar.editor.execCommand("strikeThrough", false, "");
                            toolbar.editor.body.focus();
                        }, 3);
                        toolbar.AddButton("sub", ManagerAddsSystem.OrkutManager.Resource("Sub"), function () {
                            toolbar.editor.execCommand("subscript", false, "");
                            toolbar.editor.body.focus();
                        }, 4);
                        toolbar.AddButton("sup", ManagerAddsSystem.OrkutManager.Resource("Sup"), function () {
                            toolbar.editor.execCommand("superscript", false, "");
                            toolbar.editor.body.focus();
                        }, 5);
                        toolbar.AddButton("-", null, null, 6);
                        toolbar.AddButton("bg", ManagerAddsSystem.OrkutManager.Resource("Background color"), function (button) {
                            button.querySelector("input[type='text']").className = "manager-colorpicker";
                            jscolor.colorUpdated = function (val) {
                                if (!val || val.length < 3) return;
                                toolbar.editor.execCommand("backColor", false, val);
                            };
                            jscolor.init();
                            button.querySelector("input[type='text']").focus();
                        }, 8);
                        toolbar.AddButton("image-link", ManagerAddsSystem.OrkutManager.Resource("External image (image-link)"), function (button) {
                            var url = prompt("Image URL", "");
                            if (!url) return;
                            toolbar.editor.execCommand("insertHTML", false, "ht" + "tp://www.orkut.com.br/Interstitial?u=" + url + " ");
                            toolbar.editor.body.focus();
                        }, 12);

                        toolbar.AddButton("-");
                        toolbar.AddButton("font", ManagerAddsSystem.OrkutManager.Resource("Font family"), function () {
                            unsafeWindow.Manager.Overlay.style.display = "";

                            var modal = document.createElement("div");
                            modal.className = "manager-modal manager-layered-remove manager-item-selector manager-item-big";
                            var w = 720;
                            var h = 520;
                            OrkutEditor.CenterElement(modal, w, h);

                            var fonts = ManagerAddsSystem.OrkutManager.UserSettingsObject.Fonts;

                            fonts.forEach(function (fontName) {
                                var fontBlock = document.createElement("div");
                                var fontText = document.createElement("span");
                                var fontSel = document.createElement("button");

                                fontText.innerHTML = fontName;
                                fontText.style.fontFamily = fontName;

                                function selectFont() {
                                    unsafeWindow.Manager.Overlay.style.display = "none";
                                    if (modal && modal.parentNode)
                                        modal.parentNode.removeChild(modal);
                                    toolbar.editor.execCommand("fontName", false, fontName);
                                    toolbar.editor.body.focus();
                                }

                                fontSel.innerHTML = ManagerAddsSystem.OrkutManager.Resource("Select");
                                fontSel.addEventListener("click", selectFont, false);
                                fontBlock.addEventListener("click", selectFont, false);

                                fontBlock.appendChild(fontSel);
                                fontBlock.appendChild(fontText);
                                modal.appendChild(fontBlock);
                            });

                            document.body.appendChild(modal);
                        });
                        toolbar.AddButton("font-size", ManagerAddsSystem.OrkutManager.Resource("Font Size"), function () {
                            unsafeWindow.Manager.Overlay.style.display = "";

                            var modal = document.createElement("div");
                            modal.className = "manager-modal manager-layered-remove manager-font-size-selector";
                            var w = 720;
                            var h = 520;

                            OrkutEditor.CenterElement(modal, w, h);

                            var fonts = [1, 2, 3, 4, 5, 6, 7];
                            var currentFont = "arial";

                            try {
                                currentFont = window.getComputedStyle(toolbar.editor.getSelection().focusNode.parentElement, null).fontFamily;
                            }
                            catch (ex) {
                            }

                            fonts.forEach(function (fontSize) {
                                var fontBlock = document.createElement("div");
                                var fontText = document.createElement("font");
                                var fontSel = document.createElement("button");

                                fontText.innerHTML = currentFont;
                                fontText.setAttribute("face", currentFont);
                                fontText.setAttribute("size", fontSize);

                                function selectFont() {
                                    unsafeWindow.Manager.Overlay.style.display = "none";
                                    if (modal && modal.parentNode)
                                        modal.parentNode.removeChild(modal);
                                    toolbar.editor.execCommand("fontSize", false, fontSize);
                                    toolbar.editor.body.focus();
                                }

                                fontSel.innerHTML = ManagerAddsSystem.OrkutManager.Resource("Select");
                                fontSel.addEventListener("click", selectFont, false);
                                fontBlock.addEventListener("click", selectFont, false);

                                fontBlock.appendChild(fontSel);
                                fontBlock.appendChild(fontText);
                                modal.appendChild(fontBlock);
                            });

                            document.body.appendChild(modal);
                        });
                        toolbar.AddButton("heading", ManagerAddsSystem.OrkutManager.Resource("Heading"), function () {
                            unsafeWindow.Manager.Overlay.style.display = "";

                            var modal = document.createElement("div");
                            modal.className = "manager-modal manager-layered-remove manager-item-selector";
                            var w = 720;
                            var h = 520;

                            OrkutEditor.CenterElement(modal, w, h);


                            var currentFont = "Arial";
                            try {
                                currentFont = window.getComputedStyle(toolbar.editor.getSelection().focusNode.parentElement, null).fontFamily;
                            }
                            catch (ex) {
                            }

                            var fonts = ["H1", "H2", "H3", "H4", "H5", "H6"];

                            fonts.forEach(function (fontHeading) {
                                var fontBlock = document.createElement("div");
                                var fontHead = document.createElement(fontHeading);
                                var fontText = document.createElement("span");
                                var fontSel = document.createElement("button");

                                fontText.innerHTML = "(" + fontHeading + ") " + currentFont;
                                fontText.style.fontFamily = currentFont;

                                function selectFont() {
                                    unsafeWindow.Manager.Overlay.style.display = "none";
                                    if (modal && modal.parentNode)
                                        modal.parentNode.removeChild(modal);
                                    toolbar.editor.execCommand("formatBlock", false, fontHeading);
                                    toolbar.editor.body.focus();
                                }

                                fontSel.innerHTML = ManagerAddsSystem.OrkutManager.Resource("Select");
                                fontSel.addEventListener("click", selectFont, false);
                                fontBlock.addEventListener("click", selectFont, false);

                                fontBlock.appendChild(fontSel);
                                fontHead.appendChild(fontText);
                                fontBlock.appendChild(fontHead);
                                modal.appendChild(fontBlock);
                            });

                            document.body.appendChild(modal);
                        });
                        toolbar.AddButton("text-shadow", ManagerAddsSystem.OrkutManager.Resource("Text Shadow"), function () {
                            var text = toolbar.editor.getSelection().toString();
                            toolbar.editor.execCommand("insertHTML", false, "<span style='text-shadow:2px 2px 6px #000'>" + text + "</span>");
                            toolbar.editor.body.focus();
                        });
                        toolbar.AddButton("-");
                        toolbar.AddButton("outdent", ManagerAddsSystem.OrkutManager.Resource("Outdent"), function () {
                            toolbar.editor.execCommand("outdent", false, "");
                            toolbar.editor.body.focus();
                        });
                        toolbar.AddButton("indent", ManagerAddsSystem.OrkutManager.Resource("Indent"), function () {
                            toolbar.editor.execCommand("indent", false, "");
                            toolbar.editor.body.focus();
                        });
                        toolbar.AddButton("left", ManagerAddsSystem.OrkutManager.Resource("Align left"), function () {
                            toolbar.editor.execCommand("justifyLeft", false, "");
                            toolbar.editor.body.focus();
                        });
                        toolbar.AddButton("center", ManagerAddsSystem.OrkutManager.Resource("Align center"), function () {
                            toolbar.editor.execCommand("justifyCenter", false, "");
                            toolbar.editor.body.focus();
                        });
                        toolbar.AddButton("right", ManagerAddsSystem.OrkutManager.Resource("Align right"), function () {
                            toolbar.editor.execCommand("justifyRight", false, "");
                            toolbar.editor.body.focus();
                        });
                        toolbar.AddButton("justify", ManagerAddsSystem.OrkutManager.Resource("Align justify"), function () {
                            toolbar.editor.execCommand("justifyFull", false, "");
                            toolbar.editor.body.focus();
                        });
                        toolbar.AddButton("-");
                        toolbar.AddButton("undo", ManagerAddsSystem.OrkutManager.Resource("Undo"), function () {
                            toolbar.editor.execCommand("undo", false, "");
                            toolbar.editor.body.focus();
                        });
                        toolbar.AddButton("redo", ManagerAddsSystem.OrkutManager.Resource("Redo"), function () {
                            toolbar.editor.execCommand("redo", false, "");
                            toolbar.editor.body.focus();
                        });
                        toolbar.AddButton("-");
                        toolbar.AddButton("symbol", ManagerAddsSystem.OrkutManager.Resource("Symbol"), function () {
                            unsafeWindow.Manager.Overlay.style.display = "";

                            var modal = document.createElement("div");
                            modal.className = "manager-modal manager-layered-remove manager-symbol-selector";
                            var w = 720;
                            var h = 520;

                            OrkutEditor.CenterElement(modal, w, h);

                            toolbar.editor.body.focus();

                            var currentFont = "arial";

                            try {
                                currentFont = window.getComputedStyle(toolbar.editor.getSelection().focusNode.parentElement, null).fontFamily;
                            }
                            catch (ex) {
                            }

                            for (var i = 160; i < 10000; ++i) {
                                var symbol = document.createElement("span");
                                symbol.className = "manager-symbol-block";
                                symbol.style.fontFamily = currentFont;
                                symbol.innerHTML = String.fromCharCode(i);
                                symbol.setAttribute("title", i);

                                (function (ix) {
                                    function select() {
                                        unsafeWindow.Manager.Overlay.style.display = "none";
                                        if (modal && modal.parentNode)
                                            modal.parentNode.removeChild(modal);
                                        toolbar.editor.execCommand("insertHTML", false, String.fromCharCode(ix));
                                        setTimeout(toolbar.editor.body.focus, 100);
                                        toolbar.iframe.style.display = "";
                                    }

                                    symbol.addEventListener("click", select, false);
                                })(i);
                                modal.appendChild(symbol);
                            }
                            document.body.appendChild(modal);
                        });
                        toolbar.AddButton("/");
                        toolbar.AddButton("shorturl manager-shorturl", ManagerAddsSystem.OrkutManager.Resource("Shorturl"), function () {
                            toolbar.editor.body.focus();
                        });
                        toolbar.AddButton("a", ManagerAddsSystem.OrkutManager.Resource("Link"), function () {
                            toolbar.editor.execCommand("createLink", false, prompt("Url", toolbar.editor.getSelection().toString()));
                            toolbar.editor.body.focus();
                        });
                        toolbar.AddButton("unlink", ManagerAddsSystem.OrkutManager.Resource("Unlink"), function () {
                            toolbar.editor.execCommand("unlink", false, "");
                            toolbar.editor.body.focus();
                        });
                        toolbar.AddButton("masklink", ManagerAddsSystem.OrkutManager.Resource("Super masklink"), function () {
                            var text = toolbar.editor.getSelection().toString();
                            var escapedText = text.replace(/\./g, "&nbsp;").replace(/:/g, "&nbsp;&nbsp;");
                            toolbar.editor.execCommand("unlink", false, "");
                            toolbar.editor.execCommand("insertHTML", false, "<span title='om-link'>" + escapedText + "</a>");
                            toolbar.editor.body.focus();
                        });
                        toolbar.AddButton("-");
                        toolbar.AddButton("ul", ManagerAddsSystem.OrkutManager.Resource("Unordered list"), function () {
                            toolbar.editor.execCommand("insertUnorderedList", false, "");
                            toolbar.editor.body.focus();
                        });
                        toolbar.AddButton("ol", ManagerAddsSystem.OrkutManager.Resource("Ordered list"), function () {
                            toolbar.editor.execCommand("insertOrderedList", false, "");
                            toolbar.editor.body.focus();
                        });
                        toolbar.AddButton("hr", ManagerAddsSystem.OrkutManager.Resource("Horizontal Line"), function () {
                            toolbar.editor.execCommand("insertHTML", false, "<hr/>");
                            toolbar.editor.body.focus();
                        });
                        toolbar.AddButton("-");
                        toolbar.AddButton("encrypt", ManagerAddsSystem.OrkutManager.Resource("Lock message (encrypt)"), function () {
                            var text = toolbar.editor.getSelection().toString();
                            var t = [];
                            text.split("").forEach(function (c, i) { t.push(String.fromCharCode(c.charCodeAt(0) + 77)); });
                            text = t.reverse().join("");
                            toolbar.editor.execCommand("insertHTML", false, text);
                            toolbar.editor.body.focus();
                        });
                        toolbar.AddButton("decrypt", ManagerAddsSystem.OrkutManager.Resource("Unlock message (decrypt)"), function () {
                            var text = toolbar.editor.getSelection().toString();
                            var t = [];
                            text.split("").forEach(function (c, i) { t.push(String.fromCharCode(c.charCodeAt(0) - 77)); });
                            text = t.reverse().join("");
                            toolbar.editor.execCommand("insertHTML", false, text);
                            toolbar.editor.body.focus();
                        });
                        toolbar.AddButton("-");
                        toolbar.AddButton("time", ManagerAddsSystem.OrkutManager.Resource("Date time"), function () {
                            toolbar.editor.body.focus();
                            toolbar.editor.execCommand("insertHTML", false, ManagerAddsSystem.OrkutManager.DateHelper.Format(
                            new Date()
                            , ManagerAddsSystem.OrkutManager.UserSettingsObject.TimeFormat));
                            toolbar.editor.body.focus();
                        });
                        toolbar.AddButton("hover", ManagerAddsSystem.OrkutManager.Resource("Hover text"), function () {
                            var text = toolbar.editor.getSelection().toString();
                            toolbar.editor.execCommand("insertHTML", false, "<span title='" + prompt("text", text) + "'>" + text + "</span>");
                            toolbar.editor.body.focus();
                        });
                        toolbar.AddButton("invisible", ManagerAddsSystem.OrkutManager.Resource("Invisible"), function () {
                            var text = toolbar.editor.getSelection().toString();
                            toolbar.editor.execCommand("insertHTML", false, "<span style='color:transparent;background:transparent'>" + text + "</span>");
                            toolbar.editor.body.focus();
                        });
                        toolbar.AddButton("-");
                        toolbar.AddButton("removeFormat", ManagerAddsSystem.OrkutManager.Resource("Remove format"), function () {
                            toolbar.editor.execCommand("removeFormat", false, "");
                            toolbar.editor.body.focus();
                        });
                        toolbar.AddButton("-");
                        toolbar.AddButton("icon-collection", ManagerAddsSystem.OrkutManager.Resource("Icon collection"), function () {
                            unsafeWindow.Manager.Overlay.style.display = "";

                            var modal = document.createElement("div");
                            modal.className = "manager-modal manager-layered-remove manager-icon-selector";
                            var w = 720;
                            var h = 520;

                            OrkutEditor.CenterElement(modal, w, h);

                            (ManagerAddsSystem.OrkutManager.UserSettingsObject["IconCollection"] || []).forEach(function (elementValue) {
                                var elementBlock = document.createElement("img");

                                elementBlock.src = elementValue.Link;
                                elementBlock.setAttribute("title", elementValue.Code);

                                function selectElement(ev) {
                                    var src = ev.target.getAttribute("src");
                                    var isInternal = /ggpht/i.test(src);

                                    unsafeWindow.Manager.Overlay.style.display = "none";
                                    if (modal && modal.parentNode)
                                        modal.parentNode.removeChild(modal);
                                    toolbar.editor.execCommand("insertHTML", false
                                    , isInternal
                                        ? "<img alt='orkut-manager' src='" + src + "'/>"
                                        : "ht" + "tp://www.orkut.com.br/Interstitial?u=" + src);
                                    toolbar.editor.body.focus();
                                    toolbar.iframe.style.display = "";
                                }

                                elementBlock.addEventListener("click", selectElement, false);

                                modal.appendChild(elementBlock);
                            });

                            document.body.appendChild(modal);
                        });
                        toolbar.AddButton("image-collection", ManagerAddsSystem.OrkutManager.Resource("Image collection"), function () {
                            unsafeWindow.Manager.Overlay.style.display = "";

                            var modal = document.createElement("div");
                            modal.className = "manager-modal manager-layered-remove manager-image-selector";
                            var w = 720;
                            var h = 520;
                            OrkutEditor.CenterElement(modal, w, h);

                            (ManagerAddsSystem.OrkutManager.UserSettingsObject["ImageCollection"] || []).forEach(function (elementValue) {
                                var elementBlock = document.createElement("img");

                                elementBlock.src = elementValue;

                                function selectElement(ev) {
                                    var src = ev.target.getAttribute("src");
                                    var isInternal = /ggpht/i.test(src);

                                    unsafeWindow.Manager.Overlay.style.display = "none";
                                    if (modal && modal.parentNode)
                                        modal.parentNode.removeChild(modal);
                                    toolbar.editor.execCommand("insertHTML", false
                                    , isInternal
                                        ? "<img alt='orkut-manager' src='" + src + "'/>"
                                        : "ht" + "tp://www.orkut.com.br/Interstitial?u=" + src);
                                    toolbar.editor.body.focus();
                                    toolbar.iframe.style.display = "";
                                }

                                elementBlock.addEventListener("click", selectElement, false);

                                modal.appendChild(elementBlock);
                            });

                            document.body.appendChild(modal);
                        });
                        toolbar.AddButton("template", ManagerAddsSystem.OrkutManager.Resource("Text templates"), function () {
                            unsafeWindow.Manager.Overlay.style.display = "";

                            var modal = document.createElement("div");
                            modal.className = "manager-modal manager-layered-remove manager-item-selector";
                            var w = 720;
                            var h = 520;
                            OrkutEditor.CenterElement(modal, w, h);

                            (ManagerAddsSystem.OrkutManager.UserSettingsObject["PreDefinedTemplates"] || []).forEach(function (elementValue) {
                                var elementBlock = document.createElement("div");
                                var elementText = document.createElement("div");
                                var elementSel = document.createElement("button");

                                elementText.style.fontSize = "12px";
                                elementText.innerHTML = elementValue;

                                function selectFont() {
                                    unsafeWindow.Manager.Overlay.style.display = "none";
                                    if (modal && modal.parentNode)
                                        modal.parentNode.removeChild(modal);
                                    toolbar.editor.execCommand("insertHTML", false, elementValue);
                                    toolbar.editor.body.focus();
                                    toolbar.iframe.style.display = "";
                                }

                                elementSel.innerHTML = ManagerAddsSystem.OrkutManager.Resource("Select");
                                elementSel.addEventListener("click", selectFont, false);
                                elementBlock.addEventListener("click", selectFont, false);

                                elementBlock.appendChild(elementSel);
                                elementBlock.appendChild(elementText);
                                modal.appendChild(elementBlock);
                            });

                            document.body.appendChild(modal);
                        });
                        toolbar.AddButton("history", ManagerAddsSystem.OrkutManager.Resource("History"), function () {
                            unsafeWindow.Manager.Overlay.style.display = "";

                            var modal = document.createElement("div");
                            modal.className = "manager-modal manager-layered-remove manager-item-selector";
                            var w = 720;
                            var h = 520;
                            OrkutEditor.CenterElement(modal, w, h);

                            (ManagerAddsSystem.OrkutManager.UserSettingsObject["History"] || []).forEach(function (elementValue) {
                                var elementBlock = document.createElement("div");
                                var elementText = document.createElement("div");
                                var elementSel = document.createElement("button");

                                elementText.style.fontSize = "12px";
                                elementText.innerHTML = elementValue;

                                function selectFont() {
                                    unsafeWindow.Manager.Overlay.style.display = "none";
                                    if (modal && modal.parentNode)
                                        modal.parentNode.removeChild(modal);

                                    toolbar.editor.body.innerHTML = "";
                                    toolbar.editor.execCommand("insertHTML", false, elementValue);
                                    toolbar.editor.body.focus();
                                    toolbar.iframe.style.display = "";
                                }

                                elementSel.innerHTML = ManagerAddsSystem.OrkutManager.Resource("Select");
                                elementSel.addEventListener("click", selectFont, false);
                                elementBlock.addEventListener("click", selectFont, false);

                                elementBlock.appendChild(elementSel);
                                elementBlock.appendChild(elementText);
                                modal.appendChild(elementBlock);
                            });

                            document.body.appendChild(modal);
                        });
                        //#endregion
                    }
                }

            }, 50);
        }
    }, false);
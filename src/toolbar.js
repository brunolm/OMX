if (!OMSystem.OrkutManager.Toolbar)
    OMSystem.OrkutManager.Toolbar = {};

OMSystem.OrkutManager.Toolbar = {
    Get: function()
    {
        var Language = OMSystem.OrkutManager.Language.Get();
        var User = OMSystem.OrkutManager.Util.User;
        var PrefManager = OMSystem.OrkutManager.PrefManager;

        IsSmilyey = 'smiley/';
        if (PrefManager.Get("omOLDemoticons", "true") == "true") {
            IsSmilyey = '';
        }

        var Separator = "<span class='Sep'>&nbsp;</span>";
        var ToolbarSetSelectedTextValue = "  function omSetSelectedTextValue(val) { var s, e; s = post.selectionStart; e = post.selectionEnd; post.value = post.value.substr(0, s) + val + post.value.substr(e); post.selectionStart = s; post.selectionEnd = s + (val.length); post.focus(); post.scrollTop = (14 * post.value.substr(0, post.selectionStart).match(/\\n/g).length); } " +
                "function omSetSelectedTextFormat(val) { var s, e; s = post.selectionStart; e = post.selectionEnd; post.value = post.value.substr(0, s) + (val.replace('{|}', psel)) + post.value.substr(e); post.selectionStart = (s + val.lastIndexOf('{|}')); post.selectionEnd = post.selectionStart + (psel.length); post.focus(); post.scrollTop = (14 * post.value.substr(0, post.selectionStart).match(/\\n/g).length);} ";
        var ToolbarFontJSIconClick = " var tob = this; do { tob = tob.parentNode; } while (tob && tob.className != 'OMToolbar'); var x = tob; var ss = tob.getElementsByTagName('span'); for each(var s in ss) { if (s.getAttribute('name') == 'OMToolbarFontIcon') { x = s; break; } } x = x.options[x.selectedIndex].value; omSetSelectedTextFormat('<span style=\\'font-family:' + x + '\\'>{|}</span>'); ";
        var ToolbarFontSizeJSIconClick = " var tob = this; do { tob = tob.parentNode; } while (tob && tob.className != 'OMToolbar'); var x = tob; var ss = tob.getElementsByTagName('span'); for each(var s in ss) { if (s.getAttribute('name') == 'OMToolbarFontSizeIcon') { x = s; break; } } x = x.options[x.selectedIndex].value; omSetSelectedTextFormat('<span style=\\'font-size:' + x + 'px\\'>{|}</span>'); ";
        var ToolbarHighlightJS = " omSetSelectedTextFormat('<span style=\\'background-color:' + this.style.backgroundColor + '\\'>{|}</span>');  this.parentNode.selectedIndex=0; \"  onmouseover=\"var tob = this; do { tob = tob.parentNode; } while (tob && tob.className != 'OMToolbar'); var x = tob; var ss = tob.getElementsByTagName('span'); for each(var s in ss) { if (s.getAttribute('name') == 'OMToolbarHightlight') { x = s; break; } } x.style.backgroundColor= this.style.backgroundColor;";
        var ToolbarshadowJS = " omSetSelectedTextFormat('<span style=\\'text-shadow:' + this.style.textShadow + '\\'>{|}</span>');  this.parentNode.selectedIndex=0; \"  onmouseover=\"var tob = this; do { tob = tob.parentNode; } while (tob && tob.className != 'OMToolbar'); var x = tob; var ss = tob.getElementsByTagName('span'); for each(var s in ss) { if (s.getAttribute('name') == 'shadowToolbar') { x = s; break; } } x.style.textShadow= this.style.textShadow;";
        var ToolbarEmoticonJS = " omSetSelectedTextFormat('[' + (this.value || this.getAttribute('value')) + ']{|}');\" onmouseover=\"var tob = this; do { tob = tob.parentNode; } while (tob && tob.className != 'OMToolbar'); var x = tob; var ss = tob.getElementsByTagName('span'); for each(var s in ss) { if (s.getAttribute('name') == 'OMToolbarEmoticonSelect') { x = s; break; } } this.parentNode.value=this.value; var x1 = tob; var ss = tob.getElementsByTagName('span'); for each(var s in ss) { if (s.getAttribute('name') == 'OMToolbarEmoticon') { x1 = s; break; } } x1.setAttribute('value', x.options[x.selectedIndex].value); x1.src=";
        var ToolbarEmoticonJS3 = " omSetSelectedTextFormat('<img src=\\'' + this.getAttribute('src') + '\\' />');";
        var ToolbarNewLine = "<div style='height:8px;width:1px;clear:both;'><br/></div>";
        var ToolbarJS = "var post = this; do { post = post.parentNode; } while (post && post.className != 'OMToolbar'); var tob = post; post = post.parentNode.getElementsByTagName('textarea')[0]; var psel = post.value.substr((post.selectionStart), (post.selectionEnd - post.selectionStart)); " + ToolbarSetSelectedTextValue + " ";

        try {
            var fonts = '';
            var Savedfonts = JSON.parse(OMSystem.OrkutManager.PrefManager.Get("FontList", ""));
            for (var i in Savedfonts)
            {
                fonts += "<option style='font-family: " + unescape(Savedfonts[i]) + "'>" + unescape(Savedfonts[i]) + "</option>";
            }
        } catch (e) {
        }

        try {
            var SpecialChars = "";
            SpecialChar = (OMSystem.OrkutManager.PrefManager.Get("CharList", "")).split('|');
            for (var i in SpecialChar)
            {
                SpecialChars += "<option>&nbsp;" + String.fromCharCode(SpecialChar[i]) + "&nbsp;</option>";
            }
        } catch (ex) {
        }
        var Toolbar = {
            Tools:
                    new Array(
                    new Array /* Collapsebar */
                    (
                            "<span title='" + Language.ToolbarCollapse + "' style='font-weight:bold;font-family:tahoma;float:right; margin-top: -5px; width: 20px; margin-left:10px;' " +
                            "onclick=\"if (this.innerHTML.indexOf('-') >= 0) { this.parentNode.parentNode.style.height='5px'; this.innerHTML = '+'; } " +
                            "else { this.parentNode.parentNode.style.height='auto'; this.innerHTML = '-'; }\" " +
                            ">-</span>",
                            "{|}",
                            "{|}",
                            "false"
                            ),
                    new Array /* Set Field Size */
                    (
                            "<span class='SizeSet Icon' style='float: right !important' " +
                            "onclick=\"" + ToolbarJS + " var h = prompt('#'); if (h > 0 && h < 999999999) post.style.height = (h) + 'px';  \" " +
                            ">&nbsp;</span>",
                            "{|}",
                            "{|}",
                            "false"
                            ),
                    new Array /* -- Field Size */
                    (
                            "<span class='SizeDec Icon' style='float: right !important' " +
                            "onclick=\"" + ToolbarJS + " post.style.height = (post.offsetHeight - 200) + 'px';  \" " +
                            ">&nbsp;</span>",
                            "{|}",
                            "{|}",
                            "false"
                            ),
                    new Array /* ++ Field Size */
                    (
                            "<span class='SizeInc Icon' style='float: right !important' " +
                            "onclick=\"" + ToolbarJS + " post.style.height = (post.offsetHeight + 200) + 'px';  \" " +
                            ">&nbsp;</span>",
                            "{|}",
                            "{|}",
                            "false"
                            ),
                    new Array /* Bold */
                    (
                            "<span title='" + Language.ToolbarBold +
                            "' class='Bold Icon'>&nbsp;</span>", // Display Button
                            "<b>{|}</b>", // HTML code ;  {|} = Cursor	; empty to disable from html
                            "[b]{|}[/b]", // code		 ;	{|} = Cursor	; empty to disable from normal
                            "true"										// false	 = 	tell not to use codes, use button script
                            ),
                    new Array /* Italic */
                    (
                            "<span title='" + Language.ToolbarItalic + "' class='Italic Icon'>&nbsp;</span>",
                            "<i>{|}</i>",
                            "[i]{|}[/i]"
                            ),
                    new Array /* Underline */
                    (
                            "<span title='" + Language.ToolbarUnderline + "' class='Underline Icon'>&nbsp;</span>",
                            "<u>{|}</u>",
                            "[u]{|}[/u]"
                            ),
                    new Array /* Strike */
                    (
                            "<span title='" + Language.ToolbarStrike + "' class='Strike Icon'>&nbsp;</span>",
                            "<s>{|}</s>",
                            ""
                            ),
                    new Array /* Strike fake (no-html) */
                    (
                            "<span title='" + Language.ToolbarStrike + "' class='Strike Icon' onclick=\"" + ToolbarJS + "function ToolbarStrikeFake(s){var i = 0;var x = 0;var f ='';for (i=0;i<s.length;++i){x = s.charCodeAt(i); f += String.fromCharCode(x) + String.fromCharCode(822);}return f;} post.value = post.value.substr(0, post.selectionStart) + ToolbarStrikeFake(psel) + post.value.substr(post.selectionEnd); var focus = post.value.lastIndexOf('{|}'); post.value = post.value.replace('{|}', psel); post.selectionStart = focus; post.selectionEnd = focus + psel.length; post.focus();\" " +
                            ">&nbsp;</span>",
                            "",
                            "{|}"
                            ),
                    new Array /* Align:: Left */
                    (
                            Separator +
                            "<span title='" + Language.ToolbarAlignLeft + "' class='AlignLeft Icon'>&nbsp;</span>",
                            "<div style=\\'text-align:left\\'>{|}</div>",
                            ""
                            ),
                    new Array /* Align:: Center */
                    (
                            "<span title='" + Language.ToolbarAlignCenter + "' class='AlignCenter Icon'>&nbsp;</span>",
                            "<center>{|}</center>",
                            ""
                            ),
                    new Array /* Align:: Right */
                    (
                            "<span title='" + Language.ToolbarAlignRight + "' class='AlignRight Icon'>&nbsp;</span>",
                            "<div style=\\'text-align:right\\'>{|}</div>",
                            ""
                            ),
                    new Array /* Align:: Justify */
                    (
                            "<span title='" + Language.ToolbarAlignJustify + "' class='AlignJustify Icon'>&nbsp;</span>",
                            "<div style=\\'text-align:justify\\'>{|}</div>",
                            ""
                            ),
                    new Array /* Separator */
                    (
                            Separator,
                            "{|}",
                            "{|}"
                            ),
                    new Array /* Link */
                    (
                            "<span title='" + Language.ToolbarLink + "' class='Link Icon'>&nbsp;</span>",
                            "<a href=\\'{|}\\' target=\\'_blank\\' title=\\'\\'></a>",
                            "[link={|}][/link]"
                            ),
                    new Array /* Image */
                    (
                            "<span title='" + Language.ToolbarImage + "' class='Image Icon'>&nbsp;</span>",
                            "<img width=\\'\\' src=\\'{|}\\' />",
                            "[link]{|}[/link]"
                            ),
                    new Array /* Source */
                    (
                            "<span title='" + Language.ToolbarSource + "' class='Source Icon'>&nbsp;</span>",
                            "<small><small><b>Código:</b></small></small><pre><div style=\\'border:1px solid;padding:0.8em\\'>[code]{|}[/code]</div></pre></div>",
                            "[code]{|}[/code]"
                            ),
                    new Array /* Spoilers */
                    (
                            "<span title='" + Language.ToolbarSpoiler + "' class='Spoiler Icon'>&nbsp;</span>",
                            "<div style=\\'border:1px solid #FFCC66;margin:10px 0px;padding:5px 3px;background-color:#FFFDDF;text-align:left;font-size:90%;\\'>" + Language.SpoilerText + "</div>[yellow]{|}[/yellow]",
                            "[red][b]/!\\\\ SPOILERS /!\\\\[/b][/red]\\n[yellow]{|}[/yellow]"
                            ),
                    new Array /* Quotes */
                    (
                            "<span title='" + Language.ToolbarQuote + "' class='Quote Icon'>&nbsp;</span>",
                            "<q style=\\'font-style:italic;\\'>{|}</q>",
                            ""
                            ),
                    new Array /* BlockQuote */
                    (
                            "<span class='BlockQuote Icon' title='BlockQuote'>&nbsp;</span>",
                            "<blockquote>{|}</blockquote>",
                            ""
                            ),
                    new Array /* HR */
                    (
                            "<span class='hrTag Icon' title='Tag <hr />'>&nbsp;</span>",
                            "<hr></hr>{|}",
                            ""
                            ),
                    new Array /* TT */
                    (
                            "<span class='ttTag Icon' title='Tag <tt>'>&nbsp;</span>",
                            "<tt>{|}</tt>",
                            ""
                            ),
                    new Array /* Invisible */
                    (
                            "<span class='invisibletag Icon' title='Invisivel/Invisible'>&nbsp;</span>",
                            "<font color=#f0f6ff>{|}</font>",
                            ""
                            ),
                    new Array /* Separator */
                    (
                            Separator,
                            "{|}",
                            "{|}"
                            ),
                    new Array /* New Line */
                    (
                            "<span class='Br Icon' title='" + Language.ToolbarNewLine + "'>&nbsp;</span>",
                            "<br/>{|}",
                            ""
                            ),
                    new Array /* Separator */
                    (
                            Separator,
                            "{|}",
                            ""
                            ),
                    new Array /* Encrypt */
                    (
                            "<span title='" + Language.ToolbarEncrypt + "' class='Encrypt Icon' onclick=\"" + ToolbarJS + "function crypt(s, secret){var i = 0;var x = 0;var f ='';for (i=0;i<s.length;++i){x = s.charCodeAt(i);f += String.fromCharCode(x+secret);}return f;} omSetSelectedTextValue(crypt(psel, 77));\">&nbsp;</span>",
                            "{|}",
                            "{|}"
                            ),
                    new Array /* Decrypt */
                    (
                            "<span title='" + Language.ToolbarDecrypt + "' class='Decrypt Icon' onclick=\"" + ToolbarJS + "function crypt(s, secret){var i = 0;var x = 0;var f ='';for (i=0;i<s.length;++i){x = s.charCodeAt(i);f += String.fromCharCode(x+secret);}return f;} omSetSelectedTextValue(crypt(psel, -77));\">&nbsp;</span>",
                            "{|}",
                            "{|}"
                            ),
                    new Array /* Separator */
                    (
                            Separator,
                            "{|}",
                            "{|}"
                            ),
                    new Array /* Time */
                    (
                            "<span title='" + Language.ToolbarTime + "' class='Time Icon' onclick=\"" + ToolbarJS + " function omTime(format) { format = unescape(format); function LeadZero(v) {  return (v < 10 ? '0' + v : v); } var date = new Date();  var d = LeadZero(date.getDate()); var j = date.getDate(); var w = date.getDay(); var l; switch (w) { case 0: l = '" + (Language.DateTimeDays[0]) + "'; break; case 1: l = '" + (Language.DateTimeDays[1]) + "'; break; case 2: l = '" + (Language.DateTimeDays[2]) + "'; break; case 3: l = '" + (Language.DateTimeDays[3]) + "'; break; case 4: l = '" + (Language.DateTimeDays[4]) + "'; break; case 5: l = '" + (Language.DateTimeDays[5]) + "'; break; case 6: default: l = '" + (Language.DateTimeDays[6]) + "'; break; }; var D = l.substring(0, 3);  var m = LeadZero(date.getMonth() + 1); var n = (date.getMonth() + 1); var F; switch ((n - 1)) { case 0: F = '" + (Language.DateTimeMonths[0]) + "'; break; case 1: F = '" + (Language.DateTimeMonths[1]) + "'; break; case 2: F = '" + (Language.DateTimeMonths[2]) + "'; break; case 3: F = '" + (Language.DateTimeMonths[3]) + "'; break; case 4: F = '" + (Language.DateTimeMonths[4]) + "'; break; case 5: F = '" + (Language.DateTimeMonths[5]) + "'; break; case 6: F = '" + (Language.DateTimeMonths[6]) + "'; break; case 7: F = '" + (Language.DateTimeMonths[7]) + "'; break; case 8: F = '" + (Language.DateTimeMonths[8]) + "'; break; case 9: F = '" + (Language.DateTimeMonths[9]) + "'; break; case 10: F = '" + (Language.DateTimeMonths[10]) + "'; break; case 11: default: F = '" + (Language.DateTimeMonths[11]) + "'; break; }; var M = F.substring(0, 3);  function YearLeap(y) {  if ((y % 4) == 0)  {   if ((y % 100) == 0)    return ((y % 400) == 0) ? 1 : 0;   else    return 1;  }  else return 0; }  var Y = date.getFullYear() + ''; var y = Y.substring(2); var L = YearLeap(Y); var H = date.getHours(); var h = (H > 12) ? (H - 12) : (H); var G = H; var g = h; var A = (H > 12) ? 'PM' : 'AM'; var a = A.toLowerCase(); H = LeadZero(H); h = LeadZero(h);  var i = LeadZero(date.getMinutes());  var s = LeadZero(date.getSeconds()); var B = date.getMilliseconds();  return format.replace(/%d/g, d).replace(/%j/g, j).replace(/%w/, w).replace(/%l/g, l).replace(/%D/g, D).replace(/%m/g, m).replace(/%n/g, n).replace(/%F/g, F).replace(/%M/g, M).replace(/%Y/g, Y).replace(/%y/g, y).replace(/%L/g, L).replace(/%H/g, H).replace(/%h/g, h).replace(/%G/g, G).replace(/%g/g, g).replace(/%A/g, A).replace(/%a/g, a).replace(/%i/g, i).replace(/%s/g, s).replace(/%B/g, B);} omSetSelectedTextValue(omTime('" + escape(OMSystem.OrkutManager.PrefManager.Get("TimeFormat")) + "')); \">&nbsp;</span>",
                            "{|}",
                            "{|}"
                            ),
                    new Array /* Mask Links */
                    (
                            "<span class='FixLinks Icon' title='" + Language.ToolbarMaskLinks + "' " +
                            "onclick=\"" +
                            ToolbarJS +
                            " post.value = post.value.replace(/(https?:\\/)()(\\/)/gi, '$1[b]$2[/b]$3'); " +
                            " post.value = post.value.replace(/\\b([.])/ig,'[b]$1[/b]'); " +
                            "\"" +
                            ">&nbsp;</span>",
                            "{|}",
                            "{|}"
                            ),
                    new Array /* Tab */
                    (
                            "<span class='Icon TabIcon'>&nbsp;</span>",
                            "{|}",
                            "{|}"
                            ),
                    new Array /* Toolbar Layout: New Line */
                    (
                            ToolbarNewLine,
                            "{|}",
                            ""
                            ),
                    new Array /* Highlight HTML */
                    (
                            "<span class='Highlight Icon' title='" + Language.ToolbarColorPicker + "' name='OMToolbarHightlight' style='background-color: yellow;' onclick=\"" + ToolbarJS + ToolbarHighlightJS + "\">&nbsp;</span> <select class='HighlightSelect'>" +
                            "<option disabled selected>" + "Highlight" + "</option>" +
                            "<option style='background-color: maroon'>&nbsp;</option>" +
                            "<option style='background-color: red'>&nbsp;</option>" +
                            "<option style='background-color: orange'>&nbsp;</option>" +
                            "<option style='background-color: navy'>&nbsp;</option>" +
                            "<option style='background-color: blue'>&nbsp;</option>" +
                            "<option style='background-color: aqua'>&nbsp;</option>" +
                            "<option style='background-color: teal'>&nbsp;</option>" +
                            "<option style='background-color: green'>&nbsp;</option>" +
                            "<option style='background-color: lime'>&nbsp;</option>" +
                            "<option style='background-color: olive'>&nbsp;</option>" +
                            "<option style='background-color: gold'>&nbsp;</option>" +
                            "<option style='background-color: yellow; color: black;'>&nbsp;</option>" +
                            "<option style='background-color: gray'>&nbsp;</option>" +
                            "<option style='background-color: silver'>&nbsp;</option>" +
                            "<option style='background-color: purple'>&nbsp;</option>" +
                            "<option style='background-color: fuchsia'>&nbsp;</option>" +
                            "<option style='background-color: violet'>&nbsp;</option>" +
                            "<option style='background-color: pink'>&nbsp;</option>" +
                            "</select>",
                            "{|}",
                            "",
                            "false",
                            "true"
                            ),
                    new Array /* Text Shadow */
                    (
                            "<span class='Shadow Icon' title='Text-shadow' name='shadowToolbar' style='text-shadow: 0px 0px 5px blue;' onclick=\"" + ToolbarJS + ToolbarshadowJS + "\"></span> <select class='ShadowSelect'>" +
                            "<option alt='blue' style='text-shadow: 0px 0px 5px blue;'>Text-shadow</option>" +
                            "<option alt='black' style='text-shadow: 0px 0px 5px black;'>Text-shadow</option>" +
                            "<option alt='white' style='text-shadow: 0px 0px 5px white;'>Text-shadow</option>" +
                            "<option alt='green' style='text-shadow: 0px 0px 5px green;'>Text-shadow</option>" +
                            "<option alt='pink' style='text-shadow: 0px 0px 5px pink;'>Text-shadow</option>" +
                            "<option alt='maroon' style='text-shadow: 0px 0px 5px maroon;'>Text-shadow</option>" +
                            "<option alt='red' style='text-shadow: 0px 0px 5px red;'>Text-shadow</option>" +
                            "<option alt='orange' style='text-shadow: 0px 0px 5px orange;'>Text-shadow</option>" +
                            "<option alt='navy' style='text-shadow: 0px 0px 5px navy;'>Text-shadow</option>" +
                            "<option alt='aqua' style='text-shadow: 0px 0px 5px aqua;'>Text-shadow</option>" +
                            "<option alt='teal' style='text-shadow: 0px 0px 5px teal;'>Text-shadow</option>" +
                            "<option alt='lime' style='text-shadow: 0px 0px 5px lime;'>Text-shadow</option>" +
                            "<option alt='olive' style='text-shadow: 0px 0px 5px olive;'>Text-shadow</option>" +
                            "<option alt='gold' style='text-shadow: 0px 0px 5px gold;'>Text-shadow</option>" +
                            "<option alt='yellow' style='text-shadow: 0px 0px 5px yellow; color: black;'>Text-shadow</option>" +
                            "<option alt='purple' style='text-shadow: 0px 0px 5px purple;'>Text-shadow</option>" +
                            "<option alt='violet' style='text-shadow: 0px 0px 5px violet;'>Text-shadow</option>" +
                            "</select>",
                            "{|}",
                            "",
                            "false",
                            "true"
                            ),
                    new Array /* Separator */
                    (
                            Separator,
                            "{|}",
                            "{|}"
                            ),
                    new Array /* Color picker HTML */
                    (
                            "<span alt='navy' class='Color Icon' title='" + Language.ToolbarColorPicker + "' name='OMToolbarColor' style='background-color:navy;'>&nbsp;</span> <select class='ColorSelect'>" +
                            "<option disabled selected>" + Language.Colors + "</option>" +
                            "<option alt='maroon' style='background-color: maroon'>&nbsp;</option>" +
                            "<option alt='red' style='background-color: red'>&nbsp;</option>" +
                            "<option alt='orange' style='background-color: orange'>&nbsp;</option>" +
                            "<option alt='navy' style='background-color: navy'>&nbsp;</option>" +
                            "<option alt='blue' style='background-color: blue'>&nbsp;</option>" +
                            "<option alt='aqua' style='background-color: aqua'>&nbsp;</option>" +
                            "<option alt='teal' style='background-color: teal'>&nbsp;</option>" +
                            "<option alt='green' style='background-color: green'>&nbsp;</option>" +
                            "<option alt='lime' style='background-color: lime'>&nbsp;</option>" +
                            "<option alt='olive' style='background-color: olive'>&nbsp;</option>" +
                            "<option alt='gold' style='background-color: gold'>&nbsp;</option>" +
                            "<option alt='yellow' style='background-color: yellow'>&nbsp;</option>" +
                            "<option alt='gray' style='background-color: gray'>&nbsp;</option>" +
                            "<option alt='silver' style='background-color: silver'>&nbsp;</option>" +
                            "<option alt='purple' style='background-color: purple'>&nbsp;</option>" +
                            "<option alt='fuchsia' style='background-color: fuchsia'>&nbsp;</option>" +
                            "<option alt='violet' style='background-color: violet'>&nbsp;</option>" +
                            "<option alt='pink' style='background-color: pink'>&nbsp;</option>" +
                            "</select>",
                            "{|}",
                            "",
                            "false",
                            "true"
                            ),
                    new Array /* Separator */
                    (
                            Separator,
                            "{|}",
                            "{|}"
                            ),
                    new Array /* Char select */
                    (
                            "<span id='omToolbarCharSelect' title='Special Chars'>&nbsp;♫&nbsp;</span> <select  name='CharSelect'>" +
                            "<option disabled selected>♫</option>" +
                            SpecialChars +
                            "</select>",
                            "{|}",
                            "{|}",
                            "false",
                            "true"
                            ),
                    new Array /* Color picker */
                    (
                            "<span alt='orange' class='Color Icon' title='" + Language.ToolbarColorPicker + "' name='OMToolbarColor' style='background-color:navy;'>&nbsp;</span> <select class='ColorSelect'>" +
                            "<option alt='maroon' style='background-color: maroon'>&nbsp;</option>" +
                            "<option alt='red' style='background-color: red'>&nbsp;</option>" +
                            "<option alt='orange' style='background-color: orange'>&nbsp;</option>" +
                            "<option alt='navy' style='background-color: navy'>&nbsp;</option>" +
                            "<option alt='blue' style='background-color: blue'>&nbsp;</option>" +
                            "<option alt='aqua' style='background-color: aqua'>&nbsp;</option>" +
                            "<option alt='teal' style='background-color: teal'>&nbsp;</option>" +
                            "<option alt='green' style='background-color: green'>&nbsp;</option>" +
                            "<option alt='lime' style='background-color: lime'>&nbsp;</option>" +
                            "<option alt='olive' style='background-color: olive'>&nbsp;</option>" +
                            "<option alt='gold' style='background-color: gold'>&nbsp;</option>" +
                            "<option alt='yellow' style='background-color: yellow'>&nbsp;</option>" +
                            "<option alt='gray' style='background-color: gray'>&nbsp;</option>" +
                            "<option alt='silver' style='background-color: silver'>&nbsp;</option>" +
                            "<option alt='purple' style='background-color: purple'>&nbsp;</option>" +
                            "<option alt='fuchsia' style='background-color: fuchsia'>&nbsp;</option>" +
                            "<option alt='violet' style='background-color: violet'>&nbsp;</option>" +
                            "<option alt='pink' style='background-color: pink'>&nbsp;</option>" +
                            "</select>",
                            "",
                            "{|}",
                            "false",
                            "true"
                            ),
                    new Array /* Separator */
                    (
                            Separator,
                            "{|}",
                            ""
                            ),
                    new Array /* Emoticons */
                    (
                            "<img alt='' src='http://static4.orkut.com/img/" + IsSmilyey + "i_bigsmile.gif' class='Emoticon Icon' title='" + Language.ToolbarEmoticons + "' name='OMToolbarEmoticon' value=':)' onclick=\"" + ToolbarJS + ToolbarEmoticonJS + "(x.options[x.selectedIndex].getAttribute('href'));\" /> " +
                            "<select name='OMToolbarEmoticonSelect' class='EmoticonSelect'>" +
                            "<option href='http://static4.orkut.com/img/" + IsSmilyey + "i_smile.gif' disabled selected value='xD'>Emoticons</option>" +
                            "<option href='http://static4.orkut.com/img/" + IsSmilyey + "i_smile.gif' onclick=\"" + ToolbarJS + ToolbarEmoticonJS + "'http://static4.orkut.com/img/" + IsSmilyey + "i_smile.gif';\" style='background-image: url(http://static4.orkut.com/img/" + IsSmilyey + "i_smile.gif); background-repeat: no-repeat; background-position: left; padding-left: 20px;'>:)</option>" +
                            "<option href='http://static4.orkut.com/img/" + IsSmilyey + "i_wink.gif' onclick=\"" + ToolbarJS + ToolbarEmoticonJS + "'http://static4.orkut.com/img/" + IsSmilyey + "i_wink.gif';\" style='background-image: url(http://static4.orkut.com/img/" + IsSmilyey + "i_wink.gif); background-repeat: no-repeat; background-position: left; padding-left: 20px;'>;)</option>" +
                            "<option href='http://static4.orkut.com/img/" + IsSmilyey + "i_bigsmile.gif' onclick=\"" + ToolbarJS + ToolbarEmoticonJS + "'http://static4.orkut.com/img/" + IsSmilyey + "i_bigsmile.gif';\" style='background-image: url(http://static4.orkut.com/img/" + IsSmilyey + "i_bigsmile.gif); background-repeat: no-repeat; background-position: left; padding-left: 20px;'>:D</option>" +
                            "<option href='http://static4.orkut.com/img/" + IsSmilyey + "i_funny.gif' onclick=\"" + ToolbarJS + ToolbarEmoticonJS + "'http://static4.orkut.com/img/" + IsSmilyey + "i_funny.gif';\" style='background-image: url(http://static4.orkut.com/img/" + IsSmilyey + "i_funny.gif); background-repeat: no-repeat; background-position: left; padding-left: 20px;'>:P</option>" +
                            "<option href='http://static4.orkut.com/img/" + IsSmilyey + "i_confuse.gif' onclick=\"" + ToolbarJS + ToolbarEmoticonJS + "'http://static4.orkut.com/img/" + IsSmilyey + "i_confuse.gif';\" style='background-image: url(http://static4.orkut.com/img/" + IsSmilyey + "i_confuse.gif); background-repeat: no-repeat; background-position: left; padding-left: 20px;'>/)</option>" +
                            "<option href='http://static4.orkut.com/img/" + IsSmilyey + "i_cool.gif' onclick=\"" + ToolbarJS + ToolbarEmoticonJS + "'http://static4.orkut.com/img/" + IsSmilyey + "i_cool.gif';\" style='background-image: url(http://static4.orkut.com/img/" + IsSmilyey + "i_cool.gif); background-repeat: no-repeat; background-position: left; padding-left: 20px;'>8)</option>" +
                            "<option href='http://static4.orkut.com/img/" + IsSmilyey + "i_surprise.gif' onclick=\"" + ToolbarJS + ToolbarEmoticonJS + "'http://static4.orkut.com/img/" + IsSmilyey + "i_surprise.gif';\" style='background-image: url(http://static4.orkut.com/img/" + IsSmilyey + "i_surprise.gif); background-repeat: no-repeat; background-position: left; padding-left: 20px;'>:o</option>" +
                            "<option href='http://static4.orkut.com/img/" + IsSmilyey + "i_sad.gif' onclick=\"" + ToolbarJS + ToolbarEmoticonJS + "'http://static4.orkut.com/img/" + IsSmilyey + "i_sad.gif';\" style='background-image: url(http://static4.orkut.com/img/" + IsSmilyey + "i_sad.gif); background-repeat: no-repeat; background-position: left; padding-left: 20px;'>:(</option>" +
                            "<option href='http://static4.orkut.com/img/" + IsSmilyey + "i_angry.gif' onclick=\"" + ToolbarJS + ToolbarEmoticonJS + "'http://static4.orkut.com/img/" + IsSmilyey + "i_angry.gif';\" style='background-image: url(http://static4.orkut.com/img/" + IsSmilyey + "i_angry.gif); background-repeat: no-repeat; background-position: left; padding-left: 20px;'>:x</option>" +
                            "</select>",
                            "{|}",
                            "{|}",
                            "false",
                            "true"
                            ),
                    new Array /* Emoticons 2 */
                    (
                            "<img alt=':D' src='http://static4.orkut.com/img/i_bigsmile.gif' class='Emoticon Icon' title='" + Language.ToolbarEmoticons + "' name='OMToolbarEmoticon2' value=':)' onclick=\"" + ToolbarJS + ToolbarEmoticonJS3 + "\" /> " +
                            "<select name='OMToolbarEmoticonSelect2' class='EmoticonSelect'>" +
                            "<option href='http://static4.orkut.com/img/i_bigsmile.gif' disabled selected value='xD'>Emoticons</option>" +
                            "</select>",
                            "{|}",
                            "",
                            "false",
                            "true"
                            ),
                    new Array /* Separator */
                    (
                            Separator,
                            "{|}",
                            ""
                            ),
                    new Array /* Fonts */
                    (
                            "<span alt='Arial' title='" + Language.ToolbarFont + "' class='Font Icon' onclick=\"" + ToolbarJS + ToolbarFontJSIconClick + "\">&nbsp;</span> " +
                            "<select name='OMToolbarFontIcon' class='FontSelect' value='Arial'>" +
                            "<option disabled selected value='Arial'>" + Language.Fonts + "</option>" +
                            fonts +
                            "</select>",
                            "{|}",
                            "",
                            "false",
                            "true"
                            ),
                    new Array /* Font Size */
                    (
                            "<span alt='11' title='" + Language.ToolbarFontSize + "' class='FontSize Icon' onclick=\"" + ToolbarJS + ToolbarFontSizeJSIconClick + "\">&nbsp;</span> " +
                            "<select name='OMToolbarFontSizeIcon' class='FontSizeSelect'>" +
                            "<option style='font-size:0px;' >0</option>" +
                            "<option style='font-size:6px;' >6</option>" +
                            "<option style='font-size:8px;' >8</option>" +
                            "<option style='font-size:10px;' >10</option>" +
                            "<option style='font-size:11px;'  selected>11</option>" +
                            "<option style='font-size:12px;' >12</option>" +
                            "<option style='font-size:14px;' >14</option>" +
                            "<option style='font-size:16px;' >16</option>" +
                            "<option style='font-size:18px;' >18</option>" +
                            "<option style='font-size:20px;' >20</option>" +
                            "<option style='font-size:22px;' >22</option>" +
                            "<option style='font-size:26px;' >26</option>" +
                            "<option style='font-size:30px;' >30</option>" +
                            "<option style='font-size:36px;' >36</option>" +
                            "</select>",
                            "{|}",
                            "",
                            "false",
                            "true"
                            ),
                    new Array /* Font Grow */
                    (
                            "<div style='float: left; width: 2px;'>&nbsp;</div>" +
                            "<span title='" + Language.ToolbarFontG + "' class='FontGrow Icon'>&nbsp;</span>",
                            "<big>{|}</big>",
                            ""
                            ),
                    new Array /* Font Shrink */
                    (
                            "<span title='" + Language.ToolbarFontS + "' class='FontShrink Icon'>&nbsp;</span>",
                            "<small>{|}</small>",
                            ""
                            ),
                    new Array /* sub */
                    (
                            "<span class='OmSub' title='Sub'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>",
                            "<sub>{|}</sub>",
                            "",
                            "true"									// false	 = 	tell not to use codes, use button script
                            ),
                    new Array /*sup */
                    (
                            "<span class='OmSup' title='Sup'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>",
                            "<sup>{|}</sup>",
                            "",
                            "true"
                            ),
                    new Array /* MOuse Hover */
                    (
                            "<span class='MouseOver' title='MouseOver'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>",
                            "<span title=\\'{|}\\'>Passe o mouse e espere</span>",
                            "",
                            "true"
                            ),
                    new Array /* UpFoto */
                    (
                            "<span id='OMUpFoto' class='OMUpFoto' title='UpfotoPicasa'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>",
                            " ",
                            " ",
                            "true"
                            ),
                    new Array /* Goo.gl */
                    (
                            "<span id='OMUrlShorten' class='OMUrlShorten' title='UrlShorten'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>",
                            " ",
                            " ",
                            "true"
                            )
                    ),
            Create: function(Id, Mode, window, rejectSetup)
            {
                // 1- HTML   2/0- Normal
                if (!Id)
                    Id = "messageBody";
                if (Mode == 0)
                    Mode = 2;
                if (Mode != 1 && Mode != 2)
                    Mode = 1;

                var el = window.document.getElementById(Id);
                if (!el)
                    return;
                el.style.width = "100%";
                el.parentNode.style.width = "99%";

                var b, e, s, sel;
                if (OMSystem.OrkutManager.Util.Window.IsPage("/Scrapbook", window))
                {
                    n = '';
                    b = (Mode == 1) ? User.SHColorB : User.SColorB;
                    e = (Mode == 1) ? User.SHColorE : User.SColorE;
                    s = (Mode == 1) ? User.SHSignature : User.SSignature;
                }
                else
                {
                    n = '';
                    n = (Mode == 1) ? User.omNameShadow : '';
                    if (n.length > 2) {
                        n += "\n";
                    }
                    b = (Mode == 1) ? User.HColorB : User.ColorB;
                    e = (Mode == 1) ? User.HColorE : User.ColorE;
                    s = (Mode == 1) ? User.HSignature : User.Signature;

                    sel = el.value.length + b.length;
                }

                try {
                    cmm = window.location.href.match(/cmm=(\d+)/)[1];
                    tid = window.location.href.match(/tid=(\d+)/)[1];
                } catch (ex) {
                    cmm = 0;
                    tid = 0;
                }

                if (tid != "5539170806300943845" && tid != "5490085033684148933") {
                    // setup & focus
                    if (!rejectSetup)
                    {
                        el.value += n;
                        el.value += b;
                        sel = el.value.length;
                        el.value += e;
                        el.value += (s != "" ? ("\n\n" + s) : "");
                    }

                }
                if (!el.id.match(/scrapText_\d+/) && !rejectSetup)
                {
                    try
                    {
                        el.selectionStart = el.selectionEnd = sel;
                        el.focus();
                    }
                    catch (ex) {
                    }
                }

                var items = "";
                toolsLength = this.Tools.length;
                for (i = 0; i < toolsLength; ++i)
                {
                    var ToolAuto = true;
                    if (this.Tools[i][Mode].length == 0)
                        continue;
                    if (this.Tools[i].length > 3)
                        ToolAuto = (this.Tools[i][3] != "false");
                    var extra = (this.Tools[i].length > 4 && this.Tools[i][4] == "true") ? "float:left;border: 1px solid silver;width:auto;margin: 0px 2px" : "";
                    items += "<span style='vertical-align:middle; " + extra + "' onmouseover=\"this.title= this.firstChild.title!='' ? this.firstChild.title : 'OMToolbar';\" ";
                    items +=
                            "onclick=\"" + "var TextArea = document.getElementById('" + Id + "'); "
                            + "var TextSelected = TextArea.value.substr((TextArea.selectionStart), (TextArea.selectionEnd - TextArea.selectionStart));";

                    if (ToolAuto)
                        items += "TextArea.value = TextArea.value.substr(0, TextArea.selectionStart) + '" +
                                this.Tools[i][Mode] +
                                "' + TextArea.value.substr(TextArea.selectionEnd); var focus = TextArea.value.lastIndexOf('{|}');" +
                                "TextArea.value = TextArea.value.replace('{|}', TextSelected);" +
                                "TextArea.selectionStart = focus; TextArea.selectionEnd = focus + TextSelected.length;" +
                                "TextArea.focus(); TextArea.scrollTop = (14 * TextArea.value.substr(0, TextArea.selectionStart).match(/\\n/g).length); ";
                    items += "\">" + (this.Tools[i][0]) + "</span> ";
                }
                var Sep = window.document.createElement("div");
                Sep.style.lineHeight = "5px";
                var Bar = window.document.createElement("div");
                Bar.id = "OMToolBar" + Id;
                Bar.className = "OMToolbar";
                Bar.innerHTML = items;
                window.document.getElementById(Id).parentNode.insertBefore(Sep, window.document.getElementById(Id));
                window.document.getElementById(Id).parentNode.insertBefore(Bar, Sep);

                $(".OMToolbar .Icon").not(".invisibletag").not(".ttTag").not(".hrTag").not(".Color").not(".Emoticon").not(".TabIcon").css("background-image", 'url(' + chrome.extension.getURL('img/toolbar.png') + ')');
                window.document.getElementById('OMUrlShorten').addEventListener('click', function() {
                    var Url = prompt("Url:", "");
                    if (Url.length > 1) {
                        OMSystem.OrkutManager.Util.OMUtil.ShortenUrl(Url, window);
                    }
                }, true);

                $("span.TabIcon", el.parentNode).click(function() {
                    omSetSelectedTextFormat("\t" + "{|}", post);
                });
                $("#" + Id + "", window.document).keydown(function(e) {
                    if (e.keyCode == 9) {
                        var check = localStorage["enableTabTextArea"];
                        check = JSON.parse(check);
                        if (check) {
                            omSetSelectedTextFormat("\t" + "{|}", post);
                            return false;
                        }
                    } else if (e.altKey && e.keyCode == 78) {
                        omSetSelectedTextFormat("[b]{|}[/b]", post);
                    } else if (e.altKey && e.keyCode == 73) {
                        omSetSelectedTextFormat("[i]{|}[/i]", post);
                    } else if (e.altKey && e.keyCode == 83) {
                        omSetSelectedTextFormat("[u]{|}[/u]", post);
                        return false;
                    }
                });

                window.document.getElementById('OMUpFoto').addEventListener('click', function() {
                    try {
                        var upFotoDiv = window.document.getElementById('OMupFotoDiv');
                        upFotoDiv.parentNode.removeChild(upFotoDiv);
                    } catch (ex) {
                    }
                    var parentNode = $('#OMUpFoto').parent().offset();
                    var uploadDiv = OMSystem.OrkutManager.Util.Orkut.GetPanel(window, "<center><b>OM Upfoto <img src='http://static4.orkut.com/img/castro/i_x.png' style='float: right; cursor: pointer' alt='close' title='close' onclick = 'var u =  window.document.getElementById(\"OMupFotoDiv\"); u.parentNode.removeChild(u);'></b></center>", "");

                    uploadDiv.id = "OMupFotoDiv";
                    uploadDiv.style.top = parentNode.top;
                    uploadDiv.style.left = parentNode.left + 200;
                    uploadDiv.style.width = "350px";
                    var PanelContent = uploadDiv.getElementsByClassName("omboxmidlrg")[0];
                    PanelContent.innerHTML = "<center class='listlight'> \n\
                                            <form id='file_upload_form' method='post' target='upload_target'  enctype='multipart/form-data' action='http://www.orkutmanager.net/upfoto/upload?script=true'>\n\
                                            <input name='ishtml' type='hidden' value='" + Mode + " '/> \n\
                                            <br />\n\
                                            <small>Link web:</small>\n\
                                            <input class='omupfoto_input' name='Link' type='text' id='web_link' /> \n\
                                            <br />Ou\n\
                                            <br />\n\
                                            <small>Upload PC:</small> <input name='File' class='omupfoto_input' type='file' id='upload_pc' />\n\
                                            <br />\n\
                                            <br />\n\
                                            <iframe id='upload_target' name='upload_target' src='' style='width:0;height:0;border:0px solid #fff;'></iframe>\n\
                                            <input class='omupfoto_input' type='submit' id='submit_omupfoto'></center>";
                    window.document.body.appendChild(uploadDiv);
                }, true);

                function omSetSelectedTextFormat(val, post) {
                    var psel = post.value.substr((post.selectionStart), (post.selectionEnd - post.selectionStart));
                    var s, e;
                    s = post.selectionStart;
                    e = post.selectionEnd;
                    post.value = post.value.substr(0, s) + (val.replace('{|}', psel)) + post.value.substr(e);
                    post.selectionStart = (s + val.lastIndexOf('{|}'));
                    post.selectionEnd = post.selectionStart + (psel.length);
                    post.focus();
                    try {
                        post.scrollTop = (14 * post.value.substr(0, post.selectionStart).match(/\\n/g).length);
                    } catch (ex) {
                    }
                }
                var post = document.getElementById(Id);

                var modId = OMSystem.OrkutManager.Util.OMUtil.GetModTopic(cmm);
                if (cmm == "90840394" && tid == "5539170806300943845" || tid == "5490085033684148933" && !modId) {
                    var orkutVer;
                    try {
                        if (window.document.getElementsByClassName("logo").length == 1) {
                            orkutVer = "velho";
                        } else {
                            orkutVer = "novo";
                        }
                    } catch (e) {
                    }
                    var current = "1.2.8";
                    var space = String.fromCharCode(160);
                    Text = "";
                    if (tid == "5539170806300943845") {
                        Text = Text + "[b]- Versão do OM:[/b] " + current;
                        Text = Text + space + "\n[b]- Navegador (Firefox/Google Chrome/Opera):[/b] Google Chrome";
                        Text = Text + space + "\n[b]- Versão do Orkut:[/b] " + orkutVer;
                        Text = Text + space + "\n[b]- Versão do Navegador: [/b] {|}";
                        Text = Text + space + "\n[b]- Se aplicavel a(s) página(s) em que ocorrem :[/b]";
                        Text = Text + space + "\n[b]- Descrição do erro:[/b]";
                        Text = Text + space + "\n[b]- Imagem do erro (opcional):[/b]";
                    } else {
                        Text = Text + "{|}\n\n\n[gray]Navegador: Google Chrome, versão do OM:" + current + ", versão do Orkut: " + orkutVer + ".[/gray]";
                    }
                    omSetSelectedTextFormat(Text, post);
                }

                var setEmoticons = true;
                try {
                    var Emotes = JSON.parse(localStorage["EmoticonsList"]);
                    if (Emotes[0]) {
                        EmotesLength = Emotes.length;
                        var New = {};
                        for (i = 0; i < EmotesLength; i++)
                        {
                            Emote = Emotes[i].split("|");
                            New[Emote[0]] = Emote[1];
                        }
                        localStorage["EmoticonsList"] = JSON.stringify(New);
                        setEmoticons = false;
                    }
                } catch (ex) {
                }

                var Emote;
                var EList = "";
                var Emotes = JSON.parse(OMSystem.OrkutManager.PrefManager.Get("EmoticonsList", ""));
                for (x in Emotes)
                {
                    EList = EList + '<option href="' + unescape(Emotes[x]) + '" style="background-image: url(' + unescape(Emotes[x]) + '); background-repeat: no-repeat; background-position: left; padding-left: 20px;">' + unescape(x) + '</option>';
                }

                $("select[name='OMToolbarEmoticonSelect2']").append(EList);

                $("select.EmoticonSelect").sb({
                    optionFormat: function() {
                        return "<span style='width: 20px; height: 20px;background: url(\"" + $(this).attr('href') + "\") no-repeat left center'></span><span style='width:35px;float: right;'>" + $(this).val() + "</span>";
                    }
                });

                $("select[class=ShadowSelect]").sb({
                    optionFormat: function() {
                        return "<div style='text-shadow: " + $(this).css("text-shadow") + ";'><span style='background: " + $(this).attr('alt') + ";' class='select_color_item'></span> " + $(this).attr('alt') + "</div>";
                    },
                    fixedWidth: true
                });

                $(".ShadowSelect li .item .text div").click(function(e) {//Shadow select - HTML
                    $("span[name='shadowToolbar']").css("text-shadow", $(this).css("text-shadow"));
                    omSetSelectedTextFormat('<span style="text-shadow:' + $(this).css("text-shadow") + '">{|}</span>', post);
                    e.preventDefault();
                    e.stopPropagation();
                });
                $("span.FontSize.Icon").click(function() {//Font-size select - HTML
                    omSetSelectedTextFormat('<span style="font-size:' + $(this).attr("alt") + 'px">{|}</span>', post);
                });
                $("span.Font.Icon").click(function() {//Fonts select - HTML
                    omSetSelectedTextFormat('<span style="font-family:' + $(this).attr("alt") + '">{|}</span>', post);
                });
                $("select[name='OMToolbarEmoticonSelect'] option, select[name='OMToolbarEmoticonSelect2'] option").hover(function() {
                    $(this).parent().parent().find("img:eq(0)").attr("src", $(this).attr('href'));
                });

                $("select[name='OMToolbarFontIcon']").change(function() {//Fonts select - HTML
                    $("select[name='OMToolbarFontIcon'] option:selected:eq(0)").each(function() {
                        $("select[name='OMToolbarFontIcon']").css("font-family", $(this).val());
                        $("span.Font.Icon").attr("alt", $(this).val());
                        omSetSelectedTextFormat('<span style="font-family:' + $(this).val() + '">{|}</span>', post);
                    });
                });
                $("select[name='OMToolbarFontSizeIcon']").change(function() {//Font-size select - HTML
                    $("select[name='OMToolbarFontSizeIcon'] option:selected").each(function() {
                        $("span.FontSize.Icon").attr("alt", $(this).val());
                        omSetSelectedTextFormat('<span style="font-size:' + $(this).val() + 'px">{|}</span>', post);
                    });
                });
                $(".HighlightSelect").change(function() {//HighLight select - HTML
                    $(".HighlightSelect option:selected").each(function() {
                        $(".HighlightSelect option:eq(0)").attr("selected", "true");
                        $("span[name='OMToolbarHightlight']").css("background-color", $(this).css("background-color"));
                        omSetSelectedTextFormat('<span style="background-color:' + $(this).css("background-color") + '">{|}</span>', post);
                    });
                });
                $("select[name='OMToolbarEmoticonSelect']").change(function(el) { //Emoticon select - NOHTML
                    $("select[name='OMToolbarEmoticonSelect'] option:selected").each(function() {
                        $("select[name='OMToolbarEmoticonSelect'] option:eq(0)").attr("selected", "true");
                        $("img[name='OMToolbarEmoticon']").attr("src", $(this).attr("href"));
                        $("img[name='OMToolbarEmoticon']").attr("value", $(this).val());
                        omSetSelectedTextFormat('[' + ($(this).val()) + ']{|}', post);
                    });
                });

                $("select[name='CharSelect']").change(function() { //Char select
                    $("select[name='CharSelect'] option:selected").each(function() {
                        $("select[name='CharSelect'] option:eq(0)").attr("selected", "true");
                        $("#omToolbarCharSelect").text($(this).val());
                        omSetSelectedTextFormat($(this).val().replace(/(^\s*)|(\s*$)/ig, "") + '{|}', post);
                    });
                });

                $("#omToolbarCharSelect").click(function() {
                    omSetSelectedTextFormat(($(this).text()) + '{|}', post);
                });

                $("select[name='OMToolbarEmoticonSelect2']").change(function() { //Emoticon select - NOHTML
                    $("select[name='OMToolbarEmoticonSelect2'] option:selected").each(function() {
                        $("select[name='OMToolbarEmoticonSelect2'] option:eq(0)").attr("selected", "true");
                        $("img[name='OMToolbarEmoticon2']").attr("src", $(this).attr("href"));
                        $("img[name='OMToolbarEmoticon2']").attr("value", $(this).val());
                        omSetSelectedTextFormat('<img src="' + $(this).attr("href") + '" alt="' + ($(this).val()) + '"/> {|}', post);
                    });
                });
                $(".ColorSelect:eq(0)").change(function() { //Color select - HTML and NOHTML
                    $(".ColorSelect:eq(0) option:selected").each(function() {
                        $("span.Color.Icon").attr("alt", $(this).attr("alt")).css("backgroundColor", $(this).attr("alt"));
                        omSetSelectedTextFormat('[' + $(this).attr("alt") + ']{|}[/' + $(this).attr("alt") + ']', post);
                        $(".ColorSelect:eq(0) option:eq(0)").attr("selected", "true");
                    });
                });
                $("span.Color.Icon").click(function() {
                    omSetSelectedTextFormat('[' + $(this).attr("alt") + ']{|}[/' + $(this).attr("alt") + ']', post);
                });
            }
        };

        ToolbarFontJS = undefined;
        ToolbarFontSizeJS = undefined;
        ToolbarHighlightJS = undefined;
        ToolbarColorHTJS = undefined;
        ToolbarColorJS = undefined;
        ToolbarEmoticonJS = undefined;
        ToolbarNewLine = undefined;
        ToolbarJS = undefined;


        return Toolbar;
    }
};

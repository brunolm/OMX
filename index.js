// ==UserScript==
// @name           Orkut Manager
// @namespace      std
// @description    Manage Orkut
// @include        http://www.orkut.com*
// ==/UserScript==

/*
 * @author Bruno Leonardo Michels
 * @profile http://www.orkut.com/Profile.aspx?uid=11584069900845257050
 */

var colors =
    new Array
    (
        "navy"/* 0 */,
        "aqua"/* 1 */, "blue"/* 2 */, "fuchsia"/* 3 */, "gold"/* 4 */ , "gray"/* 5 */,
        "green"/* 6 */, "lime"/* 7 */, "maroon"/* 8 */, "navy"/* 9 */, "olive"/* 10 */,
        "orange"/* 11 */, "pink"/* 12 */, "purple"/* 13 */, "red"/* 14 */, "silver"/* 15 */,
        "teal"/* 16 */, "violet"/* 17 */, "yellow"/* 18 */
    );

var i;
var x;
/* VARS:: Quote */
var quoteB = "[navy][i]";
var quoteE = "[/i][/navy]";
var headerB = "[navy][i]";
var headerE = "[/i][/navy]";

var htmlQuoteB = "<div style='background: #FFFFFF; border: 1px #777777 solid; color: black; font-size: 90%; margin-left: 20px; margin-right: 20px; padding: 1px 3px 1px 3px'>";
var htmlQuoteE = "</div>";
var htmlHeaderB = "<div style='font-size: 75%'>Quote (";
var htmlHeaderE = ")</div>";

var buttonColor = "#C40098";
var quotedMessage = "$USER$ @ ";
var lightMode = true;
/* /VARS:: Quote */

/* VARS:: TextAreas default color */
var msgB = "[b]";
var msgE = "[/b]";

var htmlB = "<b>";
var htmlE = "</b>";

var htmlAccept =
    new Array
    (
        "1443557"
    );
/* /VARS:: TextAreas */

/* VARS:: Signature */
var newLine = isHTMLEnabled() ? "\n<br />" : "\n";
var signature = "";
var htmlSignature = "";
/* /VARS:: Signature */


/**
 * Edit false and/or true
 * if HTML ?    false   :   true
 * if HTML ? USE HEADER : DONT USE
 */
lightMode = (isHTMLEnabled() ? false : true);

/////////////// APP ///////////////

function isHTMLEnabled()
{
    var x;
    x = window.location.href;
    x = x.match(/cmm=(\d+)/);
    if (!x) return false;
    x = x[1];
    return (htmlAccept.indexOf(x) != -1 ? true : false);
}

// Validate HTML, re-set messages
msgB = (isHTMLEnabled() ? htmlB : msgB);
msgE = (isHTMLEnabled() ? htmlE : msgE);

quoteB = (isHTMLEnabled() ? htmlQuoteB : quoteB);
quoteE = (isHTMLEnabled() ? htmlQuoteE : quoteE);
headerB = (isHTMLEnabled() ? htmlHeaderB : headerB);
headerE = (isHTMLEnabled() ? htmlHeaderE : headerE);

signature = (isHTMLEnabled() ? htmlSignature : signature);

// Focus length
focusLength = msgE.length + signature.length;

function getXPATH(path) {
    return document.evaluate(
        path,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    ).singleNodeValue;
}

var botPath = "/html/body/div[6]/div[3]/table/tbody/tr[2]/td/div[$]/div";
var quotePath = "/html/body/div[6]/div[3]/table/tbody/tr[2]/td/div[$]/div[2]";
var postPath = '//*[@id="messageBody"]';
var usernamePath = "/html/body/div[6]/div[3]/table/tbody/tr[2]/td/div[$]/h3/a";

var trimPattern = /^\s+|\s+$/g;
var argPattern = /\S+\?/;

var getter = "##@quote##";

var postURL = "http://www.orkut.com/CommMsgPost.aspx?";
var msgURL  = "http://www.orkut.com/CommMsgs";

// page of messages
if (window.location.href.indexOf(msgURL) > -1)
{
    var args = window.location.href.replace(argPattern, "").split("&");
    var cmm = args[0];
    var tid = args[1];

    var i = 3;
    var msg = "";
    while ((msg = getXPATH(quotePath.replace("$", i))))
    {
		// @ time content
		var stime = getXPATH(botPath.replace("$", i)).textContent;
		stime = stime.replace(/(.*?)(\s{5,}\w+.*?)/, "$1")
		stime = stime.replace(/\n/g, " ");
		stime = stime.replace(trimPattern, "");

		// @ time + message
		var fmsg = msg.innerHTML;
		fmsg = fmsg.replace(/<br(.*?)>/ig, "\n");
		fmsg = fmsg.replace(/<.*?>/ig, "");
        var sendMsg = stime + "TIME" + fmsg;
        sendMsg = sendMsg.replace(trimPattern, "");

		// get username
        var user = getXPATH(usernamePath.replace("$", i)).textContent;
        user = user.replace(trimPattern, "");

		// User @ Time
        sendMsg = quotedMessage.replace("$USER$", user) + sendMsg;
        if (sendMsg.length > 1800)
            sendMsg = sendMsg.substr(0, 1800) + " [...]";
        sendMsg = escape(sendMsg);

		// location to insert a new button
        var bot = getXPATH(botPath.replace("$", i));
		var button = '<span class="grabtn" onclick="self.location=\'' + postURL + cmm + '&' + tid + getter + sendMsg + '\';" style="cursor: pointer;">' +
				'<a class="btn" onclick="self.location=\'' + postURL + cmm + '&' + tid + getter + sendMsg + '\';" style="cursor: pointer;" href="javascript:void(0);">quote</a>' +
				'</span>' +
				'<span class="btnboxr">' +
				'<img width="5" height="1" alt="" src="http://img1.orkut.com/img/b.gif"/>' +
				'</span>';
		bot.innerHTML = bot.innerHTML + button;
        i += 2;
    }
}
else
{
var post = getXPATH(postPath);
// new post page
    if (window.location.href.indexOf(getter) > -1)
    {
        /* [[Quote]] */
        var newLines = (isHTMLEnabled() ? "\n<br />\n" : "\n\n");
        var newLinesHeader = (isHTMLEnabled() ? "\n" : "\n");
        if (post)
        {
            var quote = unescape(window.location.href.replace(/\S+##@quote##/, ""));
			var aquote = quote;
            var header = "";
			var x;
            x = quote.indexOf("TIME");
            header = headerB + quote.substr(0, x) + headerE;
            quote = quote.substr(x + 4);
            quote = quote.replace(trimPattern, "");
            header += newLinesHeader;
            if (lightMode) header = "";
            if (!post.value)
            {
                post.value = header +
                    quoteB + quote + quoteE +
                    newLines;
                post.focus();
            }
        /* [[/Quote]] */
    
        }
    }
    
    /* [[TextArea Colorizer]] */
    var textarea = document.getElementsByTagName("textarea");
    for (i = 0; i < textarea.length; ++i)
    {
        textarea[i].focus();
        if (textarea[i].value.indexOf(msgB) == -1 ||
            textarea[i].value.indexOf(msgE) == -1)
        textarea[i].value += msgB + msgE;
    }
    if (i > 0)
    {
        if (post != textarea[0])
        {
            x = 0;
            textarea[x].focus();
            textarea[x].selectionStart =
                textarea[x].selectionEnd = textarea[x].value.length - focusLength;
        }
    }

    /* [[/TextArea Colorizer]] */
    
    if (i > 0)
    {
        var msgText;

        post = textarea[0];
        /* [[Signature]] */
        if (post.value.indexOf(signature) == -1)
        {
            post.value += signature;
        }
        /* [[/Signature]] */
        
        /* FOCUS */
        post.focus();
        post.selectionStart =
            post.selectionEnd = post.value.length - focusLength;
    }
    
}
pref = function(key, value){
    if(typeof(localStorage[key])=="undefined"){
        if(typeof(value)=="boolean")
            localStorage[key] = JSON.stringify(value);
        else
            localStorage[key] = value;
    }
}

pref("oldOrkut", 'ForceOld');
pref("omOLDemoticons", false);
pref("MemberApprove.Show", false);
pref("MassUnjoin.Show", false);
pref("Language", "pt-BR");
pref("OrkutSize", "0");
pref("TimeFormat", "%H:%i:%s %Y-%m-%d");
pref("Update.Communities", false);
pref("Update.Topics", false);
pref("Update.Delay", 30);

pref("Bookmarks", '["90840394|Orkut%20Manager"]');
pref("Bookmarks.Topic", '["90840394~5348193113558541788|Orkut%20Manager~%5BFIXO%5D%20Sandbox", "90840394~5478591971370655818|Orkut%20Manager~%5BFIXO%5D%20Sugest%F5es", "90840394~5523525189629388261|Orkut%20Manager~%5BFIXO%5D%20Chat", "90840394~5490085033684148933|Orkut%20Manager~%5BFIXO%5D%20D%FAvidas"]');

pref("NameShadow", "");
pref("ColorB", "");
pref("ColorE", "");

pref("HColorB", "");
pref("HColorE", "");

pref("SColorB", "");
pref("SColorE", "");
pref("SHColorB", "");
pref("SHColorE", "");

pref("Signature", "");
pref("HSignature", '');
pref("SSignature", "");
pref("SHSignature", '');

pref("QuoteText", "$USER$ @ $TIME$");
pref("QuoteTextHtml", '$USER$ @ $TIME$');

pref("QuoteHeaderB", "[b]Quote([/b][navy]");
pref("QuoteHeaderE", "[/navy][b])[/b]");

pref("QuoteMessageB", "[blue][i]");
pref("QuoteMessageE", "[/i][/blue]");

pref("HQuoteHeaderB", '<div style="padding:2px 5px;background:#87CEFA;font-size:75%;margin-top:4px">Quote (');
pref("HQuoteHeaderE", ")</div>");

pref("HQuoteMessageB", '<div style="border:2px solid #87CEFA;padding:2px 3px;background:#C8E1FF;font-size:90%">');
pref("HQuoteMessageE", "<div align='right'>[link=/Community?cmm=90840394]Orkut Manager[/link]</div></div>");

pref("ModerationOnModDelete", true);
pref("ModerationOnModDeleteConfirm", true);
pref("ModerationOnModUserManage", false);
pref("ModerationOnDeleteModPost", true);
pref("ModerationOnModModConfirm", true);
pref("ModerationT", "[b]Topic/Poll:[/b] $TITLE$\n[b]User:[/b] [red]$USER$[/red] ([blue]$USERLINK$[/blue])\n[b]Message:[/b] $MESSAGE$\n[b]Action:[/b] \n[b]Reason:[/b]\n[b]Hour:[/b] $CURRENTDATE$ \n\n[gray]$RAND$[/gray]");
pref("HModerationT", "<b>Topic/Poll:</b> $TITLE$\n<b>User:</b> <font color=red>$USER$</font> (<font color=blue>$USERLINK$</font>)\n<b>Message:</b> $MESSAGE$\n<b>Action:</b> \n<b>Reason:</b>\n<b>Hour:</b> $CURRENTDATE$ <br /><br />[gray]$RAND$[/gray]");

pref("ModerationU", "[b]User: [/b] [red]$USER$[/red] ([blue]$USERLINK$[/blue])\n[b]Action:[/b] \n[b]Reason:[/b]\n[b]Hour:[/b] $CURRENTDATE$");
pref("HModerationU", "<b>User: </b>  <font color=red>$USER$</font> ( <font color=blue>$USERLINK$</font>)\n<b>Action:</b> \n<b>Reason:</b>\n<b>Hour:</b> $CURRENTDATE$ ");

pref("ModerationTopic", "[]");
pref("Chat", '[]');
pref("Quote", "[]");

pref("omNotifyEnable", false);
pref("omNotifyEnableSound", false);
pref("omNotifyInterval", "2");
pref("omNotifyEnableScrap", false);
pref("omNotifyEnableHome", false);
pref("omNotifyEnableTestemonials", false);
pref("omNotifyEnableTpcs", false);

pref("omEnableBookmarks", true);
pref("omEnableLast", true);
pref("omEnableForum", true);
pref("omEnableMenuHeader", false);
pref("omEnableMenuDD", false);
pref("omToolbarScrapBook", true);
pref("omToolbarEdit", true);
pref("omToolbarqReply", true);
pref("omToolbarPost", true);
pref("omEmailHide", true);
pref("omEnableMod", false);
pref("omEnableChat", false);
pref("omShowAds", true);
pref("omShowPromote", true);
                
pref("enablePreviewTopics", true);
pref("omPreviewClick", false);                
pref("omEnableClosePreview", true);
                
pref("EmoticonsList", '{":)": "http://static1.orkut.com/img/i_smile.gif",";)": "http://static3.orkut.com/img/i_wink.gif", ";x": "http://static2.orkut.com/img/i_angry.gif",":(": "http://static4.orkut.com/img/i_sad.gif","8)": "http://static4.orkut.com/img/i_cool.gif",":p": "http://static4.orkut.com/img/i_funny.gif",":o": "http://static1.orkut.com/img/i_surprise.gif","*a*": "http://lh3.ggpht.com/_QJuiOh91trE/TNhkUvRw33I/AAAAAAAAAeE/8pd9CoGOnhM/+-+.png",";)*": "http://lh6.ggpht.com/_d-qTEG150NM/TXLjYSHWeFI/AAAAAAAAFjA/F4CChKQCI5g/4d72e35d0d6df.gif",";B": "http://lh4.ggpht.com/_QJuiOh91trE/TNhkdKDLakI/AAAAAAAAAek/Kk70s7ye9uo/+B.gif",":c": "http://lh5.ggpht.com/_QJuiOh91trE/TNhkdfdzU9I/AAAAAAAAAeo/bITD54ego8g/+c.png","=[": "http://lh6.ggpht.com/_d-qTEG150NM/TXLmMw1UHcI/AAAAAAAAFjQ/L1HXxOvCTNk/4d72e63044530.png","=]": "http://lh4.ggpht.com/_d-qTEG150NM/TXLmaqgrU1I/AAAAAAAAFjU/WB-FF63m3Rc/4d72e666b6806.png","*o*": "http://lh3.ggpht.com/_QJuiOh91trE/TNhlEfSlpqI/AAAAAAAAAfA/VU9tz0JAy6A/+oo+.gif","--\'": "http://lh6.ggpht.com/_d-qTEG150NM/TXLnakWRpwI/AAAAAAAAFjg/6BaTi7AH5Vg/4d72e76559671.png","=d": "http://lh3.ggpht.com/_d-qTEG150NM/TXRUsN1GiRI/AAAAAAAAGYU/PN_84ymUC2E/4d7454ad2d4c0.gif","hmm": "http://lh3.google.com/_QJuiOh91trE/TNhqHHpyOkI/AAAAAAAAAk8/thtq7YvvLpU/hmm0.png","-K": "http://lh3.google.com/_RY-bdZyvsZo/TXZnhMeQAvI/AAAAAAAAALw/LUUFWwslvWU/shoray.png"}');
pref("FontList", '{"Arial": "Arial", "Arno Pro": "Arno Pro", "Old English Text MT": "Old English Text MT","Book Antiqua": "Book Antiqua","Bookman Old Style": "Bookman Old Style", "Calibri": "Calibri", "Comic Sans MS" : "Comic Sans MS", "Diablo": "Diablo", "Final Fantasy":"Final Fantasy", "MS Mincho" : "MS Mincho", "Ninja Naruto": "Ninja Naruto", "Sand": "Sand", "Tahoma": "Tahoma", "Times New Roman": "Times New Roman", "Verdana" : "Verdana"}');
pref("TagList", '[OFF]|[DUV]|[DOWN]|[HELP]|[DICA]|[TUTO]|[AJUDA]');
pref("CharList", '9835|9834|9788|8595|8594|8592|8593|8594|171|187|190|188|9829|12484|9608|9619|9658|9786|9618|9617|8224|8249|8250|8482|169');


pref("SignaturePosition", "3");

pref("enablePreviewTopics", false);
pref("omPreviewClick", false);
pref("omEnableClosePreview", false);
pref("omtweetButton", true);
pref("omMassDelete", true);
pref("omFixPost", true);
pref("ShortcutPost", "1");

pref("firstRun", true);

/* Change the notify interval, too much time*/
if(localStorage["omNotifyInterval"] == "15")
    localStorage["omNotifyInterval"] = "4";

//Emoticons compatibility module
try{
    var Emotes = JSON.parse(localStorage["EmoticonsList"]);
    if(Emotes[0]){
        EmotesLength = Emotes.length;
        var New = {};
        for (i=0;i<EmotesLength;i++)
        {   
            Emote = Emotes[i].split("|");
            New[Emote[0]] = Emote[1];
        }
        localStorage["EmoticonsList"] = JSON.stringify(New);            
    }
}catch(ex){}
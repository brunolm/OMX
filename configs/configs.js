$(function(){
    loadSettings = function(){
        for (k in localStorage){
            if(localStorage[k]==="false" || localStorage[k]==="true"){
                if(localStorage[k]==="true")
                    $("input[name='" + k + "']").attr("checked", true);
            }else{
                if(k!=="SignaturePosition" || k!=="ShortcutPost")
                    $("*[name='" + k + "']:not([type='radio'])").val(localStorage[k]);
            }
            if(k==="oldOrkut"){
                $("[name='oldOrkut'][value='" + localStorage[k] + "']").attr('checked', 'checked');
            }
            
            if(k==="SignaturePosition"){
                if(localStorage["SignaturePosition"]==="undefined"){
                    localStorage["SignaturePosition"] = "3";
                }
                $("input[name='" + k + "'][value='" + localStorage["SignaturePosition"] + "']").attr("checked", true);
            } else if(k==="ShortcutPost"){
                if(localStorage["ShortcutPost"]==="undefined"){
                    localStorage["ShortcutPost"] = "1";
                }                                
                $("input[name='" + k + "'][value='" + localStorage["ShortcutPost"] + "']").attr("checked", true);
            } else if(k==="EmoticonsList"){
                                
                var EmoteList = JSON.parse(localStorage["EmoticonsList"]);
                for (k in EmoteList){
                    $("#addRow").before('<div><label>Nome: </label><input type="text" name="emote_name" value="' + unescape(k) + '" size="8" /><label> Url: </label><input type="text" name="emote_value" value="' + unescape(EmoteList[k]) + '" size="50" /></div>');
                }
                $("#addRow").parent().find("div:eq(0)").before("<div>Lista (Mass Add Emoticons): <input size='65' type='text' id='MassEmoticonsInput'><br /><span id='MassEmoticonsButton'><span class='grabtn'><a class='btn' href='javascript:void(0);'>Adicionar</a></span><span class='btnboxr'><img width='5' height='1' alt='' src='http://static1.orkut.com/img/b.gif'></span></div><br /><div>Manter os antigos<input type='checkbox' value='1' id='keep_old' /></div><hr/><br />");
                $("#addRow").before('<div><label>Nome: </label><input type="text" name="emote_name" value="" size="8" /><label> Url: </label><input type="text" name="emote_value" value="" size="50" /></div>').before('<div><label>Nome: </label><input type="text" name="emote_name" value="" size="8" /><label> Url: </label><input type="text" name="emote_value" value="" size="50" /></div>');
            } else if(k==="FontList"){
                var FontList = JSON.parse(localStorage["FontList"]);
                for (k in FontList){
                    $("#addRowFont").before('<div><label>Nome: </label><input type="text" name="font_name" value="' + unescape(k) + '" size="8" /><label> Fonte: </label><input type="text" name="font_value" value="' + unescape(FontList[k]) + '" size="50" /></div>');
                }
                $("#addRowFont")
                .before('<div><label>Nome: </label><input type="text" name="font_name" value="" size="8" /><label> Fonte: </label><input type="text" name="font_value" value="" size="50" /></div>')
                .before('<div><label>Nome: </label><input type="text" name="font_name" value="" size="8" /><label> Fonte: </label><input type="text" name="font_value" value="" size="50" /></div>');
            } else if(k==="TagList"){
                var TagList = (localStorage["TagList"]).split('|');
                for (k in TagList){
                    $("#addRowTag").before('<div><label>Tag: </label><input type="text" name="tag_name" value="' + unescape(TagList[k]) + '" size="50" /></div>');
                }
                $("#addRowTag")
                .before('<div><label>Tag: </label><input type="text" name="tag_name" value="" size="8" /></div>')
                .before('<div><label>Tag: </label><input type="text" name="tag_name" value="" size="8" /></div>');
            } else if(k==="CharList"){    
                var CharsList = (localStorage["CharList"]).split('|');
                for (k in CharsList){
                    $("#addRowChar").before('<div><label>Caractere: </label><input type="text" name="char_txt" value="' + String.fromCharCode(CharsList[k]) + '" size="50" /></div>');
                }
                $("#addRowChar")
                .before('<div><label>Caractere: </label><input type="text" name="char_txt" value="" size="8" /></div>')
                .before('<div><label>Caractere: </label><input type="text" name="char_txt" value="" size="8" /></div>');                
            }else if(k=== "Language"){
                if(localStorage[k]==="pt-BR")
                    $("#LangPt").attr("checked", true);
                else
                    $("#LangEn").attr("checked", true);
            }
        }
    }
    loadPage = function(url){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){                            
            if (this.readyState === 4) {
                $("#settingscontainer").html(this.responseText);
                loadSettings();
            }
        };
        xhr.open("GET", chrome.extension.getURL("configs/" + url + ".html"), true);
        xhr.send();
    }

    try{
        var ajaxUrl = window.location.href.match(/v=(.+)/)[1];
        $(".sel").removeClass("sel");
        $("a[href='#v=" +ajaxUrl + "']").parent().addClass("sel");
    }catch(ex){
        var ajaxUrl = "geral";
    }
    //var url = window.open(chrome.extension.getURL("configs/" + ajaxUrl + ".html"));

    loadPage(ajaxUrl);
    $("ul.intabs a").click(function(){
        $(".sel").removeClass("sel");
        $(this).parent().addClass("sel");
        var u = $(this).attr("href");
        u = u.match(/v=(.+)/)[1];
        loadPage(u);
    });
    pref = function(a,b){
        localStorage[a] = b;
    }
    $("#resetSettings").click(function(){
        if(!confirm("Deseja resetar as configurações? \nObs.: TODAS elas serão resetadas para o padrão.")) return;
        window.localStorage.clear();
        $.getScript('bg/default.js');
        loadSettings();
        alert("Configurações resetadas");
    });

    $("#saveCell").click(function(){
        if($("input[name='emote_value']").length>1){
            var node = {};
            $("input[name='emote_value']").each(function(i){
                if(($("input[name='emote_value']").eq(i).val())==="") {
                    i--;
                }else{
                    node[$("input[name='emote_name']").eq(i).val()] =  $("input[name='emote_value']").eq(i).val();
                }
            });
            node = JSON.stringify(node);
            localStorage["EmoticonsList"] = node;
        }else if($("input[name='font_name']").length>1 || $("input[name='tag_name']").length>1){
            var node = {};
            $("input[name='font_value']").each(function(i){
                if(($("input[name='font_value']").eq(i).val())==="") {
                    i--;
                }else{
                    node[$("input[name='font_name']").eq(i).val()] =  $("input[name='font_value']").eq(i).val();
                }
            });
            node = JSON.stringify(node);
            localStorage["FontList"] = node;
            
            var node2 = new Array();
            $("input[name='tag_name']").each(function(i){
                if(($("input[name='tag_name']").eq(i).val())!="") {
                    node2[i] =  $("input[name='tag_name']").eq(i).val();
                }
            });
            node2 = (node2).join('|');
            localStorage["TagList"] = node2;
            
            var node3 = new Array();
            $("input[name='char_txt']").each(function(i){
                if(($("input[name='char_txt']").eq(i).val())!="") {
                    node3[i] =  ($("input[name='char_txt']").eq(i).val()).charCodeAt();
                }
            });
            node3 = (node3).join('|');
            localStorage["CharList"] = node3;            
        }else{
            $("input, textarea").each(function(){
                if($(this).attr("type")==="checkbox")
                    localStorage[$(this).attr("name")] = JSON.stringify($(this).attr("checked"));
                else if($(this).attr("type")==="radio"){
                    if($("#LangPt").attr("checked")===true){
                        localStorage[$(this).attr("name")] = "pt-BR";
                    }else{
                        localStorage[$(this).attr("name")] = "en-US";
                    }
                    localStorage["SignaturePosition"] = $("input[name='SignaturePosition']:checked").val();
                    if($("input[name='ShortcutPost']:checked").length)
                        localStorage["ShortcutPost"] = $("input[name='ShortcutPost']:checked").val();
                    
                    localStorage["oldOrkut"] =  $("[name='oldOrkut']:checked").val();
                }
                else
                    localStorage[$(this).attr("name")] = $(this).val();
                            
            });
        }
        alert("Configurações salvas");
    });

    $("#ImportSettings").click(function(){
        $("#ExportDiv").hide();
        $("#ImportDiv").show();
    })
    $("#ImportSettings2").click(function(){
        var list = $("#ImportTextarea").val();
        if(list){
            try{
                list = JSON.parse(list);
                for (var x in list){
                    localStorage[x] = list[x];
                }
                console.log(x);
                alert("Lista importada");
                loadSettings();
            }catch(ex){
                alert(ex);
                alert("Lista inválida");
            }
        }
    });
    $("#ExportSettings").click(function(){
        for (var x in localStorage)
            localStorage[x] = localStorage[x];
        $("#ExportDiv").show();
        $("#ImportDiv").hide();
        $("#ExportTextarea").val(JSON.stringify(localStorage));
        prompt("Copie o conteúdo abaixo e salve em um arquivo de texto em seu computador", JSON.stringify(localStorage));
    });
});

chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        if(request.type=="clear-itens"){
            for(i=0;i<request.Itens.length;i++){
                window.localStorage.removeItem(request.Itens[i]);
            }
        }else if(request.type=="transfer-itens"){
            var response = {}
            for (k in localStorage){
                response[k] = localStorage[k];
            }
            sendResponse(response);
        }else if(request.type=="transfer-item"){
            sendResponse(localStorage[request.Itens]);
        }else if(request.type=="shorten-url"){
            var response;
            var	xmlhttp = new XMLHttpRequest();
            xmlhttp.open("POST", "http://goo.gl/api/shorten?url=" + encodeURIComponent(request.Url), false);
            xmlhttp.setRequestHeader("X-Auth-Google-Url-Shortener", "true");
            xmlhttp.onload = function()
            {
                var object = JSON.parse(xmlhttp.responseText);

                if(object["short_url"] == undefined)
                    alert("Erro");
                else
                    prompt("Url:", object["short_url"]);
            }
            xmlhttp.send(null);
        }else if(request.type=="post"){
            for(i=0;i<request.Itens.length;i++){
                localStorage[request.Itens[i]] = request.Values[i]; 
            }
            sendResponse({s: "ok"});
        }
    });
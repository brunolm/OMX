try{
    if(!JSON.parse(localStorage["omNotifyEnable"])) throw "";

    get_pref = function(k,v){
        if(typeof(localStorage[k])){
            v = localStorage[k];
            if(v=="true" || v=="false")
                v = JSON.parse(v);
        }
        return v;
    }

    set_pref = function(k,v){
        if(typeof(v)=="boolean"){
            v = JSON.parse(v);
        }
        localStorage[k] = v;
    }

    Interval = function(){
        try{
            Inter = get_pref("omNotifyInterval", 2);
            Inter = parseFloat(Inter) * 60 * 1000;
            Inter = parseFloat(Inter) + Math.floor(Math.random()*10001);
        }catch(ex){
            Inter = 600000 + Math.floor(Math.random()*10001);
        }
        return Inter;
    }

    try{
        if(ScrapsInterVal)
            clearInterval(ScrapsInterVal);
        if(HomeInterval)
            clearInterval(HomeInterval)
        if(TopicsInterval)
            clearInterval(TopicsInterval)
    }catch(ex){}
    var langs = new Array();
    if(get_pref("Language", "pt-BR")=="pt-BR"){
        langs[0] = "Voce possui ";
        langs[1] = " novos scraps.";
        langs[2] = " lhe deixou um novo scrap.";
        langs[3] = " pedidos de amizade novos.";
        langs[4] = "Voce possui 1 pedido de amizade pendente";
        langs[5] = " lhe adicionou";
        langs[6] = " depoimentos pendentes.";
        langs[7] = "Voce possui 1 novo depoimento";
        langs[8] =  " lhe deixou um depoimento";
        langs[9] = " novas mensagens no topico ";
    }else{
        langs[0] = "You have ";
        langs[1] = " new scraps.";
        langs[2] = " left you a new scrap.";
        langs[3] = " open friends requests.";
        langs[4] = "You have one friend request";
        langs[5] = " added you";
        langs[6] = " pending testemonials.";
        langs[7] = "You have 1 new testemonial";
        langs[8] =  " left you a new testemonial";
        langs[9] = " new messages on the topic ";
    }
    
    
    sendNotify = function(msg, link){
        var notification = webkitNotifications.createHTMLNotification(
            'notification.html?&'+ btoa(link) +'&'+ btoa(msg)
            );
        if(get_pref("omNotifyEnableSound")){
            var audio = new Audio("newscrap.wav");
            audio.play();
        }
        setTimeout(function(){
            notification.show();
        }, 500);
        setTimeout(function(){
            notification.cancel();
        }, 30000);
    }
    
    Array.prototype.inArray = function (value)
    {
        var i;
        for (i=0; i < this.length; i++) {
            if (this[i] === value) {
                return true;
            }
        }
        return false;
    };
    
    try{
        if(!get_pref("omNotifyEnableScrap", false)) throw "";
        checkScrap = function(){
            var scraplist, display;
            try{
                scraplist = JSON.parse(get_pref("omNotifyScrapList", "{}"));
                display = true;
            }catch(ex){
                scraplist = new Array();
                display = false;
            }
            $.get("http://www.orkut.com.br/Scrapbook?pageSize=30", function(data){
                var y = 0;
                $("#mboxfull .editcheck", data).each(function(){
                    var value = $(this).val();
                    if(!scraplist.inArray(value))
                    {
                        y++;
                        scraplist.push(value);
                    }
                });

                if(y==0) display = false;
                if(display)
                {
                    chrome.browserAction.setIcon({
                        path: '/img/OM-Warn.png'
                    });                    
                    set_pref("has_new_scrap", true);                    
                    if(y>1){
                        sendNotify(langs[0] + y + langs[1], "http://orkut.com.br/Scrapbook");
                    }else{                        
                        var nome = $("#mboxfull .listitemchk:eq(0) .listimg:eq(0)", data).attr("title");
                        sendNotify(nome + langs[2], "http://orkut.com.br/Scrapbook");
                    }
                }          
                set_pref("omNotifyScrapList", JSON.stringify(scraplist));                
            }, "html");         
        }
        ScrapsInterVal = setInterval(checkScrap, Interval()); //Scrapbook
        setTimeout(checkScrap, Interval()/4);
        checkScrap();
    }catch(ex){
        console.log(ex);
    }
    
    //Check Home Page
    try{
        if(!get_pref("omNotifyEnableHome", false) && !get_pref("omNotifyEnableTestemonials", false)) throw "";
        checkHomePage = function(){
            $.get("http://www.orkut.com.br/Home", function(data){
                
                try{
                    if(!get_pref("omNotifyEnableHome", false)) throw "";  //Return Friends Check
                    var y = 0;                    
                    var friendlist, display_friends;
                    try{
                        friendlist = JSON.parse(get_pref("omFriendAddList", ""));
                        display_friends = true;
                    }catch(ex){
                        friendlist = new Array();
                        display_friends = false;
                    }                    
                    $("#mbox form", data).each(function(){
                        if((/friendRequestAction/i).test($(this).attr("id"))){
                            var uid = $(this).attr("id");
                            uid = uid.match(/\d+/)[0];
                            if(!friendlist.inArray(uid))
                            {
                                y++;
                                friendlist.push(uid);
                            }
                        }
                    });
                    if(y==0) display_friends = false;
                    if(display_friends)
                    {        
                        if(y>1)
                        {
                            console.log("Texto:" + langs[0] + y + langs[3]);                            
                            sendNotify(langs[0] + y + langs[3], "http://orkut.com.br/Home");
                        }else{
                            var text;
                            var nome_add = $("#mbox form .para:eq(0) a:eq(0)", data).text();                            
                            if(!nome_add)
                                text = langs[4];
                            else
                                text = nome_add + langs[5];
                            sendNotify(text, "http://orkut.com.br/Home");
                        }
                        set_pref("has_itens_in_home", true);
                        chrome.browserAction.setIcon({
                            path: '/img/OM-Warn.png'
                        });                        
                    }
                    set_pref("omFriendAddList", JSON.stringify(friendlist));  
                }catch(ex){
                    console.log(ex);
                }
                
                try{
                    if(!get_pref("omNotifyEnableTestemonials", false)) throw "";  //Return Testemonials Check
                    var testemonialList, display_testemonial;
                    try{
                        testemonialList = JSON.parse(get_pref("omTestemonialList", ""));
                        display_testemonial = true;
                    }catch(ex){
                        testemonialList = new Array();
                        display_testemonial = false;
                    }         
                    $("#mbox form", data).each(function(){
                        if((/acceptTestimonial/i).test($(this).attr("id"))){
                            if(y==0)
                                localStorage["nome_add"] = $(".para:eq(0) a:eq(0)", $(this).parent().parent()).text();
                            
                            var uid = $(this).attr("id");
                            uid = uid.match(/\d+/)[0];
                            if(!testemonialList.inArray(uid))
                            {
                                y++;
                                testemonialList.push(uid);
                            }
                        }
                    });
                    if(y==0) display_testemonial = false;
                    if(display_testemonial)
                    {                
                        if(y>1)
                        {
                            sendNotify(langs[0] + y + langs[6], "http://orkut.com.br/Home");
                        }else{
                            text = localStorage["nome_add"] + langs[8];
                            sendNotify(text, "http://orkut.com.br/Home");
                        }
                        set_pref("has_itens_in_home", true);
                        chrome.browserAction.setIcon({
                            path: '/img/OM-Warn.png'
                        });                            
                    }
                    set_pref("omTestemonialList", JSON.stringify(testemonialList));                    
                }catch(ex){
                    console.log(ex);
                }  
            }, "html");
        }        
        HomeInterval = setInterval(checkHomePage, Interval()); //Scrapbook
        setTimeout(checkHomePage, Interval()/4);
        checkHomePage();
    }catch(ex){
        console.log(ex);
    }
    
    try{
        if(!get_pref("omNotifyEnableTpcs", false)) throw "";
        checkTopics = function(Tpcs_list){
            console.log("Topics Called");            
            var MessagesRead, display,Tpcs;
            Tpcs = Tpcs_list.split("|");
            try{
                MessagesRead = get_pref("omNotifyTpc" + Tpcs[0] + Tpcs[1], "");
                display = true;
            }catch(ex){
                MessagesRead = -1;
                display = false;
            }

            $.get("http://www.orkut.com.br/CommMsgs?cmm=" + Tpcs[0] + "&tid=" + Tpcs[1] + "&na=2", function(response){
                console.log("CommMsgs Loaded");
                var total_posts = $("#mboxfull .rf:eq(0)", response).parent().find("b:eq(1)").text(); //Actual posts numbers
                total_posts = total_posts.replace(".", "").replace(",", "");
                set_pref("omNotifyTpc" + Tpcs[0] + Tpcs[1], total_posts);
                
                if(total_posts==MessagesRead) display = false;
                var x = 0;
                if(display && total_posts!=MessagesRead && MessagesRead!="")
                {
                    var ExtraInter = 0;
                    var Diff = total_posts-MessagesRead;
                    console.log(Diff);
                    if(x!=0) ExtraInter = 1000 * 8 * x;
                    if(Diff>0){
                        setTimeout(function(){
                            sendNotify(Diff + langs[9] + Tpcs[2], "http://www.orkut.com.br/CommMsgs?cmm=" + Tpcs[0] + "&tid=" + Tpcs[1] + "&na=2");
                        }, ExtraInter);
                    }
                    x++;
                }                
            });
        }
        FullCheckTpcs = function()
        {
            x=0;
            Tpcs_list = get_pref("omNotifyTpcsMarked", "");
            Tpcs_list = JSON.parse(Tpcs_list);
            Tpcs_list_l = Tpcs_list.length;
            for(var ii=0;ii<Tpcs_list_l;ii++)
            {
                checkTopics(Tpcs_list[ii]);
            }
        }
        TopicsInterval = setInterval(FullCheckTpcs, Interval()); //Scrapbook
        setTimeout(FullCheckTpcs, Interval()/4);
        FullCheckTpcs();
    }catch(ex){
        
    }
}catch(ex){
    console.log(ex);
}

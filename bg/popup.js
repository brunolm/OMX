closepopup = function() {
    window.close();
}
newtab = function(link) {
    chrome.tabs.create({url: link});
    setTimeout(closepopup, 150);
}

PrefSet = function(e, v) {
    if (typeof(v) == "boolean")
        v = JSON.stringify(v);

    window.localStorage.setItem(e, v);
}
PrefGet = function(e, d) {
    r = window.localStorage.getItem(e);
    if (!r) {
        r = d;
    }
    if (r == "false" || r == "true")
        r = JSON.parse(r);

    return r;
}

defaultbk = function() {
    bookmarks = new Array();

    bookmarks[0] = "Orkut Manager";
    bookmarks[0] += "|||http://www.orkut.com.br/Main#Community?cmm=90840394";
    bookmarks[1] = "DC - Informática & Internet";
    bookmarks[1] += "|||http://www.orkut.com.br/Main#Community?cmm=9531162";

    node = JSON.stringify(bookmarks);
    return node;
}

unsetbk = function(key) {
    bks = PrefGet("bookmarks", defaultbk());
    bks = JSON.parse(bks);
    bks.splice(key, 1);
    bks.sort(function(a, b) {
        return b - a
    });
    bks = JSON.stringify(bks);
    PrefSet("bookmarks", bks);
    $(".remove_bk, .add_bk").animate({opacity: "show"});
    loadBks();
}

addbks = function() {
    bks = PrefGet("bookmarks", defaultbk());
    bks = JSON.parse(bks);
    newbk = $("#nome").val() + "|||" + $("#url").val();
    bks.push(newbk);
    bks = JSON.stringify(bks);
    PrefSet("bookmarks", bks);
    $(".remove_bk, .add_bk").animate({opacity: "show"});
    loadBks();
}
loadBks = function() {
    node = PrefGet("bookmarks", defaultbk());
    node = JSON.parse(node);
    l = node.length;
    $("ul.bookmarks").html("");
    for (var i = 0; i < l; i++) {
        nod = node[i].split("|||");
        if (typeof(nod[0]) && typeof(nod[1])) {
            $("ul.bookmarks").append('<li><a href="' + nod[1] + '"><img alt="bookmark" src="/img/bookmark.png" /><span>' + nod[0] + '</span></a> <img class="remove_bk" title="Remover favorito" alt="Remove bookmark" src="/img/del.png"/></li>');
        }
    }
    $("ul.bookmarks img.remove_bk").each(function(i) {
        $(this).click(function() {
            unsetbk(i);
        });
    });
}

$(function() {

    loadBks();
    $("a").not("#man_bk").click(function() {
        newtab($(this).attr('href'));
        return false;
    });

    $("#send").click(addbks);

    $("#man_bk").click(function() {
        x = $(".remove_bk, .add_bk").css("display");
        if (x == "block" || x == "inline") {
            $(".remove_bk, .add_bk").animate({opacity: "hide"});
        } else {
            $(".remove_bk, .add_bk").animate({opacity: "show"});
        }
    });

    if (PrefGet("has_new_scrap", false)) {
        $("#scrap_links").css("font-weight", "bold").find("span").text("Recados (novo)");
    } else {
        $("#scrap_links").css("font-weight", "normal").find("span").text("Recados");
    }
    PrefSet("has_new_scrap", false);
    if (PrefGet("has_itens_in_home", false)) {
        $("#home_links").css("font-weight", "bold").find("span").text("Inicio (novo)");
    } else {
        $("#home_links").css("font-weight", "normal").find("span").text("Inicio");
    }
    PrefSet("has_itens_in_home", false);


    if (PrefGet("oldOrkut", "") === "disabled") {
        $("#old_orkut").text('Voltar para o Orkut Antigo');
    } else {
        $("#old_orkut").text('Voltar para o Novo Orkut');

    }

    $("#old_orkut").click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (PrefGet("oldOrkut", "") === "disabled") {
            PrefSet("oldOrkut", "ForceOld");
        } else {
            PrefSet("oldOrkut", "disabled");
        }
        
    });
    chrome.browserAction.setIcon({path: '/img/om.png'});
});
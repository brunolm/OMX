if (!ManagerAddsSystem) var ManagerAddsSystem = {};
if (!ManagerAddsSystem.OrkutManager) ManagerAddsSystem.OrkutManager = {};

ManagerAddsSystem.OrkutManager.StartNotifyUpdate = function(e)
{
    ManagerAddsSystem.OrkutManager.LoadStatus(e);
};

ManagerAddsSystem.OrkutManager.UpdateNotification = function(e, manual)
{
    var user = ManagerAddsSystem.OrkutManager.PrefManager.Get("CurrentUserID");
    var fetch = 10 * 1000;

    if (user)
    {
        var url = "https://www.orkut.com.br/Main#Home.aspx";

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange=function()
        {
            if (xhr.readyState==4 && xhr.status==200)
            {
                var d = xhr.responseText;
                var n = d.match(/^[^,]+,(\d+)/);
                n = n[1];

                e.setAttribute("style", "list-style-image: url('" + ManagerAddsSystem.OrkutManager.WriteStatus(parseInt(n, 10)) + "')");
            }
        }
        xhr.open("GET", url, true);
        xhr.send();
    }

    if (!manual)
        window.setTimeout(function(){ManagerAddsSystem.OrkutManager.UpdateNotification(e);}, fetch);
};

ManagerAddsSystem.OrkutManager.LoadStatus = function(e)
{
    if (ManagerAddsSystem.OrkutManager.LoadStatusFlag) return;
    ManagerAddsSystem.OrkutManager.LoadStatusFlag = true;

    e.setAttribute("style", "list-style-image: url('" + ManagerAddsSystem.OrkutManager.WriteStatus(0) + "')");

    ManagerAddsSystem.OrkutManager.UpdateNotification(e, true);
    ManagerAddsSystem.OrkutManager.UpdateNotification(e);
};

ManagerAddsSystem.OrkutManager.WriteStatus = function(val)
{
    var c = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");

    c.setAttribute("width", 24);
    c.setAttribute("height", 24);

    var context=c.getContext("2d");
    
    var img = new Image();
    img.src = "chrome://orkutmanager/skin/icons/m24.png";
    context.drawImage(img, 0, 0);

    if (val > 0)
    {
        var grd=context.createLinearGradient(0,0,20,12);
        grd.addColorStop(0,"#f00");
        grd.addColorStop(1,"#b00");
        context.fillStyle = grd;
    }
    else
    {
        context.fillStyle = "#6c6c6c";
    }
    context.fillRect(12,12,12,12)
    context.font = "bold 10px sans-serif";
    context.textBaseline = 'top';
    context.fillStyle="#fff";
    context.fillText(val, 15, 14);
    context.stroke();

    return c.toDataURL();
};
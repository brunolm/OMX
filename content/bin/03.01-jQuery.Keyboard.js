$.kb = {};
$.kb.Activation = {
    All: 0,
    NoInputOnly: 1,
    InputOnly: 2
};

$.fn.kb = function (keys, callback, delay, activation, preventDefault)
{
    var $this = this;
    if (!keys.length)
    {
        if (!keys.Callback) return;
        callback = keys.Callback;
        delay = keys.Delay || 300;
        activation = keys.Activation || 0;
        preventDefault = keys.PreventDefault || false;
        keys = keys.Keys
    }
    else
    {
        if (!callback) return;
        delay = delay || 300;
        activation = activation || 0;
        preventDefault = preventDefault || false
    }

    var combos = {};
    function AddToTree(combos, keys)
    {
        for (var i = 0, length = keys.length; i < length; ++i) combos = combos[keys[i].toLowerCase()] = i == length - 1 ? callback : combos[keys[i].toLowerCase()] || {}
    }
    AddToTree(combos, keys);

    var timer = "KeysTimer" + keys.join(""),
        dataKey = "KeysCombo" + keys.join(""),
        specialChars = {
            27: "esc", 9: "tab", 32: "space", 13: "return", 8: "backspace", 145: "scroll", 20: "capslock", 144: "numlock",
            19: "pause", 45: "insert", 36: "home", 46: "del", 35: "end", 33: "pageup", 34: "pagedown",
            37: "left", 38: "up", 39: "right", 40: "down", 109: "-",
            112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6",
            118: "f7", 119: "f8", 120: "f9", 121: "f10", 122: "f11", 123: "f12", 191: "/"
        },
        shiftKeys = { "/":"?" };

    function m(a)
    {
        return specialChars[a] != undefined ? specialChars[a] : String.fromCharCode(a).toLowerCase()
    }

    function handleKey(e)
    {
        var target = e.target;
        var n = target.tagName.toLowerCase(),
            isInput = (n == "input" || n == "textarea" || $(target).attr("contenteditable"));

        if (isInput && activation == $.kb.Activation.NoInputOnly) return;
        if (!isInput && activation == $.kb.Activation.InputOnly) return;

        $this.data(timer) != null && clearTimeout($this.data(timer));
        $this.data(timer, setTimeout(function ()
        {
            $this.data(dataKey, null)
        }, delay));

        if ($this.data(dataKey))
        {
            callback = $this.data(dataKey);
        }
        else
        {
            callback = combos;
        }

        var key = e.which == 0 && specialChars[e.keyCode] != undefined ? specialChars[e.keyCode] : String.fromCharCode(e.which).toLowerCase();
        key = e.shiftKey && shiftKeys[key] != "undefined" ? shiftKeys[key] : key;
        callback = callback[key];

        typeof callback !== undefined && $this.data(dataKey, callback);
        if (typeof callback === "function")
        {
            preventDefault && e.preventDefault();
            callback(e);
            $this.data(dataKey, null)
            e.stopImmediatePropagation();
        }
    }

    function handleKeyChrome(i, e)
    {
        e.type = "chromekeypress";
        e.which = 0;
        handleKey(e);
    }

    if (!$.browser.mozilla)
    {
        this.bind("keydown", function (e) {
            if (specialChars[e.keyCode])
            {
                e.which = 0;

                $this.trigger("chromekeypress", e);

                $this.unbind("keypress");
                window.setTimeout(function(){$this.bind("keypress",handleKey)},10);
            }
        });

        this.bind("chromekeypress", handleKeyChrome);
    }

    this.bind("keypress", handleKey);
}
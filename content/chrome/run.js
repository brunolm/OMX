ManagerAddsSystem.OrkutManager.GetDefaultPref = function(p,d) { if (typeof(p) === "undefined") return d; return p; };

ManagerAddsSystem.OrkutManager.LoadDefaultSettings = function(settings)
{
    var def = ManagerAddsSystem.OrkutManager.GetDefaultPref;

    var s;
    s = JSON.parse(settings);

    //#region UserSettings default

    s.Language = def(s.Language, "pt");

    //#region Features

    s.Features = s.Features || {};

    s.Features.HideEmail = def(s.Features.HideEmail, true);
    s.Features.MenuDropdown = def(s.Features.MenuDropdown, true);
    s.Features.Favorites = def(s.Features.Favorites, true);
    s.Features.MultiDelete = def(s.Features.MultiDelete, true);
    s.Features.Quote = def(s.Features.Quote, true);
    s.Features.Share = def(s.Features.Share, true);
    s.Features.Shortcut = def(s.Features.Shortcut, true);
    s.Features.Toolbar = def(s.Features.Toolbar, true);

    //#endregion

    s.Fonts = def(s.Fonts,
        ["Arial","Arial Black","Bookman Old Style","Courier","Courier New","Comic Sans MS","Courier New","Garamond","Georgia","Impact","Lucida Console","Lucida Sans Unicode","Palatino Linotype","Tahoma","Times New Roman","Trebuchet MS","Verdana","Symbol","Webdings","Wingdings","MS Sans Serif","MS Serif"]);

    s.TimeFormat = def(s.TimeFormat, "yyyy-MM-dd HH:mm");
    s.PreDefinedTemplates = def(s.PreDefinedTemplates,
        [
            "<sub>Code</sub><pre style='border:1px solid #AAA;background:#FAFAFA;font-family:lucida console;padding:4px;'>code</pre>"
            , "<div style='background:#FDFDDF;border:1px solid #FC6'><br><div style='text-align: center;'><img src='http://lh3.ggpht.com/-shWQ53gKYqE/TtJ4IP0s0XI/AAAAAAAAEHk/iCWq11HD0Fk/s400/050%25255B1%25255D.png'> <b>Aviso</b>: Esta área contém <b>revelações sobre o enredo</b> (<i><font color='#ff0000'>spoilers</font></i>).<br><sup>O texto abaixo está invisível, selecione a área abaixo para visualizá-lo.</sup></div><br>&nbsp;&nbsp;&nbsp; Selecione » <div style='text-align:left;color:transparent'>Texto_do_spoiler</div></div>"
        ]
    );
    s.ImageCollection = def(s.ImageCollection,
        [
              "http://img3.orkut.com/images/mittel/1302646489/90840394/of.jpg"
              , "http://img6.orkut.com/images/mittel/1310313544/116113006/io.jpg"
              , "http://img5.orkut.com/images/mittel/1316360862/118020477/of.jpg"
              , "http://img3.orkut.com/images/mittel/1315779190/117939416/of.jpg"
              , "http://i.imgur.com/iApy4.jpg"
        ]
    );

    s.IconCollection = def(s.IconCollection,
        [
            { Link: "http://static1.orkut.com/img/i_smile.gif", Code: "/:)" }
            , { Link: "http://static3.orkut.com/img/i_wink.gif", Code: "/;)" }
            , { Link: "http://static2.orkut.com/img/i_angry.gif", Code: "/;x" }
            , { Link: "http://static4.orkut.com/img/i_sad.gif", Code: "/:(" }
            , { Link: "http://static4.orkut.com/img/i_cool.gif", Code: "/8)" }
            , { Link: "http://static4.orkut.com/img/i_funny.gif", Code: "/:P" }
            , { Link: "http://static1.orkut.com/img/i_surprise.gif", Code: "/:o" }
            , { Link: "https://lh5.ggpht.com/-wlPOXQfGwpI/TtUnx9T0TxI/AAAAAAAAEKU/dQWB_1SpE_4/iApy4%25255B1%25255D.jpg", Code: "/troll" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhkBr_FRSI/AAAAAAAAAeA/pK-hMV3QZEY/.gif", Code: "/rss" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhkUvRw33I/AAAAAAAAAeE/8pd9CoGOnhM/.png", Code: "/*-*" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNhlEmvSIwI/AAAAAAAAAfI/39RuqbwCNvU/.png", Code: "/*w*" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhkUxPnu0I/AAAAAAAAAeQ/pA-q0BoV7BQ/.png", Code: "/*~*" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhkdDjavLI/AAAAAAAAAeg/MBOyRbXNyw4/.gif", Code: "/*6*" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhkdCv_3-I/AAAAAAAAAec/L8kkew9dlhk/.gif", Code: "/*3*" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNhlE4CJQBI/AAAAAAAAAfM/584_86uVe3o/.gif", Code: "/:x" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhkU6Q8i0I/AAAAAAAAAeI/wW0_sxhBhvs/.gif", Code: "/:]" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhlU6wnoqI/AAAAAAAAAfk/G9kLVZSaM5o/.gif", Code: "/;]" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TNhkU1Xy5BI/AAAAAAAAAeM/OoxxCjHxqps/.gif", Code: "/:}" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhkdKDLakI/AAAAAAAAAek/Kk70s7ye9uo/.gif", Code: "/:B" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhlUVHhmyI/AAAAAAAAAfc/7qt9m8pnBZM/.png", Code: "/._." }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNhkdfdzU9I/AAAAAAAAAeo/bITD54ego8g/.png", Code: "/:c" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhl3eJmgQI/AAAAAAAAAgI/Y7lo3obRbSc/.png", Code: "/=[" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhl3t4FJbI/AAAAAAAAAgM/nFIEldlKhoc/.png", Code: "/=]" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhl4O12aLI/AAAAAAAAAgQ/PTCvfpWOK84/.gif", Code: "/={" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNhl4AWQcXI/AAAAAAAAAgU/RgcewCveAgM/.gif", Code: "/=}" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhlUWlmnDI/AAAAAAAAAfY/kdw0waqfOGg/.png", Code: "/.-." }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhkVChqi6I/AAAAAAAAAeU/yqUoBSAoTFs/.gif", Code: "/*1*" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TNhkcWtgVJI/AAAAAAAAAeY/D8XBivw2bUo/.gif", Code: "/*2*" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhkutSZhfI/AAAAAAAAAes/rmnwHExBX3c/.png", Code: "/*D*" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNhkvNaM_PI/AAAAAAAAAew/yLzVKkN4XCk/.png", Code: "/F" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNhq_6AlafI/AAAAAAAAAmI/D6NoiVwzcoY/.png", Code: "/K" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhlivuc3JI/AAAAAAAAAfo/CIZAQRDjDe8/.png", Code: "/;B" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TNhkvW54YfI/AAAAAAAAAe4/IIQdHY4C5Q8/.gif", Code: "/o/" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhkvqUofrI/AAAAAAAAAe8/7yxkTutFAPg/.gif", Code: "/o" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhlU3248cI/AAAAAAAAAfg/goq9vX2Y4EI/.gif", Code: "/'-'" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhlEfSlpqI/AAAAAAAAAfA/VU9tz0JAy6A/.gif", Code: "/*oo*" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TNhlETVcLrI/AAAAAAAAAfE/lAn5l_kfqGA/.gif", Code: "/*ooo*" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhlE96sL2I/AAAAAAAAAfQ/Xy5X_frFAZQ/.png", Code: "/(6" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhljMn6gfI/AAAAAAAAAfw/y1AO8M_d8eU/.gif", Code: "/~kd" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhljDBeVJI/AAAAAAAAAf0/mU_IYWGobAA/.png", Code: "/=(" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhmNVThZKI/AAAAAAAAAgc/MP_rffsuqdE/.png", Code: "/=O" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNhmNqayB2I/AAAAAAAAAgg/evyZduKzCbc/.png", Code: "/=P" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhl3NvTsXI/AAAAAAAAAgE/1Qv4fS_HHNo/.gif", Code: "/=@" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhmNE-iZ2I/AAAAAAAAAgY/SUQ1yJ6OH9U/.gif", Code: "/=d" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TNhmNiE3UbI/AAAAAAAAAgk/uaUL-VA9iO4/.png", Code: "/=X" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhmNvGJmzI/AAAAAAAAAgo/mNzjxBcILIw/.gif", Code: "/a" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhmXaUKOZI/AAAAAAAAAgw/Yc9uqWdbm2U/.gif", Code: "/b" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhmXIV6vKI/AAAAAAAAAgs/vXebbu7ARVg/.gif", Code: "/-ae" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TNhmXdCICzI/AAAAAAAAAg0/CiXFHNjk8ZI/.gif", Code: "/B1" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhmXvvMqrI/AAAAAAAAAg4/o4Df4EbTYHw/.gif", Code: "/B2" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNhmXyg9XqI/AAAAAAAAAg8/e-DNgAdqlww/.gif", Code: "/B3" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhm06I_UnI/AAAAAAAAAhA/Qn15B04Lj1c/.gif", Code: "/bacana" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhm1RfeEhI/AAAAAAAAAhM/3Z-xVnbg-5M/.gif", Code: "/BRINKS" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhm1iKgdnI/AAAAAAAAAhQ/g8cKj6F7y0E/.gif", Code: "/brinks" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TNhnDiP_RcI/AAAAAAAAAhU/ALxMnpaLHiY/.gif", Code: "/BRINKZ" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhoURbhO9I/AAAAAAAAAiU/fEqsV9o0Xtg/.gif", Code: "/ehnoiz" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhogcKdq2I/AAAAAAAAAik/rxNsINqoFlw/.gif", Code: "/euri" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhoVeYVuEI/AAAAAAAAAig/6Ynr7uvjF00/.gif", Code: "/eunao" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhogiW0vzI/AAAAAAAAAio/Xi5gJz5o9CY/.gif", Code: "/eusim" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhoUhUgkEI/AAAAAAAAAiY/TVkGLdyxZeU/.gif", Code: "/ENOIS" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhogs0tbaI/AAAAAAAAAis/OQhbyswRdUI/.gif", Code: "/fdp" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhnEP_OsZI/AAAAAAAAAhc/YtDFmHLvmZA/.gif", Code: "/como" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhnpHSnzqI/AAAAAAAAAiE/k0TlHq-cjmw/.gif", Code: "/danado" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNhpTg1mjzI/AAAAAAAAAjk/4TSq0wBiUQA/.gif", Code: "/fikdik" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNhnDkvOpRI/AAAAAAAAAhY/drrwT3KYI4c/.gif", Code: "/caiden" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TQaxPnCLEiI/AAAAAAAAAu4/l8l_ymjy9mA/.gif", Code: "/contin" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhnESlOM8I/AAAAAAAAAhg/nxSNyeTqp1s/.gif", Code: "/coolfc1" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNhnEiMaSCI/AAAAAAAAAhk/4ByeLMRoisc/.gif", Code: "/coolfc2" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhnUcaCnzI/AAAAAAAAAho/Buqj7z-kkSI/.gif", Code: "/coolfc3" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TNhnUWIQopI/AAAAAAAAAhs/ggqAdu0uR6k/.gif", Code: "/coolfc4" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TNhnU_OuLeI/AAAAAAAAAhw/_FQXWVxsaAI/.gif", Code: "/coolfc5" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TNhnVL5RMfI/AAAAAAAAAh0/ZBZD8I-AAKU/.gif", Code: "/D" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TNhnVQnEbbI/AAAAAAAAAh4/TlHIouJwxG0/.gif", Code: "/D;" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhnpHqmQ3I/AAAAAAAAAh8/U6FcIU7XSiU/.gif", Code: "/D=" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhnpKvCoQI/AAAAAAAAAiA/RHg52mFGSMk/.png", Code: "/D'=" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNhnpBmQK-I/AAAAAAAAAiI/H55gXK8Wwmc/.gif", Code: "/dorgas" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNhnpf7XOtI/AAAAAAAAAiM/cu2Xg4d9e-Y/.gif", Code: "/dorgs" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhoUbLCIkI/AAAAAAAAAiQ/mTWaGcmfGK8/.gif", Code: "/E_E" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhpTrwV1II/AAAAAAAAAjg/F7BG8D_Bv4c/.gif", Code: "/fiesta" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNhpT4Ahv-I/AAAAAAAAAjs/-0GIX9Kd880/.gif", Code: "/flvv" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhoU2GwaII/AAAAAAAAAic/i2r7xDgY6AU/.gif", Code: "/-enois" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhpT3oAtXI/AAAAAAAAAjw/DalbS_My_9g/.gif", Code: "/lw" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNhpfBq4VBI/AAAAAAAAAj0/xztDSYdNG-o/.gif", Code: "/fneto" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TNhm1ULcVTI/AAAAAAAAAhI/ihlPXEm7fH8/.gif", Code: "/blz" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhs9dlCWQI/AAAAAAAAAns/EetMoSM9hXM/.gif", Code: "/porra" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhm0-pTVzI/AAAAAAAAAhE/yms5hA6pezQ/.gif", Code: "/beleza" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhpTy_fa_I/AAAAAAAAAjo/2iRBxJIWCdE/.gif", Code: "/fiuk" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TVhQfDseB4I/AAAAAAAAA6g/e9zy1rNC4Uc/.gif", Code: "/kurt" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TVhPHYsuR3I/AAAAAAAAA58/KrouO6SzIeA/.gif", Code: "/LOL!" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhpfD12XsI/AAAAAAAAAj4/_TYpbB5zNl0/.gif", Code: "/forever" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhtMQH6-lI/AAAAAAAAAoA/gFa-udp2-7E/.gif", Code: "/RERE " }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TNhog79CeQI/AAAAAAAAAiw/XAdIc8mE7Ug/.gif", Code: "/FF1" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhohcNpL7I/AAAAAAAAAi0/ivyLozEyBpY/.gif", Code: "/FF2" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TNhoum8bwLI/AAAAAAAAAi4/SwdYiZFsBCk/.gif", Code: "/FF3" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhouqtYM1I/AAAAAAAAAi8/NqYIkluCCyE/.gif", Code: "/FF4" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhour2xw7I/AAAAAAAAAjA/AJVxwOYlFSY/.gif", Code: "/FFFU1" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhouyA30II/AAAAAAAAAjE/chEptgUz1Ps/.gif", Code: "/FFFU2" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhouw-3cnI/AAAAAAAAAjI/H4amOvZNhtU/.gif", Code: "/FFFU3" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNho-DMkXBI/AAAAAAAAAjM/i_jHzzs1UrM/.gif", Code: "/FFFU4" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNho-Cd-HoI/AAAAAAAAAjQ/wck7JiV66b8/.gif", Code: "/FFU1" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNho-IwHAkI/AAAAAAAAAjU/-fhWrEKBzoA/.gif", Code: "/FFU2" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNho-XIzftI/AAAAAAAAAjY/h7jPYIUlb9g/.gif", Code: "/FFU3" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNho-WKbgDI/AAAAAAAAAjc/13P_8DuBcwg/.gif", Code: "/FFU4" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNhp5IwochI/AAAAAAAAAkc/fM4wGqOOtl4/.gif", Code: "/FU9" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TVhMdLacKpI/AAAAAAAAA5k/sBn6rFXy5qU/.gif", Code: "/FU3" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TVhMdK_KF0I/AAAAAAAAA5g/EB4hZh46W2Q/.gif", Code: "/FU2" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TVhLx7glJsI/AAAAAAAAA5U/iYXIRKI_bBw/.gif", Code: "/FUA" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNhps2Qp1QI/AAAAAAAAAkQ/3t93SOUS_-g/.gif", Code: "/FU6" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TNhps9diIsI/AAAAAAAAAkM/fR4TWC-Sl14/.gif", Code: "/FU5" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TVhMdJqZTmI/AAAAAAAAA5c/cwDuSKYiDVo/.gif", Code: "/FUC" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhps99okjI/AAAAAAAAAkU/ROajdl7XQS8/.gif", Code: "/FU7" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNhptKxYUII/AAAAAAAAAkY/XNz5y0X4u-E/.gif", Code: "/FU8" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TNhpskHbOII/AAAAAAAAAkI/P8AZCbfOK2o/.gif", Code: "/FU4" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNhpfMtoTSI/AAAAAAAAAj8/UHgrPrdgkvY/.gif", Code: "/FU1" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNhp5A3wYwI/AAAAAAAAAkg/eIRLG1GPAmQ/.gif", Code: "/fuckyea" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhp5VhGrFI/AAAAAAAAAko/Q8lSZPRa_kc/.gif", Code: "/happy1" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TNhp5eEQsdI/AAAAAAAAAks/JlgeZcK7x0U/.gif", Code: "/happy2" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhqGvToW9I/AAAAAAAAAkw/guIR1PBX_zM/.gif", Code: "/happy3" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhqGkShHhI/AAAAAAAAAk0/LQuQWMXFAvk/.gif", Code: "/happy4" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TNhqG67ScII/AAAAAAAAAk4/Jo8fng81yXk/.gif", Code: "/happy5" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNsmSC4vAFI/AAAAAAAAAqo/dGp6xo4pZF8/.gif", Code: "/happy7" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhqHHpyOkI/AAAAAAAAAk8/thtq7YvvLpU/.png", Code: "/hmm0" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhqHHinlPI/AAAAAAAAAlA/1y2UlaNIok8/.gif", Code: "/hmm1" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNhqTDO4ArI/AAAAAAAAAlE/zZOCjisKaoY/.png", Code: "/hmm2" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhqTQW2DBI/AAAAAAAAAlI/Yxb-VNTncDg/.gif", Code: "/hmm3" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TNhqTQ50-fI/AAAAAAAAAlM/MkhZH_pVA98/.png", Code: "/hmm4" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhqTtukq2I/AAAAAAAAAlQ/uO_m6CQkZvk/.gif", Code: "/hmm5" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhqT8rMB8I/AAAAAAAAAlU/WHQQtru-Cgc/.png", Code: "/hmm6" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TVhMdYFEe5I/AAAAAAAAA5s/uy3AxVMtSEU/.gif", Code: "/hmm7" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhqlCc6BRI/AAAAAAAAAlc/9n9BWHOjtoM/.png", Code: "/hmm8" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TNhqlE8BzjI/AAAAAAAAAlg/eKgxEBVeRPw/.png", Code: "/hmm9" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhqlaBRVUI/AAAAAAAAAlk/k6BivVXgDNQ/.png", Code: "/hmmA" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhqlXBVHNI/AAAAAAAAAlo/eANQPADu-Cs/.gif", Code: "/hmmB" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhqz9OQq7I/AAAAAAAAAls/Ihf07eB6kgo/.gif", Code: "/hmmC" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TNhqzz_eXzI/AAAAAAAAAlw/ctfnlg6uLeU/.gif", Code: "/hmmD" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNhqzxKVsTI/AAAAAAAAAl0/0J0LihnzX1o/.gif", Code: "/hmmE" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhq0ocN1vI/AAAAAAAAAl4/C9ZW1L12fMg/.gif", Code: "/hmmF" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNhq0p2KMUI/AAAAAAAAAl8/fPKhUDD_tFQ/.gif", Code: "/hmmG" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNhq_mXG-AI/AAAAAAAAAmA/A6Zmeu1Y5Wc/.png", Code: "/hmmH" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TNhq_s93G2I/AAAAAAAAAmE/xq4m8w1oy-g/.png", Code: "/hmmI" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNhq_3lZLbI/AAAAAAAAAmM/7AZxcMtszuY/.gif", Code: "/light" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TVhQekJrvdI/AAAAAAAAA6U/Ux89WMCL__4/.gif", Code: "/god" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TVhPHQGbNOI/AAAAAAAAA6E/S7_RoesI1Zs/.gif", Code: "/light2" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TNhrAMM1FBI/AAAAAAAAAmQ/xtyZ4YHueI4/.gif", Code: "/loro" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhrPtwZWOI/AAAAAAAAAmU/hY_VgU7LKlM/.gif", Code: "/mecome" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhrPmDBtcI/AAAAAAAAAmY/s_5Up4LXQTw/.gif", Code: "/mequer" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhrPq9oN6I/AAAAAAAAAmc/yv6SrN6045E/.gif", Code: "/mesuga" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TNhrPl6zhmI/AAAAAAAAAmg/o40pICV8gbU/.gif", Code: "/meuovo" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNhrP_ElW_I/AAAAAAAAAmk/HYozg36wnCM/.gif", Code: "/mijei" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhrd99UPMI/AAAAAAAAAmo/M9jzuch4ETQ/.gif", Code: "/nada" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TNhreNmlepI/AAAAAAAAAms/xOiESzu4K14/.gif", Code: "/ao" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhreNk2coI/AAAAAAAAAmw/I9Gug6ZTHmA/.gif", Code: "/nemri" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhreLVCqMI/AAAAAAAAAm0/ZdCZ2I4SDpM/.gif", Code: "/nemvi" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNhreR8TmKI/AAAAAAAAAm4/gakoEHwiAk4/.gif", Code: "/ossa" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhsT6zP-9I/AAAAAAAAAnA/0Lbycx2U1Cw/.gif", Code: "/OI" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhsUDvGLoI/AAAAAAAAAnE/pjzC_NbalCc/.gif", Code: "/oie" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNhsUG_gmnI/AAAAAAAAAnM/mOukgWVdUcs/.gif", Code: "/palias" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhsUSgVeUI/AAAAAAAAAnQ/Thv3xyX6EcY/.gif", Code: "/oveia2" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhslYEtZKI/AAAAAAAAAnU/4qpGRljh7MI/.gif", Code: "/pedo" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhslVnhCfI/AAAAAAAAAnY/fIiifdoHDOE/.png", Code: "/pkb" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhslqwdgfI/AAAAAAAAAnc/z1ctawUfpIU/.gif", Code: "/pkb2" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhsl3uTEEI/AAAAAAAAAng/GUtoFGC4qwc/.gif", Code: "/pokecao" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhsl75cs0I/AAAAAAAAAnk/aUfspvWUFM4/.gif", Code: "/pokemon" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNhp5Z1nGjI/AAAAAAAAAkk/4QUmkESbHL8/.gif", Code: "/HAHAHA" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhs9u_4-3I/AAAAAAAAAnw/rk-Mz8DikZM/.gif", Code: "/pqp" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TQax1AiIvgI/AAAAAAAAAvQ/3WdZ7dDSu4U/.gif", Code: "/Q" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TNhs97XWFsI/AAAAAAAAAn4/KQgdb1iFKeM/.gif", Code: "/rapaz" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TNhtMa3A6XI/AAAAAAAAAoE/2EIlbsjfqVI/.gif", Code: "/rialto" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhtMl6YdRI/AAAAAAAAAoI/q7Qm_iK_10M/.gif", Code: "/rialtu" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhtMockoiI/AAAAAAAAAoM/60WEUcYbGDw/.gif", Code: "/rimsm" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNhtMq7ad7I/AAAAAAAAAoQ/OFTotFV5xw8/.gif", Code: "/rimt" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TVhPHQlQ96I/AAAAAAAAA6A/Zb6M0PHMQSc/.gif", Code: "/rs" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhtfG1fwSI/AAAAAAAAAoY/2f-INMPRUm8/.gif", Code: "/rsrs" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNhtfHewAbI/AAAAAAAAAoc/4pLN5SzQnCg/.gif", Code: "/satan" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhtfNRzRiI/AAAAAAAAAog/w_mLyEHDumo/.gif", Code: "/sofoda" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhtfaHhcgI/AAAAAAAAAok/Aly08HXdSwg/.gif", Code: "/soufoda" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhtve5l40I/AAAAAAAAAoo/CvYewrASDQI/.gif", Code: "/talvez" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhtvr4U7XI/AAAAAAAAAos/oNED2Nf8wTU/.gif", Code: "/V1" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TNhtvyMKC3I/AAAAAAAAAow/sh3kQhDdJoI/.gif", Code: "/V2" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhtv-RQzZI/AAAAAAAAAo0/K_ciGAad5Fg/.gif", Code: "/V3" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TNhtwTtIvrI/AAAAAAAAAo4/de_RerR7Eeg/.gif", Code: "/V4" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TNht8fgsbPI/AAAAAAAAAo8/n2agBiM6KIs/.gif", Code: "/V5" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNht8vPiWvI/AAAAAAAAApA/j1iMBgarfRc/.gif", Code: "/vcnao" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNht8qN6b_I/AAAAAAAAApE/FX1XPzfX4MQ/.gif", Code: "/vcsim" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNht8z493ZI/AAAAAAAAApI/i7i300XudGE/.gif", Code: "/vemk" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNht8zldGDI/AAAAAAAAApM/2-cyUzyrLAw/.gif", Code: "/vsf" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TNhs95QyftI/AAAAAAAAAn8/1iBCKwSk5Js/.gif", Code: "/rawr" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhsUD1WeSI/AAAAAAAAAnI/r0fq0FVFUXU/.gif", Code: "/oveia" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TVhLx5z2jEI/AAAAAAAAA5Y/yUWH1221S9Y/.gif", Code: "/own" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TNhuMzaqYTI/AAAAAAAAApQ/FeifaVTgs_o/.gif", Code: "/wat" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhuM88nr1I/AAAAAAAAApU/akF0mQg0fJA/.gif", Code: "/wet" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TNhuM3pnAcI/AAAAAAAAApY/wYPDIui1c9I/.gif", Code: "/wow" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TNhuNHkfiWI/AAAAAAAAApc/LE0TWORK5xU/wut.gif", Code: "/wut" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TNpZWgr8CGI/AAAAAAAAAqA/OuEbN6tI1ow/X.gif", Code: "/X=" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TNrs28uAcUI/AAAAAAAAAqU/F1xe1Ug0-E4/.gif", Code: "/happy6" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TNsq7UTxjlI/AAAAAAAAAq4/kEXccYKZxnY/.gif", Code: "/lol " }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TQawH3PpoFI/AAAAAAAAAug/s-tYnQ8fKQg/.gif", Code: "/aids" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TQawIKcbfOI/AAAAAAAAAuk/MCWrsPCX1EM/.gif", Code: "/balone" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TQawIT2NSmI/AAAAAAAAAuo/H1zDXQl1new/.gif", Code: "/cancer" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TQawIf_yBGI/AAAAAAAAAus/EKQomGl_gE0/.gif", Code: "/rss3" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TQawIumXMtI/AAAAAAAAAuw/5mqEUAH5Btg/.gif", Code: "/BAN" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TQaxP52O09I/AAAAAAAAAu8/fkAKVorci0E/.png", Code: "/[]" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TQaxP8NKQGI/AAAAAAAAAvA/PRTTGS_pWPk/.gif", Code: "/dgoh" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TVhLx4C_4XI/AAAAAAAAA5M/0UGrcOQrQKk/.gif", Code: "/dgohriu" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TQaxQIZnHNI/AAAAAAAAAvE/Q8EoPzfdY6o/.gif", Code: "/grr" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TQaxQCia-4I/AAAAAAAAAvI/nhzr-_oz6vg/.gif", Code: "/LOL" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TQax1KH_6jI/AAAAAAAAAvM/r1oJWWf4MKg/.gif", Code: "/ohno" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TQax1aMxQyI/AAAAAAAAAvU/IOOr-nbac7g/.gif", Code: "/bjao" }
            , { Link: "http://lh5.ggpht.com/_QJuiOh91trE/TRqL-2RH8XI/AAAAAAAAAww/vPzWlxzWUeo/.gif", Code: "/spcinv" }
            , { Link: "http://lh4.ggpht.com/_QJuiOh91trE/TSdwUzuNkVI/AAAAAAAAAz4/SP5HbjiFwzI/.gif", Code: "/vao" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TVhLxvvvRFI/AAAAAAAAA5I/-fH24XEgZ4U/.gif", Code: "/*-*" }
            , { Link: "http://lh3.ggpht.com/_QJuiOh91trE/TVhLx_wPjAI/AAAAAAAAA5Q/Dum_9bSbDss/.gif", Code: "/fpalm" }
            , { Link: "http://lh6.ggpht.com/_QJuiOh91trE/TVhQeuB7BPI/AAAAAAAAA6Q/Rl5vg1Vl6SY/.gif", Code: "/ffpalm" }
        ]);

    s.MenuDD = def(s.MenuDD,
        [
            {Name: "Home", Link: "#Home"}
            , { Name: "Perfil", Link: "#Profile" }
            , { Name: "Scrapbook", Link: "#Scrapbook" }
            , { Name: "Communities", Link: "#Communities" }
            , { Name: "Orkut Manager", Link: "#Community?cmm=90840394" }
            , { Name: "Google+ Manager", Link: "#Community?cmm=116113006" }
            , { Name: "Twitter Manager", Link: "#Community?cmm=118020477" }
            , { Name: "eBuddy Manager", Link: "#Community?cmm=117939416" }
            , { Name: "Orkut Manager - Dúvidas", Link: "#Community?cmm=117178142" }
            
            , { Name: "ManagerAddons", Link: "http://www.manageraddons.com/" }
            , { Name: "Website", Link: "http://www.orkutmanager.net/" }
            , { Name: "Google+", Link: "https://plus.google.com/u/0/111934632939022276614/posts" }
            , { Name: "Facebook", Link: "https://www.facebook.com/orkutmanager" }
            , { Name: "Twitter", Link: "https://twitter.com/#!/orkutmanager" }
        ]);
    s.Favorites = def(s.Favorites,
        [
            {"Favoritos":[]}
            , {"Managers":
                [
                    { Name: "Orkut Manager", Link: "#Community?cmm=90840394", Image: "<img src=\"http://img3.orkut.com/images/mittel/1302646489/90840394/of.jpg\"/>" }
                    , { Name: "Google+ Manager", Link:"#Community?cmm=116113006", Image: "<img src=\"http://img6.orkut.com/images/mittel/1310313544/116113006/io.jpg\"/>" }
                    , { Name: "Twitter Manager", Link:"#Community?cmm=118020477", Image: "<img src=\"http://img5.orkut.com/images/mittel/1316360862/118020477/of.jpg\"/>" }
                    , { Name: "eBuddy Manager", Link:"#Community?cmm=117939416", Image: "<img src=\"http://img3.orkut.com/images/mittel/1315779190/117939416/of.jpg\"/>" }
                    , { Name: "Orkut Manager - Dúvidas", Link:"#Community?cmm=117178142", Image: "<img src=\"http://img2.orkut.com/images/mittel/1313283209/117178142/io.jpg\"/>" }

                    , { Name: "[FIXO] Regras", Link: "#CommMsgs?cmm=90840394&tid=5347276125155943900" }
                    , { Name: "[FIXO] FAQ", Link: "#CommMsgs?cmm=90840394&tid=5399089807851692741" }
                    , { Name: "[FIXO] Bug report", Link: "#CommMsgs?cmm=90840394&tid=5539170806300943845" }
                    , { Name: "[FIXO] Sandbox", Link: "#CommMsgs?cmm=90840394&tid=5348193113558541788" }
                    , { Name: "[FIXO] Topico de testes", Link: "#CommMsgs?cmm=90840394&tid=5576922782713684677" }
                    , { Name: "[FIXO] Sugestões", Link: "#CommMsgs?cmm=90840394&tid=5656933354948797925" }
                    , { Name: "[TUT] Colocando sobra no nome", Link: "#CommMsgs?cmm=90840394&tid=5550066588001832311" }
                    
                ]}
            , {"Orkut":[]}
            , {"Games":[]}
            , {"Anime/Manga":[]}
            , {"TV/Seriados":[]}
            , {"Breath of Fire":[{Name:"Breath of Fire Brasil", Link: "#Community?cmm=13766660", Image: "<img src=\"http://img1.orkut.com/images/mittel/1299799315/13766660/of.jpg\"/>"}]}
            , {"Final Fantasy":[]}
            , {"Outros":[]}
        ]);

    //#region Templating

    s.TemplateQuote = def(s.TemplateQuote, "<div style='padding:4px;background:#eee;border:2px solid #777;min-height:64px'><div style='float:left;padding:0 4px 2px'>{UserImage}</div><div style='margin-left:72px'><b><span style='text-shadow:#fff 0 0 7px;color:#000'>Quote <a href='{UserLink}'>{UserName}</a> @ {Time}</span></b><br>{Content}<div style='clear:both'></div></div></div><br>");
    s.TemplateText = def(s.TemplateText, "{|}<br><br><sub>Orkut Manager</sub>");

    s.ModerationText = def(s.ModerationText, "<b>Post</b>: {Subject} @ {Time}\n<b>Usuário</b>: {UserName} (uid={UserID}) \n<b>Ação</b>: {ModActions}\n<b>Motivo</b>: {ModReasons}\n{CurrentDate}");

    //#endregion

    //#endregion

    ManagerAddsSystem.OrkutManager.UserSettingsObject = s;
    return ManagerAddsSystem.OrkutManager.UserSettingsObject;
};

ManagerAddsSystem.OrkutManager.LoadSettings = function(cb){
    chrome.extension.sendRequest({Command: "GetSettings"},
        function(response)
        {
            ManagerAddsSystem.OrkutManager.UserSettings = response.Settings || "{}";
            ManagerAddsSystem.OrkutManager.UserSettingsObject =
                ManagerAddsSystem.OrkutManager.LoadDefaultSettings(ManagerAddsSystem.OrkutManager.UserSettings);

            if (typeof(cb) == "function")cb();
            return ManagerAddsSystem.OrkutManager.UserSettings;
        });
};

chrome.extension.sendRequest({Command: "GetSettings"},
    function(response)
    {
        ManagerAddsSystem.OrkutManager.UserSettings = response.Settings || "{}";
        ManagerAddsSystem.OrkutManager.UserSettingsObject =
            ManagerAddsSystem.OrkutManager.LoadDefaultSettings(ManagerAddsSystem.OrkutManager.UserSettings);

        ManagerAddsSystem.OrkutManager.Startup(window, window.document, window, ManagerAddsSystem.OrkutManager);
    });

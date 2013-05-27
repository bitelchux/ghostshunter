// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik MÃ¶ller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
                                   || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
} ());
function getURLParam(strParamName) {
    //if (strParamName == "pg") return "si";
    //if (strParamName == "l") return "1";
    var strReturn = "";
    var strHref = window.location.href;
    if (strHref.indexOf("?") > -1) {
        var strQueryString = strHref.substr(strHref.indexOf("?"));
        var aQueryString = strQueryString.split("&");
        for (var iParam = 0; iParam < aQueryString.length; iParam++) {
            if (aQueryString[iParam].indexOf(strParamName + "=") > -1) {
                var aParam = aQueryString[iParam].split("=");
                strReturn = aParam[1];
                break;
            }
        }
    }
    return strReturn;
}
function getPhoneGapPath() {

    var path = window.location.pathname;
    path = path.substr(path, path.length - 10);
    return 'file://' + path;

};




function setCookie(name, value, expires, path, domain, secure) {
//    alert("setcok");
    if (window.JSInterface != undefined) {
        window.JSInterface.setCookie(name, value);
    } else {
        document.cookie =
                name + "=" + escape(value) +
                (expires ? "; expires=" + expires.toGMTString() : "") +
                (path ? "; path=" + path : "") +
                (domain ? "; domain=" + domain : "") +
                (secure ? "; secure" : "");
    }
}

// ***** setCookieLT *****

// PARAMETERS: lifetime - cookie lifetime in seconds

function setCookieLT(name, value, lifetime, path, domain, secure) {
    if (lifetime) { lifetime = new Date(Date.parse(new Date()) + lifetime * 1000); }
    setCookie(name, value, lifetime, path, domain, secure);
}

// ***** getCookie *****

function getCookie(name) {
//    alert(name);
    if (window.JSInterface != undefined) {

        var out = window.JSInterface.getCookie(name);
//        alert("coockie" + out)
        return out;
    } else {
        var cookie, offset, end;
        cookie = " " + document.cookie;
        offset = cookie.indexOf(" " + name + "=");
        if (offset == -1) { return undefined; }
        offset += name.length + 2;
        end = cookie.indexOf(";", offset)
        if (end == -1) { end = cookie.length; }
        return unescape(cookie.substring(offset, end));
    }
}

// ***** delCookie *****

// PARAMETERS:
//
// name         - cookie name
// path, domain - cookie path & domain (the same as those used to create cookie)

function delCookie(name, path, domain) {
    if (getCookie(name)) {
        setCookie(name, "", new Date("January 01, 2000 00:00:01"), path, domain);
    }
}
function decodeStr(coded) {
    coded = decodeURIComponent(coded);
    var uncoded = "";
    var chr;
    for (var i = coded.length - 1; i >= 0; i--) {
        chr = coded.charAt(i);
        uncoded += (chr >= "a" && chr <= "z" || chr >= "A" && chr <= "Z") ?
      String.fromCharCode(65 + key.indexOf(chr) % 26) :
      chr;
    }

    return uncoded;
}
var playOriginal = Audio.prototype.play;
Audio.prototype.play = function () {
    if (window.JSInterface != undefined) {
        var aux = this.src.split("/");
        window.JSInterface.playAudio(aux[aux.length - 1]);
    } else {
        playOriginal.apply(this, arguments);
    }
}
var pauseOriginal = Audio.prototype.pause;
Audio.prototype.pause = function () {
    if (window.JSInterface != undefined) {
        var aux = this.src.split("/");
        window.JSInterface.pauseAudio(aux[aux.length - 1]);
    } else {
        pauseOriginal.apply(this, arguments);
    }
}
function pauseAllSfx() {
//    alert("para")
    if (window.JSInterface != undefined) {
        window.JSInterface.pauseAllSfx();
    } else {
        for (var index in ML.sounds) {
            ML.sounds[index].pause()
        }

    }
}
function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}
function replaceAll(text, busca, reemplaza) {
    while (text.toString().indexOf(busca) != -1)
        text = text.toString().replace(busca, reemplaza);
    return text;
}
function encodeStr(uncoded) {
    uncoded = uncoded.toUpperCase().replace(/^\s+|\s+$/g, "");
    var coded = "";
    var chr;
    for (var i = uncoded.length - 1; i >= 0; i--) {
        chr = uncoded.charCodeAt(i);
        coded += (chr >= 65 && chr <= 90) ?
        //            key.charAt(chr - 65 + 26*Math.floor(Math.random()*2)) :
            key.charAt(chr - 65 + 26 * Math.floor(0.666 * 2)) :
            String.fromCharCode(chr);
    }

    coded = replaceAll(coded, ' ', '');

    return encodeURIComponent(coded);
}

var levels = new Array();
cont = 0;
//speed desde 0.5 hasta 3
//numpajaros maximo 4
levels[cont++] = { tipoghost: 0, numpajaros: 1, bg: 'f1.jpg', txt: 'Menu', fuel: 200, clave: 'xxx', traptipo: 0, speed: 0.5 };
levels[cont++] = { tipoghost: 0, numpajaros: 1, bg: 'f1.jpg', txt: 'La Alhambra de Granada', fuel: 200, clave: 'xxx', traptipo: 0, speed: 0.1 };
levels[cont++] = { tipoghost: 1, numpajaros: 1, bg: 'f2.jpg', txt: 'Angkor', fuel: 200, clave: 'xxx', traptipo: 0, speed: 0.6 };
levels[cont++] = { tipoghost: 1, numpajaros: 2, bg: 'f4.jpg', txt: 'Neuschwanstein Castle', fuel: 200, clave: 'xxx', traptipo: 0, speed: 0.8 };
levels[cont++] = { tipoghost: 2, numpajaros: 2, bg: 'f5.jpg', txt: 'Statues of Easter Island', fuel: 200, clave: 'xxx', traptipo: 0, speed: 0.9 };
levels[cont++] = { tipoghost: 2, numpajaros: 2, bg: 'f6.jpg', txt: 'Stonehenge', fuel: 200, clave: 'xxx', traptipo: 0, speed: 1 };
levels[cont++] = { tipoghost: 1, numpajaros: 2, bg: 'f7.jpg', txt: 'The Acropolis of Athens', fuel: 200, clave: 'xxx', traptipo: 0, speed: 1.1 };
levels[cont++] = { tipoghost: 3, numpajaros: 3, bg: 'f8.jpg', txt: 'Eiffel Tower', fuel: 200, clave: 'xxx', traptipo: 0, speed: 1.2 };
levels[cont++] = { tipoghost: 3, numpajaros: 3, bg: 'f9.jpg', txt: 'The Kremlin Red Square', fuel: 200, clave: 'xxx', traptipo: 0, speed: 1.3 };
levels[cont++] = { tipoghost: 1, numpajaros: 3, bg: 'f10.jpg', txt: 'The Pyramids of Giza', fuel: 200, clave: 'xxx', traptipo: 0, speed: 1.4 };
levels[cont++] = { tipoghost: 2, numpajaros: 3, bg: 'f11.jpg', txt: 'The Statue of Liberty', fuel: 200, clave: 'xxx', traptipo: 0, speed: 1.5 };
levels[cont++] = { tipoghost: 3, numpajaros: 3, bg: 'f12.jpg', txt: 'Timbuktu', fuel: 200, clave: 'xxx', traptipo: 0, speed: 1.6 };
levels[cont++] = { tipoghost: 0, numpajaros: 3, bg: 'f13.jpg', txt: 'Petra Great Temple', fuel: 200, clave: 'xxx', traptipo: 0, speed: 1.7 };
levels[cont++] = { tipoghost: 1, numpajaros: 4, bg: 'f14.jpg', txt: 'La Sagrada Familia', fuel: 200, clave: 'xxx', traptipo: 1, speed: 1.8 };
levels[cont++] = { tipoghost: 2, numpajaros: 4, bg: 'f15.jpg', txt: 'Machu Pichu', fuel: 200, clave: 'xxx', traptipo: 0, speed: 2 };

levels[cont++] = { tipoghost: 3, numpajaros: 4, bg: 'f16.jpg', txt: 'Big Ben', fuel: 200, clave: 'xxx', traptipo: 0, speed: 2.1 };
levels[cont++] = { tipoghost: 0, numpajaros: 4, bg: 'f17.jpg', txt: 'Pisa Tower', fuel: 200, clave: 'xxx', traptipo: 0, speed: 2.2 };
levels[cont++] = { tipoghost: 1, numpajaros: 4, bg: 'f18.jpg', txt: 'Taj Majal', fuel: 200, clave: 'xxx', traptipo: 0, speed: 2.3 };
levels[cont++] = { tipoghost: 2, numpajaros: 4, bg: 'f19.jpg', txt: 'Coliseo', fuel: 200, clave: 'xxx', traptipo: 0, speed: 2.4 };
levels[cont++] = { tipoghost: 3, numpajaros: 4, bg: 'f20.jpg', txt: 'Cristo Rey', fuel: 200, clave: 'xxx', traptipo: 0, speed: 2.5 };
levels[cont++] = { tipoghost: 0, numpajaros: 5, bg: 'f21.jpg', txt: 'Himalaya', fuel: 200, clave: 'xxx', traptipo: 0, speed: 2.6 };
levels[cont++] = { tipoghost: 1, numpajaros: 5, bg: 'f22.jpg', txt: 'Niagara Falls', fuel: 200, clave: 'xxx', traptipo: 0, speed: 2.7 };
levels[cont++] = { tipoghost: 2, numpajaros: 5, bg: 'f23.jpg', txt: 'Notre Dame', fuel: 200, clave: 'xxx', traptipo: 0, speed: 2.8 };
levels[cont++] = { tipoghost: 0, numpajaros: 1, bg: 'f24.jpg', txt: 'Burj Khalifa (Final)', fuel: 200, clave: 'xxx', traptipo: 0, speed: 0.1 };

//taj majal, torre de pisa, big ben, cristo rey,central park,niagara falls,notra dame,Burj Khalifa
var key = "SXGWLZPDOKFIVUHJYTQBNMACERxswgzldpkoifuvjhtybqmncare";
for (var i = 0; i < levels.length; i++) {
    levels[i].clave = encodeStr(levels[i].txt)

}
//ojo
/*
for (var i=0;i<levels.length;i++){
document.writeln("<br/><br/>$fases["+i+"]='"+ levels[i].clave + "';");
}
*/



function listCookies() {

    if (window.JSInterface != undefined) {

        var lista = window.JSInterface.listCookies();
//        alert("devuelto lista:" + lista)
        return lista.split("|");
    } else {
        var theCookies = document.cookie.split(';');
        var aString = new Array();
        for (var i = 1; i <= theCookies.length; i++) {
            var micookie = theCookies[i - 1];
            if (micookie.indexOf(" level") == 0) {
                aString.push(micookie)
            }
        }
        return aString;
    }
}

function getGlobalSituation() {
    var misfases = listCookies();
    if (misfases.length == 0) return "";
    misfases.sort();
    misfases.reverse();
    var salida = "<ul style='width:310px;margin:4px;padding:4px'>";
    for (i = 0; i < misfases.length; i++) {
        //nombre de la fase|pos en el array de fases|estrellas
        var aux = misfases[i].split("=");
        aux[0] = parseInt(aux[0].replace("level", "").trim());
        aux[1] = aux[1].split("-");
        salida = salida + "<li onclick=\"ira('" + levels[aux[0]].clave + ".html');ML.sounds['button'].play()\" id='thumb_" + aux[0] + "' class='thumbfases'>" + "<img src='stars" + aux[1][0] + ".png'/><br/>" + levels[aux[0]].txt + "(" + parseInt(aux[1][1]) + " pts)</li>";
    }
    salida = salida + "</ul>";
    return salida;
}
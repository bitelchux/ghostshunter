var OFF = 0;
var ON = 1;
var isphonegap = false;
//ojo
/*
if (getURLParam("pg") != "") {
isphonegap = true;
}
*/
// ***** Examples **************************************************************



// ***** Delete & Visibility *****

/*

For this example the document should not be in the root directory.
The first cookie is set in the root directory.
The second cookie is set in the current directory and it hides the first one.
However, when the second cookie is deleted the first one becomes visible again.

*/



function MessageTicker() {

    this.status = OFF;
    //1 scroll desde left,2 permanece centro,3 desaparece derecha
    this.x = 0;
    this.y = realh / 2;
    this.incx = 0;
    this.callback = null;
    this.msg = []
    this.contador = 0;
    this.contbase = 20;
    this.multiplicador = 20;
    this.pausar = true;
    this.activate = function () {
        if (this.status != OFF) { return; }
        if (this.pausar) {
            waiting = true;
        }
        this.status = 1;
        this.contador = this.contbase;
        this.x = -100;
        this.incx = 100 / this.contador;
        var msg = this.msg.pop().split("|");
        $("#tickerMsg").html("<h3>" + msg[0] + "</h3> -- Tap for continue --<br/><br/>")
        document.getElementById("tickerMsg").style.top = this.y + "px"
        document.getElementById("tickerMsg").style.left = this.x + "px"
        document.getElementById("tickerMsg").style.width = realw + "px"

        document.getElementById("tickerBg").style.top = (this.y) + "px"
        document.getElementById("tickerBg").style.left = 0 + "px"
        document.getElementById("tickerBg").style.width = realw + "px"


        $("#tickerBg").fadeIn()
        $("#tickerMsg").fadeIn()

    }
    this.deactivate = function () {
        if (this.pausar) {
            waiting = false;
        }
        this.status = OFF;
        if (this.msg.length > 0) {
            this.activate();
        } else {
            $("#tickerBg").fadeOut()
            $("#tickerMsg").fadeOut()
            if (this.callback != null) {
                this.callback();
            }
        }

    }
    this.paint = function () {
        if (this.status != OFF) {
            if (this.status == 1) {
                this.x = this.x + this.incx;
                this.contador = this.contador - 1;
                if (this.contador <= 0) {
                    this.status = 2;

                    this.contador = this.contbase * this.multiplicador;
                }
            }
            if (this.status == 2) {
                this.contador = this.contador - 1;
                if (this.contador <= 0) {
                    this.status = 3;
                    this.contador = this.contbase;
                    this.incx = ((realw + 100) - this.x) / this.contador;
                }
            }
            if (this.status == 3) {
                this.x = this.x + this.incx;
                this.contador = this.contador - 1;
                if (this.contador <= 0) {
                    this.deactivate();
                }
            }
            $("#tickerMsg").css("left", this.x)
        }
    }
}


function MediaLibrary(g) {
    this.g = g;
    this.spritessrcs = []
    this.soundssrcs = []
    this.sprites = []
    this.sounds = []

    this.loadAll = function () {
        //alert("ini load");
        var loadedImagesCount = 0;
        var loadedSoundsCount = 0;
        var aux = null;
        for (var i = 0; i < this.spritessrcs.length; i++) {
            var image = new Image();
            aux = this.spritessrcs[i].split("|")
            var multix = 1;
            var multiy = 1;
            if (aux[2] != undefined) { multix = aux[2] }
            if (aux[3] != undefined) {
                multiy = aux[3]
            }
            image.src = aux[1];
            //image.width = image.width*multix;
            //image.height = image.width*multiy;

            image.onload = function () {
                loadedImagesCount++;

                if (loadedImagesCount >= ML.spritessrcs.length) {
                    loadFinished();
                }
            }
            this.sprites[aux[0]] = image;
        }
        //alert("es phonegap:" + isphonegap);
        for (var i = 0; i < this.soundssrcs.length; i++) {
            aux = this.soundssrcs[i].split("|")
            if (!isphonegap) {
                var myAudio = new Audio(aux[1]);
                if (aux[2] == "loop") {
                    myAudio.addEventListener('ended', function () {
                        this.currentTime = 0;
                        this.play();
                        //alert("loop normal");
                    }, false);
                }
                myAudio.addEventListener('canplaythrough', function () {
                    loadedSoundsCount++;
                    if (loadedSoundsCount >= ML.soundssrcs.length) {
                        loadSoundsFinished();
                    }
                }, false);
                this.sounds[aux[0]] = myAudio;
            } else {
                var myAudio;
                if (aux[2] == "loop") {
                    myAudio = new Media(getPhoneGapPath() + aux[1],
                    function () {
                        this.play();
                        //alert("loop phonegap");
                    },
                    // error callback
                    function (err) {
                        //alert("playAudio():Audio Error: " + err.code + err.message);
                    });
                } else {
                    myAudio = new Media(getPhoneGapPath() + aux[1],
                    function () {

                    },
                    // error callback
                    function (err) {
                        //alert("playAudio():Audio Error: " + err.code + err.message);
                    });
                }
                this.sounds[aux[0]] = myAudio;
            }
        }
    }
}

var ctx;
var ctxBG;
var timeraux = null;
var clockspeed = 50;
var pause = false;
var waiting = false;
var loadingweapon = 100;
var realw = 0
var realh = 0
//      var miw = 720
//      var mih = 960
var miw = 320
var mih = 470

var ratiow = 1
var ratioh = 1
var rangey = 55;
var bswitch = 0;
var paintRecal = true; // recalcular widhts, repintar fondo...

var ML = new MediaLibrary();

//statuses pajaros
var MOVER = 1;
var ESPERAR = 0;
var mouse = { x: 0, y: 0, antx: 0, anty: 0 }
var ghost = { div: null, xPos: 150, yPos: 4, dx: 0, dy: 0, w: 45 * 3, h: 55 * 3, tox: 150, toy: 4, movesteps: 0, incx: 0, incy: 0 }
var player = { div: null, xPos: 150, yPos: 4, dx: 0, dy: 0, w: 45 * 3, h: 55 * 3, tox: 150, toy: 4, movesteps: 0, incx: 0, incy: 0 }
var trap = { div: null, xPos: 1, yPos: 295, w: 45 * 3, h: 55 * 3, despx: 1, estado: 1, contestado: 0, tipo: 0 }
var pajaro = { div: null, xPos: 150, yPos: 4, dx: 0, dy: 0, w: 35 * 3, h: 35 * 3, tox: 150, toy: 4, movesteps: 20, incx: 0, incy: 0, status: ESPERAR }
var fondo = { div: null, xPos: 0, yPos: 0, dx: 0, dy: 0, w: miw, h: mih, tox: 150, toy: 4, movesteps: 20, incx: 0, incy: 0 }
var cursor = { div: null, xPos: 0, yPos: 0, dx: 0, dy: 0, w: 720, h: 960, tox: 150, toy: 4, movesteps: 20, incx: 0, incy: 0 }
var explodiv = { div: null, xPos: 0, yPos: 0, dx: 0, dy: 0, w: 720, h: 960, tox: 150, toy: 4, movesteps: 20, incx: 0, incy: 0 }
var contclick = 0;
var breaklockx = 0;
var breaklockdesp = 3;
var gamestatus = 0 //0 libre,1 capturado,2 pregana,3 prepierde, 5 capturado(colocar los munecos),6 gana,7 pierde,8 break lock,9 toca pajaro,10 showmsg;
var gamestatuscont = 0 //de momento no se usa
var fuel = 200;
//var gravity = .0005;
var gravity = .06;
var lander = null;
var landerHeight = 0;
var landerWidth = 0;
var timerkey = null;
var ticker = new MessageTicker();
var anims = new Array(8);
var cont = 0;
anims[cont++] = { src: 'aghost', numframes: 1, cont: 0, max: 4, current: 0, numrepes: 0 }
anims[cont++] = { src: 'aghosta', numframes: 1, cont: 0, max: 4, current: 0, numrepes: 0 }
anims[cont++] = { src: 'aplayer', numframes: 1, cont: 0, max: 4, current: 0, numrepes: 0 }
anims[cont++] = { src: 'bola', numframes: 4, cont: 0, max: 2, current: 0, numrepes: 0 }
anims[cont++] = { src: 'explo', numframes: 1, cont: 0, max: 2, current: 0, numrepes: 1 }
anims[cont++] = { src: 'donde', numframes: 1, cont: 0, max: 2, current: 0, numrepes: 0 }
anims[cont++] = { src: 'pajaro', numframes: 2, cont: 0, max: 2, current: 0, numrepes: 0 }
anims[cont++] = { src: 'trapon', numframes: 1, cont: 0, max: 1, current: 0, numrepes: 0 }
anims[cont++] = { src: 'trapoff', numframes: 1, cont: 0, max: 1, current: 0, numrepes: 0 }







//min
//levels[cont++] = {tipoghost:1, numpajaros:5, bg:'f1.jpg', txt: 'Paris', gravity: .001,  fuel: 200, trapmov: 1,gravinc:.04 };
//max
//levels[cont++] = {tipoghost:1, numpajaros:5, bg:'f1.jpg', txt: 'Paris', gravity: .03, rangey: 10, fuel: 100, trapmov: 1, gravinc: 1.2 };
var pajaros;
/*
var pajaros = new Array()
cont = 0;
pajaros[cont++] = { xPos: 0, yPos: 0, dx: 0, dy: 0, w: 29, h: 24, incx: 0, incy: 0 }
pajaros[cont++] = { xPos: 0, yPos: 0, dx: 0, dy: 0, w: 29, h: 24, incx: 0, incy: 0 }
pajaros[cont++] = { xPos: 0, yPos: 0, dx: 0, dy: 0, w: 29, h: 24, incx: 0, incy: 0 }
*/
var currentlevel = "";

var blank = new Image();
var donde0 = new Image();

var aghost0 = new Image();

var aghosta0 = new Image();

var pajaro0 = new Image();

var aplayer0 = new Image();

var aplayerfin = new Image();
var ef2 = new Image();

var bola0 = new Image();

var explo0 = new Image();

var trapoff = new Image();
var trapon0 = new Image();



function xxx(id) {
    return document.getElementById(id);
}
function getanim(idx) {
    return ML.sprites[anims[idx].src + "0"];
    var img = anims[idx];

    if (img.cont++ > img.max) {
        img.cont = 0;
        if (img.current + 1 < img.numframes) {
            img.current++
        }
        else if (img.numrepes == 0) {
            img.current = 0;
        }
    }

    var imgdef = (img.src + img.current);
    imgdef = ML.sprites[imgdef]
    if (imgdef != null) {
        return imgdef
    }
    else {
        return blank;
    }
}
//recal?
var midw1, midw2, midh1, midh2;
function checktouching(item1, item2) {
    if (midw1 == undefined) {

        midw1 = item1.w * ratiow / 4;
        midw2 = item2.w * ratiow / 4;
        midh1 = item1.h * ratioh / 4;
        midh2 = item2.h * ratioh / 4;

    }
    var difX = (item1.xPos + midw1) - (item2.xPos + midw2) - 0; // -0 converts to integer
    var difY = (item1.yPos + midh1) - (item2.yPos + midh2) - 0; // -0 converts to integer

    difX = parseInt(difX)
    difY = parseInt(difY)

    // set touch = 1 if it is touching an enemy
    if (difX > (-1 * (midw1)) && difX < midw2 && difY > (-1 * midh1) && difY < midh2) {
        touch = 1;
    }
    else touch = 0;
    return touch
}
function initgamepre() {

    initgame();
}
function initgame() {

    $("#divmenu").hide()
    $("#divloading").fadeIn("slow")




    gamestatus = 0
    /*
    lander = document.getElementById( 'divlander' );
    landerHeight = parseInt( lander.height );
    landerWidth = parseInt( lander.width );
    */
    //maximo 30 niveles

    if (currentlevel == "") {
        currentlevel = 0;
    }
    xxx("divmsgsIn").innerHTML = levels[currentlevel].txt
    fuel = levels[currentlevel].fuel;

    pajaros = new Array(levels[currentlevel].numpajaros)
    var despx = realw / (pajaros.length + 1)
    for (var cont = 0; cont < pajaros.length; cont++) {
        pajaros[cont] = { div: xxx("divpajaro" + cont), xPos: despx * cont, yPos: realh / 2, dx: 0, dy: 0, w: pajaro.w, h: pajaro.h, incx: 0, incy: 0, status: ESPERAR }
    }

    ghost.div = xxx("divghost")
    trap.div = xxx("divtrap")
    fondo.div = xxx("divfondo")
    player.div = xxx("divplayer")
    cursor.div = xxx("divcursor")
    explodiv.div = xxx("divexplo")

    $("#divloading").hide()
    $("#divgameplay").fadeIn("slow");
    $("#divcanvas").show();
    pause = true;

    startTimer();    // start the game
}
var maintimer = null;
var filterStrength = 20;
var frameTime = 0, lastLoop = new Date, thisLoop;

function mydrawimage(div, img, x, y, w, h) {
    if (div.xold != x) {
        div.style.left = x + "px";
        div.xold = x
    }
    if (div.yold != y) {
        div.style.top = y + "px";
        div.yold = y
    }

    if (div.children[0].title == "") {
        div.children[0].title = "ok"
        div.children[0].src = img.src;


    }
    if (paintRecal) {
        div.style.width = (w) + "px";
        div.style.height = (h) + "px";
        div.children[0].width = (w)
        div.children[0].height = (h)
    }
}
var fps = 40
function paint() {
    requestAnimationFrame(paint);
    /*
    setTimeout(function () {
    requestAnimationFrame(paint);
    // Drawing code goes here
    }, 1000 / fps);
    */
    var thisFrameTime = (thisLoop = new Date) - lastLoop;
    frameTime += (thisFrameTime - frameTime) / filterStrength;
    lastLoop = thisLoop;
    doAnimation()
}
function startTimer() {
    paint()
    /*
    var fps = 25
    maintimer = setInterval(paint, 500 / fps);
    */
}

function aleator(desde, hasta) {
    return Math.floor((Math.random() * hasta) + desde);
}
function movepajaro(idx) {
    if (pajaros[idx].status == MOVER) {
        if (pajaros[idx].movesteps > 0) {

            pajaros[idx].xPos = Math.max(0, Math.min(realw - 5, pajaros[idx].xPos + pajaros[idx].incx));

            pajaros[idx].yPos = Math.max(0, Math.min(realh - 5, pajaros[idx].yPos + pajaros[idx].incy));

            pajaros[idx].movesteps--;
        }
        else {
            pajaros[idx].movesteps = Math.max(10, 50 - Math.max(currentlevel, 10) + aleator(40, 80));
            pajaros[idx].status = ESPERAR;
        }
    }
    if (pajaros[idx].status == ESPERAR) {
        if (pajaros[idx].movesteps > 0) {
            pajaros[idx].movesteps--;
        } else {
            pajaros[idx].toy = pajaros[idx].yPos;
            pajaros[idx].tox = pajaros[idx].xPos;
            //alert(ghost.tox + "x-x" + ghost.toy)
            pajaros[idx].movesteps = 50 - currentlevel;
            var r = aleator(1, 2);
            var rsigno = aleator(1, 2);
            var rw = aleator(10, realw / 4);
            var rh = aleator(10, realh / 4);
            if (rsigno == 2) {

                rsigno = -1
            }
            if (r == 1) {
                var aux = Math.min(pajaros[idx].yPos + (rsigno * rh), realh - realh / 5);
                pajaros[idx].toy = Math.max(0, aux);
            }
            if (r == 2) {
                var aux = Math.min(pajaros[idx].xPos + (rsigno * rw), realw - gosw)
                pajaros[idx].tox = Math.max(0, aux);
            }
            var disty = pajaros[idx].toy - pajaros[idx].yPos;
            var distx = pajaros[idx].tox - pajaros[idx].xPos;
            var dist = distx + disty

            //ojo
            //pajaros[idx].movesteps = dist / levels[currentlevel].speed //(minimo 2;max:8)
            //pajaros[idx].movesteps = 2
            pajaros[idx].incx = 0;
            pajaros[idx].incy = 0;

            pajaros[idx].incx = (distx / (pajaros[idx].movesteps + levels[currentlevel].speed))
            pajaros[idx].incy = (disty / (pajaros[idx].movesteps + levels[currentlevel].speed))
            pajaros[idx].status = MOVER;

        }
    }
}
function linei(rx, ry, rw, rh, l1x, l1y, l2x, l2y) {
    var rect = { width: rw, height: rh, x: rx, y: ry };
    var p1 = { x: l1x, y: l1y };
    var p2 = { x: l2x, y: l2y };
    var p1x = p1.x;
    var p2x = p2.x;
    var rectX = rect.x;
    var rectWidth = rect.width;

    // check if the projections onto the x axis overlap
    if (p1x < p2x && (rectX > p2x || rectX + rectWidth < p1x) || (rectX > p1x || rectX + rectWidth < p2x)) {
        return false;
    }

    var p1y = p1.y;
    var p2y = p2.y;
    var rectY = rect.y;
    var rectHeight = rect.height;

    // check if the projections onto the y axis overlap
    if (p1y < p2y && (rectY > p2y || rectY + rectHeight < p1y) || (rectY > p1y || rectY + rectHeight < p2y)) {
        return false;
    }

    // Check whether all 4 corners are on the same side of the segment. If they are,
    // we know there is no intersection.
    //
    // F(x, y) = (y2-y1)x + (x1-x2)y + (x2*y1-x1*y2)
    //
    // Do this by checking the sign of F(x, y) for all 4 corners of the rectangle.
    // If all the signs match, then they are all on the same side of the segment.
    // If they differ, it means that the the segment overlaps (because we already checked that)
    // its shadow on the x and y axes overlaps the rectangles shadows.
    var a = p2y - p1y;
    var b = p1x - p2x;
    var c = p2x * p1y - p1x * p2y;
    var bottomLeft = rectX * a + rectY * b + c;

    var isNegative = bottomLeft < 0;

    var aWidth = a * rectWidth;
    var x = bottomLeft + aWidth;
    if (isNegative !== x < 0) {
        return true;
    }

    var bHeight = b * rectHeight;
    var y = bottomLeft + bHeight;
    if (isNegative !== y < 0) {
        return true;
    }

    var z = y + aWidth;
    if (isNegative !== z < 0) {
        return true;
    }

    if (!(bottomLeft && x && y && z)) {
        return true;
    }

    // all 4 of the rectangles corners are on the same side of the line
    return false;
}

var gosw, gosh, realwentre2, realhentre2;
function movearrastrar() {
    if (ghost.movesteps > 0) {
        ghost.xPos = ghost.xPos + ghost.incx;
        ghost.yPos = ghost.yPos + ghost.incy;
        ghost.movesteps = ghost.movesteps - 1;
    }
    else

        if (ghost.movesteps <= 0 && parseInt(mouse.x) != mouse.antx && parseInt(mouse.y) != mouse.anty) {
            //alert(ghost.tox + "x-x" + ghost.toy)
            if (mouse.y > realh - rangey) {
                mouse.y = realh - rangey;
            }
            if (gosw == undefined) {
                gosw = (ghost.w * ratiow / 2);
                gosh = (ghost.h * ratioh / 2);


            }
            var disty = mouse.y - (ghost.yPos + gosh / 2);
            var distx = mouse.x - (ghost.xPos + gosw / 2);

            var dist = Math.abs(distx) + Math.abs(disty)
            //ojo velocidad de arrastre
            ghost.movesteps = parseInt(dist / Math.max(1, levels[currentlevel].speed) / 1.5) //(minimo 2;max:8)

            ghost.incx = distx / ghost.movesteps
            ghost.incy = disty / ghost.movesteps
        }
    //$("debugOutput").innerHTML=mouse.x + "-" + mouse.y + "+" + ghost.incx + "-" + ghost.incy
}

function move() {
    if (ghost.movesteps >= 0) {
        ghost.xPos = ghost.xPos + ghost.incx;
        ghost.yPos = ghost.yPos + ghost.incy;
        ghost.movesteps--;
    }
    else {
        //alert(ghost.tox + "x-x" + ghost.toy)

        //no caiga cerca del click
        var caelejos = false;
        var alex, aley;
        while (!caelejos) {
            caelejos = true;
            alex = Math.ceil(Math.random() * realw);
            aley = Math.ceil(Math.random() * realh);
            //alert(mouse.x + "-" + alex +"@" + mouse.y + "-" + aley +" gos" + gosw + "-" + gosh);
            if (linei(mouse.x - gosw, mouse.y - gosh, gosw * 2, gosh * 2, ghost.xPos, ghost.yPos, alex, aley)) {
                caelejos = false;
            }
        }
        ghost.tox = alex;
        ghost.toy = aley;
        ghost.tox = Math.min(ghost.tox, realw);
        ghost.toy = Math.min(ghost.toy, realh);

        var disty = ghost.toy - ghost.yPos;
        var distx = ghost.tox - ghost.xPos;
        var dist = Math.abs(distx) + Math.abs(disty)

        ghost.movesteps = dist / (levels[currentlevel].speed * 7.5) //(minimo 2;max:8)
        ghost.incx = (distx / ghost.movesteps)
        ghost.incy = (disty / ghost.movesteps)
    }
}
function move2() {
    if (ghost.movesteps >= 0) {
        ghost.xPos = ghost.xPos + ghost.incx;
        ghost.yPos = ghost.yPos + ghost.incy;
        ghost.movesteps--;
    }
    else {
        ticker.multiplicador = 5;
        ticker.pausar = true;

        if (currentlevel==1){
        ticker.msg.push("Take the ghost to the trap by <u>single</u> tapping on screen<BR/><font style='color:red'>AVOID the skulls</font>");
        }
        ticker.msg.push("GOTCHA!");
        ticker.activate();
        ticker.callback = function () {
            waiting = false;
            mouse.x = ghost.xPos;
            mouse.y = ghost.yPos;
        }
        gamestatus = 1;


        paintRecal = true;

        mouse.x = realw - ghost.w;
        mouse.y = 0;
    }
}
function resetmove2() {
    ghost.movesteps = 35;
    ghost.toy = 0;

    ghost.tox = realw - gosw;
    var disty = ghost.toy - ghost.yPos;
    var distx = ghost.tox - ghost.xPos;

    ghost.incx = parseInt(distx / ghost.movesteps)
    ghost.incy = parseInt(disty / ghost.movesteps)

}
var linew, rayosaux1, rayosaux2;
function rayo2(ctx) {

    if (mouse.x < realw && mouse.y < realh) {
        var r1xold, r1yold;
        var desp1 = Math.round(30 * Math.random())
        var desp2 = Math.round(5 * Math.random())
        r1xold = mouse.x;
        //r1yold=realh/2
        r1yold = mouse.y - 15 + desp1;
        //r2yold=0;                       
        ctx.beginPath();
        ctx.moveTo(r1xold, r1yold);
        if (linew == undefined) {
            linew = 13 * ratiow;
            rayosaux1 = realw / 2;
            rayosaux2 = realh - gosh - 3;
        }
        ctx.lineTo(rayosaux1 + desp2, rayosaux2);

        ctx.lineWidth = linew;
        //ctx.endPath();
        ctx.stroke();
    }
}
var rayoaux1, rayoaux2, rayoaux3;
function rayo(ctx) {
    if (mouse.x < realw && mouse.y < realh) {
        var r1xold, r1yold;
        if (rayoaux1 == undefined) {
            linew = 5 * ratiow;
            rayoaux1 = (gosw);
            rayoaux2 = (gosh);
            rayoaux3 = realh - gosh - 3;
        }
        ctx.lineWidth = linew;
        r1xold = ghost.xPos + rayoaux1;

        r1yold = ghost.yPos + rayoaux2;


        var pasoy = Math.round(Math.abs((ghost.yPos - rayoaux3)) / 20);

        var pasox = 5;
        ctx.beginPath();
        ctx.moveTo(r1xold, r1yold);
        for (i = 0; i < 18; i++) {
            var xrandom = Math.round(pasox * Math.random());

            var newx = r1xold + xrandom;
            if (r1xold + xrandom > ghost.xPos) {
                newx = r1xold - xrandom
            }

            ctx.lineTo(newx, r1yold + pasoy);

            r1xold = newx;
            r1yold = r1yold + pasoy

        }

        ctx.stroke();
    }
}

function testclick() {
    if (gosw == undefined) {
        gosw = (ghost.w * ratiow / 2);
        gosh = (ghost.h * ratioh / 2);
    }
    if (contclick >= 1) {


        if (mouse.x < ghost.xPos + gosw && mouse.x > ghost.xPos) {
            if (mouse.y < ghost.yPos + gosh && mouse.y > ghost.yPos) {
                gamestatus = 5;
                ML.sounds["rayo"].play();
                resetmove2();
            }
        }
    }
    if (contclick <= 0) {
        mouse.x = realw - gosw;
        mouse.y = 0;
    }

}
var divrayosx;
function rayos() {
    if (mouse.x < realw && mouse.y < realh) {
        if (divrayosx == undefined) {
            divrayosx = xxx("divrayos");
            divrayosx.children[0].src = ML.sprites["rayoanim"].src;
            divrayosx.children[0].width = 50 * ratiow;
            divrayosx.children[0].height = realh - player.yPos - playerh / 2;
            divrayosx.style.width = divrayosx.children[0].width + "px";
            divrayosx.style.height = divrayosx.children[0].height + "px";
            divrayosx.style.top = "0px";
        }

        if (ghost.xPos != ghost.xPosold) {
            divrayosx.style.left = (ghost.xPos) + "px";
            ghost.xPosold = ghost.xPos;
        }

        //divrayosx.style.height=
        if (ghost.yPos != ghost.yPosold) {
            divrayosx.style.clip = "rect(" + (parseInt(ghost.yPos) + gosh / 2 - parseInt(divrayosx.style.top)) + "px,100px,2000px,0px)";
            ghost.yPosold = ghost.yPos;
        }


    }
    /*
    ctx.strokeStyle = "#ff9933";
    rayo(ctx);

    ctx.strokeStyle = "#ffffff";
    rayo(ctx);
    ctx.strokeStyle = "#ffcc00";
    rayo(ctx);
    rayoesfera()
    */
}
function rayoesfera() {
    //            ctx.shadowBlur = 3;
    //            ctx.shadowColor = "white";
    if (bswitch == 0) {
        ctx.fillStyle = "#ff9933";
        bswitch = 1;
        ctx.strokeStyle = "#ffffff";
    }
    else {
        ctx.fillStyle = "#ffcc00";
        bswitch = 0;
        ctx.strokeStyle = "#ff9933";
    }
    ctx.beginPath();
    ctx.arc(ghost.xPos, realh - (ghost.h * ratioh) - 10, 15, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
}
function rayos2() {


    ctx.strokeStyle = "#ff9933";
    rayo2(ctx);
    /*
    ctx.strokeStyle = "#ffffff";
    rayo2(ctx);
    ctx.strokeStyle = "#ffcc00";
    rayo2(ctx);
    */

}
function timeoutgameover() {
    hideGame();
    //   pauseAllSfx();
    ML.sounds["llorando"].play();
    $("#divgameover").fadeIn("slow")
    clearTimeout(timeraux)
    gamestatus = 666;
}
function hideGame() {
    $("#divgameplay").hide()
    $(".divSprite").hide()
    $("#divcanvas").hide()
    $("#divfondo").hide()
}
function updateStars2(level, f) {
/*
    var oldf = getCookie("level" + level);
    if (oldf != undefined) {
        oldf = oldf.split("-")[1];
    }

    if (oldf == "" || oldf == undefined || oldf < f) {
*/
    {
        var stars = 1;

        if (f > 80) {
            stars = 2;
        }
        if (f > 140) {
            stars = 3;
        }
        f = f + ((f * level) / 50);
        f = parseInt(f * 100);
		//alert("cook"+pad(level, 3));
        setCookie("level" + pad(level, 3), stars + "-" + f, new Date("January 01, 2020 00:00:01"));
		return stars;
    }
}
function updateStars(){
    //alert(currentlevel)
    return updateStars2(currentlevel, fuel);

}
function timeoutnextlevel() {
    hideGame();
    //           pauseAllSfx();
    ML.sounds["misionfinished"].play();
    $("#divnextlevel").fadeIn("slow")
	var stars=updateStars();
    $("#stars" + stars).fadeIn("slow");
    clearTimeout(timeraux)
    gamestatus = 666;

}
function irain(donde) {
    window.location.href = donde
}
function ira(donde) {
    window.setTimeout(function () { irain(donde) }, clockspeed * 10)

}
function gotonext() {
    $("#divloading").fadeIn("slow");
    $("#divnextlevel").hide()
	updateStars();
    if (currentlevel < levels.length - 1) {
        ira(levels[parseInt(currentlevel) + 1].julkclave + ".html");
    } else {
        hideGame();
        $("#divloading").fadeOut("slow");
        $("#divgamefinished").fadeIn("slow")
        $("#divgameplay").hide()
        $("#divnextlevel").hide()
    }
}
function gotosavedlevel() {
    $("#divmenu").hide()
    $("#divloading").fadeIn("slow")
    ira(levels[parseInt(getCookie("ghostlevel")) + 1].julkclave + ".html");
}
function btexit() {
$("body").hide();
    $("div").hide();
    ML.sounds["button"].play();
    if (window.JSInterface != undefined) {
        window.JSInterface.exit();
    }

}
function btback() {
$("body").hide();
    ML.sounds["button"].play();
	updateStars();
    
    document.location.href='indexx.html'

}
function btcontinueclick() {
 
    ML.sounds["button"].play();

    $('#divcontinue').fadeIn();
    $('#divmenu').fadeOut();
    this.blur();
}
function btstart() {
     ML.sounds["button"].play();
    $("#divmenu").hide()
    $("#divloading").fadeIn("slow")
    ML.sounds["button"].play();
	
    ira(levels[1].julkclave + ".html");
}
function btgameover() {
bttryagain();
return true;
    $("#divgameover").hide()
    $("#divloading").fadeIn("slow")
    ML.sounds["button"].play();
    if (getCookie("ghostlevel") != "") {
        ira(levels[parseInt(currentlevel)].julkclave + ".html");
    } else {
        ira(levels[1].julkclave + ".html");
    }
}
function bttryagain() {
    hideGame();
    ML.sounds["button"].play();
    $("#divgamefinished").hide()
    $("#divloading").fadeIn("slow")
    ira(levels[parseInt(currentlevel)].julkclave + ".html");
}
function clearCanvas() {
    c.width = c.width
}
var c = null;
var playerw, playerh, realwentre2, trapw, traph, pajarow, pajaroh;
var canvastimer = null;

function doAnimation() {
    ticker.paint();
    if (waiting) { return; }

    if (fuel <= 0) {
        hideGame()
        $("#divgameplay").hide()
        $("#divgameover").fadeIn("slow")
        return
    }
    //ctx.clearRect(0, 0, realw, realh);
    if (c == null) {
        c = document.getElementById("divcanvas")
        ctx = c.getContext('2d');
    }
    if (gosw == undefined) {
        gosw = (ghost.w * ratiow / 2);
        gosh = (ghost.h * ratioh / 2);

    }
    if (pajarow == undefined) {
        pajarow = (pajaro.w * ratiow / 2);
        pajaroh = (pajaro.h * ratioh / 2);
    }
    if (playerw == undefined) {
        playerw = (player.w * ratiow / 2);
        playerh = (player.h * ratioh / 2);
    }
    if (realwentre2 == undefined) {
        realwentre2 = (realw / 2);
    }
    if (trapw == undefined) {
        trapw = (trap.w * ratiow / 2);
        traph = (trap.h * ratioh / 2);
    }


    var fueltpc = parseInt((fuel * realw) / levels[currentlevel].fuel)
    if (fuel > 140) {
        xxx("divenergy").style.backgroundColor = "#EDF553";
    }
    else if (fuel > 80) {
        xxx("divenergy").style.backgroundColor = "#F5D453";
    }
    else if (fuel > 50) {
        xxx("divenergy").style.backgroundColor = "#FA360A";
    }

    //ojo probar que pasa si no refresco la barra de fuel
    xxx("divenergy").style.width = fueltpc + "px";




    if (pause != true) {
        if (gamestatus == 0) {
            //fuel = fuel - currentlevel / 30
            fuel = fuel - (levels[currentlevel].speed / 20)
            move();
            mydrawimage(ghost.div, getanim(0), parseInt(ghost.xPos), parseInt(ghost.yPos), gosw, gosh);
            mydrawimage(player.div, getanim(2), parseInt(realwentre2 - playerw / 2), parseInt(realh - playerh - 3), playerw, playerh);
            if (loadingweapon <= 0) {
                testclick();
            }
            if (paintRecal) {
			/*
				if (screenh/screenw>1 && screenh/screenw<1.8){
				mydrawimage(fondo.div, ML.sprites["fondo"], 0, 0, realw, realh);
				alert(realw +" " + realh);
				}else{
                mydrawimage(fondo.div, ML.sprites["fondo"], 0, 0, fondo.w * ratiow, fondo.h * ratioh);
				}
			*/
				mydrawimage(fondo.div, ML.sprites["fondo"], 0, 0, fondo.w * ratiow, fondo.h * ratioh);
                paintRecal = false;
            }
            if (loadingweapon > 0 && !waiting) {
                loadingweapon = loadingweapon - 1;
                if (parseInt(loadingweapon/10) %2==0 || loadingweapon >90){
                   player.div.style.display="block";
                }else{
                   player.div.style.display="none";
                }
            }            
            if (contclick-- >= 1 && loadingweapon <= 0) {
                c.width = c.width;
                rayos2();


                if (currentlevel < 10) {
                    fuel = fuel - 10
                } else {
                    fuel = fuel - 7
                }
                canvastimer = setTimeout(function () { clearCanvas() }, 500);


            }
        }
        else if (gamestatus == 1) {
            fuel = fuel - (levels[currentlevel].speed / 20)

            if (levels[currentlevel].traptipo != 0) {
                if (trap.contestado-- <= 0) {
                    if (trap.estado == 1) {
                        trap.estado = 0;
                        trap.contestado = 100 + (Math.ceil(Math.random() * currentlevel) * 3)
                    }
                    else {
                        trap.estado = 1;
                        trap.contestado = 100 - (Math.ceil(Math.random() * currentlevel) * 3)
                    }
                }
            }
            //$("debugOutput").innerHTML = trap.contestado + "|" + trap.estado
            movearrastrar()



            if (trap.estado == 0) {
                mydrawimage(trap.div, getanim(8), trap.xPos, realh - traph, trapw, traph);
            } else {
                mydrawimage(trap.div, getanim(7), trap.xPos, realh - traph, trapw, traph);
            }

            mydrawimage(ghost.div, getanim(3), parseInt(ghost.xPos), parseInt(ghost.yPos), gosw, gosh);

            mydrawimage(player.div, getanim(3), parseInt(ghost.xPos), parseInt(realh - playerh - 3), playerw, playerh);

            //ctx.drawImage(getanim(1), ghost.xPos, ghost.yPos, ghost.w, ghost.h);
            //ctx.drawImage(getanim(2), ghost.xPos - (ghost.w / 2), realh - ghost.h - 3, ghost.w, ghost.h);


            if (ghost.movesteps > 0) {
                mydrawimage(cursor.div, getanim(5), mouse.x - 15, mouse.y - 15, 30, 30);
            }
            for (var i = 0; i < pajaros.length; i++) {
                movepajaro(i);
                if (checktouching(ghost, pajaros[i]) == 1) {
                    gamestatus = 9;
                    ML.sounds["rayo"].pause();
                    ML.sounds["explo"].play();

                }
                if (pajaros[i].status != ESPERAR)
                    mydrawimage(pajaros[i].div, getanim(6), pajaros[i].xPos, pajaros[i].yPos, pajarow, pajaroh);

            }

            //ctx.drawImage(getanim(2), ghost.xPos, ghost.yPos, 40, 40);

            rayos();


            if (trap.estado == 1 && ghost.yPos + (gosh) > realh - (gosh) && ghost.xPos + gosw >= trap.xPos && ghost.xPos <= trap.xPos + trapw) {
                gamestatus = 2;
                divrayosx.style.display = "none";
                ML.sounds["rayo"].pause();
                ML.sounds["absorbe"].play();
                //document.getElementById("debugOutput").innerHTML = "<h1>STAGE CLEAR!!</h1>";
            }
            //window.setTimeout(function(){doAnimation()}, clockspeed);

        }
        if (gamestatus == 2) {
            if (ghost.xPos > (trap.xPos + trap.w / 2)) {
                ghost.xPos--
            }
            if (ghost.xPos < (trap.xPos + trap.w / 2)) { ghost.xPos++ }
            if (ghost.w > 8) { ghost.w = ghost.w - 0.25 }
            if (ghost.h > 8) { ghost.h = ghost.h - 0.25 }
            if (ghost.yPos + ghost.h < realh - 5) {
                ghost.yPos++
            }
            mydrawimage(trap.div, getanim(7), trap.xPos, realh - traph, trapw, traph);
            mydrawimage(ghost.div, getanim(1), trap.xPos, ghost.yPos, ghost.w, ghost.h);
            mydrawimage(player.div, getanim(2), trap.xPos, realh - (playerh) - 3, playerw, playerh);


            if (timeraux == null)
                timeraux = setTimeout(function () { timeoutnextlevel() }, 3000);
            window.setTimeout(doAnimation, clockspeed);
        }

        if (gamestatus == 5) {
            move2();
ghost.div.children[0].title="";
            mydrawimage(ghost.div, getanim(1), ghost.xPos, ghost.yPos, gosw, gosh);
            mydrawimage(player.div, getanim(2), ghost.xPos, realh - (playerh) - 3, gosw, gosh);
            //window.setTimeout(doAnimation, clockspeed);
            rayos();

        }
        if (gamestatus == 8) {
            ctx.fillStyle = "#000000";
            var with2 = 290;
            ctx.fillRect(0, 0, 300, 20);
            ctx.fillStyle = "#ff0000";
            var margenerror = 20;
            var margen1, margen2
            margen1 = (with2 / 2) - (margenerror / 2)
            margen2 = (with2 / 2) + (margenerror / 2)
            ctx.fillRect(5, 2, margen1, 16);
            ctx.fillStyle = "#00ff00";
            ctx.fillRect(margen1, 2, margenerror, 16);
            ctx.fillStyle = "#ff0000";
            ctx.fillRect(margen2, 2, with2 - margen2, 16);
            if (breaklockx < 4) { breaklockdesp = 10; }
            if (breaklockx > 285) { breaklockdesp = -10; }
            breaklockx = breaklockx + breaklockdesp
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(breaklockx, 2, 10, 10);

            //window.setTimeout(doAnimation, clockspeed*2);
        }
        if (gamestatus == 9) {
            //document.getElementById("debugOutput").innerHTML = "OVERLOAD!!OVERLOAD!!";
            var explo = getanim(4);
            player.div.children[0].title = "";
            mydrawimage(player.div, ML.sprites["aplayerfin"], ghost.xPos, realh - (playerh) - 3, gosw, gosh);
            mydrawimage(explodiv.div, explo, ghost.xPos, realh - (playerh) - 3, gosw, gosh);
            mydrawimage(ghost.div, explo, ghost.xPos, ghost.yPos, gosw, gosh);
            divrayos.style.display = "none"
            //ctx.drawImage(getanim(1), ghost.xPos - (ghost.w / 2), realh - ghost.h - 3, ghost.w, ghost.h);
            //window.setTimeout(doAnimation, clockspeed*2);
            if (timeraux == null) {
                timeraux = setTimeout(function () { timeoutgameover() }, 3000);
            }
        }
    }
    else {

        $("#divmsgs").fadeIn("slow")
        $("#divcanvas").hide()


    }

}
var framerate = 0;
function initengine() {
/*
    var fpsOut = document.getElementById('fps');

    setInterval(function () {
        framerate = (1000 / frameTime).toFixed(1);
        fpsOut.innerHTML = framerate + " fps";
    }, 1000);
*/

}
var antwidth = 0;
var screenw,screenh;
function resize() {
    if (antwidth == $(window).width()) {
        return;
    }
    antwidth = $(window).width();
    ratiow = $(window).width() / miw;
    ratioh = $(window).height() / mih;

	screenw=$(window).width();
	screenh=$(window).height();
    ratiow = Math.min(ratiow, ratioh);
    ratioh = Math.min(ratiow * 1.3, ratioh);
    //	    alert(ratiow + " - " + ratioh)
    realw = miw * ratiow;
    realh = mih * ratioh;

    var canvas = document.getElementById('divcanvas');
    canvas.style.top = "0px";
    canvas.style.left = "0px";
    canvas.width = realw;
    canvas.height = realh;
    canvas.style.zIndex = 8;
    canvas.style.position = "absolute";
    //document.body.appendChild(canvas);
    //                            document.getElementById("divcanvas").setAttribute("width",(realw) + "px");
    //                            document.getElementById("divcanvas").setAttribute("height",(realh ) + "px");                                            
    $('.bigDiv').css({
        position: 'absolute',
        left: 0,
        top: 0,
        width: realw,
        height: realh
    });

    $('.menuimg').each(function () {
        var aux = parseInt((80 * realw) / 100);

        if (parseInt(this.width) > aux || 1 == 1) {
            this.width = aux;
        }
    });
}
var timersound=null;
function initTouchs() {
    if (typeof (document.body.ontouchstart) == "undefined") {
        document.getElementById("divcanvas").onclick = function (e) {
            e.preventDefault();
            mouse.antx = mouse.x
            mouse.anty = mouse.y
            mouse.x = e.pageX;
            mouse.y = e.pageY;
            if (mouse.x < 30 && mouse.y < 30) {
                waiting = !waiting;
                ticker.multiplicador = 1000;
                ticker.msg.push("PAUSED");
                ticker.activate();
                ticker.callback = function () {
                    waiting = false;
                }
            }
            if (gamestatus != 5) {
                ghost.movesteps = 0;
            }
            if (gamestatus == 0) {
                contclick = 2;
                if (!waiting && loadingweapon <= 0) {
					window.clearInterval(timersound)
					timersound=setTimeout(function(){ML.sounds["pium"].play();},500)
                    

                }
            }
            if (ticker.status == 2) {
                ticker.contador = 1;
            }

        }
        document.getElementById("divmsgs").onclick = function (e) {
            e.preventDefault();
            if (pause == true) {
                pause = false;
                $("#divmsgs").hide();
                $("#divcanvas").fadeIn("slow");
                $(".divSprite").fadeIn("slow");




                //document.getElementById("debugOutput").innerHTML = "Info:Tap above the ghost to catch him...";
                doAnimation()
                ticker.pausar = true;
                ticker.msg.push("GO!!!");
                ticker.msg.push("Ready??");
                if (currentlevel==1){
                ticker.msg.push("So DONT tap as mad...your energy is limited");
                ticker.msg.push("When you tap, if you miss the shot, your energy will decrease");
                ticker.msg.push("Single tap the ghosth and catch it!");
                }
                ticker.callback = function () {
                    waiting = false;
                }
                ticker.activate();
                //		       var dumtimeout=setTimeout(function () { ticker.activate() },1000);
            }
        }

    } else {

        document.getElementById("divcanvas").ontouchstart = function (e) {
            e.preventDefault();
            mouse.antx = mouse.x
            mouse.anty = mouse.y
            mouse.x = e.touches[0].pageX;
            mouse.y = e.touches[0].pageY;
            if (mouse.x < 30 && mouse.y < 30) {
                waiting = !waiting;
            }
            if (gamestatus != 5) {
                ghost.movesteps = 0;
            }
            if (gamestatus == 0) {
                contclick = 2;
                if (!waiting && loadingweapon <= 0) {
                    ML.sounds["pium"].play();
                }
            }
            if (ticker.status == 2) {
                ticker.contador = 1;
            }

        }
        document.getElementById("divmsgs").ontouchstart = function (e) {
            e.preventDefault();
            if (pause == true) {
                pause = false;
                $("#divmsgs").hide();
                $("#divcanvas").fadeIn("slow");
                $(".divSprite").fadeIn("slow");




                //document.getElementById("debugOutput").innerHTML = "Info:Tap above the ghost to catch him...";
                doAnimation()
                ticker.pausar = true;
                ticker.msg.push("Go!!!");
                ticker.msg.push("Ready?");
				if (currentlevel==1){
                ticker.msg.push("So DONT tap as mad...your energy is limited");
                ticker.msg.push("When you tap, if you miss the shot, your energy will decrease");
                ticker.msg.push("Single tap the ghosth and catch it!");
                }
				   ticker.callback = function () {
                    waiting = false;
                }
                ticker.activate();
                //		       var dumtimeout=setTimeout(function () { ticker.activate() },1000);
            }
        }
    }


    window.addEventListener('touchmove', function (e) {
        // we're not interested in this,
        // but prevent default behaviour
        // so the screen doesn't scroll
        // or zoom
        //    e.preventDefault();
        console.log("tm");
    }, false);
    window.addEventListener('touchend', function (e) {
        // as above
        //    e.preventDefault();
        console.log("te");
    }, false);
    window.addEventListener('mousemove', function (e) {
        // we're not interested in this,
        // but prevent default behaviour
        // so the screen doesn't scroll
        // or zoom
        //    e.preventDefault();
        //console.log("mm");
    }, false);
    window.addEventListener('mousedown', function (e) {
        // we're not interested in this,
        // but prevent default behaviour
        // so the screen doesn't scroll
        // or zoom
        //    e.preventDefault();
        console.log("md");
    }, false);
}
{
    //cargo imagenes antes, por si las moscas

    var pagename = location.pathname.substring(1);
    pagename = pagename.replace(".html", "").split("/");
    pagename = pagename[pagename.length - 1];
    //alert("pagename" + pagename);
    //alert("pagename decoded" + decodeStr(pagename))
    for (var i = 0; i < levels.length; i++) {
        if (decodeStr(pagename) == replaceAll(levels[i].txt.toUpperCase(), ' ', '')) {
            currentlevel = i;

            break;
        }
    }
    //alert(currentlevel);
    if (currentlevel == "" || currentlevel == "NaN") {
        currentlevel = 0;
    } else {

        if (decodeStr(pagename) != replaceAll(levels[currentlevel].txt.toUpperCase(), ' ', '')) {
            document.location.href = 'indexx.html'
            currentlevel = 0;
        }
    }
    if (currentlevel != "") {
        updateStars2(currentlevel, 0);
        ML.spritessrcs.push("blank|blank.png|" + ratiow + "|" + ratioh)
        ML.spritessrcs.push("donde0|donde0.gif|" + ratiow + "|" + ratioh)

        ML.spritessrcs.push("aghost0|ghost" + levels[currentlevel].tipoghost + ".gif|" + ratiow + "|" + ratioh)
        
        ML.spritessrcs.push("aghosta0|ghost" + levels[currentlevel].tipoghost + "a.gif|" + ratiow + "|" + ratioh)
        
        ML.spritessrcs.push("pajaro0|skull.gif|" + ratiow + "|" + ratioh)
        ML.spritessrcs.push("aplayer0|player.gif|" + ratiow + "|" + ratioh)
        //           ML.spritessrcs.push("aplayer1|player1.png|" + ratiow + "|" + ratioh)
        ML.spritessrcs.push("aplayerfin|player2.png|" + ratiow + "|" + ratioh)
        ML.spritessrcs.push("ef|ef0.gif|" + ratiow + "|" + ratioh)
        ML.spritessrcs.push("bola0|bolarayo0.png|" + ratiow + "|" + ratioh)
        /*
        ML.spritessrcs.push("bola1|bolarayo1.png|" + ratiow + "|" + ratioh)
        ML.spritessrcs.push("bola2|bolarayo2.png|" + ratiow + "|" + ratioh)
        ML.spritessrcs.push("bola3|bolarayo3.png|" + ratiow + "|" + ratioh)
        ML.spritessrcs.push("bola4|bolarayo4.png|" + ratiow + "|" + ratioh)
        */
        ML.spritessrcs.push("explo0|explo.gif|" + ratiow + "|" + ratioh)
        /*
        ML.spritessrcs.push("explo1|explo1.png|" + ratiow + "|" + ratioh)
        ML.spritessrcs.push("explo2|explo2.png|" + ratiow + "|" + ratioh)
        ML.spritessrcs.push("explo3|explo3.png|" + ratiow + "|" + ratioh)
        ML.spritessrcs.push("explo4|explo4.png|" + ratiow + "|" + ratioh)
        ML.spritessrcs.push("explo4|blank.png|" + ratiow + "|" + ratioh)
        */
        ML.spritessrcs.push("trapoff0|trapoff0.png|" + ratiow + "|" + ratioh)
        ML.spritessrcs.push("trapon0|trap.gif|" + ratiow + "|" + ratioh)
        ML.spritessrcs.push("trapon1|trapon1.png|" + ratiow + "|" + ratioh)
        ML.spritessrcs.push("rayoanim|rayo0.gif|" + ratiow + "|" + ratioh)
        ML.spritessrcs.push("fondo|" + levels[currentlevel].bg + "|" + ratiow + "|" + ratioh)
    }
}
if (currentlevel != "") {
    ML.soundssrcs.push("pium|http://gh.delasource.info/pium2.mp3")
    ML.soundssrcs.push("rayo|http://gh.delasource.info/rayo.mp3|loop")
    ML.soundssrcs.push("llorando|http://gh.delasource.info/llorando.mp3")
    ML.soundssrcs.push("explo|http://gh.delasource.info/explo1.mp3")
    ML.soundssrcs.push("absorbe|http://gh.delasource.info/absorbe.mp3")
    ML.soundssrcs.push("misionfinished|http://gh.delasource.info/misionfinished.mp3")
    ML.soundssrcs.push("button|http://gh.delasource.info/button.mp3");    
} else {
    ML.soundssrcs.push("button|http://gh.delasource.info/button.mp3");
}



//ML.soundssrcs.push("fx1|bell1.ogg")                  
function loadFinished() {
//    alert("cargadas las imgs")
    initengine();
    initgamepre();
}

$(document).ready(function () {

    resize();
    initTouchs();
    //alert("ready level"+ currentlevel )
    if (currentlevel != "") {
        $(".bigDiv").hide();
        $("#divloading").show();
        if (!isphonegap)
            ML.loadAll();

    } else {
        $("#divmenu").show();
        ML.loadAll();
    }
});
$(window).on('load resize', function () {
    resize();
});





// PhoneGap esta listo
if (isphonegap) {
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        ML.loadAll();
        loadSoundsFinished();
    }
} else {
    function loadSoundsFinished() {
        //               ML.sounds["bgm"].play();
    }
}
                

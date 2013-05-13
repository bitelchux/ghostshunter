var OFF=0;
var ON=1;
function setCookie(name, value, expires, path, domain, secure) {
    document.cookie =
    name + "=" + escape(value) +
    (expires ? "; expires=" + expires.toGMTString() : "") +
    (path ? "; path=" + path : "") +
    (domain ? "; domain=" + domain : "") +
    (secure ? "; secure" : "");
}

// ***** setCookieLT *****

// PARAMETERS: lifetime - cookie lifetime in seconds

function setCookieLT(name, value, lifetime, path, domain, secure) {
    if (lifetime) { lifetime = new Date(Date.parse(new Date()) + lifetime * 1000); }
    setCookie(name, value, lifetime, path, domain, secure);
}

// ***** getCookie *****

function getCookie(name) {
    var cookie, offset, end;
    cookie = " " + document.cookie;
    offset = cookie.indexOf(" " + name + "=");
    if (offset == -1) { return undefined; }
    offset += name.length + 2;
    end = cookie.indexOf(";", offset)
    if (end == -1) { end = cookie.length; }
    return unescape(cookie.substring(offset, end));
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
    this.activate = function () {
        if (this.status != OFF) { return; }
        waiting = true;
        this.status = 1;
        this.contador = this.contbase;
        this.x = -100;
        this.incx = ((realw / 2) - this.x) / this.contador;
        var msg = this.msg.pop().split("|");
        $("#tickerMsg").html("<h3>" + msg[0] + "</h3>")
        document.getElementById("tickerMsg").style.top = this.y + "px"
        document.getElementById("tickerMsg").style.left = this.x + "px"
        //document.getElementById("tickerMsg").style.width = realw + "px"

        document.getElementById("tickerBg").style.top = (this.y) + "px"
        document.getElementById("tickerBg").style.left = 0 + "px"
        document.getElementById("tickerBg").style.width = realw + "px"


        $("#tickerBg").fadeIn()
        $("#tickerMsg").fadeIn()

    }
    this.deactivate = function () {
        waiting = false;
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
                    this.contador = this.contbase * 100;
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
      this.isphonegap = false;
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
          for (var i = 0; i < this.soundssrcs.length; i++) {
              aux = this.soundssrcs[i].split("|")
              if (!this.isphonegap) {
                  var myAudio = new Audio(aux[1]);
                  if (aux[2] == "loop") {
                      myAudio.addEventListener('ended', function () {
                          this.currentTime = 0;
                          this.play();
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
                  var myAudio = new Media(aux[1],
                  // success callback
                function () {
                    alert("playAudio():Audio Success");
                },
                  // error callback
                function (err) {
                    alert("playAudio():Audio Error: " + err);
                });
                  this.sounds[aux[0]] = myAudio;
                  // Play audio
                  myAudio.play();
              }
          }
      }
  }
  var levels = new Array(30);
  cont = 0;
  levels[cont++] = { tipoghost: 0, numpajaros: 6, bg: 'f1.jpg', txt: 'La Alhambra de Granada', fuel: 200, traptipo: 0, speed: 0.1 };
  levels[cont++] = { tipoghost: 0, numpajaros: 6, bg: 'f1.jpg', txt: 'La Alhambra de Granada', fuel: 200, traptipo: 0, speed: 0.1};
  levels[cont++] = { tipoghost: 1, numpajaros: 1, bg: 'f2.jpg', txt: 'Angkor', fuel: 200, traptipo: 0, speed: 2 };
  levels[cont++] = { tipoghost: 0, numpajaros: 2, bg: 'f2.jpg', txt: 'Angkor', fuel: 200, traptipo: 1, speed: 2 };
  levels[cont++] = { tipoghost: 0, numpajaros: 2, bg: 'f2.jpg', txt: 'Angkor', fuel: 200, traptipo: 0, speed: 2 };
  levels[cont++] = { tipoghost: 1, numpajaros: 2, bg: 'f4.jpg', txt: 'Neuschwanstein Castle', fuel: 200, traptipo: 0, speed: 2 };
  levels[cont++] = { tipoghost: 1, numpajaros: 2, bg: 'f4.jpg', txt: 'Neuschwanstein Castle ', fuel: 200, traptipo: 0, speed: 3 };
  levels[cont++] = { tipoghost: 0, numpajaros: 2, bg: 'f4.jpg', txt: 'Neuschwanstein Castle ', fuel: 200, traptipo: 0, speed: 3 };
  levels[cont++] = { tipoghost: 1, numpajaros: 2, bg: 'f5.jpg', txt: 'Statues of Easter Island', fuel: 200, traptipo: 1, speed: 3 };
  levels[cont++] = { tipoghost: 2, numpajaros: 2, bg: 'f5.jpg', txt: 'Statues of Easter Island', fuel: 200, traptipo: 0, speed: 3 };
  levels[cont++] = { tipoghost: 2, numpajaros: 2, bg: 'f6.jpg', txt: 'Stonehenge', fuel: 200, traptipo: 0, speed: 4 };
  levels[cont++] = { tipoghost: 1, numpajaros: 3, bg: 'f6.jpg', txt: 'Stonehenge', fuel: 200, traptipo: 1, speed: 4 };
  levels[cont++] = { tipoghost: 2, numpajaros: 3, bg: 'f7.jpg', txt: 'The Acropolis of Athens', fuel: 200, traptipo: 1, speed: 4 };
  levels[cont++] = { tipoghost: 2, numpajaros: 3, bg: 'f7.jpg', txt: 'The Acropolis of Athens', fuel: 200, traptipo: 1, speed: 4 };
  levels[cont++] = { tipoghost: 1, numpajaros: 3, bg: 'f8.jpg', txt: 'Eiffel Tower', fuel: 200, traptipo: 1, speed: 4 };
  levels[cont++] = { tipoghost: 3, numpajaros: 3, bg: 'f8.jpg', txt: 'Eiffel Tower', fuel: 200, traptipo: 1, speed: 4 };
  levels[cont++] = { tipoghost: 3, numpajaros: 3, bg: 'f9.jpg', txt: 'The Kremlin / Red Square', fuel: 200, traptipo: 1, speed: 4 };
  levels[cont++] = { tipoghost: 2, numpajaros: 3, bg: 'f9.jpg', txt: 'The Kremlin / Red Square', fuel: 200, traptipo: 1, speed: 5 };
  levels[cont++] = { tipoghost: 3, numpajaros: 3, bg: 'f10.jpg', txt: ' The Pyramids of Giza ', fuel: 200, traptipo: 1, speed: 5 };
  levels[cont++] = { tipoghost: 4, numpajaros: 3, bg: 'f10.jpg', txt: ' The Pyramids of Giza ', fuel: 200, traptipo: 1, speed: 5 };

  levels[cont++] = { tipoghost: 4, numpajaros: 4, bg: 'f11.jpg', txt: ' The Statue of Liberty', fuel: 200, traptipo: 1, speed: 5 };
  levels[cont++] = { tipoghost: 3, numpajaros: 4, bg: 'f11.jpg', txt: ' The Statue of Liberty', fuel: 200, traptipo: 1, speed: 5 };
  levels[cont++] = { tipoghost: 4, numpajaros: 4, bg: 'f12.jpg', txt: ' Timbuktu ', fuel: 200, traptipo: 1, speed: 5 };
  levels[cont++] = { tipoghost: 5, numpajaros: 4, bg: 'f12.jpg', txt: ' Timbuktu ', fuel: 200, traptipo: 1, speed: 5 };
  levels[cont++] = { tipoghost: 5, numpajaros: 4, bg: 'f13.jpg', txt: 'Petra Great Temple', fuel: 200, traptipo: 1, speed: 6 };
  levels[cont++] = { tipoghost: 4, numpajaros: 4, bg: 'f13.jpg', txt: 'Petra Great Temple', fuel: 200, traptipo: 1, speed: 0.1 };
  levels[cont++] = { tipoghost: 5, numpajaros: 4, bg: 'f14.jpg', txt: 'La Sagrada Familia', fuel: 200, traptipo: 1, speed: 6 };
  levels[cont++] = { tipoghost: 6, numpajaros: 4, bg: 'f14.jpg', txt: 'La Sagrada Familia', fuel: 200, traptipo: 1, speed: 6 };
  levels[cont++] = { tipoghost: 6, numpajaros: 4, bg: 'f15.jpg', txt: 'Machu Pichu', fuel: 200, traptipo: 1, speed: 6 };
  levels[cont++] = { tipoghost: 6, numpajaros: 4, bg: 'f15.jpg', txt: 'Machu Pichu (Final)', fuel: 200, traptipo: 1, speed: 6 };

  
      var ctx;
      var ctxBG;
      var timeraux = null;
      var clockspeed = 50;
      var pause = false;
      var waiting = false;
      var loadingweapon = 50;
      var realw = 0
      var realh = 0
      var miw = 720
      var mih = 960
      var ratiow = 1
      var ratioh = 1
      var rangey = 55;
      var bswitch = 0;
      var paintRecal=true;// recalcular widhts, repintar fondo...
      var ML = new MediaLibrary();

      //statuses pajaros
      var MOVER = 1;
      var ESPERAR = 0;
      var mouse = { x: 0, y: 0, antx: 0, anty: 0 }
      var ghost = { div:null, xPos: 150, yPos: 4, dx: 0, dy: 0, w: 45*3, h: 55*3, tox: 150, toy: 4, movesteps: 0, incx: 0, incy: 0 }
      var player = { div:null, xPos: 150, yPos: 4, dx: 0, dy: 0, w: 45*3, h: 55*3, tox: 150, toy: 4, movesteps: 0, incx: 0, incy: 0 }
      var trap = { div:null, xPos: 1, yPos: 295 , w: 45*3, h: 55*3, despx: 1, estado: 1, contestado: 0, tipo: 0 }
      var pajaro = { div:null, xPos: 150, yPos: 4, dx: 0, dy: 0, w: 60*3, h: 60*3, tox: 150, toy: 4, movesteps: 20, incx: 0, incy: 0,status:ESPERAR }
      var fondo = { div:null, xPos: 0, yPos: 0, dx: 0, dy: 0, w: 720, h: 960, tox: 150, toy: 4, movesteps: 20, incx: 0, incy: 0 }
      var cursor = { div:null, xPos: 0, yPos: 0, dx: 0, dy: 0, w: 720, h: 960, tox: 150, toy: 4, movesteps: 20, incx: 0, incy: 0 }
      var explodiv = { div:null, xPos: 0, yPos: 0, dx: 0, dy: 0, w: 720, h: 960, tox: 150, toy: 4, movesteps: 20, incx: 0, incy: 0 }
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
      anims[cont++] = { src: 'aghost', numframes: 2, cont: 0, max: 4, current: 0, numrepes: 0 }
      anims[cont++] = { src: 'aghosta', numframes: 2, cont: 0, max: 4, current: 0, numrepes: 0 }
      anims[cont++] = { src: 'aplayer', numframes: 2, cont: 0, max: 4, current: 0, numrepes: 0 }
      anims[cont++] = { src: 'bola', numframes: 4, cont: 0, max: 2, current: 0, numrepes: 0 }
      anims[cont++] = { src: 'explo', numframes: 6, cont: 0, max: 2, current: 0, numrepes: 1 }
      anims[cont++] = { src: 'donde', numframes: 2, cont: 0, max: 2, current: 0, numrepes: 0 }
      anims[cont++] = { src: 'pajaro', numframes: 2, cont: 0, max: 2, current: 0, numrepes: 0 }
      anims[cont++] = { src: 'trapon', numframes: 2, cont: 0, max: 1, current: 0, numrepes: 0 }
      anims[cont++] = { src: 'trapoff', numframes: 1, cont: 0, max: 1, current: 0, numrepes: 0 }
      
      
      


      

      //min
      //levels[cont++] = {tipoghost:1, numpajaros:5, bg:'f1.jpg', txt: 'Paris', gravity: .001,  fuel: 200, trapmov: 1,gravinc:.04 };
      //max
      //levels[cont++] = {tipoghost:1, numpajaros:5, bg:'f1.jpg', txt: 'Paris', gravity: .03, rangey: 10, fuel: 100, trapmov: 1, gravinc: 1.2 };
      var pajaros;
      /*
      var pajaros = new Array(5)
      cont = 0;
      pajaros[cont++] = { xPos: 0, yPos: 0, dx: 0, dy: 0, w: 29, h: 24, incx: 0, incy: 0 }
      pajaros[cont++] = { xPos: 0, yPos: 0, dx: 0, dy: 0, w: 29, h: 24, incx: 0, incy: 0 }
      pajaros[cont++] = { xPos: 0, yPos: 0, dx: 0, dy: 0, w: 29, h: 24, incx: 0, incy: 0 }
      */
      var currentlevel = 0;

      var blank = new Image();
      var donde0 = new Image();
      var donde1 = new Image();
      var aghost0 = new Image();
      var aghost1 = new Image();
      var aghosta0 = new Image();
      var aghosta1 = new Image();
      var pajaro0 = new Image();
      var pajaro1 = new Image();
      var pajaro2 = new Image();
      var pajaro3 = new Image();
      var pajaro4 = new Image();
      var pajaro5 = new Image();
      var aplayer0 = new Image();
      var aplayer1 = new Image();
      var aplayerfin = new Image();
      var ef2 = new Image();

      var bola0 = new Image();
      var bola1 = new Image();
      var bola2 = new Image();
      var bola3 = new Image();
      var bola4 = new Image();
      var explo0 = new Image();
      var explo1 = new Image();
      var explo2 = new Image();
      var explo3 = new Image();
      var explo4 = new Image();
      var trapoff = new Image();
      var trapon0 = new Image();
      var trapon1 = new Image();


      function xxx(id) {
        return document.getElementById(id);
      }
      function getanim(idx) {

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
            if (midw1==undefined){
                
              midw1 = item1.w*ratiow / 2;
              midw2 = item2.w*ratiow / 2;
              midh1 = item1.h*ratioh / 2;
              midh2 = item2.h*ratioh / 2;

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
        function initmenu() {
            $("#divloading").hide()
            if (getURLParam("l") == "") {
                $("#divmenu").fadeIn("slow")
            }
            else {
                setCookie("level" + getURLParam("l"), aleator(0, 3), new Date("January 01, 2020 00:00:01"));
				
                $("#divmenu").fadeIn("slow")
                initgame();
            }
        }
        function initgame() {

            $("#divmenu").hide()
            $("#divloading").fadeIn("slow")
            ctx = document.getElementById('divcanvas').getContext('2d');



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
            document.getElementById("divmsgs").innerHTML = "<img src='logo.png' /><h1>" + levels[currentlevel].txt + "</h1><br/><img src='logoimg.png' /><br /><img src='start.png'>"
            fuel = levels[currentlevel].fuel;

            pajaros = new Array(levels[currentlevel].numpajaros)
            var despx = realw / (pajaros.length + 1)
            for (var cont = 0; cont < pajaros.length; cont++) {
                pajaros[cont] = { div: xxx("divpajaro" + cont), xPos: despx * cont, yPos: realh / 2, dx: 0, dy: 0, w: pajaro.w * ratiow, h: pajaro.h * ratioh, incx: 0, incy: 0, status:ESPERAR }
            }

            ghost.div = xxx("divghost")
            trap.div = xxx("divtrap")
            fondo.div = xxx("divfondo")
            player.div = xxx("divplayer")
            cursor.div = xxx("divcursor")
            explodiv.div = xxx("divexplo")

            $("#divloading").hide()
            $("#divgameplay").fadeIn("slow");
            pause = true;

            startTimer();    // start the game
        }
        var maintimer = null;
        var filterStrength = 20;
        var frameTime = 0, lastLoop = new Date, thisLoop;
        
        function mydrawimage(div, img, x, y, w,h) {
            div.style.left = x + "px";
            div.style.top = y + "px";
            
            
            if (paintRecal){
            
		div.children[0].src = img.src;
                div.style.width = (w*ratiow) + "px";            
                div.style.height = (h*ratioh) + "px";
                div.children[0].width=(w*ratiow) 
                div.children[0].height=(h*ratioh) 
            }
        }
        
        function paint() {

            var thisFrameTime = (thisLoop = new Date) - lastLoop;
            frameTime += (thisFrameTime - frameTime) / filterStrength;
            lastLoop = thisLoop;                         
            doAnimation()                        
        }
        function startTimer() {

            var fps = 25
            maintimer = setInterval(paint, 500 / fps);
        }
        function getURLParam(strParamName) {
            return "1"
            var strReturn = "";
            var strHref = window.location.href;
            if (strHref.indexOf("?") > -1) {
                var strQueryString = strHref.substr(strHref.indexOf("?")).toLowerCase();
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
        function aleator(desde,hasta) {
            return Math.floor((Math.random() * hasta) + desde);
        }
        function movepajaro(idx) {
            if (pajaros[idx].status == MOVER) {
                if (pajaros[idx].movesteps > 0) {
                    pajaros[idx].xPos = Math.max(0,Math.min(realw-5,pajaros[idx].xPos + pajaros[idx].incx));
                    pajaros[idx].yPos = Math.max(0, Math.min(realh - 5, pajaros[idx].yPos + pajaros[idx].incy));
                    pajaros[idx].movesteps--;
                }
                else {
                    pajaros[idx].movesteps = Math.max(10,50 - Math.max(currentlevel,10));
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
                    var rw = aleator(10, realw/4);
                    var rh = aleator(10, realh / 4);
                    if (rsigno == 2) {

                        rsigno = -1
                    }
                    if (r == 1) {
                        var aux = Math.min(pajaros[idx].yPos + (rsigno * rh), realh - realh/5);
                        pajaros[idx].toy = Math.max(0, aux);
                    }
                    if (r == 2) {
                        var aux=Math.min(pajaros[idx].xPos + (rsigno * rw), realw)
                        pajaros[idx].tox = Math.max(0, aux);
                    }
                    var disty = pajaros[idx].toy - pajaros[idx].yPos;
                    var distx = pajaros[idx].tox - pajaros[idx].xPos;
                    var dist = distx+disty

                    //ojo
                    //pajaros[idx].movesteps = dist / levels[currentlevel].speed //(minimo 2;max:8)
                    //pajaros[idx].movesteps = 2
                    pajaros[idx].incx = 0;
                    pajaros[idx].incy = 0;

                    pajaros[idx].incx = (distx / pajaros[idx].movesteps)
                    pajaros[idx].incy = (disty / pajaros[idx].movesteps)
                    pajaros[idx].status = MOVER;
                    
                }
            }
        }
        var gosw,gosh;                  
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
                  if (gosw==undefined){
                    gosw=(ghost.w * ratiow / 2);
                    gosh=(ghost.h * ratioh / 2);
                  }
                  var disty = mouse.y - (ghost.yPos + gosh);
                  var distx = mouse.x - (ghost.xPos + gosw);

                  var dist = Math.abs(distx) + Math.abs(disty)
                  //ojo velocidad de arrastre
                  ghost.movesteps = parseInt(dist / levels[currentlevel].speed / 1.5) //(minimo 2;max:8)

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


                  ghost.tox = Math.ceil(Math.random() * realw / 2);
                  ghost.toy = Math.ceil(Math.random() * realh / 2);
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
                  document.getElementById("debugOutput").innerHTML = "<H1>GOTCHA!!</H1>";
                          ghost.movesteps--;
                      }
                      else {

                          document.getElementById("debugOutput").innerHTML = "INFO:Drive the ghost at the trap by tapping on screen<BR/><font style='color:red'>Don't touch the birds</font>";
                          gamestatus = 1;
                          paintRecal = true;
                          mouse.x = realw - ghost.w;
                          mouse.y = 0;
                      }
                  }
                  function resetmove2() {
                      ghost.movesteps = 35;
                      ghost.toy = 20;
                      ghost.tox = realw - ghost.w * ratiow - 20;
                      var disty = ghost.toy - ghost.yPos;
                      var distx = ghost.tox - ghost.xPos;

                      ghost.incx = parseInt(distx / ghost.movesteps)
                      ghost.incy = parseInt(disty / ghost.movesteps)

                  }
                  var linew,rayosaux1,rayosaux2;
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
                          if (linew==undefined){
                            linew=25 * ratiow;
                            rayosaux1=realw / 2;
                            rayosaux2=realh - (ghost.h * ratioh) - 3;
                          }
                          ctx.lineTo(rayosaux1 + desp2, rayosaux2);
                          
                          ctx.lineWidth = linew;
                          //ctx.endPath();
                          ctx.stroke();
                      }
                  }
        var rayoaux1,rayoaux2,rayoaux3;
        function rayo(ctx) {
            if (mouse.x < realw && mouse.y < realh) {
                var r1xold, r1yold;
                if (rayoaux1==undefined){
                  linew=25 * ratiow;
                  rayoaux1=(ghost.w / 2 * ratiow);
                  rayoaux2=(ghost.h / 2 * ratioh);
                  rayoaux3=realh - (ghost.h*ratioh) - 3;
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
            if (gosw==undefined){
                    gosw=(ghost.w * ratiow / 2);
                    gosh=(ghost.h * ratioh / 2);
            }
            if (contclick >= 1) {
                //alert(mouse.x+"+"+ghost.xPos)
                
                if (mouse.x < ghost.xPos + gosw*2 && mouse.x > ghost.xPos) {
                    if (mouse.y < ghost.yPos + gosh*2 && mouse.y > ghost.yPos) {
                        gamestatus = 5;
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
		if (divrayosx==undefined){
			divrayosx=xxx("divrayos");  
              divrayosx.children[0].src = ML.sprites["rayoanim"].src;
              divrayosx.style.width=30;
		}
		//divrayosx.style.top=(ghost.yPos + gosh)+"px";
              divrayosx.style.top="0px";
             	divrayosx.style.left=ghost.xPos+"px";
             	
             	//divrayosx.style.height=
              divrayosx.style.clip="rect(" + (ghost.yPos + gosh) + ",30,600,0)";


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
            ctx.strokeStyle = "#ffffff";
            rayo2(ctx);
            ctx.strokeStyle = "#ffcc00";
            rayo2(ctx);

        }
        function timeoutgameover() {
            hideGame();

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
              function timeoutnextlevel() {
                  hideGame();

                  $("#divnextlevel").fadeIn("slow")
                  clearTimeout(timeraux)
                  gamestatus = 666;

              }
              function ira(donde) {
                  window.location.href = donde
              }
              function gotonext() {
                  $("#divloading").fadeIn("slow");
                  $("#divnextlevel").hide()

                  if (currentlevel < levels.length - 1) {
                      window.setTimeout(function () { ira('?l=' + (parseInt(currentlevel) + 1)) }, clockspeed * 10);
                  } else {
                      hideGame();
                      $("#divgamefinished").fadeIn("slow")
                      $("#divgameplay").hide()
                      $("#divnextlevel").hide()
                  }
              }
        function gotosavedlevel() {
            $("#divmenu").hide()
            $("#divloading").fadeIn("slow")
            window.setTimeout(function() { ira('?l=' + (parseInt(getCookie("ghostlevel")) + 1)) }, clockspeed * 10);
        }
        function btstart() {
            $("#divmenu").hide()
            $("#divloading").fadeIn("slow")

            window.setTimeout(function () { ira('?l=0') }, clockspeed * 10);
        }
        function btgameover() {
            $("#divgameover").hide()
            $("#divloading").fadeIn("slow")
            if (getCookie("ghostlevel") != "") {
                window.setTimeout(function () { ira('?l=' + (parseInt(currentlevel))) }, clockspeed * 10);
            } else {
                window.setTimeout(function () { ira('?l=0') }, clockspeed * 10);
            }

        }
        function bttryagain() {
          hideGame();

            $("#divgamefinished").hide()
            $("#divloading").fadeIn("slow")
            window.setTimeout(function() { ira('/') }, clockspeed * 10);
        }
	function clearCanvas(){
		c.width=c.width
	}
        var c=null;
        var playerw,playerh,realwentre2,trapw,traph;
	var canvastimer=null;
	
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
              }
              if (gosw==undefined){
              gosw=(ghost.w * ratiow / 2);
              gosh=(ghost.h * ratioh / 2);
              }
              if (playerw==undefined){
              playerw=(player.w * ratiow / 2);
              playerh=(player.h * ratioh / 2);
              }
              if (realwentre2==undefined){
              realwentre2=(realw / 2);
              }
              if (trapw==undefined){
              trapw=(trap.w / 2);
              traph=(trap.h / 2);
              }


              var fueltpc = parseInt((fuel * realw) / levels[currentlevel].fuel)
              xxx("divenergy").style.width = fueltpc + "px";
	
              /*
              var fueltpc = parseInt((fuel * realw) / levels[currentlevel].fuel)
              ctx.fillStyle = "#000000";
              ctx.fillRect(2, 2, realw, 40);
              ctx.fillStyle = "#ff0000";
              ctx.fillRect(2, 2, fueltpc, 40);


              ctx.lineWidth = 3;
              */


              if (pause != true) {
              if (gamestatus == 0) {
              //fuel = fuel - currentlevel / 30
              fuel = fuel - (levels[currentlevel].speed / 20)
              move();
              mydrawimage(ghost.div, getanim(0), parseInt(ghost.xPos), parseInt(ghost.yPos), ghost.w, ghost.h);
              mydrawimage(player.div, getanim(2), parseInt(realwentre2 - playerw), parseInt(realh - playerh - 3), player.w, player.h);
              if (loadingweapon <= 0) {
                        testclick();
                    }
                    if (paintRecal) {
                        mydrawimage(fondo.div, ML.sprites["fondo"], 0, 0, fondo.w, fondo.h);                                            
                        paintRecal = false;
                    }
                    if (loadingweapon > 0 && !waiting) {
                        loadingweapon = loadingweapon - 1; 
                    }
                    if (contclick-- >= 1 && loadingweapon<=0) {
			c.width=c.width;
                        rayos2();
                        if (currentlevel < 10) {
                            fuel = fuel - 10
                        } else {
                            fuel = fuel - 5
                        }
			canvastimer=setTimeout(function(){clearCanvas()},500);
		
		
                    }
                }
                else if (gamestatus == 1) {
                    fuel = fuel - currentlevel / 70

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

                    mydrawimage(player.div, getanim(2), parseInt(realwentre2 - playerw), parseInt(realh - playerh - 3), playerw, playerh);

                    if (trap.estado == 0) {
                        mydrawimage(trap.div, getanim(8), trap.xPos, realh - traph, trap.w, trap.h);
                    } else {
                        mydrawimage(trap.div, getanim(7), trap.xPos, realh - traph, trap.w, trap.h);
                    }

                    mydrawimage(ghost.div, getanim(1), parseInt(ghost.xPos), parseInt(ghost.yPos), ghost.w, ghost.h);
                    mydrawimage(player.div, getanim(2), parseInt(ghost.xPos - (playerw)), parseInt(realh - playerh - 3), player.w, player.h);

                    //ctx.drawImage(getanim(1), ghost.xPos, ghost.yPos, ghost.w, ghost.h);
                    //ctx.drawImage(getanim(2), ghost.xPos - (ghost.w / 2), realh - ghost.h - 3, ghost.w, ghost.h);


                    if (ghost.movesteps > 0) {
                        mydrawimage(cursor.div, getanim(5), mouse.x - 10, mouse.y - 10, 20, 20);
                    }
                    for (var i = 0; i < pajaros.length; i++) {
                        movepajaro(i);
                        if (checktouching(ghost, pajaros[i]) == 1) {
                            gamestatus = 9
                        }
                        mydrawimage(pajaros[i].div, getanim(6), pajaros[i].xPos, pajaros[i].yPos, pajaros[i].w, pajaros[i].h);

                    }

                    //ctx.drawImage(getanim(2), ghost.xPos, ghost.yPos, 40, 40);
                    
               	    rayos();

                    
                    if (trap.estado == 1 && ghost.yPos + (gosh) > realh - (gosh) && ghost.xPos + gosw >= trap.xPos && ghost.xPos <= trap.xPos + trapw) {
                        gamestatus = 2;
                        document.getElementById("debugOutput").innerHTML = "<h1>STAGE CLEAR!!</h1>";
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
                    mydrawimage(trap.div, getanim(7), trap.xPos, realh - traph, trap.w, trap.h);
                    mydrawimage(ghost.div, getanim(1), ghost.xPos, ghost.yPos, ghost.w, ghost.h);
                    mydrawimage(player.div, getanim(2), ghost.xPos - (playerw), realh - (playerh) - 3, player.w, player.h);


                    if (timeraux == null)
                        timeraux = setTimeout(function () { timeoutnextlevel() }, 3000);
                    window.setTimeout(doAnimation, clockspeed);
                }

                if (gamestatus == 5) {
                    move2();
                    mydrawimage(ghost.div, getanim(1), ghost.xPos, ghost.yPos, ghost.w, ghost.h);
                    mydrawimage(player.div, getanim(2), ghost.xPos - (playerw), realh - (playerh) - 3, ghost.w, ghost.h);
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
                    document.getElementById("debugOutput").innerHTML = "OVERLOAD!!OVERLOAD!!";
                    var explo = getanim(4)
                    mydrawimage(player.div, ML.sprites["aplayerfin"], ghost.xPos - (gosw), realh - (playerh) - 3, ghost.w, ghost.h);
                    mydrawimage(explodiv.div, explo, ghost.xPos - (gosw), realh - (playerh) - 3, ghost.w * 2, ghost.h * 2);
                    mydrawimage(ghost.div, explo, ghost.xPos, ghost.yPos, ghost.w * 2, ghost.h * 2);

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

                /*
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.font = "bold 14px 'Times New Roman', Times, serif";            
                ctx.fillStyle = "#ffcc00";
                ctx.fillRect(0, 80, 300, 200);
                
                ctx.fillStyle = "#000";
                ctx.strokeStyle = "#f00";
                
                try {
                ctx.fillText(msg, 10, 90);
                } catch (ex) {alert(ex) }                

                */
            }
        }
	var framerate=0;
                      function initengine() {

                      var fpsOut = document.getElementById('fps');
/*
                      setInterval(function() {
			framerate=(1000 / frameTime).toFixed(1);
                      fpsOut.innerHTML = framerate+ " fps";
                      }, 1000);
*/
                      
                      }
                      function resize() {
                          ratiow = Math.min(1, $(window).width() / miw);
                          ratioh = Math.min(1, $(window).height() / mih);
                          ratiow = Math.min(ratiow, ratioh);
                          ratioh = Math.min(0.6, ratioh);
                          realw = miw * ratiow;
                          realh = mih * ratioh;

                          var canvas = document.createElement('canvas');
                          canvas.id = "divcanvas";
                          canvas.style.top = "0px";
                          canvas.style.left = "0px";
                          canvas.width = realw;
                          canvas.height = realh;
                          canvas.style.zIndex = 8;
                          canvas.style.position = "absolute";
                          document.body.appendChild(canvas);
                          //                            document.getElementById("divcanvas").setAttribute("width",(realw) + "px");
                          //                            document.getElementById("divcanvas").setAttribute("height",(realh ) + "px");                                            
                          $('.bigDiv').css({
                              position: 'absolute',
                              left: 0,
                              top: 0
                          });
                      }


                      function initTouchs() {
                          if (typeof (document.body.ontouchstart) == "undefined") {
                              document.getElementById("divcanvas").onmousedown = function (e) {
                                  e.preventDefault();
                                  mouse.antx = mouse.x
                                  mouse.anty = mouse.y
                                  mouse.x = e.pageX;
                                  mouse.y = e.pageY;
                                  if (mouse.x < 30 && mouse.y < 30) {
                                      waiting = !waiting;
                                  }
                                  if (gamestatus != 5) {
                                      ghost.movesteps = 0;
                                  }
                                  if (gamestatus == 0) {
                                      contclick = 2;
                                  }
                                  if (ticker.status == 2) {
                                      ticker.contador = 1;
                                  }

                              }
                              document.getElementById("divmsgs").onmousedown = function (e) {

                                  if (pause == true) {
                                      pause = false;
                                      $("#divmsgs").hide();
                                      $("#divcanvas").fadeIn("slow");
                                      $(".divSprite").fadeIn("slow");




                                      document.getElementById("debugOutput").innerHTML = "Info:Tap above the ghost to catch him...";
                                      doAnimation()
                                      waiting = true;
                                      ticker.msg.push("Go!!!");
                                      ticker.msg.push("Ready??");
                                      ticker.callback = function () {
                                          waiting = false;
                                      }
                                      ticker.activate();
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
                                      waiting = true;
                                      ticker.msg.push("Go!!!");
                                      ticker.msg.push("Ready??");
                                      ticker.callback = function () {
                                          waiting = false;
                                      }

                                      ticker.activate();
                                      document.getElementById("debugOutput").innerHTML = "Info:Tap above the ghost to catch him...";
                                      doAnimation()
                                  }
                              }
                          }
                      }                      
                      {
                          //cargo imagenes antes, por si las moscas
                          currentlevel = getURLParam("l")
                          if (currentlevel == "" || currentlevel == "NaN") { currentlevel = 0; }
                          ML.spritessrcs.push("blank|blank.png|" + ratiow + "|" + ratioh)
                          ML.spritessrcs.push("donde0|donde0.png|" + ratiow + "|" + ratioh)
                          ML.spritessrcs.push("donde1|donde1.png|" + ratiow + "|" + ratioh)
                          ML.spritessrcs.push("aghost0|ghost" + levels[currentlevel].tipoghost + "0.png|" + ratiow + "|" + ratioh)
                          ML.spritessrcs.push("aghost1|ghost" + levels[currentlevel].tipoghost + "1.png|" + ratiow + "|" + ratioh)
                          ML.spritessrcs.push("aghosta0|ghost" + levels[currentlevel].tipoghost + "a0.png|" + ratiow + "|" + ratioh)
                          ML.spritessrcs.push("aghosta1|ghost" + levels[currentlevel].tipoghost + "a1.png|" + ratiow + "|" + ratioh)
                          ML.spritessrcs.push("pajaro0|pajaro0.png|" + ratiow + "|" + ratioh)
                          ML.spritessrcs.push("pajaro1|pajaro1.png|" + ratiow + "|" + ratioh)
                          ML.spritessrcs.push("pajaro2|pajaro1.png|" + ratiow + "|" + ratioh)
                          ML.spritessrcs.push("pajaro3|pajaro3.png|" + ratiow + "|" + ratioh)
                          ML.spritessrcs.push("pajaro4|pajaro3.png|" + ratiow + "|" + ratioh)
                          ML.spritessrcs.push("pajaro5|pajaro5.png|" + ratiow + "|" + ratioh)
                          ML.spritessrcs.push("aplayer0|player0.png|" + ratiow + "|" + ratioh)
                          ML.spritessrcs.push("aplayer1|player1.png|" + ratiow + "|" + ratioh)
                          ML.spritessrcs.push("aplayerfin|player2.png|" + ratiow + "|" + ratioh)
                          ML.spritessrcs.push("ef2|ef2.png|" + ratiow + "|" + ratioh)
                          ML.spritessrcs.push("bola0|bolarayo0.png|" + ratiow + "|" + ratioh)
                          ML.spritessrcs.push("bola1|bolarayo1.png|" + ratiow + "|" + ratioh)
                          ML.spritessrcs.push("bola2|bolarayo2.png|" + ratiow + "|" + ratioh)
                          ML.spritessrcs.push("bola3|bolarayo3.png|" + ratiow + "|" + ratioh)
                          ML.spritessrcs.push("bola4|bolarayo4.png|" + ratiow + "|" + ratioh)
                          ML.spritessrcs.push("explo0|explo0.png|" + ratiow + "|" + ratioh)
                          ML.spritessrcs.push("explo1|explo1.png|" + ratiow + "|" + ratioh)
                          ML.spritessrcs.push("explo2|explo2.png|" + ratiow + "|" + ratioh)
                          ML.spritessrcs.push("explo3|explo3.png|" + ratiow + "|" + ratioh)
                          ML.spritessrcs.push("explo4|explo4.png|" + ratiow + "|" + ratioh)
                          ML.spritessrcs.push("explo4|blank.png|" + ratiow + "|" + ratioh)
                          ML.spritessrcs.push("trapoff0|trapoff0.png|" + ratiow + "|" + ratioh)
                          ML.spritessrcs.push("trapon0|trapon0.png|" + ratiow + "|" + ratioh)
                          ML.spritessrcs.push("trapon1|trapon1.png|" + ratiow + "|" + ratioh)
                                ML.spritessrcs.push("rayoanim|rayo0.png|" + ratiow + "|" + ratioh)
                          ML.spritessrcs.push("fondo|" + levels[currentlevel].bg + "|" + ratiow + "|" + ratioh)
                      }
        function loadFinished() {
            alert("cargadas las imgs")
            initengine();
            initmenu();
        }                                            
        //ML.soundssrcs.push("bgm|fase1.ogg|loop")
        //ML.soundssrcs.push("fx1|bell1.ogg")
        //ML.loadAll(),ratiow,ratioh)
        function loadSoundsFinished() {
            ML.sounds["bgm"].play();
        }
        $(document).ready(function () {
            resize();
            initTouchs();
            ML.loadAll();
        });


        function listCookies() {
            var theCookies = document.cookie.split(';');
            var aString = new Array();
            for (var i = 1; i <= theCookies.length; i++) {
                var micookie = theCookies[i - 1];
                if (micookie.indexOf("fase_") == 0) {
                    aString.push(micookie)
                }
            }
            return aString;
        }
        function getGlobalSituation() {
            var misfases = listCookies();
            var salida = "<ul class='fases'>";
            for (i = 0; i < misfases.length; i++) {
                //nombre de la fase|pos en el array de fases|estrellas
                var aux = getCookie(misfases[i]).split("|");

                salida = salida + "<li><div id='thumb_" + aux[1] + "' class='thumbfases'><img src='thumb_" + aux[1] + "' /><br/>" + aux[0] + "<br/><img src='starts" + aux[2] + ".png'/></div></li>";
            }
            salida = salida + "</ul>";
            return salida;
        }

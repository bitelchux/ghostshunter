<?php
error_reporting(0);
include("detectcountry.php");
$wp7=0;
if(stripos($_SERVER["HTTP_USER_AGENT"],"Windows Phone OS 7")!=false) 
$wp7=1;
if(stripos($_SERVER["HTTP_USER_AGENT"],"Windows Phone 7")!=false) 
$wp7=1;
if($_GET["wp7"]!="") 
$wp7=1;
$rowh=50;
$roww=155;
$rowcanalw=95;
$numofhoursingrid=3;
$subd=array_shift(explode(".",$_SERVER['HTTP_HOST']));
$auxnumofhoursingrid=intval(getnumcols());

if ($auxnumofhoursingrid>=0) $numofhoursingrid=$auxnumofhoursingrid+1;
//if ($wp7) $numofhoursingrid=2;

function istomorrowsite(){
$subd=array_shift(explode(".",$_SERVER['HTTP_HOST']));
 if (stripos($subd,"omorrow")!=1)
    return false;
 else
    return true;
}
function getnumcols_in(){
global $rowcanalw,$roww,$numofhoursingrid,$wp7;
  //if (getP("genre")!="") return 800;
  return 8000;
  if ($_GET["w"]!=""){
       setcookie("ancho", intval($_GET["w"]), 1000*(time()+3600));  /* expira en 1000 hora */

       return intval($_GET["w"]);
  }
  if ($_COOKIE["ancho"]!=""){

     return $_COOKIE["ancho"];
  }
  header('Location: http://'.$_SERVER["SERVER_NAME"].'/detect.php?r='.rand(1,6666));
  exit(0);
}

function getnumcols(){
global $rowcanalw,$roww,$numofhoursingrid;
  $w=getnumcols_in();
  
  if (!is_numeric($w) || intval($w)<200) return $numofhoursingrid;

  $numcols=intval((intval($w)-$rowcanalw)/$roww);
 
  
  return ($numcols);
}
if ($_GET["offset"]."x"!="x"){
        
    setcookie("offset", $_GET["offset"],$time,"/",'tvgrid.info'); 
        header('Location: http://'.$_SERVER['SERVER_NAME']);
        exit(0);
}
header('Content-Type: text/html; charset=utf-8');
//Set no caching
/*
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT"); 
header("Cache-Control: no-store, no-cache, must-revalidate"); 
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Fecha en el pasado
*/
// seconds, minutes, hours, days
$expires = 60*30;
header("Pragma: private");
header("Cache-Control: maxage=".$expires);
header('Expires: ' . gmdate('D, d M Y H:i:s', time()+$expires) . ' GMT');



date_default_timezone_set('America/New_York');

include($_SERVER['DOCUMENT_ROOT'].'/tv2/grid/funcs.php');


/*
if (intval(getP("at"))<=23)
  $hoysql=date("Y-m-d");
else
  $hoysql=date("Y-m-d", strtotime("+1 days"));

$hoysql=date("Y-m-d");
$mananasql=date("Y-m-d", strtotime("+1 days"));
*/

if (stripos($subd,"omorrow")!=1){
   $hora=intval(date("H"));
   $hoysql=date("Y-m-d");
   $mananasql=date("Y-m-d", strtotime("+1 days"));

}
else{  //estoy en tomorrow dominio
   $hora=0;
   $hoysql=date("Y-m-d", strtotime("+1 days"));
   $mananasql=date("Y-m-d", strtotime("+2 days"));
}
$minuto=date("H:i:s");
$manana= date('m-d-y', strtotime("+1 days"));
$aix=split(":",$minuto);
$minuto=$aix[1];
$hoy=str_replace(".","",date("m.d.y"));
$ampm=date("A");
$minuto=date("H:i:s");
$aix=split(":",$minuto);
$minuto=$aix[1];
$time = 70*24*3600 + time();
if (strpos(strtolower($_SERVER['REQUEST_URI']),"/movie/")!==false){
   echo(megaget("http://tvgrid.info/gridmovie/index.php?id=".getP("id")."&t=".getP("movie")));
   exit(0);
}
header('Content-Type: text/html; charset=utf-8');
include($_SERVER['DOCUMENT_ROOT'].'/tv2/cans.php');
// seconds, minutes, hours, days
$expires = 60*30;
header("Pragma: private");
header("Cache-Control: maxage=".$expires);
header('Expires: ' . gmdate('D, d M Y H:i:s', time()+$expires) . ' GMT');
mb_internal_encoding('utf-8');

date_default_timezone_set('America/New_York');



echo('<?xml version="1.0"  encoding="utf-8" ?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd">');
?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>TV Grid</title> 
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />

<meta http-equiv="cache-control" content="private" />
<meta http-equiv="expires" content="<?php echo(gmdate('D, d M Y H:i:s', time()+$expires) . ' GMT');?>" />

<meta name="viewport" content="target-densitydpi=medium-dpi,width=device-width,initial-scale=1,user-scalable=no" />  
<meta name="title" content="TV listings Schelude Guide for mobile" /> 
<meta name="Description" content="Todays on TV - Tv schelude and TV listings for blackberry, nokia, android, iphone,  mobile,tv schelude" /> 
<meta name="Keywords" content="tv shows, tv today,today on tv,tv guide,tv listings,tv today mobile,today on tv mobile,tv guide mobile,tv listings mobile,tv schelude mobile,tv schelude blackberry,tv schelude iphone,tv schelude nokia" /> 
<link rel="alternate" type="application/rss+xml" title="Today TV Recommendations" href="http://feeds.feedburner.com/TodayOnTv-Hightlights" />
<meta name="language" content="en" /> 
<meta name="robots" content="All" /> 
<!-- verification-key:225fecd4-3054-4022-9540-ab2bd207c085 -->
<link type="text/css" rel="stylesheet" href="http://grid.todayontv.mobi/styles.css" />
<style>
.q0{
height: <?php echo($rowh);?>px !important;
position:relative;
}
.q0alt{
border-bottom:1px solid gray;
height: <?php echo($rowh);?>px !important;
margin: 0px !important;
padding: 0px !important;
position:relative;
font-size: x-small;
background-color:#E3E1E2 !important;
}
.started, .stared, .infoed{
background-color:inherit;

}
.infoed b{
color:blue;
}
.stared b{
color:green;
}
.started b{
color:red;
}
.conrelleno{
font-weight:bold;
}
html, body, p, div, td, span, a {
font-family: Verdana, Helvetica, Arial, Sans-Serif;
font-size: small;
color: inherit;
text-transform: capitalize;
}
td, div,b{
margin:0px;
padding:0px;

}
table { 
  border-spacing:0;
  border-collapse:collapse;
}
.qin{
border:0px;
}
.q0{

border-bottom:1px solid gray;
}
.reglahora{
position:relative;
margin:0px;
padding:0px;
border:0px;
}
.reglahoraalt, .conrellenoalt{
background-color:#3D82D4;
color:white;
font-weight:bold;
}
</style>
<script type="text/javascript" src="http://code.jquery.com/jquery.min.js"></script> 
<script type="text/javascript" src="/funcs.js?reload"></script> 
<script>
    function girar() {

        var r = Math.floor(Math.random() * 6666)

        jQuery.ajax({
            type: "post",
            url: "/currenttime.php?r=" + r,
            success: function (data, text) {
                var randomnumber = Math.floor(Math.random() * 6666)
                document.location.href = '/detect.php?r=' + randomnumber;
                return "no conn.";

            },
            error: function (request, status, error) {
                // alert("ERROR: A data connection is required for update grid when orientation change");
            }
        });


    }
    jQuery(window).bind('orientationchange', function (e) {
        /*
        switch ( window.orientation ) { 
        case 0:
        alert('portrait mode');
        break;
        case 90:
        alert('landscape mode screen turned to the left');
        break;
        case -90:
        alert('landscape mode screen turned to the right');
        break;
        }
        */

        girar();

    });

    function goto(url) {
        document.location.href = url;
    }
    function refreshcurrenthour(obj, canal) {
        var r = Math.floor(Math.random() * 11)
        $("#currenthour").load("/currenttime.php?r=" + r);
    }
</script>
<script>
<?php 
if ($wp7=="1"){
?>

        function alertx(txt) {
            window.external.notify(txt);
        }
<?php 
} 
?>
function hidepopup(){
$('#pop-up').hide()
$('#thegrid').show()

}
function showmenumain(){
  $('#thegrid').toggle()
  $('#menus').toggle()
  $("body").scrollTop("0");
  $("body").scrollLeft("0");

}
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
 function sticky() {
      var y = $(window).scrollTop();
      var x = $(window).scrollLeft();

      if (antx!=x || anty!=y){
        antx=x;
        anty=y;

//        if( y > (60) ){
        {
          $('#menu').css({
              'position': 'fixed',
              'top': '0'
          });
        }
       }        
 //     'top': '0','left': -x

      temporizador=setTimeout(function(){sticky()},1000)         
  };

var antx=0;
var anty=0;
var temporizador=null
var refreshhour=null
function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}
function slug(str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();
  
  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to   = "aaaaeeeeiiiioooouuuunc------";
  for (var i=0, l=from.length ; i<l ; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return str;
}

$(document).ready(function(){
  refreshcurrenthour()
  refreshhour=setInterval(function(){refreshcurrenthour()},30000)

  $('.qin').click(function(e) {

   var txt=$(this).html()

   


   if (!txt.trim().endsWith("<!--- imdb --->")){
     txt= txt.replace(/(<([^>]+)>)/ig,"")
     txt= txt.replace("&nbsp;","")
     <?php if ($wp7=="1"){?> alertx(txt) <?php } ?>
     <?php if ($wp7!="1"){?> alert(txt) <?php } ?>
   }

   else{
       txt= txt.replace(/(<([^>]+)>)/ig,"")
       var imdbid=($(this).attr("id").split("_"))[1]
       document.location.href='/movie/detail/id/'+pad(imdbid,7)+'/?next=<?php echo(getP("next"));?>'
   }
//   $('#pop-up').html( + "<a href='#' onclick='hidepopup();return false;' class='boton'>Close this</a>")
//$('#thegrid').hide()

//   $('#pop-up').show()

  });
//  $(window).scroll(sticky);
  temporizador=setTimeout(function(){sticky()},1000)

});
</script>
<script type="text/javascript">

    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-30469433-7']);
    _gaq.push(['_trackPageview']);

    (function () {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();

</script>
<?php
if ($wp7=="1"){
?>
<?php
}
?>

</head>
<body>
<?php



// inicializa la hora ahora
$ampm=date("A");
$redirhora=getmihoraserver(intval(date("h"))." ".$ampm,"00");
$aux6=split(" ",$redirhora);
$ampm=strtoupper ($aux6[1]);
$redirhora=str_replace("am","",$redirhora);
$redirhora=str_replace("pm","",$redirhora);
$redirhora=str_replace("00","",$redirhora);
$redirhora=str_replace(" ","",$redirhora);
$redirhora=str_replace(":","",$redirhora);
$abshora=$redirhora*100 ;
if ($ampm=="PM" && $redirhora!=12 ) $abshora = $abshora + 1200;

$abshoraround=$abshora;
$abshora=$abshora + $minuto;

function megaget($url){
  $opts = array('http' => array('header'=> 'Cookie: ' . $_SERVER['HTTP_COOKIE']."\r\n"));
  $context = stream_context_create($opts);
  $contents = file_get_contents($url, false, $context);
  return $contents;
}

function getFiltrosSql(){
global $cans;
 $canalesoff=$_COOKIE["canalesoff"];
 $canalesoff=str_replace(",,",",",$canalesoff);
 $aux=explode(",",$canalesoff);
 $aux[0]="";
 $cadena="'xxx'";
 for ($i=0;$i<sizeof($aux);$i++){
   if ($aux[$i]!=""){
    $cadena=$cadena.",'".str_replace("-"," ",$aux[$i])."'";
   }
 }

 return $cadena;
}

function duration2width($hfin,$hini,$maxhfin){
       global $roww;
       $hfin=min($hfin,$maxhfin);
       $centini=intval($hini/100);
       $deceini=intval((($hini-($centini*100))*100)/60);
       $centfin=intval($hfin/100);
       $decefin=intval((($hfin-($centfin*100))*100)/60);
$dur=(($centfin*100)+$decefin)-(($centini*100)+$deceini);
    $res=($dur*$roww)/100;
        
    return $res;
}
function hour2decimal($h){
       global $roww;
       $cent=intval($h/100);
       $dece=intval((($h-($cent*100))*100)/60);
        $dur=(($cent*100)+$dece);
    $res=($dur*$roww)/100;
    return $res;
}

function sinparametros(){
	return true;
}
function showrow($row,$abshora,$ahoraampm,$w){
        $out="<div class='qin' id='".$row["id"]."_".$row["imdb2"]."' style='width:".$w."px'>";
	$aux=explode(":",$row["hini"]);
	$h=$aux[0];
	$m=$aux[1];
	$aux=explode(":",$row["hfin"]);
	$h2=$aux[0];
	$m2=$aux[1];
	$am=strtolower($row["hiniam"]);
	$am2=strtolower($row["hfinam"]);
	$istoday=$row["dia"];
	$canal=$row["canal"];
	$aux=explode("|",$row["imdb1"]);
	$generos=$aux[3];
	$rating=$aux[1];
	$programa=$row["programa"];
	$habso=$row["varhini"];
	$habso2=$row["varhfin"];
	$destacado="";
	$imdblink="";
	// echo("ahora:".$ahora."<br/>");
	if (intval($rating)*10>=70 && intval($row["duracion"])>105  && intval($row["duracion"])<=400) 
		$destacado="<!--- stared --->";		
	$hourarr1=getlocalhorahmampm($h.":".$m,$am);
	$hourarr2=getlocalhorahmampm($h2.":".$m2,$am2);
	$out=$out."$destacado";  
	$out=$out.str_replace("&nbsp;","","<b>$programa</b>");
	$out=$out."\r\n<br/> ".getlocalhoraabs($row["varhini"])." to ".getlocalhoraabs($row["varhfin"]);


	//print_r($row);
	if ($row["imdb2"]!=""){
	  //$out=$out."<!--- imdb ---><a href='/movie/".slug($row["programa"])."/id/".$row["imdb2"]."/'  class='boton'>Detail</a>";
//          $out=$out."<!--- imdb --->  <u>$rating out 10</u>";
          $out=$out."<br/>\n";
          if ($rating!=""){
           $out=$out."<b style='font-size:15px'>";
           for ($m=0;$m<round($rating/2);$m++)
            $out=$out."&#9733;";
           $out=$out."</b><font style='font-size:15px'>";
           for (round($rating/2);$m<5;$m++)
            $out=$out."&#9734;";
           $out=$out."</font>";
          }
          $out=$out."<!--- imdb --->"; 
        }else{
          $out=$out."\r\n<br/> on <u><b>$canal</b></u>";
        }
        $out=$out."\n</div>";        
	return $out;

}
function tratarrow($row){
        $row['programa']=ucwords($row["programa"]);
	$row['programa']=str_replace("esdeimdb","",$row['programa']);
	$row['programa']=preg_replace("/[E-e]tiqtt([t0-9])*/", "", $row['programa']);
	if ($row['hiniam']=="pm" && intval(str_replace(":","",$row['hini']))<1200)
	$row['habs1']=intval(str_replace(":","",$row['hini']))+1200;
	else
	$row['habs1']=intval(str_replace(":","",$row['hini']));						
	if ($row['hfinam']=="pm" && intval(str_replace(":","",$row['hfin']))<1200)
		$row['habs2']=intval(str_replace(":","",$row['hfin']))+1200;
	else
		$row['habs2']=intval(str_replace(":","",$row['hfin']));	
	$noadd=0;
	if ($row["hoy"]=="(h2)" && $row["hiniam"]==$row["hfinam"] ) $noadd=1;
	if (getP("what-on-tv-at")==""){
                
	}
	return $row;
      
}
$con = mysql_connect("mob1132510112866.db.8628892.hostedresource.com","mob1132510112866","Soytont0!");
mysql_select_db("mob1132510112866", $con);  	
if (!$con){
	 die('Could not connect: ' . mysql_error());
} 

{
	$mixed[0]="";
	$hoyd=date("m-d-y");
	$varhini=" cast(replace(replace(hini,'12:','0'),':','') as UNSIGNED) + cast(replace(replace(hiniam,'am','0'),'pm','1200') as UNSIGNED)  ";
	$varhfin=" cast(replace(replace(hfin,'12:','0'),':','') as UNSIGNED) + cast(replace(replace(hfinam,'am','0'),'pm','1200') as UNSIGNED)  ";
	$varrating="cast(replace(replace(substring(substring_index(imdb1, '|', 2), length(substring_index(imdb1, '|', 2 - 1)) + 1), ',', ''),'|','') as UNSIGNED)";
	//$where=" and canal='bet' or canal like '%disney%'";
$where=" and 1=1";
	$order=" order by canal,hiniabs asc";
/*
	if (getP("tv-listings")!="" ) {
		$where=$where." and replace(replace(replace(canal,'-',''),'&',''),' ','-') ='".getP("tv-listings")."' ";
	}else{	
		    $where=$where." and canal not in (".getFiltrosSql().") ";
	}
*/
        $where=$where." and canal not in (".getFiltrosSql().") ";
	if (getP("genre")!=""){
//		$where=$where." and (($varhfin)-($varhini))>101 and imdb1 like '%".getP("genre")."%' and $varrating >=5 ";
		$where=$where." and imdb1 like '%".getP("genre")."%'";

		$cuantos=300;
		if (getP("count")!="") $cuantos=getP("count");
		$order=" order by canal,$varrating desc";
		$sqltop=" limit 0,$cuantos ";
	}
	if (getP("best-programs")!=""){
		$where=$where." and $varrating >=6 and imdb1!='' ";
		// $sqltop=" limit 1,600 ";
		// split funcion en mysql
		//			$order=" order by canal,replace(substring(substring_index(imdb1, '|', 2), length(substring_index(imdb1, '|', 2 - 1)) + 1), ',', '') desc";
		$order=" order by canal,hiniabs asc";
	}
        
	$generos=null;
//        $hora=22; 
        if (getP("at")!="") {
              $desphora = intval(getP("at"))*100;     
        }else{
          if ($hora>2) 
            $desphora =($hora-3)*100;
          else
            $desphora =($hora)*100;
        }
        if ($desphora>2300) $desphora=$desphora-2300;


        if (getP("genre")!="") $desphora=0;
        if (getP("next")!="") $desphora=0;
        

        
	$sql="select tvhoyx2.id ,$varhini as varhini,$varhfin as varhfin,(($varhfin)-($varhini)) as duracion,hini,hiniam,hfin,hfinam,programa,canal,dia,imdb1,imdb2, $varhini as hiniabs,$varhfin as hfinabs,'' as habs1,'' as habs2 from tvhoyx2 where (($varhini<=$desphora and $varhfin>=$desphora) or $varhini>=$desphora) $desphorahasta and fecha='$hoysql' and hini!='' $where $order $sqltop";

	//echo(strtolower($sql)."xxx");

	$result = mysql_query($sql);
?>


<?php	
	//echo("<hr/>");
	$anterior="";
        $primerprograma=true;
        $numcanales=0;

        $salida="<tr><td></td>";
        $btnnextplaced=0;
        $contads=0;
        $contadsmax=2;
        $altadsense=false;
        $adsense=false;
        
        $maxhour=$desphora+($numofhoursingrid*100);
	while ($row = mysql_fetch_array($result)) {
                $hinidesp=$row["varhini"]-$desphora;
                $hfindesp=$row["varhfin"]-$desphora;
                if ($hinidesp<0) $hinidesp=0;

                $row=tratarrow($row);
		if ($anterior!=$row["canal"]){
                        $salida.="\n</tr></table><div style='clear:both;'></div>\n\n";  
		
                        $salida.="\n<table cellpadding=0 cellspacing=0 border=0 id='".slug($row["canal"])."'><tr>";
			$anterior=$row["canal"];
                        $primerprograma=true;
                        $btnnextplaced=0;
                        $numcanales++; 

                        if ($contads++==22){

                             $contads=0;
                             $adsense=true; 
                             if (!$wp7) include($_SERVER["DOCUMENT_ROOT"]."/tv2/grid/banners2.php");
                             $salida=$salida.("</tr></table><div style='clear:both;'></div><table cellpadding=0 cellspacing=0><tr><td>$salidaban</td></tr></table>");
                             $salida.="\n<table cellpadding=0 cellspacing=0 id='".slug($row["canal"])."'><tr>";
                             $numcanales++;
                             $numcanales++;
                        }                        
                        if ($althead=="") $althead="alt"; else $althead="";
			$salida=$salida.("\n<td class='q0 conrelleno".$althead."' style= 'border:0px;width:".$rowcanalw."px;'><div style='width:".$rowcanalw."px;'>$anterior</div></td>");
		}
                if ($primerprograma && $row["varhini"]>"0") {
                 if (intval(duration2width($hinidesp,0))!=0){
                  if ($alt=="") $alt="alt"; else $alt="";
                  $salida=$salida.("\n<td class='q0' style='width:".(duration2width($hinidesp,0))."px'><div class='qin' style='width:".duration2width($hinidesp,0)."px'>...</div></td>");
                 }   
                }

                $primerprograma=false;
//echo($row["varhini"]."***".intval($maxhour)."<br/>");
                if (intval($row["varhini"])<intval($maxhour)){

//echo("ok");                

                 $item=showrow($row,$abshora,$ampm,duration2width($hfindesp,$hinidesp,$maxhour-$desphora));
                 $item=str_replace("/?ref_=fn_tt_tt_1\" >","",$item);
                 $item=str_replace("/?ref_=fn_tt_tt_2\" >","",$item);
                 $item=str_replace("/?ref_=fn_tt_tt_3\" >","",$item);
                 $item=str_replace("/?ref_=fn_tt_tt_4\" >","",$item);
                 $item=str_replace("/?ref_=fn_tt_tt_5\" >","",$item);
                 $item=str_replace("/?ref_=fn_tt_tt_6\" >","",$item);
                 $item=str_replace("/?ref_=fn_tt_tt_7\" >","",$item);
                 $item=str_replace("/?ref_=fn_tt_tt_8\" >","",$item);
                 $clases="";
                 if (strpos($item,"<!--- imdb --->")!=false){
                   $clases="infoed";
                 }

                 if (strpos($item,"<!--- stared --->")!=false){
                   $clases="stared trigger";
                 }
                 if (intval($row["varhini"])-$desphora<0){
                   $clases="started";
                 }
                 if (intval(duration2width($hfindesp,$hinidesp,$maxhour-$desphora))!=0){
                  if ($alt=="") $alt="alt"; else $alt="";
		  $salida=$salida.("<td class='q0".$alt." $clases' style='width:".(duration2width($hfindesp,$hinidesp,$maxhour-$desphora))."px'>".$item."</td>");
                 }
                }
                /*
                else if ($btnnextplaced==0){
                   $btnnextplaced=1;
                   $salida=$salida.("<td class='q0 boton' style='left:".(hour2decimal($maxhour-$desphora)+$rowcanalw)."px;top:".(($numcanales*$rowh)+$rowh*5)."px;width:30px'><br/><a href='/at/".((intval($maxhour)/100)+3)."'>Next</a></td>");
                }
                */
    }
    $numcanales++;
    $salida.="\n</tr></table><div style='clear:both;'></div>\n\n"; 
    if (!$wp7) include($_SERVER["DOCUMENT_ROOT"]."/tv2/grid/banners2.php");
    $salida=$salida.("<td class='q0' style='height:45px;width:".$rowcanalw."px;'>$salidaban</td>");

    $num_total_registros = mysql_num_rows($result );
}
?>
<?php 
if ($wp7!=1){
?>
<div  id="menu" class='headertitulo consombra' style="width:100%;position:fixed;left:0px;top:0px;z-index:666;">

<?php
}
else{
?>
<div  id="menu" class='headertitulo consombra' style="width:<?php echo((($numofhoursingrid*$roww)+$rowcanalw));?>px;position:fixed;left:0px;top:0px;z-index:666;">


<?php
}
?>
<table>
<tr>
<td>
   <div id="currenthour" style="width:".$rowcanalw."px;height:32px">Loading...    
   </div>
</td>
<td>
<div class="boton" style="width:60px;text-align:center" onclick="document.location.href='/menu/?next=<?php echo(getP("next"));?>'">Options</div>
</td>
<td>
<div class="boton" style="width:80px;text-align:center" onclick="document.location.href='/highlights/?next=<?php echo(getP("next"));?>'">Highlights</div>

</td>
</tr>
</table>
</div>
<!--- Home --->



<br/><br/><br/>



<?php
if (getnumcols_in()>=420){
 $contadsmax=1;
 $altadsense=true;
 $adsense=false;
?>
<div id="banner">
<script type="text/javascript"><!--
    google_ad_client = "ca-pub-5716547436542020";
    /* tvgridbig */
    google_ad_slot = "9505302792";
    google_ad_width = 468;
    google_ad_height = 60;
//-->
</script>
<script type="text/javascript"
src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
</script>
</div>
<?php
}else{
 $contadsmax=1;
 $altadsense=true;
 $adsense=true;
}
if (!$wp7) include($_SERVER["DOCUMENT_ROOT"]."/tv2/grid/banners2.php");
echo($salidaban);

$nextbtn="";
$anthour=-1;
function getfecha($h){
     $hoy=date("Y-m-d");
     $manana=date("Y-m-d", strtotime("+1 days"));
     $ayer=date("Y-m-d", strtotime("-1 days"));
     if (istomorrowsite()){
      if (intval($h)>=getoffset()) return $manana; else return $hoy;
     }else
      if (intval($h)>=getoffset()) return $hoy; else return $ayer;
}
echo("<br/><table cellpadding=0 cellspacing=0><tr>");
echo("<td class='reglahora' style='width:".$rowcanalw."px;'><div style='width:".$rowcanalw."px;'>&nbsp;</div></td>"); 
for ($i=$desphora/100;$i<$maxhour=($desphora+($numofhoursingrid*100))/100;$i++){
 if ($i>=24) break;
 {    
    $currentday=getfecha($i);
 }
  $localhour=intval(getlocalhoraabs($i."00"));

  $despdia_conoffset = date("Y-m-d ".$localhour.":i ")."am";  


  if ($localhour>12) {
    $localhour=intval($localhour)-12;
    $despdia_conoffset = date("Y-m-d ".$localhour.":i ")."pm";  
  };

  $despdia_sinoffset = date("Y-m-d  g:i a",time($despdia_conoffset));

  if ($alt=="") $alt="alt"; else $alt="";
  echo("<td style='width:".$roww."px;' class='reglahora"."$alt'><div style='width:".$roww."px;'><b>".getlocalhoraabs($i."00"));  
  echo("<br/>$currentday</b></div> $nextbtn</td>");
}
echo("</tr></table>");
?>
<script>
function fijar2(que){
    /*
    $(que).css('position','fixed');
    $(que).css('z-index','777');
    $(que).css('bottom','0px');
    $(que).css('left','0px');
    */
    
}
</script>
<?php
echo($salida);
?>

<?php
//echo("wp7= $wp7");
//print_r($_COOKIE);
//echo($_SERVER["HTTP_USER_AGENT"]);
//Windows Phone 7. or Windows Phone OS 7.
?>


</body>
</html>
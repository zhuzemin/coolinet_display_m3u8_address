// ==UserScript==
// @name        coolinet m3u8 address
// @name:zh-TW        coolinet m3u8 address
// @name:zh-CN        coolinet m3u8 address
// @supportURL  https://github.com/zhuzemin
// @description coolinet show m3u8 address
// @description:zh-CN coolinet show m3u8 address
// @description:zh-TW coolinet show m3u8 address
// @include     https://www.coolinet.net/*
// @version     1.0
// @grant       GM_xmlhttpRequest
// @run-at      document-start
// @author      zhuzemin
// @license     Mozilla Public License 2.0; http://www.mozilla.org/MPL/2.0/
// @license     CC Attribution-ShareAlike 4.0 International; http://creativecommons.org/licenses/by-sa/4.0/
// @connect-src video1.yocoolnet.in
// ==/UserScript==
var config = {
  'debug': false
};
var debug = config.debug ? console.log.bind(console)  : function () {
};
class Player{
  constructor(href) {
    this.method = 'GET';
    this.url = href;
    this.headers = {
      'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
      'Accept': 'application/atom+xml,application/xml,text/xml',
      'Referer': window.location.href,
    };
    this.charset = 'text/plain;charset=utf8';
  }
};
var getLocation = function(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
};
var init = function () {
	var allmyplayer=document.querySelector("#allmyplayer");
	var src="https:"+allmyplayer.getAttribute("src");
      debug(src);
      var player = new Player(src);
      debug(player.url);
      GM_xmlhttpRequest({
        method: player.method,
        url: player.url,
        headers: player.headers,
        overrideMimeType: player.charset,
        //synchronous: true
        onload: function (responseDetails) {
          debug(responseDetails);
          var Html = new DOMParser().parseFromString(responseDetails.responseText, "text/html");
          debug(Html);
          var m3u8;
          var p1 = Html.querySelector('#p1');
          if(p1!=null){
            var script=p1.querySelector("script");
            var url=script.innerText.match(/url:\s"([\/\.\d\w]*)"/)[1];
            var hostname=getLocation(player.url).hostname;
            m3u8="https://"+hostname+url;
          }
          else{
            var mediaplayer1=Html.querySelector("#mediaplayer1");
            var script=mediaplayer1.nextElementSibling;
            var url=script.innerText.match(/url:\s"([:\/\.\d\w]*)"/)[1];
            m3u8=url;
          }
          debug(m3u8);
          var div=document.querySelector("div.videoWrap");
          var title=div.querySelector("h2").innerText;
          var input=document.createElement("input");
          input.setAttribute("type","text");
          input.setAttribute("value",m3u8);
          input.size=100;
          div.parentNode.insertBefore(input,div);
          var N_m3u8DL=document.createElement("input");
          N_m3u8DL.setAttribute("type","text");
          N_m3u8DL.setAttribute("value",'N_m3u8DL-CLI_v2.4.6 "'+m3u8+'" --headers "Referer:https://video1.yocoolnet.in/|Accept:text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"  --saveName "'+title+'"');
          N_m3u8DL.size=100;
          div.parentNode.insertBefore(N_m3u8DL,div);
        }
      });
}
window.addEventListener('DOMContentLoaded', init);
	
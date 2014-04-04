// ==UserScript==
// @name        Adfree thePiratebay
// @description remove ads from thepiratebay website
// @namespace   nod
// @downloadURL https://nodar-chkuaselidze.github.io/userscripts/scripts/piratebay-adfree.user.js
// @updateURL   https://nodar-chkuaselidze.github.io/userscripts/scripts/piratebay-adfree.meta.js
// @include     http://thepiratebay.se/*
// @include     https://thepiratebay.se/*
// @version     1.1.0
// @grant       none
// ==/UserScript==

function removeAds() {
  var ads = document.getElementsByTagName('iframe');

  while(ads.length)
    ads[0].parentNode.removeChild(ads[0]);
}

removeAds();
window.addEventListener('load', removeAds);

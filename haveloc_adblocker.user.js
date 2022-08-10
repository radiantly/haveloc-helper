// ==UserScript==
// @name        Haveloc Adblocker
// @namespace   LB.HA
// @match       https://app.haveloc.com/*
// @grant       none
// @version     1.0
// @author      rad
// @description Blocks ads on haveloc
// ==/UserScript==

document.body.insertAdjacentHTML(
  "beforeend",
  `
<style>
  .adsbygoogle,
  iframe {
    display: none !important;
  }
</style>
`
);

window.TikTokNetworkID = true;
window.SIPID = false;

function initMRAID() { window.MRAIDNetworkID ? "loading" === mraid.getState() ? mraid.addEventListener("ready", onSdkReady) : onSdkReady() : (initGame(), document.addEventListener("visibilitychange", visibilityListener)) } function visibilityListener() { document.visibilityState } function viewableChangeHandler(e) { e && showMyAd(), GlobalData.appPlayed } function onSdkReady() { mraid.addEventListener("viewableChange", viewableChangeHandler), mraid.isViewable() && showMyAd() } function showMyAd() { window.appPlayed || initGame() } function initGame() { window.appPlayed = !0, window.mintegralNetworkID ? window.gameReady && window.gameReady() : createGame() } function gameStart() { createGame() } function gameClose() { } var game; function createGame() { game = new Phaser.Game(config), window.addEventListener("resize", resizeHandler), resizeHandler() } function resizeHandler() { } function gotoStoreHandler() { if (window.mintegralNetworkID) window.install && window.install(); else if (window.TikTokNetworkID) window.playableSDK.openAppStore(); else if (window.MRAIDNetworkID) if (window.MRAIDWithURL) { var e = navigator.userAgent || navigator.vendor, i = "https://apps.apple.com/app/id1625989755"; /android/i.test(e) && (i = "https://play.google.com/store/apps/details?id=com.gamestart.pullemall"), mraid.open(i) } else mraid.open(""); else alert("Go to store") } "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", (function (e) { initMRAID() })) : initMRAID();
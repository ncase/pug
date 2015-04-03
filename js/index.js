/***

On scroll, tell each playable iframe whether they're on screen,
and if so, how far they are along the page.

Parallax Parameter:
< 0: below viewing screen
0 < x < 1: on screen
> 1: above viewing screen

***/
var playables = document.querySelectorAll("#article iframe");
window.onscroll = function(){
	var scrollY = window.pageYOffset;
	var innerHeight = window.innerHeight;
	for(var i=0;i<playables.length;i++){
		var p = playables[i];
		var top = p.offsetTop-innerHeight;
		var bottom = p.offsetTop+parseInt(p.height=="100%" ? innerHeight : p.height);
		var parallax = (scrollY-top)/(bottom-top); // from 0 to 1
		p.contentWindow.postMessage({
			onScreen: (0<parallax && parallax<1),
			parallax: parallax
		},"*");
	}
};
window.onload = function(){
	window.onscroll();
};
"use strict";
(function(win,doc){
	function fontScale(){
		var innerWidth = win.innerWidth;
		if (!innerWidth) {
			return false;
		}
		win._rootFontSize =innerWidth < 640 ? (20 * innerWidth / 320) : 40;
		doc.documentElement.style.fontSize = win._rootFontSize + 'px';
	}
	fontScale();
	win.addEventListener('resize', fontScale, false);
})(window,document)
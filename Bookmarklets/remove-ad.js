(function(){
    var selector = '.__brand_top_2889, \
#mlph2889, \
[class^="sidebar"]:not(html), \
#fishki-video-frame-wrapper, \
[class*="banner"], \
iframe:not([allowfullscreen]), \
.pagelet, \
.sideColumn';
    var els = document.querySelectorAll(selector);
    els.forEach(e => e.remove());
    alert(els.length + ' elements was deleted!');
})();







(function(){
    var count = 0;
    var selector = [
        '.__brand_top_2889',
        '#mlph2889',
        '[class^="sidebar"]:not(html)',
        '#fishki-video-frame-wrapper',
        '[class*="banner"]',
        'iframe',
        '.pagelet',
        'iframe[src*="googleapis"]',
        '.container-slider-top',
        '.sideColumn'
    ].join(',');
    var els = document.querySelectorAll(selector);
    alert(els.length + ' elements found')
    els.forEach(e => {
        count++;
        e.remove();
    });
    alert(count + ' elements have been deleted!');
})();

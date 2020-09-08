(function(d){
    var selector = '[class*=application],.l-window,.article__content';
    d.querySelectorAll(selector).forEach(e => {
        e.style.width = '100%';
        //e.style.position = 'absolute';
        e.style.maxWidth = '100%';
    });
    alert('done');
})(document)

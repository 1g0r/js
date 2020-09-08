(function(d){
    var selector = '.article__content';
    var body = d.querySelector('body');
    body.style.display = 'flex';
    body.style.flexDirection = 'column';
    body.style.justifyContent = 'center';
    var elements = d.querySelectorAll(selector) || [];
    if(elements.length > 0){
        body.innerHTML = '';
        elements.forEach(e => {
            e.style.width = '100%';
            e.style.maxWidth = '50%';
            e.style.backgroundColor = 'white';
            body.append(e);
        });
    }
    alert('done');
})(document)

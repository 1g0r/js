(function(d){
    var selector = '[class*=application]';
    d.querySelectorAll(selector).forEach(e => e.style.width = '100%');
    alert('done');
})(document)

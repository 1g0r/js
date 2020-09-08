(function(d){
    var selector = '[class*=application],.l-table';
    d.querySelectorAll(selector).forEach(e => e.style.width = '100%');
    alert('done');
})(document)

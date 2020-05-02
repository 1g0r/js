(function(){
    var links = document.getElementsByTagName('a');
    var c=0;
    for(var i=0; i<links.length; i++){
        if(links[i].href && !links[i].target && links[i].className !== 'next') {
                links[i].target = '_blank';
                c++;
            }
        }
    alert(c + ' links were fixed');
})()

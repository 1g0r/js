(function() {
  var send = function(request, callback) {
    callback(null, request);
  };
  var step1 = function(callback) {
  	alert(1);
    callback('step1', null);
  };
  var step2 = function(from, resp, callback) {
  	alert(2);
    callback('step2', {
      resp: 200,
      value: 666
    });
  };
  var step3 = function(from, resp, callback) {
  	alert(3);
    callback('step3', null);
  };
  var step5 = function(from, resp, callback) {
  	alert(5);
    callback('step5', null);
  };
  var step4 = function(f, r) {
    alert(f + r);
  };

  //var t = () => step1((f, r) => step2(f, r, (f2, r2) => step3(f2, r2, (f3, r3) => step4(f3, r3))));
  //t();
  
  var ww = function(fn) {
    return (n) => {
    	//var nn = n();
    	return (c) => fn((f, r) => n(f, r, c));
    };
  };
  var t1 = ww(step1);
  var t2 = ww(t1(step2));
  var t3 = ww(t2(step3));
  //var tt = t3(step5);
  //var tt = t1(step4);
  var tt = ww(ww(ww(step1)(step2))(step3))(step5)
  alert(tt);
  tt(step4);
})();

(function() {
    //callback chain
    //composition
    //currying
    //application (pipes)
    //map, reduce, filter

    function a() {}
    function b() {}
    function c() {}

    // Use currying to reduce number of parameters
    a(b(c(), 2)); //or
    var b2 = x => b(x, 2);
    a(b2(c('waffle')));

    // Use currying for polymorphism
    function emailSender(obj, message) {};
    function consoleLogger() {};

    function clientOfSender(sender) {
        var message = 'Client willing to send this message to a sender';
        sender(message);
    };
})();
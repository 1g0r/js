var chain = (...fns) => () => fns.reduceRight((arg, fn) => fn(arg));
var mapParam = fn => next => (req, resp) => fn(resp, next);
var invoke = fn => (req, resp) => fn(resp);

// Lib function
function send(request, callback) {
    $.sendRequest(request, function(error, response){
        if (error){
            console.error(error);
        } else if (response.code != 200) {
            console.error(response);
        } else if (response && response.size && response.size !== 0){
            callback(request, response.json());
        } else {
            callback(request, response);
        }
    })
}

// Example methods.
// Let's say wee want to create some kind of an 2 factor authentication
// Fist we call 'auth/token' API to get session token with login and password
// Secondly we call 'auth/code' REST API to activate session and get type of second phase
// Thirdly we call 'auth/activate' REST API to activate session and to get Authorization token to be passed through all requests
// Without chaining the process described would look like so
var firstRequest = {
    url: 'auth/token',
     method: 'POST'
}
send(firstRequest, (request1, response1) => {
    // First handler's code goes here. 
    // Note that firstRequest an the request1 are the same objects
    // Here we are building second request out of data that came with the response1 
    // And if we are OK we are calling second API method
    var secondRequest = {
        url: 'auth/code',
        method: 'POST'
    };
    send(secondRequest, (request2, response2) => {
        // Second handler's code goes here
        // Note that secondRequest and request2 are the same too
        // Here we are analyzing the response2 and if it's OK 
        // we are building our third request
        var thirdRequest = {
            url: 'auth/code',
            method: 'POST'
        };
        send(thirdRequest, (request3, response3) => {
            // Third handler's code goes here
            // Note that thirdRequest and request3 are the same too
            // Inhere we are analyzing the response3 and if all good
            // we are logged in!

            //save session token for future requests
        });
    });
});

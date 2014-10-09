var rated = false;
var url = "";
var state = {};


function setup() {
    state = JSON.parse(getCookie('state')); 

    rated = false;

    // for all urls in state
    for (k in state) {

        // look for the one which matches the tab
        if (k == url) {

            // and go though all the ratings
            for (rating in state[k]) {
                $('.rating-' + rating).removeClass('rating-h');
                // alnd change color of those ratings
                for (i=1; i <= state[k][rating]; i++) {
                    $('#' + rating + "-" + i).css('color','gold')
                }
            }

            rated = true;
             $('#send-button').hide();
        }
    }

    if (!rated) {
        $('#send-button').show();
        $('.rating').each(function() {
            $(this).addClass('rating-h')
        });
    }
}



chrome.tabs.getSelected(null,function(tab) {
        var tablink = tab.url;
        var parser = document.createElement('a');
        parser.href = tablink;
        url = parser.protocol + "//" + parser.hostname;
        setup();
});

function createUUID() {
    // http://www.ietf.org/rfc/rfc4122.txt
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

$(document).ready(function(){


    $('.rating span').click(function(span){

            var params = $(this).attr('id').split('-');

            if (typeof(state[url]) == 'undefined') {
                state[url] = {};
            }

            // if we didn't vote on this one yet
            if (rated == false) {
                state[url][params[0]] = parseInt(params[1]);
                for (i=1; i <= params[1]; i++) {
                   $('#' + params[0] + "-" + i).css('color','gold')
                }

                setCookie('state', JSON.stringify(state));
            }
    });

    $('#send-button').click(function(span){
        sendData();
    });
});



function sendData() {
    chrome.tabs.getSelected(null,function(tab) {

        var uid = getCookie("id") 

        if (uid == "") {
            uid = createUUID();
            setCookie("id", uid)
        }

        if (typeof(state[url]) != 'undefined') {
            var request = {url: url, uid: uid, data: {rating:state[url]}};

            $.ajax('http://rateit.modeo.co.uk',{
                'data': JSON.stringify(request), //{action:'x',params:['a','b','c']}
                'type': 'POST',
                'processData': false,
                'contentType': 'application/json',
                success: function(data){
                    window.close();
                }
            });
        }

    });
}



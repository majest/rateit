
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

function setCookie(){
    document.cookie = "id=" + createUUID();
    return document.cookie;
}

function getCookie(){
    return document.cookie;
}

var state = {};

$(document).ready(function(){
    $('.rating span').click(function(span){
            var params = $(this).attr('id').split('-');
            state[params[0]] = params[1];
            for (i=1; i <= params[1]; i++) {
               $('#' + params[0] + "-" + i).css('color','gold')
            }
    });

    $('#send-button').click(function(span){
        sendData();
    });
});


function sendData() {
    chrome.tabs.getSelected(null,function(tab) {
        var tablink = tab.url;
        var parser = document.createElement('a');
        parser.href = tablink;
        url = parser.protocol + "//" + parser.hostname;
        var cookie = getCookie();
        if (cookie.length == 0) {
            cookie = setCookie();
        }

        cookieParts = cookie.split("-");
        $.post('http://modeo.co.uk:9010',{url: url, uid: cookie[1], data: {rating:state}})
    });
}



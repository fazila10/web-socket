 var stompClient = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversationDiv").show();
    }
    else {
        $("#conversationDiv").hide();
    }
}
function connect() {
    var socket = new SockJS('/web-socket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/messages', function(messageOutput) {
             showMessageOutput(JSON.parse(messageOutput.body));
        });
    });
}
function disconnect() {
    if(stompClient != null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}
function sendMessage() {
    stompClient.send("/app/chat", {}, JSON.stringify({'from': $("#from").val(),'text': $("#text").val()}));
}

function showMessageOutput(messageOutput) {
    $("#messages").append("<tr><td>" + messageOutput.from + ": " + messageOutput.text + " (" + messageOutput.time + ")" + "</td></tr>");
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendMessage(); });
});

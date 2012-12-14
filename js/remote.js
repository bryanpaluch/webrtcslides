$(function () {

	
    socket = io.connect('/');

    socket.on('connect', function () { 
	socket.emit('remote_connected');
    	socketReady = true;
    });
    $('a').live('click', function(){
	console.log(this);
	socket.emit('remote', {command: $(this).attr('data')});
    });
});


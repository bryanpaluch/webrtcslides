# WebRTC slides for Node Philly

```


1. Install [Node.js](http://nodejs.org/)
2. Run ```npm install```
3. Run ```node plugin/webrtc-server```
4. Go to http://yourserverip:1974 on the presentation computer
5. Go to http://yourserverip:1974/receiver on the computer you wish to chat
6. Go to http://yourserverip:1974/remote2 or remote1 for remote for your
   smartphone. Remote2 is using jquery mobile and remote1 is using
   rachet.
7. Note replace localhost with the ip of your server.


plugin/webrtc-server/index.js has the code for both the remote server
and webrtc signaling. 

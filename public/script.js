const socket = io('/')
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;
var peer = new Peer(undefined,{
    path:'/peerjs',
    host:'/',
    port:'3030'
});

let myVideoStream;

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true,
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo,stream)

    console.log("h")//--------
    peer.on('call',call=>{
        console.log("hi")//------------
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream',userVideoStream=>{
            addVideoStream(video,userVideoStream)
        })
    })

    socket.on('user-connected',(userId)=>{
        connecToNewUser(userId,stream);
    })
})

peer.on('open',id=>{
    // console.log("peer connected")
    socket.emit('join-room',ROOM_ID,id);
    console.log(ROOM_ID,id)//-------
    
})

const connecToNewUser = (userId,stream) =>{
    const call = peer.call(userId,stream)
    console.log(userId)
    const video = document.createElement('video');
    call.on('stream',userVideoStream =>{
        addVideoStream(video,userVideoStream)
        console.log("line 45")//--------------
    })
}



const addVideoStream = (video,stream) => {
    video.srcObject = stream; 
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    })
    videoGrid.append(video);
}
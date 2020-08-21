const socket  = io('/')
const videoGrid = document.getElementById('video-grid');
const myPeer= new Peer(undefined,{
    path: '/peerjs',
    host:'/',
    port:'443'
})

const myVideo = document.createElement('video')
myVideo.muted = true
navigator.mediaDevices.getUserMedia({
    video:true,
    audio: true
}).then(stream=>{
    myVideoStream = stream;
    addVideoStream(myVideo, stream)
    myPeer.on('call', call => {
      call.answer(stream)
      const video = document.createElement('video')
      call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
      })
    })
  
    socket.on('user-connected', userId => {
      connectToNewUser(userId, stream)
    })
})

myPeer.on('open', id=>{
    socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
      video.remove()
    })
  
    // peers[userId] = call
  }

  function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    videoGrid.append(video)
  }

let text = $('input')
  $('html').keydown((e)=>{
    if(e.which ===13 && text.val().length != 0){
      console.log(text.val())
      socket.emit('message', text.val())
      text.val('')
    }
  })

  socket.on('createMessage', message=>{
    $('ul').append(`<li class='message'><b>User</b><br/>${message}</li>`)
    scrollToBottom()
  })

  const scrollToBottom = ()=>{
    const d = $('.right__messages')
    d.scrollTop(d.prop('scrollHeight'))
  }

  const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getAudioTracks()[0].enabled = false;
      setUnmuteButton();
    } else {
      setMuteButton();
      myVideoStream.getAudioTracks()[0].enabled = true;
    }
  }

  const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `
    document.querySelector('.audio__control__button').innerHTML = html;
  }
  
  const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
    document.querySelector('.audio__control__button').innerHTML = html;
  }

  const playStop = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  }

  const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.video__control__button').innerHTML = html;
  }
  
  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.video__control__button').innerHTML = html;
  }
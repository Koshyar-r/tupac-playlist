const Container = document.querySelector(".container"),
NowPlaying = document.querySelector("#now__playing"),
MusicImg = Container.querySelector(".img-area img"),
MusicName = Container.querySelector(".song-details .name"),
MusicArtist = Container.querySelector(".song-details .artist"),
VolumeContainer = Container.querySelector(".volume__container"),
volume_slider = Container.querySelector(".volume_slider"),
Volume = Container.querySelector("#volume"),
MusicIcon = Container.querySelector(".music"),
PlayPauseBtn = Container.querySelector(".play-pause"),
PrevBtn = Container.querySelector("#prev"),
NextBtn = Container.querySelector("#next"),
MainAudio = Container.querySelector("#main-audio"),
ProgressArea = Container.querySelector(".progress-area"),
ProgressBar = ProgressArea.querySelector(".progress-bar"),
MusicList = Container.querySelector(".music-list"),
MoreMusicBtn = Container.querySelector("#more-music"),
CloseMoreMusic = MusicList.querySelector("#close")

let MusicIndex = Math.floor((Math.random() * AllMusic.length) + 1)
isMusicPaused = true

window.addEventListener("load", ()=>{
  loadMusic(MusicIndex)
  playingSong()
})

Volume.addEventListener("click", () => {
    VolumeContainer.classList.add("active")

    setTimeout(() => {
      VolumeContainer.classList.remove("active")
    }, 6000)
})

function MusicAnimation() {
    Container.querySelector(".top-bar img").classList.add("active")
}

function SetVolume() {
    MainAudio.volume = volume_slider.value / 100
}

function loadMusic(indexNumb){
  MusicName.innerText = AllMusic[indexNumb - 1].name
  MusicArtist.innerText = AllMusic[indexNumb - 1].artist
  MusicImg.src = `images/${AllMusic[indexNumb - 1].src}.jpg`
  MainAudio.src = `songs/${AllMusic[indexNumb - 1].src}.mp3`
  NowPlaying.textContent = "Playing " + (indexNumb) + " of " + AllMusic.length
}


function playMusic(){
  Container.classList.add("paused")
  PlayPauseBtn.querySelector("i").innerText = "pause"
  MainAudio.play()
  MusicAnimation()
}

function pauseMusic(){
  Container.classList.remove("paused")
  PlayPauseBtn.querySelector("i").innerText = "play_arrow"
  MainAudio.pause()
  Container.querySelector(".top-bar img").classList.remove("active")
}

//prev music function
function prevMusic(){
  MusicIndex-- //decrement of MusicIndex by 1
  //if MusicIndex is less than 1 then MusicIndex will be the array length so the last music play
  MusicIndex < 1 ? MusicIndex = AllMusic.length : MusicIndex = MusicIndex
  loadMusic(MusicIndex)
  playMusic()
  playingSong() 
}

//next music function
function nextMusic(){
  MusicIndex++ //increment of MusicIndex by 1
  //if MusicIndex is greater than array length then MusicIndex will be 1 so the first music play
  MusicIndex > AllMusic.length ? MusicIndex = 1 : MusicIndex = MusicIndex
  loadMusic(MusicIndex)
  playMusic()
  playingSong() 
}

// play or pause button event
PlayPauseBtn.addEventListener("click", ()=>{
  const isMusicPlay = Container.classList.contains("paused")
  //if isPlayMusic is true then call pauseMusic else call playMusic
  isMusicPlay ? pauseMusic() : playMusic()
  playingSong()
})

//prev music button event
PrevBtn.addEventListener("click", ()=>{
  prevMusic()
})

//next music button event
NextBtn.addEventListener("click", ()=>{
  nextMusic()
})

// update progress bar width according to music current time
MainAudio.addEventListener("timeupdate", (e)=>{
  const currentTime = e.target.currentTime //getting playing song currentTime
  const duration = e.target.duration //getting playing song total duration
  let progressWidth = (currentTime / duration) * 100
  ProgressBar.style.width = `${progressWidth}%`

  let musicCurrentTime = Container.querySelector(".current-time"),
  musicDuartion = Container.querySelector(".max-duration")
  MainAudio.addEventListener("loadeddata", ()=>{
    // update song total duration
    let mainAdDuration = MainAudio.duration
    let totalMin = Math.floor(mainAdDuration / 60)
    let totalSec = Math.floor(mainAdDuration % 60)
    if(totalSec < 10){ //if sec is less than 10 then add 0 before it
      totalSec = `0${totalSec}`
    }
    musicDuartion.innerText = `${totalMin}:${totalSec}`
  })
  // update playing song current time
  let currentMin = Math.floor(currentTime / 60)
  let currentSec = Math.floor(currentTime % 60)
  if(currentSec < 10){ //if sec is less than 10 then add 0 before it
    currentSec = `0${currentSec}`
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`
})

// update playing song currentTime on according to the progress bar width
ProgressArea.addEventListener("click", (e)=>{
  let progressWidth = ProgressArea.clientWidth //getting width of progress bar
  let clickedOffsetX = e.offsetX //getting offset x value
  let songDuration = MainAudio.duration //getting song total duration
  
  MainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration
  playMusic() //calling playMusic function
  playingSong()
})

//change loop, shuffle, repeat icon onclick
const repeatBtn = Container.querySelector("#repeat-plist")
repeatBtn.addEventListener("click", ()=>{
  let getText = repeatBtn.innerText //getting this tag innerText
  switch(getText){
    case "repeat":
      repeatBtn.innerText = "repeat_one"
      repeatBtn.setAttribute("title", "Song looped")
      break
    case "repeat_one":
      repeatBtn.innerText = "shuffle"
      repeatBtn.setAttribute("title", "Playback shuffled")
      break
    case "shuffle":
      repeatBtn.innerText = "repeat"
      repeatBtn.setAttribute("title", "Playlist looped")
      break
  }
})

//code for what to do after song ended
MainAudio.addEventListener("ended", ()=>{
  // we'll do according to the icon means if user has set icon to
  // loop song then we'll repeat the current song and will do accordingly
  let getText = repeatBtn.innerText //getting this tag innerText
  switch(getText){
    case "repeat":
      nextMusic() //calling nextMusic function
      break
    case "repeat_one":
      MainAudio.currentTime = 0 //setting audio current time to 0
      loadMusic(MusicIndex) //calling loadMusic function with argument, in the argument there is a index of current song
      playMusic() //calling playMusic function
      break
    case "shuffle":
      let randIndex = Math.floor((Math.random() * AllMusic.length) + 1) //genereting random index/numb with max range of array length
      do{
        randIndex = Math.floor((Math.random() * AllMusic.length) + 1)
      }while(MusicIndex == randIndex) //this loop run until the next random number won't be the same of current MusicIndex
      MusicIndex = randIndex //passing randomIndex to MusicIndex
      loadMusic(MusicIndex)
      playMusic()
      playingSong()
      break
  }
})

//show music list onclick of music icon
MoreMusicBtn.addEventListener("click", ()=>{
  MusicList.classList.toggle("show")
})
CloseMoreMusic.addEventListener("click", ()=>{
  MoreMusicBtn.click()
})

const ulTag = Container.querySelector("ul")
// let create li tags according to array length for list
for (let i = 0 ; i < AllMusic.length ; i++) {
  //let's pass the song name, artist from the array
  let liTag = `<li li-index="${i + 1}">
                <div class="row">
                  <span>${AllMusic[i].name}</span>
                  <p>${AllMusic[i].artist}</p>
                </div>
                <span id="${AllMusic[i].src}" class="audio-duration">3:40</span>
                <audio class="${AllMusic[i].src}" src="songs/${AllMusic[i].src}.mp3"></audio>
              </li>`
  ulTag.insertAdjacentHTML("beforeend", liTag) //inserting the li inside ul tag

  let liAudioDuartionTag = ulTag.querySelector(`#${AllMusic[i].src}`)
  let liAudioTag = ulTag.querySelector(`.${AllMusic[i].src}`)
  liAudioTag.addEventListener("loadeddata", ()=>{
    let duration = liAudioTag.duration
    let totalMin = Math.floor(duration / 60)
    let totalSec = Math.floor(duration % 60)
    if(totalSec < 10){ //if sec is less than 10 then add 0 before it
      totalSec = `0${totalSec}`
    }
    liAudioDuartionTag.innerText = `${totalMin}:${totalSec}` //passing total duation of song
    liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`) //adding t-duration attribute with total duration value
  })
}

//play particular song from the list onclick of li tag
function playingSong(){
  const allLiTag = ulTag.querySelectorAll("li")
  
  for (let j = 0 ; j < allLiTag.length ; j++) {
    let audioTag = allLiTag[j].querySelector(".audio-duration")
    
    if(allLiTag[j].classList.contains("playing")){
      allLiTag[j].classList.remove("playing")
      let adDuration = audioTag.getAttribute("t-duration")
      audioTag.innerText = adDuration
    }

    //if the li tag index is equal to the MusicIndex then add playing class in it
    if(allLiTag[j].getAttribute("li-index") == MusicIndex){
      allLiTag[j].classList.add("playing")
      audioTag.innerText = "Playing"
    }

    allLiTag[j].setAttribute("onclick", "clicked(this)")
  }
}

//particular li clicked function
function clicked(element){
  let getLiIndex = element.getAttribute("li-index")
  MusicIndex = getLiIndex //updating current song index with clicked li index
  loadMusic(MusicIndex)
  playMusic()
  playingSong()
}
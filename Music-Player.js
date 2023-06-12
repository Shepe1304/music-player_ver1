// song list initialization
const songlist = document.getElementsByClassName("song-name-list");
const songlistBlock = document.getElementsByClassName("song");
const songlistBtn = document.getElementsByClassName(
  "song-list-minimize-btn"
)[0];
const songlistBox = document.getElementsByClassName("songs")[0];

// volume initialization
const volume = document.querySelector(".volume-slider");
const volumeIconContainer = document.querySelector(".volume-icon-container");
const volumeIcon = document.querySelector(".volume-icon");
const volumeCurrent = document.querySelector(".volumeCurrent");
let volumeSave;

// song initialization
let songId = 0;
const title = document.querySelector(".song-name");
const artist = document.querySelector(".artist-name");
const cover = document.getElementById("cover");
const music = document.querySelector("audio");

// progress intialization
const progress = document.querySelector(".progress");
const fromStart = document.querySelector(".fromStart");
const finish = document.querySelector(".finish");
const playBtn = document.getElementById("play");
const rewindBtn = document.getElementById("rewind");
const forwardBtn = document.getElementById("forward");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let isPlaying = false;
let listIsShowing = true;

// timers
let timer;
let timeOut;
let timeOut2;

const songs = [
  {
    name: "achillescomedown",
    displayName: "Achilles Come Down",
    artist: "Gang Of Youths Band",
  },

  {
    name: "tellme",
    displayName: "Tell Me",
    artist: "Milet",
  },

  {
    name: "comedy",
    displayName: "Comedy",
    artist: "Gen Hoshino",
  },

  {
    name: "everythinggoeson",
    displayName: "Everything Goes On",
    artist: "Porter Robinson",
  },
];

function timeCalc(t) {
  let a = Math.trunc(Math.trunc(t) / 60);
  let b = Math.trunc(Math.trunc(t) % 60);
  let sa = a.toString();
  let sb = b.toString();
  if (sb.length < 2) sb = "0" + sb;
  let res = sa + ":" + sb;
  return res;
}

// Volume initialization
music.volume = 0.8;
volume.max = 100;
volume.value = music.volume * 100;
volumeCurrent.textContent = volume.value;
volumeSave = volume.value;

music.onloadedmetadata = function () {
  progress.max = music.duration;
  progress.value = music.currentTime;
  finish.textContent = timeCalc(music.duration);
};

volume.oninput = function () {
  music.volume = (1.0 * volume.value) / 100;
  volumeCurrent.textContent = volume.value;
  if (music.volume > 0) volumeSave = volume.value;
  if (volume.value == 0) {
    volumeIcon.setAttribute("class", "volume-icon fa-solid fa-volume-off");
  } else if (volume.value <= 50) {
    volumeIcon.setAttribute("class", "volume-icon fa-solid fa-volume-low");
  } else if (volume.value < 100) {
    volumeIcon.setAttribute("class", "volume-icon fa-solid fa-volume");
  } else if (volume.value == 100) {
    volumeIcon.setAttribute("class", "volume-icon fa-solid fa-volume-high");
  }
};

volumeIconContainer.addEventListener("click", () => {
  if (music.volume == 0) {
    music.volume = (1.0 * volumeSave) / 100;
    volume.value = volumeSave;
    if (volume.value <= 50) {
      volumeIcon.setAttribute("class", "volume-icon fa-solid fa-volume-low");
    } else if (volume.value < 100) {
      volumeIcon.setAttribute("class", "volume-icon fa-solid fa-volume");
    } else if (volume.value == 100) {
      volumeIcon.setAttribute("class", "volume-icon fa-solid fa-volume-high");
    }
  } else {
    music.volume = 0;
    volume.value = 0;
    volumeIcon.setAttribute("class", "volume-icon fa-solid fa-volume-off");
  }
  volumeCurrent.textContent = volume.value;
});

function playSong() {
  isPlaying = true;
  playBtn.classList.replace("fa-play", "fa-pause");
  playBtn.setAttribute("id", "pause");
  music.play();
}

function pauseSong() {
  isPlaying = false;
  playBtn.classList.replace("fa-pause", "fa-play");
  playBtn.setAttribute("id", "play");
  music.pause();
}

playBtn.addEventListener("click", () => {
  isPlaying ? pauseSong() : playSong();
});

function updateProgress() {
  if (isPlaying) {
    progress.value = music.currentTime;
    fromStart.textContent = timeCalc(music.currentTime);
  }
  //auto load next song when completed
  if (Math.trunc(progress.value) == Math.trunc(music.duration)) {
    //NEED HELP!!!
    //temporary fix for the current time update delay
    timeOut2 = setTimeout(fixTime, 500);
    timeOut = setTimeout(loadNextSong, 2000);
    clearInterval(timer);
  }
}
timer = setInterval(updateProgress, 10);

//This is to fix the problem: Played time display does not equal song duration when ended.
//It freezes at a second before the song's duration
function fixTime() {
  fromStart.textContent = finish.textContent;
}

function loadNextSong() {
  timer = setInterval(updateProgress, 10);
  loadSong((songId + 1) % songlist.length);
  clearTimeout(timeOut);
}

//using oninput instead of onchange
//help src: https://stackoverflow.com/questions/18544890/onchange-event-on-input-type-range-is-not-triggering-in-firefox-while-dragging
progress.oninput = function () {
  music.play();
  isPlaying = true;
  music.currentTime = progress.value;
  playBtn.classList.replace("fa-play", "fa-pause");
  playBtn.setAttribute("id", "pause");
};

rewindBtn.addEventListener("click", () => {
  // if (!isPlaying) { //this if user wants website to play song when rewind or forward
  //   playSong();
  // }
  music.currentTime -= Math.min(5, music.currentTime);

  progress.value = music.currentTime;
  fromStart.textContent = timeCalc(music.currentTime);
});

forwardBtn.addEventListener("click", () => {
  // if (!isPlaying) { //this if user wants website to play song when rewind or forward
  //   playSong();
  // }
  let tmp = music.duration - progress.value;
  music.currentTime += Math.min(5, tmp);

  progress.value = music.currentTime;
  fromStart.textContent = timeCalc(music.currentTime);
});

prevBtn.addEventListener("click", () => {
  loadSong((songId - 1 + songlist.length) % 4);
});

nextBtn.addEventListener("click", () => {
  loadSong((songId + 1) % 4);
});

function hideList() {
  listIsShowing = false;
  songlistBox.style.opacity = 0;
}

function showList() {
  listIsShowing = true;
  songlistBox.style.opacity = 1;
}

songlistBtn.addEventListener("click", () => {
  listIsShowing ? hideList() : showList();
});

function loadSong(pos) {
  songId = pos;

  const song = songs[pos];
  title.textContent = song.displayName;

  console.log(title);
  artist.innerHTML = song.artist;
  console.log(artist);
  music.src = `music/${song.name}.mp3`;
  cover.src = `./img/${song.name}.jpg`;
  for (let i = 0; i < songlist.length; i++) {
    if (song.displayName == songlist[i].innerText) {
      songlistBlock[i].style.color = `yellow`;
    } else {
      songlistBlock[i].style.color = `white`;
    }
  }
  playSong();
}

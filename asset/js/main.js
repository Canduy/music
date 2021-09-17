

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = 'F8'
const cd = $('.cd');
const cdWidth = cd.offsetWidth ;
const heading = $('header h2');
const cdThumd = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress')
const nextBtn = $('.btn-next')
const PrevBtn = $('.btn-prev')
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist =  $('.playlist');
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom : false,
    isRepeat: false,
    config : JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
   
    songs : [
        {
            name: 'Sắp 30',
            singer: 'Trịnh Đình Quang',
            path: './asset/music/SẮP 30  TRỊNH ĐÌNH QUANG MV 4K OFFICIAL.mp3',
            image: './asset/img/thumnail_30.jpg'
        },
        {
            name: 'Mood',
            singer: '24kGoldnfeatIannDior',
            path: './asset/music/Mood-24kGoldnfeatIannDior-6687456.mp3',
            image: './asset/img/thumnail_mood.jpg'
        },
        {
            name: 'Độ tộc 2',
            singer: 'MasewDoMixiPhucDuPhao',
            path: './asset/music/DoToc2-MasewDoMixiPhucDuPhao-7064730.mp3',
            image: './asset/img/thumnail_mixi.jpg'
        },
        {
            name: 'lalala',
            singer: ' Naughty Boy ft Sam Smith Cover by VONCKEN',
            path: './asset/music/Lalala  Naughty Boy ft Sam Smith Cover by VONCKEN.mp3',
            image: './asset/img/thumnail_lalala.jpg'
        },
        {
            name: 'Lời xin lỗi vụng về',
            singer: 'Quân AP',
            path: './asset/music/LỜI XIN LỖI VỤNG VỀ  QUÂN AP  OFFICIAL MV.mp3',
            image: './asset/img/thumnail_ap.jpg'
        },
        {
            name: 'Ngước mắt nhìn đời',
            singer: 'Phú lê',
            path: './asset/music/NGƯỚC MẮT NHÌN ĐỜI  PHÚ LÊ  OFFICIAL MV 4K.mp3',
            image:'./asset/img/thumnail_pl.jpg'
        },
        {
            name: 'Họ yêu ai mất rồi',
            singer: 'Doãn Hiếu',
            path : './asset/music/Họ Yêu Ai Mất Rồi l Doãn Hiếu l Official Lyrics Video.mp3',
            image: './asset/img/thumnail_DHieu.jpg'
        },
        {
            name: 'Hôm nay em cưới rồi',
            singer: 'Khải Đăng & Thanh Hưng',
            path: './asset/music/Hôm Nay Em Cưới Rồi  Khải Đăng  Thanh Hưng  Live Version.mp3',
            image: './asset/img/thumnail_wedding.jpg'
        },
        {
            name: 'Astronaut In The Ocean Lyrics',
            singer: 'Masked Wolf',
            path: './asset/music/Masked Wolf  Astronaut In The Ocean Lyrics.mp3',
            image: './asset/img/thumnail_what.jpg'
        },
        {
            name: 'Powfu',
            singer: 'death bed',
            path: './asset/music/y2mate.com - Powfu  death bed coffee for your head Official Video ft beabadoobee.mp3',
            image: './asset/img/thumnail_bed.jpg'
        },
        {
            name: '♬Cô đơn dành cho ai',
            singer: 'Lee Ken x Nal',
            path: './asset/music/♬Lofi Lyrics_ Cô đơn dành cho ai - Lee Ken x Nal.mp3',
            image: ''
        },
        {
            name: 'Chơi',
            singer: 'HIEUTHUHAI',
            path: './asset/music/HIEUTHUHAI  CHƠI rmx FtMANBO LvK x BILLY100.mp3',
            image: './asset/img/thumnail_CHOI.jpg'
        }
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function(){
        // console.log('as')
        const htmls = this.songs.map((song, index) =>{
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = ${index}>
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function(){
        Object.defineProperty(this,'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvent: function(){
        const _this = this;
        // Xử lí Cd quay và dừng
        const cdThumdAnimate = cdThumd.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 10000, //10s
            iterations: Infinity,
        })
        cdThumdAnimate.pause()
        // xử lí khi play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause();
            }else{
                audio.play();
            }
            
        }
        // khi song được play
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumdAnimate.play();
        }
        // khi song bị pause 
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumdAnimate.pause();
        }

        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent =Math.floor(audio.currentTime / audio.duration *100)
                progress.value = progressPercent;
            }
        }

        // xu li khi tua
        progress.oninput = function(e) {
            const seekTime = audio.duration /100 *e.target.value;
            audio.currentTime = seekTime;
            audio.play();
        }

        // xử lí phóng to thu nhỏ cd
        document.onscroll = function() {
            const scrollTop = window.scrollY || (document.documentElement.scrollTop);
            const newCdWidth = cdWidth - scrollTop;
            // console.log(newCdWidth)
            cd.style.width = newCdWidth > 0 ?  newCdWidth + 'px' : 0 ;
            cd.style.opacity = newCdWidth / cdWidth ;
        }
        // khi next bai hat
        nextBtn.onclick = function() {
            if(_this.isRandom){
                _this.playRandomSong();
            }else{
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        // khi prev bai hat
        PrevBtn.onclick = function() {
            if(_this.isRandom){
                _this.playRandomSong();
            }else{
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        //  random
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }
        // xử lí next khi audio ended
        audio.onended = function() {
            if(_this.isRepeat){
                audio.play();
            }else{
                nextBtn.click();
            }
        }
        // repeat 
        repeatBtn.onclick =function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }
        // click playlist
        playlist.onclick = function (e) {
            let songNode = e.target.closest('.song:not(.active)');
            if (!e.target.closest('.option')) {
              if (songNode) {
                _this.currentIndex = Number(songNode.dataset.index);
                _this.loadCurrentSong();
                audio.play();
                _this.render();
              }
            }
          }
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
          $('.song.active').scrollIntoView({
            behavior: 'smooth',
            block: 'end',
          });
        }, 300);
      },
      loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
      },
    loadCurrentSong: function(){
        

        heading.textContent = this.currentSong.name;
        cdThumd.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
        // console.log(audio)
    },
    nextSong: function(){
        this.currentIndex ++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function(){
        this.currentIndex --;
        if(this.currentIndex < 0 ){
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function() {
        let newIndex ;
        do {
            newIndex = Math.floor(Math.random() * app.songs.length)
        }while(newIndex == this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function(){
        this.loadConfig();
        // Định nghĩa các thuộc tính cho object
        this.defineProperties();
        // lắng nghe và xử lí các sự kiện
        this.handleEvent();
        // tải thông tin bài hát đầu tiên vào UI khi chạy 
        this.loadCurrentSong();
        // ender playlist
        this.render();
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    }
}

app.start();

/*VARS*/
let links = document.querySelectorAll("a")
let middlebar = document.getElementById("middlebar")
let currentpage = location.hash.split('#')[1] + ".html";
let slideIndex = 0;


/* HOME PAGE*/
/*EVENTS*/

showSlides();


links.forEach((link) => {
    link.addEventListener("click", function (e) {
        e.preventDefault()
        e.stopPropagation()
        location.hash = link.id
        let file = location.hash.split('#')[1] + ".html"
        window.scrollTo({ top: 0 })
        fetch(file).
            then(r => r.text()).
            then(r => middlebar.innerHTML = r)
    })
})

let reload = ajax(currentpage);

reload.addEventListener("load", () => {
    switch (reload.status) {
        case 200:
            middlebar.innerHTML = reload.response
            return;
        case 404:
            location.replace(location.href + "#home")
            break
    }

})


window.addEventListener("hashchange", () => {
    let file = location.hash.split('#')[1] + ".html"
    let xhr = ajax(file)
    xhr.addEventListener("load", () => {
        if (xhr.status == 200) {
            middlebar.innerHTML = xhr.response
        }
    })

})

/*FUNCTIONS*/

function plusSlides(n) {
    showSlides2(slideIndex += n);
  }

function showSlides2(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex-1].style.display = "block";
  }

function showSlides() {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}
    slides[slideIndex-1].style.display = "block";
    setTimeout(showSlides, 3000); 
  }
  
function ajax(url, method) {

    let http_method = method || "GET"
    let xhr = new XMLHttpRequest
    xhr.open(http_method, url)
    xhr.send()
    myFunc();
    myFunc2();
    return xhr

}

/*FORM*/

function myFunc() {
    if (document.getElementById('formulario')) {

        $("#actualForm").submit(function (e) {
            e.preventDefault()
            var name = $('#form-name').val();
            var lastname = $('#form-lastname').val();
            var email = $('#form-email').val();
            var movie = $('#form-movie').val();
            var textarea = $('#form-textarea').val();
            var submit = $('#form-submit').val();

            $('.form-message').load('form.php', {
                name: name,
                lastname: lastname,
                email: email,
                movie: movie,
                textarea: textarea,
                submit: submit
            })

        })


    } else {
        setTimeout(myFunc, 15);
    }
}

/*VIDEOPLAYER*/
function myFunc2() {
    if (document.getElementById('multimediacontainer')) {

        $('.video-player').each(function (_, videoPlayer) {
            /**
             * get all the controls
             **/
            let eleVideoObj = $(videoPlayer).find('video');
            let elePlayPauseBtn = $(videoPlayer).find('.play');
            let elePlayPauseBtn2 = $(videoPlayer).find('.pause');
            let eleStartTime = $(videoPlayer).find('.start-time');
            let eleEndTime = $(videoPlayer).find('.end-time');
            let eleToggleVolume = $(videoPlayer).find('.on');
            let eleToggleVolume2 = $(videoPlayer).find('.off');


            let seek = document.getElementById('seek')
            let seek2 = document.getElementById('seek2');
            let v1 = document.getElementById("v1")
            let v2 = document.getElementById("v2")
            let p1 = document.getElementById("p1")
            let p2 = document.getElementById("p2")

            let totalDurationInSeconds = 0;
            let currentTimeInSeconds = 0;
            let currentDuration = null;
            let totalDuration = null;
            let seekPercentage = 0;
            let volumePercentage = 100;

            /*-------------- HIDE / SHOW CONTROLS -----------*/
            $(videoPlayer).hover(

                () => $(videoPlayer).removeClass('hide-controls'),
                () => {
                    if (!eleVideoObj['0'].paused) $(videoPlayer).addClass('hide-controls');
                }
            );
            /*--------------- HIDE / SHOW CONTROLS --------*/

            /*-------------- UPDATE FUNCTIONS ---------------*/
            const updateSeekbar = () => {
                seekPercentage = helper_getPercentage(
                    currentTimeInSeconds,
                    totalDurationInSeconds
                );
                seek.value = seekPercentage
            };

            const updateVolumebar = () => {
                seek2.value = volumePercentage;
            };

            const updateTotalDuration = () => {
                $(eleEndTime).html(
                    `${totalDuration.hours}:${totalDuration.minutes}:${totalDuration.seconds}`
                );
            };

            const updateCurrentTime = () => {
                $(eleStartTime).html(
                    `${currentDuration.hours}:${currentDuration.minutes}:${currentDuration.seconds}`
                );
            };
            /*----------- UPDATE FUNCTIONS -----------------*/

            //1. update the total duration
            eleVideoObj.on('loadeddata', () => {
                totalDurationInSeconds = eleVideoObj['0'].duration;
                totalDuration = helper_calculateDuration(totalDurationInSeconds);
                updateTotalDuration();
                updateSeekbar();
                updateVolumebar();
            });

            // 2. update current time
            eleVideoObj.on('timeupdate', () => {
                currentTimeInSeconds = eleVideoObj['0'].currentTime;
                currentDuration = helper_calculateDuration(currentTimeInSeconds);
                updateCurrentTime();
                updateSeekbar();
            });
            //3. update volume
            eleVideoObj.on('volumechange', () => {
                volumePercentage = eleVideoObj['0'].volume * 100;
                updateVolumebar();
            });

            eleVideoObj.on('ended', () => {
                eleVideoObj['0'].currentTime = 0;
                $(elePlayPauseBtn)
                    .removeClass('pause')
                    .addClass('play');
                $(videoPlayer).removeClass('hide-controls');
            });
            /*----------------------user events ------------------------------*/

            //4. play 
            $(elePlayPauseBtn).on('click', () => {
                eleVideoObj['0'].play()
                p1.style.display = "none"
                p2.style.display = "flex"
                eleVideoObj['0'].volume = 0.5;
                seek.value= 1;
            });
            $(elePlayPauseBtn2).on('click', () => {
                eleVideoObj['0'].pause()
                p2.style.display = "none"
                p1.style.display = "flex"
            });

            //5. toggle volume
            $(eleToggleVolume).on('click', () => {
                eleVideoObj['0'].volume = 0;
                v1.style.display = "none"
                v2.style.display = "flex"
                seek2.value = 0
                
            });

            $(eleToggleVolume2).on('click', () => {
                eleVideoObj['0'].volume = 0.5;
                v2.style.display = "none"
                v1.style.display = "flex"
                seek2.value = 1
                
            });

            //6. volume bar click
            seek2.addEventListener('change', e => {
                eleVideoObj['0'].volume = e.target.value / 100;
                seek2.addEventListener('click', () => {
                    $(eleToggleVolume)
                        .addClass('on')
                        .removeClass('off');
                })


            });
            //7. seekbar click
            seek.addEventListener('change', () => {
                var seekTo = eleVideoObj['0'].duration * (seek.value / 100);
                eleVideoObj['0'].currentTime = seekTo;
            })
            
        });


        const helper_getPercentage = (presentTime, totalTime) => {
            var calcPercentage = (presentTime / totalTime) * 100;
            return parseFloat(calcPercentage.toString());
        };

        const helper_calculateDuration = duration => {
            var seconds = parseInt(duration % 60);
            var minutes = parseInt((duration % 3600) / 60);
            var hours = parseInt(duration / 3600);

            return {
                hours: helper_pad(hours),
                minutes: helper_pad(minutes.toFixed()),
                seconds: helper_pad(seconds.toFixed())
            };
        };

        const helper_pad = number => {
            if (number > -10 && number < 10) {
                return '0' + number;
            } else {
                return number;
            }
        };


    }
    else {
        setTimeout(myFunc2, 15);
    }
}


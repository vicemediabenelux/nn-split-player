var mouseOver = false;
var seconds = 0;
var playing = false;
var timerInterval = null;

var pointers = [
    [0, 10],
    [3, 60],
    [4, 60],
    [5, 70],
    [6, 70],
    [9, 20],
    [10, 20],
];

// hande mouse over
document.getElementsByClassName('wrapper')[0].addEventListener('mousemove', function(e) {
    mouseOver = true;

    elementWidth = this.offsetWidth;
    pxHover = event.pageX- this.offsetLeft;
    percentageHover = (pxHover / elementWidth) * 100;

    // fix ugly last bit
    if(percentageHover>=99.5){
        percentageHover = 100;
    }

    setClipPath(percentageHover);
});

// handle click
document.getElementsByClassName('wrapper')[0].addEventListener('click', function(e) {
    playButtons = document.getElementsByClassName('vjs-big-play-button');
    for (var i = 0; i < playButtons.length; i++) {
        playButtons[i].click();
    }

    if(!playing){
        playing = true;
        seconds = 0;
        timerInterval = setInterval(increaseSeconds, 1000);
    }

    // should be used in production
    // if(playing){
    //     playing = false;
    //     clearInterval(timerInterval);
    // }else{
    //     playing = true;
    //     timerInterval = setInterval(increaseSeconds, 1000);
    // }
});

// reset on leave
document.getElementsByClassName('wrapper')[0].addEventListener("mouseleave", setClipPath);
document.getElementsByClassName('wrapper')[0].addEventListener("mouseout", setClipPath);

function setClipPath(percentageHover){
    if(percentageHover.target){
        mouseOver = false;
        percentageHover = 50;
    }

    rightElement = document.getElementsByClassName('right')[0];
    rightElement.style.clipPath = 'polygon(0 0, ' + percentageHover + '% 0, ' + percentageHover + '% 100%, 0% 100%)';
}

function increaseSeconds() {
    handleAnimatedPoints();

    seconds = seconds + 1;
}

function handleAnimatedPoints(){
    pointers.forEach(function(pointer, key){
        if(pointer[0]==seconds && !mouseOver && pointers[key + 1]!=undefined){
            timeToAnimate = pointers[key + 1][0] - pointer[0];
            rightElement = document.getElementsByClassName('right')[0];
            rightElement.style.transitionDuration = timeToAnimate + 's';
            setClipPath(pointer[1]);
        }
    });
}
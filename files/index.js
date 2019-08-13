var pointers = [
    [0, 10],
    [3, 60],
    [4, 60],
    [5, 70],
    [6, 70],
    [9, 20],
    [10, 20],
];

var leftplayer = undefined;
var rightplayer = undefined;
var playing = false;
var mouseOver = false;
var lastPoint = 0;
var seconds = 0;

document.addEventListener("DOMContentLoaded", function(event) {
    videojs.getPlayer('leftvideo').ready(function() {
        leftplayer = this;
    });

    videojs.getPlayer('rightvideo').ready(function() {
        rightplayer = this;
    });
});

// handle click
document.getElementsByClassName('wrapper')[0].addEventListener('click', function(e) {
    if (leftplayer != undefined && rightplayer != undefined && playing == false) {
        leftplayer.play();
        rightplayer.play();
        playing = true;

        leftplayer.on('timeupdate', function() {
            handleAnimatedPoints(this.currentTime());
        })
    } else {
        leftplayer.pause();
        rightplayer.pause();
        playing = false;
    }
});

// hande mouse over
document.getElementsByClassName('wrapper')[0].addEventListener('mousemove', function(e) {
    mouseOver = true;

    // disable animation
    rightElement = document.getElementsByClassName('right')[0];
    rightElement.style.transitionDuration = '0s';

    // calculate clip position
    elementWidth = this.offsetWidth;
    pxHover = event.pageX - this.offsetLeft;
    percentageHover = (pxHover / elementWidth) * 100;

    // fix ugly last bit
    if (percentageHover >= 99.5) {
        percentageHover = 100;
    }

    setClipPath(percentageHover);
});

// reset on leave
document.getElementsByClassName('wrapper')[0].addEventListener("mouseleave", setClipPath);
document.getElementsByClassName('wrapper')[0].addEventListener("mouseout", setClipPath);

function setClipPath(percentageHover) {
    if (percentageHover.target) {
        mouseOver = false;

        // todo fix
        handleAnimatedPoints(lastPoint);
    }

    rightElement = document.getElementsByClassName('right')[0];
    rightElement.style.clipPath = 'polygon(0 0, ' + percentageHover + '% 0, ' + percentageHover + '% 100%, 0% 100%)';
}


function handleAnimatedPoints(seconds) {
    seconds = Math.floor(seconds);
    pointers.forEach(function(pointer, key) {
        if (pointer[0] == seconds && !mouseOver && pointers[key + 1] != undefined) {
            timeToAnimate = pointers[key + 1][0] - pointer[0];
            rightElement = document.getElementsByClassName('right')[0];
            rightElement.style.transitionDuration = timeToAnimate + 's';
            setClipPath(pointer[1]);
            lastPoint = seconds;
        }
    });
}
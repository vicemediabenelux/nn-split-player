(function () {
    var pointers = [
        [0, 50],
        [0.1, 50],
        [0.9, 50],
        [1.5, 72],
        [1.7, 72],
        [2.6,36],
        [3.4,50],
        [15,50],
        [15.1,100],
        [18,100],
        [19.4,50],
        [38.6,50],
        [39.4,58],
        [42,58],
        [42.5,50],
        [51,50],
        [51.3,36],
        [55,36],
        [56,50],
        [58.4,50],
        [60,67],
        [61.4,67],
        [63,50],
        [69,50],
        [70.5,56],
        [75.8,56],
        [77,41],
        [83.9,41],
        [85,100],
        [91.9,100],
        [95,0],
        [100,0],
        [101.8,50],
        [119.6,50],
        [120,100],
        [123.8,100],
        [125,50],
        [146,50],
        [146.8,100],
        [166,100]
    ];

    var leftplayer = undefined;
    var rightplayer = undefined;
    var playing = false;
    var mouseOver = false;
    var lastPointMin = 0;
    var lastPointMax = 0;
    var outOfSyncCorrection = false;
    var dragging = false;
    var videoPlayerSize = 0;
    var tutorialAnimation = undefined;
    var played = false;
    var tutorial = false;

    document.addEventListener("DOMContentLoaded", function (event) {
        // asign videos when loaded
        videojs.getPlayer('leftvideo').ready(function () {
            leftplayer = this;
        });

        videojs.getPlayer('rightvideo').ready(function () {
            rightplayer = this;
        });

        // set player width's / overflows
        videoPlayerSize = document.getElementById('vice-split-player-nn').clientWidth;
        document.getElementsByClassName('leftOverflow')[0].style.width = videoPlayerSize + 'px';
        document.getElementsByClassName('rightOverflow')[0].style.width = videoPlayerSize + 'px';
        document.getElementsByClassName('leftFrame')[0].style.width = videoPlayerSize + 'px';
        document.getElementsByClassName('rightFrame')[0].style.width = (videoPlayerSize / 2) + 'px';
        document.querySelector('#vice-split-player-nn #tutorial').style.left = (videoPlayerSize / 2) + 'px';
    });

    // handle click
    function handleClick(e) {
        if (dragging || tutorial) {
            return;
        }

        if (leftplayer !== undefined && rightplayer !== undefined && playing === false) {
            leftplayer.play();
            rightplayer.play();
            playing = true;

            leftplayer.on('timeupdate', function () {
                // if player is Xs out of sync. Correct it
                var outOfSync = leftplayer.currentTime() - rightplayer.currentTime();
                if (outOfSync >= 0.12 || outOfSync <= -0.12) {
                    if (!outOfSyncCorrection) {
                        outOfSyncCorrection = true;

                        // since 2 video players are heavy on mobile. Instead of seeking, we use pause and play
                        if (outOfSync >= 0) {
                            leftplayer.pause();
                            setTimeout(function () {
                                leftplayer.play();
                                outOfSyncCorrection = false;
                            }, (outOfSync * 1000));
                        } else {
                            rightplayer.pause();
                            setTimeout(function () {
                                rightplayer.play();
                                outOfSyncCorrection = false;
                            }, (Math.abs(outOfSync) * 1000));
                        }
                    }
                }

                // handle tutorial
                if(!played){
                    tutorial = true;
                    mouseOver = false;

                    setTimeout(function(){
                        document.querySelector('#vice-split-player-nn #tutorial').style.display = 'none';
                        document.getElementsByClassName('rightFrame')[0].classList.remove("borderRight");
                        tutorial = false;
                        played = true;
                    }, 4500);
                }
            });

            // handle seeking of player 1
            leftplayer.on('seeking', function () {
                rightplayer.pause();
            });

            // adjust player 2 to seeking of player 1
            leftplayer.on('seeked', function () {
                rightplayer.currentTime(this.currentTime());
                rightplayer.play();
            });

        } else {
            leftplayer.pause();
            rightplayer.pause();
            playing = false;

            // always adjust player after pause
            rightplayer.currentTime(leftplayer.currentTime());
        }
    }

    function handleDrag(e) {
        if(tutorial){
            return;
        }

        mouseOver = true;

        // disable animation
        var rightElement = document.getElementById('vice-split-player-nn').getElementsByClassName('rightFrame')[0];
        rightElement.style.transitionDuration = '0s';

        var tutorialElement = document.querySelector('#vice-split-player-nn #tutorial');
        tutorialElement.style.transitionDuration = '0s';

        // calculate clip position
        var elementWidth = this.offsetWidth;
        if (e.type === "mousemove") {
            var pxHover = event.pageX - this.offsetLeft;
        } else {
            var pxHover = e.touches[0].pageX - this.offsetLeft;
        }
        var percentageHover = (pxHover / elementWidth) * 100;

        // fix ugly last bit
        if (percentageHover >= 99.5) {
            percentageHover = 100;
        }

        setClipPath(percentageHover);
    }

    // handle clicks
    document.getElementById('vice-split-player-nn').addEventListener('click', handleClick);
    document.getElementById('vice-split-player-nn').addEventListener('touchend', handleClick);

    // corrections to the touchend
    document.getElementById('vice-split-player-nn').addEventListener('touchmove', function (e) {
        dragging = true;
    });
    document.getElementById('vice-split-player-nn').addEventListener('touchstart', function (e) {
        dragging = false;
    });

    // hande mouse over
    document.getElementById('vice-split-player-nn').addEventListener('mousemove', handleDrag);
    document.getElementById('vice-split-player-nn').addEventListener('touchmove', handleDrag);

    // reset on leave
    document.getElementById('vice-split-player-nn').addEventListener("mouseleave", setClipPath);
    document.getElementById('vice-split-player-nn').addEventListener("touchend", setClipPath);

    function setClipPath(percentageHover) {
        if (percentageHover.target) {
            // if mouse leave etc
            mouseOver = false;
            handleAnimatedPoints(lastPointMin);
        }

        var rightElement = document.getElementById('vice-split-player-nn').getElementsByClassName('rightFrame')[0];
        rightElement.style.width = videoPlayerSize * (percentageHover / 100) + 'px';

        var tutorialElement = document.querySelector('#vice-split-player-nn #tutorial');
        tutorialElement.style.left = videoPlayerSize * (percentageHover / 100) + 'px';
    }


    function handleAnimatedPoints(seconds) {
        var pointersLength = pointers.length;
        for (i = 0; i < pointersLength; i++) {
            y = i + 1;
            x = i - 1;

            if (pointers[y] !== undefined && mouseOver === false && pointers[x] !== undefined) {
                if (seconds >= pointers[i][0] && seconds <= pointers[y][0]) {
                    var timeToAnimate = pointers[i][0] - pointers[x][0];
                    var rightElement = document.getElementById('vice-split-player-nn').getElementsByClassName('rightFrame')[0];
                    rightElement.style.transitionDuration = timeToAnimate + 's';
                    rightElement.style.transitionTimingFunction = 'cubic-bezier(0.47, 0, 0.3, 1)';

                    var tutorialElement = document.querySelector('#vice-split-player-nn #tutorial');
                    tutorialElement.style.transitionDuration = timeToAnimate + 's';
										tutorialElement.style.transitionTimingFunction = 'cubic-bezier(0.47, 0, 0.3, 1)';
                    setClipPath(pointers[i][1]);

                    console.log(pointers[i], timeToAnimate);

                    lastPointMin = pointers[i][0];
                    lastPointMax = pointers[y][0];
                }
            }
        }
    }


    setInterval(function(){
        // handle animation more accurate then brightcove
        if (leftplayer !== undefined && rightplayer !== undefined && playing === true) {
            handleAnimatedPoints(leftplayer.currentTime());
        }
    }, 50);
})();
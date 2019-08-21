(function () {
    var pointers = [
        [0, 50],
        [0.5, 90],
        [1, 10],
        [2, 30],
        [2.5, 60],
        [3, 50],
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
    var lastPointMin = 0;
    var lastPointMax = 0;
    var outOfSyncCorrection = false;
    var dragging = false;
    var videoPlayerSize = 0;
    var tutorialAnimation = undefined;

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

        // set tutorial animation
        tutorialAnimation = document.getElementById('vice-split-player-nn').getElementsByClassName('rightFrame')[0];
        tutorialAnimation.classList += ' borderAnimationStart';
        tutorialAnimation.addEventListener("transitionend", loopTutorialTransition, false);
        tutorialAnimation.addEventListener("webkitTransitionEnd", loopTutorialTransition, false);
        tutorialAnimation.addEventListener("mozTransitionEnd", loopTutorialTransition, false);
        tutorialAnimation.addEventListener("msTransitionEnd", loopTutorialTransition, false);
        tutorialAnimation.addEventListener("oTransitionEnd", loopTutorialTransition, false);

    });

    // tutorial animation
    function loopTutorialTransition(e) {
        if (e.propertyName == "border-right-width") {
            if (tutorialAnimation.classList.contains("borderAnimationStart")) {
                tutorialAnimation.classList.remove("borderAnimationStart");
                tutorialAnimation.classList += ' borderAnimationStop';
            } else {
                tutorialAnimation.classList.remove("borderAnimationStop");
                tutorialAnimation.classList += ' borderAnimationStart';
            }
        }
    }

    // handle click
    function handleClick(e) {
        if (dragging) {
            return;
        }

        if (leftplayer !== undefined && rightplayer !== undefined && playing === false) {
            leftplayer.play();
            rightplayer.play();
            playing = true;

            leftplayer.on('timeupdate', function () {
                // handle animation each second
                handleAnimatedPoints(this.currentTime());

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
        mouseOver = true;

        // disable animation
        var rightElement = document.getElementById('vice-split-player-nn').getElementsByClassName('rightFrame')[0];
        rightElement.style.transitionDuration = '0s';

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
    }


    function handleAnimatedPoints(seconds) {
        var pointersLength = pointers.length;
        for (i = 0; i < pointersLength; i++) {
            y = i + 1;

            if (pointers[y] !== undefined) {
                if (seconds >= pointers[i][0] && seconds <= pointers[y][0]) {
                    var timeToAnimate = pointers[y][0] - pointers[i][0];
                    var rightElement = document.getElementById('vice-split-player-nn').getElementsByClassName('rightFrame')[0];
                    rightElement.style.transitionDuration = timeToAnimate + 's';
                    setClipPath(pointers[i][1]);

                    lastPointMin = pointers[i][0];
                    lastPointMax = pointers[y][0];
                }
            }
        }
    }
})();
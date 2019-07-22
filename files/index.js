// hande mouse over
document.getElementsByClassName('wrapper')[0].addEventListener('mousemove', function(e) {
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
});

// reset on leave
document.getElementsByClassName('wrapper')[0].addEventListener("mouseleave", setClipPath);
document.getElementsByClassName('wrapper')[0].addEventListener("mouseout", setClipPath);

function setClipPath(percentageHover){
    if(percentageHover.target){
        percentageHover = 50;
    }

    rightElement = document.getElementsByClassName('right')[0];
    rightElement.style.clipPath = 'polygon(0 0, ' + percentageHover + '% 0, ' + percentageHover + '% 100%, 0% 100%)';
}
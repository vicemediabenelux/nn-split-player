// var pointers = [
//     [0, 10],
//     [3, 60],
//     [4, 60],
//     [5, 70],
//     [6, 70],
//     [9, 20],
//     [10, 20],
// ];

var pointers = [
    [0, 20],
    [3, 60],
    [4, 40],
    [5, 60],
    [6, 40],
    [9, 60],
    [10, 40],
];

var leftplayer = undefined;
var rightplayer = undefined;
var playing = false;
var mouseOver = false;
var lastPoint = 0;
var seconds = 0;
var device = detectDevice();
var outOfSyncCorrection = false;
var dragging = false;

document.addEventListener("DOMContentLoaded", function(event) {
    videojs.getPlayer('leftvideo').ready(function() {
        leftplayer = this;
    });

    videojs.getPlayer('rightvideo').ready(function() {
        rightplayer = this;
    });
});

// handle click
function handleClick(e){
    if (dragging){
        return;
    }

    if (leftplayer != undefined && rightplayer != undefined && playing == false) {
        leftplayer.play();
        rightplayer.play();
        playing = true;

        // handle animation each second
        leftplayer.on('timeupdate', function() {
            handleAnimatedPoints(this.currentTime());

            // if player is Xs out of sync. Correct it
            outOfSync = leftplayer.currentTime() - rightplayer.currentTime();
            if(outOfSync >= 0.12 || outOfSync <= -0.12){
                if(!outOfSyncCorrection){
                    outOfSyncCorrection = true;
                    // since 2 video players are heavy on mobile. Instead of seeking, we use pause and play
                    if(outOfSync>=0){
                        leftplayer.pause();
                        setTimeout(function (){
                            leftplayer.play();
                            outOfSyncCorrection = false;
                        }, (outOfSync * 1000));
                    }else{
                        rightplayer.pause();
                        setTimeout(function (){
                            rightplayer.play();
                            outOfSyncCorrection = false;
                        }, (Math.abs(outOfSync) * 1000));
                    }
                }
            }
        });

        // handle seeking of player 1
        leftplayer.on('seeking', function() {
            rightplayer.pause();
        });

        // adjust player 2 to seeking of player 1
        leftplayer.on('seeked', function() {
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

document.getElementsByClassName('wrapper')[0].addEventListener('click', handleClick);
document.getElementsByClassName('wrapper')[0].addEventListener('touchend', handleClick);

// corrections to the touchend
document.getElementsByClassName('wrapper')[0].addEventListener('touchmove', function(e){
    dragging = true;
});
document.getElementsByClassName('wrapper')[0].addEventListener('touchstart', function(e){
    dragging = false;
});

// hande mouse over
document.getElementsByClassName('wrapper')[0].addEventListener('mousemove', function(e) {
    if(device=='desktop'){
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
    }
});

// document.getElementsByClassName('wrapper')[0].addEventListener('touchmove', function(e) {
//     if(device!='desktop'){
//         mouseOver = true;

//         // disable animation
//         rightElement = document.getElementsByClassName('right')[0];
//         rightElement.style.transitionDuration = '0s';
    
//         // calculate clip position
//         elementWidth = this.offsetWidth;
//         pxHover = e.touches[0].pageX - this.offsetLeft;
//         percentageHover = (pxHover / elementWidth) * 100;
    
//         // fix ugly last bit
//         if (percentageHover >= 99.5) {
//             percentageHover = 100;
//         }
    
//         setClipPath(percentageHover);
//     }
// });

// reset on leave
document.getElementsByClassName('wrapper')[0].addEventListener("mouseleave", setClipPath);

function setClipPath(percentageHover) {
    if (percentageHover.target) {
        // if mouse leave etc
        mouseOver = false;
        handleAnimatedPoints(lastPoint);
    }

    
    rightElement = document.getElementsByClassName('right')[0];
    rightElement.style.clipPath = 'polygon(0 0, ' + percentageHover + '% 0, ' + percentageHover + '% 100%, 0% 100%)';
    rightElement.style.webkitClipPath = 'polygon(0 0, ' + percentageHover + '% 0, ' + percentageHover + '% 100%, 0% 100%)';
}


function handleAnimatedPoints(seconds) {
    seconds = Math.floor(seconds);
    pointers.forEach(function(pointer, key) {
        if (pointer[0] == seconds && !mouseOver && pointers[key + 1] != undefined){
            timeToAnimate = pointers[key + 1][0] - pointer[0];
            rightElement = document.getElementsByClassName('right')[0];
            rightElement.style.transitionDuration = timeToAnimate + 's';
            rightElement.style.webkitTransitionDuration = timeToAnimate + 's';
            setClipPath(pointer[1]);
            lastPoint = seconds;
        }
    });
}

function detectDevice(){
    var mobile = false;
    var tablet = false;
    var desktop = false;
    
    var a = window.navigator.userAgent||window.navigator.vendor||window.opera;
    
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) mobile = true;
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) tablet = true;
    if(mobile == false && tablet == false) desktop = true;
    
    if(mobile == true) { return 'mobile'; }
    if(mobile == false && tablet == true) { return 'tablet'; }
    if(mobile == false && tablet == false) { return 'desktop'; }
  }
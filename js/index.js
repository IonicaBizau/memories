const Match = require("match")

let game = null
  , $ = require("jquery")
  , jQuery = $
  , $aboutWindow = $(".window-about")
  , $closeAboutBtn = $(".close-about")
  , $game = $(".game-info")
  , $enterName = $(".enter-name")
  , $congrats = $(".congrats")
  , $nameInput = $("form input.user-name")
  , $time = $(".time")
  , $pairsCount = $(".pairs-count")
  , $body = $(document.body)
  , $skillSelect = $("select")
  ;

jQuery.fn.sparkle = function() {
    return this.each(function(){

        var sparkling;
        var mousePositionX;
        var mousePositionY;
        var defaults = {
            sparkleHtml: '<img class="sparkle" src="assets/sparkle.gif" />',
            createSpeed: 150,
            fadeSpeed: 500,
            randomness: 15
        }

        $(this).hover(function(){
            sparkling = window.setInterval(function(){

                var sparkleItem = $(defaults.sparkleHtml).css({
                    top: mousePositionY+((Math.random()-.5)*defaults.randomness)+'px',
                    left: mousePositionX+((Math.random()-.5)*defaults.randomness)+'px'
                }).appendTo('body').fadeOut(defaults.fadeSpeed, function(){ delete this; });

            },defaults.createSpeed);
        },function(){
            window.clearInterval(sparkling);
        });

        $(this).mousemove(function(e){
            mousePositionX = e.pageX;
            mousePositionY = e.pageY;
        });
    });

}

$('body').sparkle();

const closeAbout = () => {
    if (game === null) {
        newGame();
    }
    $aboutWindow.addClass("hide");
}

$closeAboutBtn.on("click", closeAbout);

const newGame = () => {

    if (game) {
        clearInterval(game.timer);
        clearInterval(game.winInterval);
        $congrats.addClass("hide");
        $game.removeClass("bg-win-purple", "bg-win");
        $time.html(0);
        $pairsCount.html(0);
    }

    let gameSize = {
        x: 6
      , y: 5
    };

    let imgs = [];
    for (let i = 1; i <= 15; ++i) {
        imgs.push({ img: `images/${i}.png` })
    }

    game = new Match(".game", {
        templateElm: ".templates > div"
      , autoremove: false
      , size: gameSize
      , step: {
            x: 115
          , y: 105
        }
    }, imgs);

    closeAbout();

    game.on("win", function () {
        setTimeout(function () {
            let time = game.passedTime
              , pairs = game.flippedPairs
              ;

            $game.addClass("bg-win");
            game.winInterval = setInterval(function () {
                $game.toggleClass("bg-win-purple");
            }, 500);

            $congrats.removeClass("hide");
            let os = [0.5, 0.9]
            setInterval(() => {
                let o = os[++i % os.length]
                $congrats.css("opacity", o)
            }, 100)
        }, 1500);
    });

    game.on("success", function (elm1, elm2) {
        let $elm1 = $(elm1)
          , $elm2 = $(elm2)
          ;

        setTimeout(function() {
            let os = [0.5, 0.9]
            let i = 1;
            let inter = setInterval(() => {
                o = os[++i % os.length]
                $elm1.css("opacity", o)
                $elm2.css("opacity", o)
            }, 100)
            setTimeout(function() {
                clearInterval(inter)
                $elm1.remove();
                $elm2.remove();
            }, 900);
        }, 10);
    });

    game.start();
}

// Restart game
$(".restart").on("click", newGame);

// Toggle colors
$(".toggle-colors").on("click", function () {
    $body.toggleClass("grayscale");
});

$(".btn-about").on("click", function (e) {
    $aboutWindow.toggleClass("hide");
});

$(".view-on-github").click(function () {
    location = "https://github.com/IonicaBizau/memories";
})

"use strict";

var gInserted = false;
var gInsertedScript = false;
var unmute = false;

function globalInsert() {
  if (!gInserted) {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = "https://cdn.plyr.io/3.7.8/plyr.css";
    document.head.appendChild(link);

    var script = document.createElement("script");
    script.src = "https://cdn.plyr.io/3.7.8/plyr.js";
    var existingScript = document.body.getElementsByTagName("script")[0];
    if (existingScript) {
      document.body.insertBefore(script, existingScript);
    } else {
      document.body.appendChild(script);
    }

    var style = document.createElement("style");
    style.innerHTML = "\n  .plyr iframe[id^=youtube] {\n    top: -100%!important;\n    min-height: 300%!important;\n  }\n  .plyr {\n    filter: blur(1.5rem);\n    transition: filter 1.3s;\n    box-shadow: 0 2px 5px rgba(0, 0, 0, .2);\n  }\n  .unmute-button {\n    border: none!important;\n    text-align: center!important;\n    position: absolute!important;\n    top: 50%!important;\n    left: 50%!important;\n    transform: translate(-50%, -50%)!important;\n    background: #ff3c3c!important;\n    padding: 25px!important;\n    border-radius: 10px!important;\n    width: 50%!important;\n    height: auto!important;\n    box-shadow: 0px 3px 10px #00000077!important;\n    cursor: pointer!important;\n    z-index: 9999999999!important;\n    color: #fff!important;\n    font-weight: bold!important;\n    font-size: 1.5rem!important;\n    transition: transform 0.3s ease, font-size 0.3s ease-out;\n    animation: pulse 1.5s infinite alternate!important;\n  }\n  @keyframes pulse {\n    0% {\n      transform: scale(1);\n    }\n    100% {\n      transform: scale(1.2);\n    }\n  }\n";
    document.head.appendChild(style);

    gInserted = true;
    gInsertedScript = script;
  }
}

function instanceStyle(id, color, radius) {
  var style = document.createElement("style");
  style.innerHTML = "\n  #".concat(id, " {\n    --plyr-color-main: ").concat(color, ";\n    border-radius: ").concat(radius, "px;\n  }\n");
  document.head.appendChild(style);
}

function init(options) {
  var id = options.id;
  var embed = options.embed;
  var loop = options.loop !== undefined ? options.loop : true;
  var color = options.color || "#00b3ff";
  var radius = options.radius || "10";
  var controls = options.controls || ["play-large", "play", "progress", "current-time", "mute", "volume", "captions", "settings", "pip", "airplay", "fullscreen"];
  var settings = options.settings || ["captions", "quality", "speed", "loop"];
  var autoplay = options.autoplay !== undefined ? options.autoplay : true;

  instanceStyle(id, color, radius);

  var container = document.getElementById(id);
  container.classList.add("plyr__video-embed");

  var iframe = document.createElement("iframe");
  iframe.src = "https://www.youtube.com/embed/".concat(embed);
  iframe.allowFullscreen = true;
  iframe.allowtransparency = true;
  iframe.setAttribute("allow", "autoplay");

  var unmuteButton = document.createElement("button");
  unmuteButton.className = "".concat(id, "-unmute unmute-button");
  unmuteButton.innerHTML = "&#128266; TOQUE AQUI</br> PARA OUVIR";

  container.appendChild(iframe);

  var player = new Plyr("#".concat(id), {
    loop: { active: loop },
    controls: controls,
    settings: settings,
    muted: autoplay ? true : false,
    keyboard: { focused: false, global: false }
  });

  player.on("ready", function () {
    var overlay = document.createElement("div");
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100vh";
    document.querySelector("#".concat(id, " > div.plyr__video-wrapper")).appendChild(overlay);
    document.querySelector("#".concat(id)).style.filter = "blur(0)";

    if (autoplay) {
      container.appendChild(unmuteButton);
      unmuteButton.addEventListener("click", function () {
        player.muted = false;
        unmuteButton.style.display = "none";
        player.currentTime = 0;
        unmute = true;
      });

      player.on("click", function () {
        if (player.muted && !unmute) {
          player.muted = false;
          unmuteButton.style.display = "none";
          player.currentTime = 0;
          player.play();
          unmute = true;
        } else if (!player.muted) {
          unmuteButton.style.display = "none";
        }
      });

      player.play();
    }
  });
}

function start(options) {
  globalInsert();

  if (gInsertedScript) {
    gInsertedScript.addEventListener("load", function () {
      init(options);
    });
  } else {
    init(options);
  }
}

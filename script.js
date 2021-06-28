var grammar =
  "#JSGF V1.0; grammar keywords; public <keyword> = find | search | google |  for | web | sprinklr | go | to";

var recognition = new webkitSpeechRecognition() || SpeechRecognition();
var speechRecognitionList =
  new webkitSpeechGrammarList() || SpeechGrammarList();

recognition.continuous = false;
recognition.lang = "en-IN";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

navigator.webkitGetUserMedia(
  { audio: true },
  function (stream) {},
  function () {
    window.open("./permission.html");
  }
);

let btn = document.querySelector(".listen");
var message = document.querySelector(".output");
let volumeContainer = document.querySelector("#container");

btn.addEventListener("click", () => {
  recognition.start();
  btn.style.display = "none";
  volumeContainer.style.display = "flex";
  message.innerHTML = "Listening....";
});

recognition.onend = function (event) {
  recognition.stop();
  btn.style.display = "block";
  volumeContainer.style.display = "none";
  message.innerHTML = "Click on mic button to start listening";
};

recognition.onresult = function (event) {
  var transcript = event.results[0][0].transcript;

  console.log(transcript);
  message.innerHTML = "Processing...";

  fetch("https://dialogsearch.herokuapp.com/", {
    method: "POST",
    mode:"cors",
    headers: {
      "Content-Type": "application/json",

    },
    body: JSON.stringify({
      transcript: transcript,
    }),
  }).then((res) => {
    res.json().then((value) => {
      switch (value.action) {
        case "search":
          message.innerHTML = "Redirecting...";
          window.open(`http://google.com/search?q=${value.search_query}`);
          message.innerHTML = "Click on mic button to start listening";
          break;

        case "website":
          message.innerHTML = "Redirecting...";
          window.open(`https://${value.website}`);
          message.innerHTML = "Click on mic button to start listening";
          break;

        default:
          message.innerHTML = value.message;
      }
    });
  });
};

navigator.mediaDevices
  .getUserMedia({ audio: true, video: false })
  .then(function (stream) {
    const audioContext = new AudioContext();
    const audioSource = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.9;
    audioSource.connect(analyser);

    const volumes = new Uint8Array(analyser.frequencyBinCount);
    const volumeCallBack = () => {
      analyser.getByteFrequencyData(volumes);
      let volumeSum = 0;
      for (const volume of volumes) {
        volumeSum += volume;
      }
      const averageVolume = volumeSum / volumes.length;
      showVolume(averageVolume);
    };

    setInterval(volumeCallBack, 10);
  })
  .catch(function (err) {
    /* handle the error */
  });

function showVolume(vol) {
  let scale_0 = Math.min(3, Math.max(1, vol / 10));
  let scale_1 = Math.max(1, scale_0 / 1.5);
  let scale_2 = Math.max(1, scale_0 / 2);

  let earth_green = document.querySelector(".earth-green.dot");
  let sun_orange = document.querySelector(".sun-orange.dot");
  let space_gray = document.querySelector(".space-gray.dot");
  let sky_blue = document.querySelector(".sky-blue.dot");
  let ocean_blue = document.querySelector(".ocean-blue.dot");

  earth_green.style.webkitTransform = `scale(1,${scale_2})`;
  sun_orange.style.webkitTransform = `scale(1,${scale_1})`;
  space_gray.style.webkitTransform = `scale(1,${scale_0})`;
  sky_blue.style.webkitTransform = `scale(1,${scale_1})`;
  ocean_blue.style.webkitTransform = `scale(1,${scale_2})`;
}

navigator.webkitGetUserMedia(
    { audio: true },
    function (stream) {
    },
    function () {
      console.log("No permission");
    }
  );

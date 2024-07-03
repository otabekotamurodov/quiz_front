document.addEventListener("DOMContentLoaded", function () {
  function watch() {
    // Get the time
    var now = new Date();
    var time =
      now.getHours() * 3600 +
      now.getMinutes() * 60 +
      now.getSeconds() * 1 +
      now.getMilliseconds() / 1000;

    // Change the time into degrees
    var hours = (time / 60 / 12) * 6;
    var minutes = (time / 60) * 6;
    var seconds = time * 6;
    var date = now.getDate();

    // Modify classes
    document
      .querySelector(".hour")
      .css("transform", "rotate(" + hours + "deg)");
    document
      .querySelector(".minute")
      .css("transform", "rotate(" + minutes + "deg)");
    document
      .querySelector(".second")
      .css("transform", "rotate(" + seconds + "deg)");
    document.querySelector(".date").html(date);
  }

  // Get new time every 50ms
  setInterval(watch, 50);
});

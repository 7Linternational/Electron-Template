(function init() {
    window.console.log("Hello from js!");
    window.console.log("Lodash:", _.VERSION);
    window.console.log("jQuery is ready:", $.fn.jquery);

    var array = [1, 2, 3];

    _.fill(array, 'a');
    console.log(array);

    $("<h1>We have JQuery!</h1>").appendTo("body");
    $("h1").css({ "clear": "both", "position": "relative" });
})();
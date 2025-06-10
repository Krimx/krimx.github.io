window.addEventListener('pageshow', function (event) {
    const textContent = document.getElementById("textContent");
    let content = "";

    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            content += "<span>" + (i + j).toString().charAt(0) + "</span>";
        }
    }
    textContent.innerHTML = content
});
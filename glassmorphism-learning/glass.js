const loremBase = "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.";

function generate() {
    const wordCountElement = document.getElementById("wordCount");
    let wordCount = 5;
    if (wordCountElement.value != "") wordCount = wordCountElement.value;

    const fontSizeElement = document.getElementById("fontSize");
    let fontSize = 12;
    if (fontSizeElement.value != "") fontSize = fontSizeElement.value;

    const fontFamilyElement = document.getElementById("fontSelector");
    const fontFamily = fontFamilyElement.value;

    const textOutputElement = document.getElementById("textOutput");

    if (fontSize == null) textOutputElement.style.fontSize = "12px";
    else textOutputElement.style.fontSize = fontSize + "px";

    textOutputElement.style.fontFamily = fontFamily;

    let loremOut = "";

    for (let i = 0; i < wordCount; i++) {
        if (i == loremBase.length) {
            wordCount -= loremBase.length;
            i -= loremBase.length;
        }
        loremOut += wordSubstring(loremBase, i, i+1) + " ";
    }

    textOutputElement.textContent = loremOut;
}

function wordSubstring(str, start, end) {
    const words = str.trim().split(/\s+/); // Split on any whitespace
    return words.slice(start, end).join(" ");
  }

function loop() {
    requestAnimationFrame(loop);
    generate();
}
loop();

function copyText() {
    const toCopy = document.getElementById("textOutput").textContent;
    navigator.clipboard.writeText(toCopy)
    .then(() => {
        makeCopyPin(true);
    })
    .catch(err => {
        makeCopyPin(false);
    });
}

function makeCopyPin(succeed) {
    let toText = "";
    if (succeed) toText = "Copied to Clipboard";
    else toText = "Failed to Copy to Clipboard";

    const copyPin = document.createElement("p");
        copyPin.textContent = toText;
        copyPin.className = "copy-pin";
        copyPin.id = "copyPin"

        const outputs = document.getElementById("outputs");

        outputs.insertBefore(copyPin, outputs.firstChild)

        setTimeout(() => {
            copyPin.remove();
        }, 2000)
}

window.generate = generate;
window.copyText = copyText;
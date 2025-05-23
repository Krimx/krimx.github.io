

  function loop() {
    requestAnimationFrame(loop);
    
    if (!(/Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
        window.location.href = "/index.html";
    }
  }
  loop();

window.addEventListener("beforeunload", () => {
    window.scrollTo(0, 0);
  });

  window.addEventListener("load", () => {
    window.scrollTo(0, 0);
    setTimeout(() => window.scrollTo(0, 0), 50);
  });

window.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".logo-cell > div");
    cells.forEach((cell, i) => {
      cell.style.animationDelay = `${i * 0.05}s`; // stagger by 0.1s
    });

    setTimeout(() => {
      const repeatCount = 4;

      // LANGUAGES
      const langElem = document.getElementById("languages");
      const langText = langElem.innerText;
    
      const langClone = langElem.cloneNode(true);
      langClone.innerText = langText;
      langClone.style.position = "absolute";
      langClone.style.visibility = "hidden";
      langClone.style.whiteSpace = "nowrap";
      document.body.appendChild(langClone);
    
      const langWidth = langClone.getBoundingClientRect().width;
      document.body.removeChild(langClone);
    
      document.documentElement.style.setProperty('--langScrollWidth', `-${langWidth}px`);
      langElem.innerText = langText.repeat(repeatCount);
    
      // SOFTWARE
      const softElem = document.getElementById("software");
      const softText = softElem.innerText;
    
      const softClone = softElem.cloneNode(true);
      softClone.innerText = softText;
      softClone.style.position = "absolute";
      softClone.style.visibility = "hidden";
      softClone.style.whiteSpace = "nowrap";
      document.body.appendChild(softClone);
    
      const softWidth = softClone.getBoundingClientRect().width;
      document.body.removeChild(softClone);
    
      document.documentElement.style.setProperty('--softScrollWidth', `-${softWidth}px`);
      softElem.innerText = softText.repeat(repeatCount);
    }, 500);
  });
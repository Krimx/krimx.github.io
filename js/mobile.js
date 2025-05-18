

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

    requestIdleCallback(() => {
        // Setup language marquee
        const langContainer = document.getElementById("languages");
        const scrollText = langContainer?.querySelector(".scroll-text");
    
        if (langContainer && scrollText) {
          const clone = scrollText.cloneNode(true);
          langContainer.appendChild(clone);
    
          requestAnimationFrame(() => {
            const scrollWidth = scrollText.offsetWidth;
            const speed = 100; // px/s
            const duration = scrollWidth / speed;
    
            langContainer.style.animation = `scroll-left ${duration}s linear infinite`;
          });
        }
    
        // Setup software marquee (rightward)
        const softwareContainer = document.getElementById("software");
        const softwareText = softwareContainer?.querySelector(".scroll-text");
    
        if (softwareContainer && softwareText) {
          const clones = softwareContainer.querySelectorAll(".scroll-text");
    
          if (clones.length === 2 && !clones[1].textContent.trim()) {
            clones[1].textContent = clones[0].textContent;
          }
    
          requestAnimationFrame(() => {
            const width = softwareText.offsetWidth;
            const speed = 100;
            const duration = width / speed;
    
            softwareContainer.style.animationDuration = `${duration}s`;
          });
        }
      });
});
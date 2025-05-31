window.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".logo-cell > div");
    cells.forEach((cell, i) => {
      cell.style.animationDelay = `${i * 0.05}s`; // stagger by 0.1s
    });
  });
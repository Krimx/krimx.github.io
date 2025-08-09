const userAgent = navigator.userAgent;
const vendor = navigator.vendor;

const navButtons = document.getElementsByClassName("nav_button");

const sidebar = document.querySelector('.sidebar');

document.addEventListener('DOMContentLoaded', () => {
    const onSafari = vendor && vendor.indexOf('Apple') > -1 &&
    userAgent && userAgent.indexOf('Safari') > -1

    if (!onSafari) {
        document.querySelectorAll('.liquid_glass').forEach(el => {
            el.classList.add('has_displacement');
        });
    }
    else {
        document.querySelectorAll('.liquid_glass').forEach(el => {
            el.classList.add('no_displacement');
        });
    }

    for (var i = 0; i < navButtons.length; i++) {
        const button = navButtons[i];

        button.addEventListener("click", (event) => {
            for (var j = 0; j < navButtons.length; j++) {
                const toRemoveFrom = navButtons[j];
                toRemoveFrom.classList.remove("selected");
            }
            button.classList.add("selected");
            moveSelectHighlight();
        })
    }
});

export function moveSelectHighlightForSidebarResize() {
    const highlight = document.getElementById("selectHighlight");
    const target = document.querySelector('.selected');

    console.log(target);
    console.log(target instanceof Element);
    console.log('Parent:', highlight.parentElement);
    
    const rect = target.getBoundingClientRect();

    const targetRect = target.getBoundingClientRect();
    const parentRect = highlight.parentElement.getBoundingClientRect();

    const offsetTop = targetRect.top - parentRect.top;
    const offsetLeft = targetRect.left - parentRect.left;

    highlight.style.top = offsetTop + 'px';
    highlight.style.left = offsetLeft + 'px';
    highlight.style.height = targetRect.height + 'px';
}

export function moveSelectHighlight() {
    const highlight = document.getElementById("selectHighlight");
    const target = document.querySelector('.selected');
    if (!highlight || !target) return;

    const parentRect = highlight.parentElement.getBoundingClientRect();
    const oldTop = highlight.offsetTop + "px";
    const oldLeft = highlight.offsetLeft + "px";
    const oldWidth = highlight.offsetWidth + "px";

    const targetRect = target.getBoundingClientRect();
    const newTop = (targetRect.top - parentRect.top) + "px";
    const newLeft = (targetRect.left - parentRect.left) + "px";
    const newWidth = targetRect.width + "px";

    // Set custom properties for keyframes to use
    highlight.style.setProperty("--old-top", oldTop);
    highlight.style.setProperty("--old-left", oldLeft);
    highlight.style.setProperty("--old-width", oldWidth);
    highlight.style.setProperty("--new-top", newTop);
    highlight.style.setProperty("--new-left", newLeft);
    highlight.style.setProperty("--new-width", newWidth);

    // Trigger the animation
    highlight.classList.remove("animate"); // reset
    void highlight.offsetWidth; // force reflow to restart animation
    highlight.classList.add("animate");
}

function updateSelectHighlightWidth() {
  const target = document.querySelector('.selected');
  const highlight = document.querySelector('.select_highlight');

  if (!target || !highlight) return; // Safety check

  const targetRect = target.getBoundingClientRect();
  // No need for parentRect since width is absolute
  highlight.style.width = targetRect.width + 'px';
}

function loop() {
    requestAnimationFrame(loop);
    updateSelectHighlightWidth();
}
loop();

sidebar.addEventListener('mouseenter', () => {
  setTimeout(() => {
    moveSelectHighlightForSidebarResize(); // Your function
  }, 300); // match your CSS transition duration
});
sidebar.addEventListener('mouseleave', () => {
  setTimeout(() => {
    moveSelectHighlightForSidebarResize(); // Your function
  }, 300); // match your CSS transition duration
});
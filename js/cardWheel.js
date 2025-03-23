export function cardWheelSetup(setHoverState) {
    const parent = document.querySelector(".card-wheel");
    const children = document.querySelectorAll(".wheel-item");

    const parentSize = parent.clientWidth;
    const parentRadius = parentSize / 2;
    const radius = parentRadius - 25;
    const angleStep = (2 * Math.PI) / children.length;

    children.forEach((child, index) => {
        const angle = angleStep * index;
        const x = parentRadius + radius * Math.cos(angle) - child.clientWidth / 2;
        const y = parentRadius + radius * Math.sin(angle) - child.clientHeight / 2;

        child.style.left = `${x}px`;
        child.style.top = `${y}px`;

        const rotation = angle * (180 / Math.PI);
        child.style.transform = `rotate(${rotation}deg)`;
    });

    parent.addEventListener("mouseenter", () => {
        setHoverState(true);
    });

    parent.addEventListener("mouseleave", () => {
        setHoverState(false);
    });
}
  
// Keep track of rotation state outside the function to avoid reset
let rotation = 0;

export function rotateCardWheel(event, lookingAt, hoveringOverCards, userOS) {
    const rotationSpeed = 0.1;
    let rotationInvert = 1;

    if (hoveringOverCards) {
        if (userOS === "macOS") rotationInvert = -1;

        rotation += event.deltaY * rotationSpeed * rotationInvert;

        // Normalize rotation
        if (rotation >= 360) rotation -= 360;
        if (rotation <= -360) rotation += 360;

        const cardWheel = document.getElementById("card-wheel");
        if (cardWheel) {
            cardWheel.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
        }
    }
}
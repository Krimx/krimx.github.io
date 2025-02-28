import gsap from "gsap";

export function loadAboutContent() {
    const aboutContent = document.getElementById("aboutContentParent");
    const aboutBackArrow = document.getElementById("aboutBackArrow");
    const aboutGradBg = document.getElementById("aboutGradBg");
    const cardWheel = document.getElementById("card-wheel");
    console.log("Passed");
    gsap.to(aboutContent, {
        marginRight: "0%",
        duration: 1,
        ease: "back.out(1.5)",
        onUpdate: () => {
        }
    });

    gsap.to(aboutBackArrow, {
        marginBottom: "0%",
        duration: 1,
        ease: "back.out(.5)",
        onUpdate: () => {
        }
    });

    gsap.to(aboutGradBg, {
        opacity: "100%",
        duration: 1,
        ease: "power2.inOut",
        onUpdate: () => {
        }
    });

    gsap.to(cardWheel, {
        left: "-30%",
        duration: 1,
        ease: "back.out(.5)",
        onUpdate: () => {
        }
    });
}

export function unloadAboutContent() {
    const aboutContent = document.getElementById("aboutContentParent");
    const aboutBackArrow = document.getElementById("aboutBackArrow")
    const aboutGradBg = document.getElementById("aboutGradBg");
    const cardWheel = document.getElementById("card-wheel");
    gsap.to(aboutContent, {
        marginRight: "-50%",
        duration: 1,
        ease: "back.in(.5)",
        onUpdate: () => {
        }
    });

    gsap.to(aboutBackArrow, {
        marginBottom: "-100%",
        duration: 1,
        ease: "back.in(.5)",
        onUpdate: () => {
        }
    });

    gsap.to(aboutGradBg, {
        opacity: "0%",
        duration: 1,
        ease: "power2.inOut",
        onUpdate: () => {
        }
    });

    gsap.to(cardWheel, {
        left: "-100%",
        duration: 1,
        ease: "back.out(.5)",
        onUpdate: () => {
        }
    });
}
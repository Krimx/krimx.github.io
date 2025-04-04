import gsap from "gsap";

export function loadAboutContent() {
    const aboutContent = document.getElementById("aboutContentParent");
    const aboutBackArrow = document.getElementById("aboutBackArrow");
    const aboutGradBg = document.getElementById("aboutGradBg");
    const cardWheel = document.getElementById("card-wheel");
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
        transform: "translateX(-50%)",
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
        transform: "translateX(-120%)",
        duration: 1,
        ease: "back.out(.5)",
        onUpdate: () => {
        }
    });
}

export function loadProjectsContent() {
    const projectsContent = document.getElementById("projectsContent");
    const projectsBackArrow = document.getElementById("projectsBackArrow");
    projectsContent.style.display = "flex";

    gsap.to(projectsBackArrow, {
        marginBottom: "0%",
        duration: 1,
        ease: "back.out(.5)",
        onUpdate: () => {
        }
    });
}

export function unloadProjectsContent() {
    const projectsContent = document.getElementById("projectsContent");
    const projectsBackArrow = document.getElementById("projectsBackArrow");

    gsap.to(projectsBackArrow, {
        marginBottom: "-100%",
        duration: 1,
        ease: "back.in(.5)",
        onUpdate: () => {
        },
        onComplete: () => {
            projectsContent.style.display = "none";
        }
    });
}
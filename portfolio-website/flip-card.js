class FlipCard extends HTMLElement {
    constructor() {
        super();

        // Create Shadow DOM
        this.attachShadow({ mode: "open" });

        // Get attributes from element
        const frontImage = this.getAttribute("front-image") || "";
        const backText = this.getAttribute("back-text") || "Back Side";
        const cardHeight = this.getAttribute("card-height") || "auto";

        // Define the template
        this.shadowRoot.innerHTML = `
            <style>
                .card {
                    width: 100%;
                    height: ${cardHeight};
                    perspective: 1000px;
                }

                .card-inner {
                    width: 100%;
                    height: 100%;
                    position: relative;
                    transform-style: preserve-3d;
                    transition: transform 0.6s ease-in-out;
                }

                .card:hover .card-inner {
                    transform: rotateY(180deg);
                }

                .card-front, .card-back {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    backface-visibility: hidden;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 20px;
                    font-weight: bold;
                }

                .card-front {
                    background-color: white;
                }

                .card-front img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .card-back {
                    background-color: #3498db;
                    color: white;
                    transform: rotateY(180deg);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            </style>

            <div class="card">
                <div class="card-inner">
                    <div class="card-front">
                        <img src="${frontImage}" alt="Front Image">
                    </div>
                    <div class="card-back">
                        <p>${backText}</p>
                    </div>
                </div>
            </div>
        `;
    }
}

// Register the custom element
customElements.define("flip-card", FlipCard);

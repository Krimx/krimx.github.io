import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css               */class a extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"});const t=this.getAttribute("front-image")||"",e=this.getAttribute("back-title")||"Title",i=this.getAttribute("back-body")||"Body text goes here.",r=this.getAttribute("card-height")||"auto";this.shadowRoot.innerHTML=`
            <style>
                .card {
                    width: 100%;
                    height: ${r};
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
                    position: absolute;
                    backface-visibility: hidden;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    box-sizing: border-box;
                    text-align: center;
                }

                .card-front {
                    width: 100%;
                    height: 100%;
                }

                .card-front img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 10px;
                }

                .card-back {
                    width: 95%;
                    height: 95%;
                    margin: 2.5%;
                    background-color: white;
                    -webkit-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
                    -moz-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
                    box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
                    transform: rotateY(180deg);
                    display: flex;
                    justify-content: start;
                    align-items: center;
                    padding: 2rem;
                    border: 2px solid black;
                    border-radius: 10px;
                }

                .card-back h2 {
                    margin: 0;
                    margin-bottom: 2rem;
                    margin-top: 1rem;
                    font-size: 24px;
                    font-weight: bold;
                }

                .card-back p {
                    margin-top: 10px;
                    font-size: 16px;
                }
            </style>

            <div class="card">
                <div class="card-inner">
                    <div class="card-front">
                        <img src="${t}" alt="Front Image">
                    </div>
                    <div class="card-back">
                        <h2>${e}</h2>
                        <p>${i}</p>
                    </div>
                </div>
            </div>
        `}}customElements.define("flip-card",a);

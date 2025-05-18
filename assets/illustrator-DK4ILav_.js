import"./modulepreload-polyfill-B5Qt9EMX.js";class c extends HTMLElement{constructor(){super()}connectedCallback(){const e=this.getAttribute("layout"),s=this.getAttribute("title"),a=this.getAttribute("description"),i=this.getAttribute("image"),n=this.getAttribute("alt"),o=this.getAttribute("download-name"),l=this.getAttribute("download-link"),t=document.createElement("div");t.className=`card ${e}`,t.innerHTML=`
        <div class="card-bg">
          <div class="content">
            <div class="text-content">
              <h1 class="title monoton-regular">${s}</h1>
              <p class="desc lexend-regular">${a}</p>
              <a href="${l}" download="${o}" class="download-button">
                <i class="fas fa-download download-icon"></i>
                <p class="lexend-regular">Download</p>
              </a>
            </div>
            <img src="${i}" alt="${n}" class="thumbnail">
          </div>
        </div>
      `,this.replaceWith(t)}}customElements.define("card-preview",c);

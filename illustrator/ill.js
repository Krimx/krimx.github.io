class CardPreview extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      const layout = this.getAttribute("layout");
      const title = this.getAttribute("title");
      const description = this.getAttribute("description");
      const image = this.getAttribute("image");
      const alt = this.getAttribute("alt");
      const downloadName = this.getAttribute("download-name");
      const downloadLink = this.getAttribute("download-link");
  
      // Instead of rendering inside <card-preview>, replace the tag entirely
      const wrapper = document.createElement("div");
      wrapper.className = `card ${layout}`;
      wrapper.innerHTML = `
        <div class="card-bg">
          <div class="content">
            <div class="text-content">
              <h1 class="title monoton-regular">${title}</h1>
              <p class="desc lexend-regular">${description}</p>
              <a href="${downloadLink}" download="${downloadName}" class="download-button">
                <i class="fas fa-download download-icon"></i>
                <p class="lexend-regular">Download</p>
              </a>
            </div>
            <img src="${image}" alt="${alt}" class="thumbnail">
          </div>
        </div>
      `;
  
      // Replace <card-preview> with the actual card DOM
      this.replaceWith(wrapper);
    }
  }
  
  customElements.define("card-preview", CardPreview);
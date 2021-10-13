class Picture {
    constructor(imageTemplateSelector, service, link) {
        this._imageTemplateSelector = imageTemplateSelector;
        this.service = service;
        this.link = link;
    }
    _getImageTemplate() {
        const imageTemplate = document.querySelector(this._imageTemplateSelector).content.querySelector('.swiper-slide').cloneNode(true);
        return imageTemplate;
    }
    _setEventListener() {
        this._element.addEventListener('click', () => {
            console.log('link is clicked');
        })
    }
    _fillTemplate() {
        this._element = this._getImageTemplate();
        this._element.querySelector('.slides__slide-img').src = this.link;
        this._element.querySelector('.slides__slide-span').textContent = this.service;
        this._setEventListener();
        return this._element;
    }
}
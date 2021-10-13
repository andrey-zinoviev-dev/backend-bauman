class Slider {
    constructor(sliderSelector, counter, pics, templateSelector, thumbnailTemplateSelector) {
        this.sliderSelector = document.querySelector(sliderSelector);
        this.counter = counter;
        this.pics = pics;
        this.templateSelector = document.querySelector(templateSelector);
        this.thumbnailTemplateSelector = document.querySelector(thumbnailTemplateSelector);
    }
    _getTemplate() {
        const sliderTemplate = this.templateSelector.content.cloneNode(true);
        return sliderTemplate;
    }
    _getThumbnailTemplate() {
        const thumbnailTemplate = this.thumbnailTemplateSelector.content.cloneNode(true);
        return thumbnailTemplate;
    }
    addItem(element) {
        this.sliderSelector.querySelector('.slider__wrapper').append(element);
    }
    addThumbnails() {
        pics.forEach((element, i) => {
            const button = this._getThumbnailTemplate()
            this.sliderSelector.querySelector('.thumbnails').append(button);
        })
    }
    clickThumbnails() {
        const thumbnails = Array.from(this.sliderSelector.querySelectorAll('.slider__thumbnail'));
        thumbnails.forEach((thumbnail, i) => {
            thumbnail.addEventListener('click', () => {
                this.counter = i;
                this.sliderSelector.querySelector('.slider__wrapper').style.transform = `translateX(${-1280 * this.counter}px)`;
            })
        })
    }
    setCounterToZero() {
        if(this.counter >= this.pics.length - 1) {
            this.counter = -1;
        }
    }
    setCounterToLastNumber() {
        if(this.counter <= 0) {
            this.counter = this.pics.length;
        }
    }
    _setEventListeners() {
        this.sliderSelector.querySelector('.slider__left').addEventListener('click', () => {
            // console.log(this.element.querySelector('.slides__slide').clientWidth);
            // if(this.counter <= 0) {
            //     this.counter = this.picsLength;
            // }
            this.setCounterToLastNumber();
            this.counter -=1;
            this.sliderSelector.querySelector('.slider__wrapper').style.transform = `translateX(${-1280 * this.counter}px)`;
        });
        this.sliderSelector.querySelector('.slider__right').addEventListener('click', () => {
            // console.log(this.element.querySelector('.slides__slide').clientWidth);
            // if(this.counter >= this.picsLength - 1) {
            //     this.counter = -1;
            // }
            this.setCounterToZero();
            this.counter +=1;
            this.sliderSelector.querySelector('.slider__wrapper').style.transform = `translateX(${-1280 * this.counter}px)`;
        });   
        
    }
    autoChangePic() {
        // if(this.counter >= this.picsLength - 1) {
        //     this.counter = -1;
        // }
        this.setCounterToZero();
        this.counter +=1;
        this.sliderSelector.querySelector('.slider__wrapper').style.transform = `translateX(${-1280 * this.counter}px)`;
        setTimeout(() => {
            this.autoChangePic();
        }, 5000)
    }
    generateSlider() {
        this.element = this._getTemplate();
        this._setEventListeners();
        return this.element;
    }
}
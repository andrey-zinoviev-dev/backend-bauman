class Section {
    constructor (items, renderer, appendSelector) {
        this.items = items;
        this.renderer = renderer;
        this.appendSelector = document.querySelector(appendSelector);
    }
    itemsRenderer() {
        this.items.forEach((item) => {
            this.renderer(item);
        })
    }
    addItem(pic) {
        this.appendSelector.append(pic);
    }
}
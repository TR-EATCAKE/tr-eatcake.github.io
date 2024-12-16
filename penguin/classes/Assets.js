class Assets{
    constructor(){
        this.toLoad = {
            penguin: "../assets/penguin.png"
        }

        this.images = {};

        Object.keys(this.toLoad).forEach(key => {
            const img = new Image();
            img.src = this.toLoad[key];

            this.images[key] = {
                image: img,
                loaded: false
            }

            img.addEventListener("load", () => {
                this.images[key].loaded = true;
            })
        })
    }
}

export const assets = new Assets();
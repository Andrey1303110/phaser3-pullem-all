class PreloadScene extends Phaser.Scene {
    constructor() {
        super("Preload");
    }

    preload() {
        this.TEXTURE_LOAD = 0;
        this.TEXTURE_ALL = 0;
        this.textures.on('onload', this.textureLoaded, this);

        Object.keys(base64).forEach(name => {
            this.TEXTURE_ALL++;
            this.textures.addBase64(name, base64[name]);
        });
    }

    textureLoaded() {
        this.TEXTURE_LOAD++;
        if(this.TEXTURE_LOAD === this.TEXTURE_ALL) {
            document.querySelector('body').style.display = 'block';
            if (document.querySelector('#logo')) {
                document.querySelector('#logo').style.display = 'none';
                document.querySelector('.loader').style.display = 'none';
                document.querySelector('#logo').remove();
                document.querySelector('.loader').remove();
            }
            setEndpoints();
            this.scene.start('Game');
        }
    }
}
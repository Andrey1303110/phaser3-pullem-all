class FinishScene extends Phaser.Scene {
    constructor() {
        super("Finish");
    }

    init(object) {
        this.finalObject = object;
    }

    create(){
        this.createBG();
        this.addObject();
        this.addDownloadButton();
        this.addListeners();
        this.addClickAreaSIP();
    }

    addListeners() {
        window.addEventListener("orientationchange", () => { this.reinitHUD() });
        window.addEventListener("resize", () => { this.reinitHUD() });
    }

    addClickAreaSIP() {
        if (window.SIPID) {
            this.add.rectangle(config.width / 2, config.height / 2, config.width, config.height, '0x000000', 0).setInteractive().on('pointerdown', gotoStoreHandler);
        }
    }

    reinitHUD() {
        setEndpoints();
        if (this.button) {
            this.button.destroy();
            this.buttonText.destroy();
            this.addDownloadButton();
        }
    };

    createBG(){
        this.sceneBG = this.add.sprite(config.width/2, config.height/2, 'rays').setOrigin(.5).setInteractive();

        this.tweens.add({
            targets: this.sceneBG,
            angle: 360,
            ease: 'Linear',
            duration: 50000,
            repeat: -1,
        });
    }

    addObject(){
        this.object = this.add.sprite(config.width/2, config.height/2, this.finalObject.texture.key)
            .setAngle(-30)
            .setScale(this.finalObject.scale / 2)
            .setOrigin(.5)
            .setInteractive();

        this.tweens.add({
            targets: this.object,
            scale: this.finalObject.scale * 1.35,
            ease: 'Linear',
            duration: 25000,
        });
    }

    addDownloadButton(){
        this.button = this.add.sprite(config.width/2, screenEndpoints.bottom, 'downloadButton')
            .setDisplaySize(262, 80)
            .setOrigin(.5)
            .setInteractive();

        this.button.setPosition(this.button.x, this.button.y - this.button.displayHeight);

        let textStyle = {
            font: `${config.height * .055}px coolvetica`,
            fill: '#ffffff',
        };

        this.buttonText = this.add.text(this.button.x, this.button.y, 'PLAY NOW', textStyle).setOrigin(0.5).setAlpha(.95);

        let initScale = this.button.scale;
        let textInitScale = this.buttonText.scale;

        let timeline = this.tweens.createTimeline();
        timeline.add({
            targets: this.button,
            scale: initScale * 1.125,
            ease: 'Power1',
            duration: 475,
        });
        timeline.add({
            targets: this.button,
            scale: initScale,
            ease: 'Power1',
            duration: 475,
        });
        timeline.loop = -1;
        timeline.play();

        timeline = this.tweens.createTimeline();
        timeline.add({
            targets: this.buttonText,
            scale: textInitScale * 1.125,
            ease: 'Power1',
            duration: 475,
        });
        timeline.add({
            targets: this.buttonText,
            scale: textInitScale,
            ease: 'Power1',
            duration: 475,
        });
        timeline.loop = -1;
        timeline.play();

        this.add.rectangle(config.width/2, config.height/2, config.width, config.height, '0x000000', 0).setInteractive().on('pointerdown', gotoStoreHandler);
    }
}
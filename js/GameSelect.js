class GameSelect extends Phaser.Scene {
    constructor() {
        super("Selecting");
    }

    init() {
        this.icons = [];
    }

    create() {
        this.createBG();
        this.createGameIcon();
        this.addGameVariatons();
        this.addIconAnim();
        this.addListeners();
        this.addClickAreaSIP();

        if (window.mintegralNetworkID) {
            window.gameEnd && window.gameEnd();
        }
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
        if (this.gameIcon) {
            this.gameIcon.destroy();
            this.createGameIcon();
        }
        if (this.icons) {
            this.icons.forEach(element => {
                element.text.destroy();
                element.destroy();
            });
            this.addGameVariatons();
        }
    };

    createBG() {
        this.sceneBG = this.add.sprite(config.width / 2, config.height / 2, 'game_select_bg').setOrigin(.5);
    }

    createGameIcon() {
        let icon_size = 60;
        this.gameIcon = this.add.sprite(screenEndpoints.left + icon_size / 2 + 8, screenEndpoints.top + icon_size / 2 + 8, 'icon')
            .setDisplaySize(icon_size, icon_size)
            .setOrigin(0.5)
            .setAlpha(0.65)
            .setInteractive();

        this.gameIcon.on('pointerdown', () => {
            if (window.mintegralNetworkID) {
                window.gameEnd && window.gameEnd();
            }
            gotoStoreHandler();
        });

        let timeline = this.tweens.createTimeline();
        let initScale = this.gameIcon.scale;

        timeline.add({
            delay: 5000,
            targets: this.gameIcon,
            scale: this.gameIcon.scale * .8,
            alpha: 1,
            ease: 'Power2',
            duration: 275,
        });
        timeline.add({
            targets: this.gameIcon,
            scale: initScale,
            alpha: 0.65,
            ease: 'Power1',
            duration: 375,
        });
        timeline.add({
            targets: this.gameIcon,
            scale: this.gameIcon.scale * .8,
            alpha: 1,
            ease: 'Power2',
            duration: 275,
        });
        timeline.add({
            targets: this.gameIcon,
            scale: initScale,
            alpha: 0.65,
            ease: 'Power1',
            duration: 375,
        });
        timeline.loop = -1;
        timeline.play();
    }

    select() {
        this.scene.scene.start('Game', this.variant);
    }

    addGameVariatons() {
        let gap = 315;
        for (let i = 0; i < config.variatons.length; i++) {
            const element = config.variatons[i];
            let cof = 1
            let position = {};
            if (document.body.clientHeight > document.body.clientWidth) {
                position.y = config.height / 2 - (gap * cof) / 2 + (gap * cof) * i;
                position.x = config.width / 2;
            } else {
                cof = 1.4;
                position.y = config.height / 2;
                position.x = config.width / 2 - (gap * cof) / 2 + (gap * cof) * i;
            }
            let icon = this.add.sprite(position.x, position.y, `variaton_${i}`)
                .setOrigin(.5)
                .setAlpha(.8)
                .setDisplaySize(205 * cof, 205 * cof)
                .setInteractive()
                .on('pointerup', this.select);
            icon.variant = element;

            let textStyle = {
                font: `${cof * config.height * .05}px coolvetica`,
                fill: '#ffffff',
            };
            icon.text = this.add.text(icon.x, icon.y + icon.displayHeight * 2 / 3, element.text, textStyle).setOrigin(0.5).setAlpha(.95);

            this.icons.push(icon);
        }
    }

    addIconAnim() {
        let timeline = this.tweens.createTimeline();
        let initScale = this.icons[0].scale;

        timeline.add({
            delay: 3000,
            targets: this.icons[0],
            scale: this.icons[0].scale * .8,
            alpha: 1,
            ease: 'Power2',
            duration: 475,
        });
        timeline.add({
            targets: this.icons[0],
            scale: initScale,
            alpha: 0.65,
            ease: 'Power1',
            duration: 525,
        });
        timeline.add({
            targets: this.icons[0],
            scale: this.icons[0].scale * .8,
            alpha: 1,
            ease: 'Power2',
            duration: 475,
        });
        timeline.add({
            targets: this.icons[0],
            scale: initScale,
            alpha: 0.65,
            ease: 'Power1',
            duration: 525,
        });

        timeline.add({
            delay: 3000,
            targets: this.icons[1],
            scale: this.icons[1].scale * .8,
            alpha: 1,
            ease: 'Power2',
            duration: 475,
        });
        timeline.add({
            targets: this.icons[1],
            scale: initScale,
            alpha: 0.65,
            ease: 'Power1',
            duration: 525,
        });
        timeline.add({
            targets: this.icons[1],
            scale: this.icons[1].scale * .8,
            alpha: 1,
            ease: 'Power2',
            duration: 475,
        });
        timeline.add({
            targets: this.icons[1],
            scale: initScale,
            alpha: 0.65,
            ease: 'Power1',
            duration: 525,
        });

        timeline.loop = -1;
        timeline.play();
    }
}
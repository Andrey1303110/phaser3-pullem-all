var test;
class GameScene extends Phaser.Scene {
    constructor() {
        super("Game");
    }

    init() {
        this.variant = config.variatons[0];
        this.money = 0;
        this.cards = {};
    }

    create() {
        this.createBG();
        this.addObjects();
        this.createCashText();
        this.createUpgradeCards();

        /* AUTO Pulling
        this.time.addEvent({
            delay: 1000/60,
            callback: ()=>{this.object.pull()},
            callbackScope: this,
            repeat: 0,
        });
        */
        this.createMoneyAnim(this.cards.strength.cost * 10);

        this.createStartText();
    }

    checkPointer(pointer){
        this.pointerTimer = this.time.addEvent({
            delay: 1000/60,
            callback: ()=>{this.object.pull(pointer)},
            callbackScope: this,
            repeat: -1,
        });
    }

    createStartText(){
        if (this.startText) {
            this.startText.destroy();
        }
        let textStyle = {
            font: `${config.height * .075}px coolvetica`,
            fill: '#ffffff',
        };
        this.startText = this.add.text(config.width/2, config.height * .65, 'Hold to pull', textStyle).setOrigin(0.5).setAlpha(.95);

        let initScale = this.startText.scale;

        let timeline = this.tweens.createTimeline();

        timeline.add({
            targets: this.startText,
            scale: this.startText.scale + .25,
            ease: 'Power2',
            duration: 550,
        });
        timeline.add({
            targets: this.startText,
            scale: initScale,
            ease: 'Power2',
            duration: 550,
        });
        timeline.loop = -1;
        timeline.play();
    }

    createBG() {
        this.sceneBG = this.add.sprite(config.width/2, screenEndpoints.bottom, this.variant.bg).setAlpha(.8).setOrigin(.5, 1).setInteractive();

        let scaleX = this.cameras.main.width / this.sceneBG.width;
        let scaleY = this.cameras.main.height / this.sceneBG.height;
        let scale = Math.max(scaleX, scaleY);
        this.sceneBG.setScale(scale).setScrollFactor(0);

        this.sceneBG.on('pointerdown', this.checkPointer, this);
        this.sceneBG.on('pointerup', ()=>{
            this.pointerTimer.paused = true;
            this.object.resetPosition();
        }, this);
    }

    addObjects(){
        this.object = new PullingObject({
            scene: this,
            texture: this.variant.object,
            scale: this.variant.object_scale,
            overlap_cof: this.variant.overlap_cof,
        });
        this.trap = new Trap({
            scene: this,
            x: config.width/2,
            y: screenEndpoints.bottom,
            texture: this.variant.trap
        });
        this.object.setPositions(this.trap);
    }

    createUpgradeCards(){
        this.createUpgradeCard(config.width/2 - config.width * .087, screenEndpoints.bottom - config.width * .05, '#0099D9', 'strength');
        this.createUpgradeCard(config.width/2, screenEndpoints.bottom - config.width * .05, '#31982F', 'stamina');
        this.createUpgradeCard(config.width/2 + config.width * .087, screenEndpoints.bottom - config.width * .05, '#D08816', 'income');

        this.checkUpgradeCardsStatus();
    }

    createCashText(){
        let bg = this.add.rectangle(screenEndpoints.right - config.width * .007, screenEndpoints.top + config.width * .007, config.width * .085, config.width * .025, 0x000000).setAlpha(0.3).setOrigin(1, 0);
        
        let textStyle = {
            font: `${bg.displayHeight * .8}px coolvetica`,
            fill: '#ffffff',
        };
        this.cashText = this.add.text(bg.x - bg.displayWidth/2 - bg.displayWidth/4.5, bg.y + bg.displayHeight/2, this.money, textStyle).setOrigin(0.5).setAlpha(.95);

        this.cashIcon = this.add.sprite(bg.x - bg.displayWidth/2 + bg.displayWidth/4.5, this.cashText.y, 'cash')
            .setDisplaySize(bg.displayHeight * .9, bg.displayHeight * .9)
    }

    createUpgardeAnimation(card){
        for (let i = 0; i < 10; i++) {
            let data = {
                x: (card.x - card.displayWidth * .5) + card.displayWidth/8 * i,
                y: Phaser.Math.Between((card.y - card.displayHeight * .5) * 100, (card.y + card.displayHeight * .5)*100)/100,
                scale: config.height * .075 * (Phaser.Math.Between(50, 150)/100),
                alpha: Phaser.Math.Between(75, 100)/100,
                duration: Phaser.Math.Between(550, 1250),
            }
            
            let plus_symbol = this.add.text(data.x, data.y, '+', {
                font: `${data.scale}px coolvetica`,
                fill: card.color,
            }).setOrigin(0.5).setAlpha(data.alpha);
            
            this.tweens.add({
                targets: plus_symbol,
                y: plus_symbol.y - card.displayHeight * 1.5,
                alpha: 0,
                ease: 'Linear',
                duration: data.duration,
                onComplete: () => { plus_symbol.destroy() }
            });
        }

        card.block.setAlpha(.35);

        if(card.cost < this.money) {
            card.upgardeAnim = this.tweens.add({
                targets: card.block,
                alpha: 0.001,
                ease: 'Linear',
                duration: 1250,
                onComplete: ()=>{ card.upgardeAnim = false; this.checkUpgradeCardsStatus(); },
            });
        }
    }

    createUpgradeCard(x, y, color, name){
        let strokeWidth = 4;
        this.cards[name] = this.add.rectangle(x, y, config.width * .0785, config.width * .0745, '0x' + color.slice(1)).setStrokeStyle(strokeWidth, 0xfffff0);
        this.cards[name].name = name;
        this.cards[name].color = color;
        this.cards[name].upgardeAnim = false;
        this.upgardeCard(this.cards[name]);

        let textStyle = {
            font: `${config.width * .0115}px coolvetica`,
            fill: '#f0fff0',
        };
        let costTextStyle = {
            font: `${config.width * .015}px coolvetica`,
            fill: '#f0fff0',
        };

        this.cards[name].nameText = this.add.text(x, y, name.toUpperCase(), textStyle).setOrigin(0.5).setAlpha(.9);
        this.cards[name].nameText.setPosition(this.cards[name].nameText.x + this.cards[name].displayWidth * .1, this.cards[name].nameText.y);

        this.add.sprite(x, y, name).setDisplaySize(this.cards[name].displayWidth * .25, this.cards[name].displayWidth * .25)
            .setPosition(this.cards[name].x - this.cards[name].displayWidth * .3375, y);

        this.cards[name].levelText = this.add.text(x, y, 'Lv. ' + this.cards[name].level, textStyle).setOrigin(0.5).setAlpha(.9);
        this.cards[name].levelText.setPosition(x, y - this.cards[name].displayHeight * .3);

        this.add.rectangle(x, y, this.cards[name].displayWidth * .875, this.cards[name].displayWidth * .25, 0x000000).setAlpha(0.3)
            .setPosition(x, y + this.cards[name].displayHeight * .3);

        this.cards[name].costText = this.add.text(x, y, this.cards[name].cost, costTextStyle).setOrigin(0.5).setAlpha(.9);
        this.cards[name].costText.setPosition(x - this.cards[name].costText.displayWidth * .75, y + this.cards[name].displayHeight * .3);

        this.cards[name].costIcon = this.add.sprite(x, this.cards[name].costText.y, 'cash')
            .setDisplaySize(this.cards[name].displayWidth * .225, this.cards[name].displayWidth * .225)
            .setPosition(x + this.cards[name].costText.displayWidth * .75, y + this.cards[name].displayHeight * .3);

        this.cards[name].block = this.add.rectangle(x, y, this.cards[name].displayWidth + strokeWidth, this.cards[name].displayHeight + strokeWidth, 0x000000)
            .setInteractive()
            .on('pointerdown', ()=>{this.buyUpgrade(this.cards[name])}, this)
            .on('pointerup', ()=>{this.object.pullingIsOn = true;});
        this.cards[name].block.name = name;
    }

    checkUpgradeCardsStatus(){
        Object.keys(this.cards).forEach(name => {
            if(this.cards[name].cost > this.money) {
                this.cards[name].block.setAlpha(.35);
            } else {
                this.cards[name].block.setAlpha(0.001);
            }
        });
    }

    buyUpgrade(card){
        this.checkUpgradeCardsStatus();
        if (card.upgardeAnim) {
            card.upgardeAnim.pause();
            card.block.setAlpha(.35);
        }
        this.object.pullingIsOn = false;
        if (this.money >= card.cost) {
            this.upgardeCard(card);
        } else {
            console.log('not enought money');
        }
    }

    upgardeCard(card){
        if (card.level) {
            this.decreaseMoney(card.cost);
        }
        card?.level ? card.level++ : card.level = 1;
        card.cost = Math.round((config.upgradeCardCost * card.level) * (0.135 * card.level + 1));
        if (card.level > 1) {
            card.levelText.setText(`Lv. ${card.level}`);
            card.costText.setText(card.cost);
            this.checkUpgradeCardsStatus();
            config.stats[card.name] *= 1.125;
            this.createUpgardeAnimation(card);
        }
    }

    increaseMoney(value){
        this.money += Math.round(value);
        this.cashText.setText(this.money);
        this.checkUpgradeCardsStatus();
    }

    decreaseMoney(value){
        this.money -= Math.round(value);
        this.cashText.setText(this.money);
    }

    createMoneyAnim(value){
        let textStyle = {
            font: `${config.width * .0295}px kidcraft`,
            fill: '#56D639',
        };
        let text = this.add.text(this.object.x, this.object.y, '+' + value, textStyle)
            .setOrigin(0.5)
            .setScale(10)
            .setAlpha(0);

    
        let timeline = this.tweens.createTimeline();
        let angle = 25;

        timeline.add({
            targets: text,
            scale: 1,
            alpha: 1,
            ease: 'Power2',
            duration: 650,
        });
        timeline.add({
            targets: text,
            angle: angle,
            ease: 'Linear',
            duration: 425,
        });
        timeline.add({
            targets: text,
            angle: angle * -1,
            ease: 'Linear',
            duration: 425,
        });
        timeline.add({
            targets: text,
            x: this.cashText.x,
            y: this.cashText.y,
            alpha: 0,
            ease: 'Linear',
            duration: 575,
            onComplete: () => {
                text.destroy();
                this.increaseMoney(value);
            }
        });

        timeline.play();
    }

    /*
    createSounds(){
        if (this.sounds) {
            return;
        }
        this.sounds = {
            rocket_launch: this.sound.add('rocket_launch'),
            fire_launch: this.sound.add('fire_launch'),
            missile_launch: this.sound.add('missile_launch'),
            explosion_small: this.sound.add('explosion_small'),
            wings: this.sound.add('wings'),
        };
    }
    */
}
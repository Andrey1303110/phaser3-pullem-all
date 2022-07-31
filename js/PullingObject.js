class PullingObject extends Phaser.GameObjects.Sprite {
    constructor(data) {
        super(data.scene, 0, 0, data.texture);
        this.init(data);
    }

    init(data) {
        this.scene.add.existing(this);
        this.setScale(data.scale);
        this.pos_corrections = data.pos_corrections;
        this.overlap_cof = data.overlap_cof;
        this.initColors();
        this.initSteps();

        this.pullingIsOn = true;

        this.colorTimer = this.scene.time.addEvent({
            delay: 1000/60,
            callback: ()=>{this.resetColorObject(1500/30)},
            callbackScope: this,
            paused: true,
            repeat: -1,
        });
    }

    initColors() {
        this.colors = {
            red: 255,
            other: 255,
        }
    }

    initSteps() {
        this.progress_steps = [
            {value: 95, isOn: false},
            {value: 81, isOn: false},
            {value: 57, isOn: false},
            {value: 35, isOn: false},
            {value: 15, isOn: false},
        ];
    }

    progressCheck(progress) {
        this.progress_steps.forEach(element => {
            if (progress > element.value && !element.isOn) {
                element.isOn = true;
                this.scene.createMoneyAnim(Math.round(config.stats.income * .01 * config.moneyIncrease));
            }
        });
        this.scene.checkUpgradeCardsStatus();
    }

    pull(pointer) {
        if (this.pullingIsOn && pointer?.isDown) {
            this.scene.startText.destroy();
            this.resetTween.pause();

            let pulling_distance = (this.initPosition + (this.displayHeight / 2) * this.overlap_cof) - (this.scene.trap.y - this.scene.trap.displayHeight);
            let pulling_step = pulling_distance / 100 * (config.stats.strength * .001);
    
            this.y -= pulling_step;
    
            let progress = ((pulling_distance - ((this.y + (this.displayHeight / 2) * this.overlap_cof) - (this.scene.trap.y - this.scene.trap.displayHeight))) / pulling_distance) * 100;
    
            this.progressCheck(progress);
    
            if (this.y + (this.displayHeight / 2) * this.overlap_cof < this.scene.trap.y - this.scene.trap.displayHeight) {
                this.scene.scene.start('Finish', this);
            }
    
            this.colors.other -= ((this.colors.red - config.redColorLimit)/350) / (config.stats.stamina * .01);
            if (this.colors.other < config.redColorLimit) {
                console.log('over color');
                this.resetPosition();
            }
            this.setTint(Phaser.Display.Color.GetColor(this.colors.red, this.colors.other, this.colors.other));
    
            /*
            if("vibrate" in window.navigator) {
                window.navigator.vibrate(200);
            }
            */
        }
    }

    resetPosition(){
        this.pullingIsOn = false;

        if (this.y === this.initPosition) {
            this.resetTween.pause();
            this.colorTimer.paused = true;
        } else {
            this.resetTween.play();
            this.colorTimer.paused = false;
        }

        this.scene.createStartText();
    }

    resetColorObject(updateRate){
        if (this.y < this.initPosition) {
            this.colors.other += ((this.colors.red - config.redColorLimit)/(updateRate)) / (config.stats.stamina * .01);
            if (this.colors.other >= 255) {
                this.colors.other = 255;
            }
            this.setTint(Phaser.Display.Color.GetColor(this.colors.red, this.colors.other, this.colors.other));
        } else {
            this.colorTimer.paused = true;
        }
    }

    setPositions(trap) {
        this.x = trap.x + (this.pos_corrections.x * this.displayWidth);
        this.y = trap.y - this.displayHeight / 2 - (this.pos_corrections.y * this.displayHeight);
        this.initPosition = this.y;

        this.resetTween = this.scene.tweens.add({
            targets: this,
            y: this.initPosition,   
            ease: 'Power2',
            duration: 1500,
            paused: true,
            onComplete: ()=>{
                this.pullingIsOn = true;
                if (this.isTinted) {
                    this.clearTint();
                    this.initColors();
                }
                this.initSteps();
            }
        });
    }
}
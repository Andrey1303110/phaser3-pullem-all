class PullingObject extends Phaser.GameObjects.Sprite {
    constructor(data) {
        super(data.scene, 0, 0, data.texture);
        this.init(data);
    }

    init(data) {
        this.scene.add.existing(this);
        this.setScale(data.scale);
        this.overlap_cof = data.overlap_cof;
        this.initColors();
        test = this;
        this.initSteps();
        this.scene.events.on('update', this.update, this);
    }

    initColors() {
        this.colors = {
            red: 255,
            other: 255,
        }
    }

    initSteps() {
        this.progress_steps = [
            {value: 90, isOn: false},
            {value: 60, isOn: false},
            {value: 30, isOn: false},
        ];
    }

    progressCheck(progress) {
        this.progress_steps.forEach(element => {
            if (progress > element.value && !element.isOn) {
                element.isOn = true;
                this.scene.increaseMoney(config.stats.income * .01 * config.moneyIncrease);
            }
        });
        this.scene.checkUpgradeCardsStatus();
    }

    pull() {
        let pulling_distance = (this.initPosition + (this.displayHeight / 2) * this.overlap_cof) - (this.scene.trap.y - this.scene.trap.displayHeight);
        let pulling_step = pulling_distance / 100 * (config.stats.strength * .01);

        this.y -= pulling_step;

        let progress = ((pulling_distance - ((this.y + (this.displayHeight / 2) * this.overlap_cof) - (this.scene.trap.y - this.scene.trap.displayHeight))) / pulling_distance) * 100;

        this.progressCheck(progress);

        if (this.y + (this.displayHeight / 2) * this.overlap_cof < this.scene.trap.y - this.scene.trap.displayHeight) {
            console.log('end overlap');
            this.y = this.initPosition;

            if (this.isTinted) {
                this.clearTint();
                this.initColors();
            }

            this.initSteps();
        }

        let limit = 65;

        this.colors.other -= ((this.colors.red - limit)/35) / (config.stats.stamina * .01);
        if (this.colors.other < limit) {
            this.colors.other = this.colors.red;
            this.y = this.initPosition;
            this.initSteps();
        }
        this.setTint(Phaser.Display.Color.GetColor(this.colors.red, this.colors.other, this.colors.other));
    }

    setPositions(trap) {
        this.x = trap.x;
        this.y = trap.y - this.displayHeight / 2;
        this.initPosition = this.y;
    }

    update() {

    }
}
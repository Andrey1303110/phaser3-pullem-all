class Trap extends Phaser.GameObjects.Sprite {
    constructor(data){
        super(data.scene, data.x, data.y, data.texture);
        this.init();
    }

    init(){
        this.setOrigin(0.5, 1);
        this.scene.add.existing(this);
        //this.move();
        //this.scene.events.on('update', this.update, this);
    }

    reset(x, y){
        this.x = x;
        this.y = y;
        this.setAlive(true);
    }

    update(){
        if (this.active && this.isDead()){
            this.setAlive(false);
        }
    }

    setAlive(status){
        this.body.enable = status;
        this.setVisible(status);
        this.setActive(status);

        if (this.timer) {
            this.timer.paused = !status;
        }

        if (!status) {
            this.emit('killed');
            if (this.launch_sound) {
                this.launch_sound.stop();
                if (this.launch_sound.stop()) {
                    this.launch_sound.destroy();
                }
            }
        }
    }

    isDead(){
        return false;
    }

    move(){
        this.body.setVelocityX(this.velocity);
    }
}
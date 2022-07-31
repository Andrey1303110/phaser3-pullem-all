class Trap extends Phaser.GameObjects.Sprite {
    constructor(data){
        super(data.scene, data.x, data.y, data.texture);
        this.init();
    }

    init(){
        this.setOrigin(0.5, 1);
        this.scene.add.existing(this);
    }
}
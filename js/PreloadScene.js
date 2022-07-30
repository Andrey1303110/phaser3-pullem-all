class PreloadScene extends Phaser.Scene {
    constructor() {
        super("Preload");
    }

    preload() {
        this.load.image('icon', 'sprites/icon.png');
        this.load.image('forest', 'sprites/forest.png');
        this.load.image('rays', 'sprites/rays.png');
        this.load.image('stones', 'sprites/stones.png');
        this.load.image('sword', 'sprites/sword.png');
        this.load.image('cash', 'sprites/cash.png');
        this.load.image('income', 'sprites/income.png');
        this.load.image('stamina', 'sprites/stamina.png');
        this.load.image('strength', 'sprites/strength.png');
        this.load.image('downloadButton', 'sprites/downloadButton.png');
        //this.load.audio('wings', 'assets/sounds/wings.mp3');
    }

    init(){
        setEndpoints();
    }

    create() {
        //this.scene.start('Start');
        this.scene.start('Game');
    }
}
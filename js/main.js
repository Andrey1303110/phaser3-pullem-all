var config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    backgroundColor: '#F3F3F3',
    parent: 'gameDiv',
    orientation: Phaser.Scale.LANDSCAPE,
    scale: {
        mode: Phaser.Scale.ENVELOP,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },

    scene: [PreloadScene, StartScene, GameScene],

    variatons: [
        {
            object: 'sword',
            object_scale: 0.4,
            bg: 'forest',
            trap: 'stones',
            overlap_cof: 0.87
        },
        {
            object: 'sword',
            object_scale: .4,
            bg: 'forest',
            trap: 'stones',
        },
        {
            object: 'sword',
            object_scale: .4,
            bg: 'forest',
            trap: 'stones',
        },
    ],

    stats: {
        strength: 100,
        stamina: 100,
        income: 100
    },

    moneyIncrease: 60,

    redColorLimit: 65,
};

var game = new Phaser.Game(config);

var screenEndpoints = {};
function setEndpoints() {
    if ((document.body.clientWidth / document.body.clientHeight) === (16 / 9)) {
        screenEndpoints.left = 0;
        screenEndpoints.right = config.width;
        screenEndpoints.top = 0;
        screenEndpoints.bottom = config.height;
    } else {
        if (document.body.clientWidth >= document.body.clientHeight) {
            if ((document.body.clientWidth / document.body.clientHeight) < (16 / 9)) {
                screenEndpoints.left = (config.width / 2) - (((config.height / document.body.clientHeight) * document.body.clientWidth) / 2);
                screenEndpoints.right = (config.width / 2) + (((config.height / document.body.clientHeight) * document.body.clientWidth) / 2);
                screenEndpoints.top = 0;
                screenEndpoints.bottom = config.height;
            } else {
                screenEndpoints.left = 0;
                screenEndpoints.right = config.width;
                screenEndpoints.top = (config.height - ((config.width / config.height) / (document.body.clientWidth / document.body.clientHeight) * config.height)) / 2;
                screenEndpoints.bottom = config.height - (config.height - ((config.width / config.height) / (document.body.clientWidth / document.body.clientHeight) * config.height)) / 2;
            }
    
        } else {
            screenEndpoints.left = (config.width / 2) - (((config.height / document.body.clientHeight) * document.body.clientWidth) / 2);
            screenEndpoints.right = (config.width / 2) + (((config.height / document.body.clientHeight) * document.body.clientWidth) / 2);
            screenEndpoints.top = 0;
            screenEndpoints.bottom = config.height;
        }
    }
};

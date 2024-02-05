class Main extends Phaser.Scene {

    // This function essentially loads things into our game
    preload() {
        this.load.spritesheet('girl', 'assets/girl.png', { frameWidth: 88, frameHeight: 60 });
        this.load.image('pipe', 'assets/pipe.png');
        this.load.audio('jump', 'assets/jump.wav');
    }

    //  it runs once at the beginning of the game and
    //  allows the user to place the things that they’ve preloaded with preload() and
    //  create objects within our game such as animations, collision detectors, text, groups, and much more
    create() {
        //Додаємо літак на сцену
        this.girl = this.physics.add.sprite(0, 0, 'girl')
        //Масштабуємо літак
        this.girl.setScale(0.65, 0.65);
        //Встановлюємо опорну точку літака
        this.girl.setOrigin(0, 0.5);

        //Створимо анімацію літака та налаштуємо для нього гравітацію
        this.anims.create({
            key: "girlAnimation",
            frames: this.anims.generateFrameNumbers('girl', { frames: [0, 1] }),
            frameRate: 10,
            repeat: -1
        });
        this.girl.play("girlAnimation");

        this.girl.body.gravity.y = 400;
        //створимо об’єкт клавіші “Пробіл”
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        //Створимо текстовий напис для рахунку
        this.score = 0;
        this.labelScore = this.add.text(20, 20, "0", { fontSize: 40, color: "black" });
        this.avtor = this.add.text(2, 2, "Created by Karina ", { fontSize: 14, color: "black" });
        //Створимо труби. Ідея полягає в тому, що кожна труба буде створюватись циклічно через кожні 1.5 секунди. Додаємо групу фізичних об’єктів та обробляємо циклічну подію:
        this.pipes = this.physics.add.group();

        this.timedEvent = this.time.addEvent({
            delay: 1500,
            callback: this.addRowOfPipes, //Цю функцію реалізуємо на наступному кроці
            callbackScope: this,
            loop: true
        });

        //
        this.physics.add.overlap(this.girl, this.pipes, this.hitPipe, null, this);

    }

    // While preload() and create() run only once at the start of the game, update() runs constantly.
    update() {
        //зробимо нахил літака на кут 20, а також перезапустимо гру, якщо літак вилетить за межі сцени
        if (this.girl.angle < 20) {
            this.girl.angle += 1;
        }

        if (this.girl.y < 0 || this.girl.y > 490) {
            this.scene.restart();
        }
        //
        if (this.spaceBar.isDown) {
            this.jump();
        }

    }
    //
    jump() {
        this.tweens.add({
            targets: this.girl,
            angle: -20,
            duration: 100,
            repeat: 1
        });
        this.girl.body.velocity.y = -150;
        this.sound.play('jump');// додаємо відтворення звуку при кожному підлітанні
    }

    //Функція для створення блоку труби
    addOnePipe(x, y) {
        var pipe = this.physics.add.sprite(x, y, 'pipe');
        pipe.setOrigin(0, 0);
        this.pipes.add(pipe);
        pipe.body.velocity.x = -300;

        pipe.collideWorldBounds = true;
        pipe.outOfBoundsKill = true;
    }
    //Функція створення труби (стовпчик блоків)
    addRowOfPipes() {
        var hole = Math.floor(Math.random() * 5) + 1;
        this.score += 1;
        this.labelScore.text = this.score;
        for (var i = 0; i < 20; i++) {
            if (!(i >= hole && i <= hole + 2))
                this.addOnePipe(600, i * 60 + 10);
        }
    }

    //метод-обробник зіткнення:
    hitPipe () {
        if (this.girl.alive == false) return;
    
        this.timedEvent.remove(false);
        this.girl.alive = false;
    
        this.pipes.children.each(function(pipe) {
            pipe.body.velocity.x = 0;
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: Main, // Цю сцену ми створимо на 4-му кроці
    backgroundColor: 'cf71c5',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    }
};

const game = new Phaser.Game(config);
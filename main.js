// Initialize Phaser
const config = {
  type: Phaser.AUTO,
  width: 600,
  height: 800,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

let player;
let playerSpeed = 200;
let laserGroup;
let enemyGroup;
let score = 0;
let scoreText;
let lives = 3;
let livesText;

function preload() {
  this.load.image('player', 'assets/player.png');
  this.load.image('laser', 'assets/laser.png');
  this.load.image('enemy', 'assets/enemy.png');
  this.load.atlas('explosion', 'assets/explosion.png', 'assets/explosion.json');
}

function create() {
  player = this.physics.add.sprite(100, 700, 'player');
  player.setCollideWorldBounds(true);
  laserGroup = new LaserGroup(this);
  enemyGroup = new EnemyGroup(this);
  enemyGroup.children.iterate(function(enemy) {
    move(enemy, this);
  }, this)
  this.physics.add.overlap(laserGroup, enemyGroup, laserCollision, null, this);
  this.physics.add.overlap(enemyGroup, player,(enemy, player)=>{
    playerEnemyCollision(enemy, player, this);
  });
  scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#fff' });
  livesText = this.add.text(16, 60, 'lives: 3', { fontSize: '32px', fill: '#fff' });
  emitter = this.add.particles(0, 0, 'explosion',
 {
 frame: ['red', 'yellow', 'green', 'blue', 'purple'],
  lifespan: 1000,
   speed: { min: 50, max: 100 },
  emitting: false
   });

}

function update() {
  const cursors = this.input.keyboard.createCursorKeys();
  if (cursors.left.isDown) {
    player.setVelocityX(-playerSpeed);
  } else if (cursors.right.isDown) {
    player.setVelocityX(playerSpeed);
  } else {
    player.setVelocityX(0);
  }
  if (cursors.space.isDown && Phaser.Input.Keyboard.JustDown(cursors.space)) {
    fireLaser(laserGroup, player);
  }
  checkLaserOutOfBounds(laserGroup);
  resetEnemy(enemyGroup, this);
}

function laserCollision(laser, enemy) {
  emitter.explode(40, enemy.x, enemy.y) 
  laser.setActive(false);
  laser.setVisible(false);
  laser.disableBody(true, true);
  move(enemy, this);
  score += 1;
  scoreText.setText('Score: ' + score);
  
}

function playerEnemyCollision(enemy, player, scene) {
  enemyGroup.children.iterate(function(enemy){
    move(enemy, scene);
  })
  
  lives -= 1;
  livesText.setText('Lives: ' + lives);
  if (lives <= 0) {
    enemy.setActive(false);
    enemy.setVisible(false);
    enemy.disableBody(true, true);
    enemyGroup.children.iterate(function(enemy){
      enemy.setVisible(false);
      enemy.setActive(false);
      enemy.disableBody(true, true);

    })

  }
}
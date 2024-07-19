class EnemyGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);
    this.createMultiple({
      key: 'enemy',
      frameQuantity: 20,
      active: false,
      visible: false,
    })
  }
}

function move(enemy, scene) {
  enemy.x = Phaser.Math.Between(0, scene.game.config.width);
  enemy.y = 0;
  enemy.active = true;
  enemy.visible = true;
  enemy.setVelocityY(Phaser.Math.Between(50, 150));
  enemy.setVelocityX(Phaser.Math.Between(-100, 100));
}

function resetEnemy(enemyGroup, scene) {
  enemyGroup.children.iterate(function(enemy) {
    if (enemy.y > scene.game.config.height
       ||enemy.x<0||enemy.x>scene.game.config.width) {
      move(enemy, scene);
    }
  });
}
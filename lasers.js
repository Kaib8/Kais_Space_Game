class LaserGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);
    this.createMultiple({
      key: 'laser',
      frameQuantity: 20,
      active: false,
      visible: false,
      x: -100,
      y: -100
    })
  }
}

function fireLaser(laserGroup, player) {
  let laser = laserGroup.getFirstDead(false);
  if (laser) {
    laser.setActive(true);
    laser.setVisible(true);
    laser.body.enable = true;
    laser.setPosition(player.x, player.y);
    laser.setVelocityY(-400);
  }
  
}
function checkLaserOutOfBounds(laserGroup) {
laserGroup.children.iterate(function(laser) {
if (laser.y < 0) {
  laser.setActive(false);
  laser.setVisible(false);
  laser.disableBody(true, true);
  laser.setVelocityY(0);
}
});
}
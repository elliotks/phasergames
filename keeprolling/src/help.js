export default class Help {
  constructor (scene, x, y, current=1) {
    this.x = x;
    this.y = y;
    this.scene = scene;
    this.current = current;
    this.init();
    this.setCurrent(current);
  }

  init () {
    this.positions = [
      [],
      [3, 2, 4, 5], // 1
      [3, 6, 4, 1], // 2
      [5, 6, 2, 1], // 3
      [2, 6, 5, 1], // 4
      [4, 6, 3, 1], // 5
      [4, 2, 3, 5], // 6

    ]
    this.currentSprite = this.scene.add.sprite(this.x, this.y, "die", this.current).setOrigin(0.5);
    this.topSprite = this.scene.add.sprite(this.x , this.y - 64, "die", this.positions[this.current][0]).setOrigin(0.5).setAlpha(0.5);
    this.rightSprite = this.scene.add.sprite(this.x + 64, this.y, "die", this.positions[this.current][1]).setOrigin(0.5).setAlpha(0.5);
    this.bottomSprite = this.scene.add.sprite(this.x, this.y + 64, "die", this.positions[this.current][2]).setOrigin(0.5).setAlpha(0.5);
    this.leftSprite = this.scene.add.sprite(this.x - 64, this.y, "die", this.positions[this.current][3]).setOrigin(0.5).setAlpha(0.5);
  }

  setCurrent(current) {
    this.current = current;
    this.currentSprite.setFrame(this.current);
    this.topSprite.setFrame(this.positions[this.current][0]);
    this.rightSprite.setFrame(this.positions[this.current][1]);
    this.bottomSprite.setFrame(this.positions[this.current][2]);
    this.leftSprite.setFrame(this.positions[this.current][3]);
  }

}
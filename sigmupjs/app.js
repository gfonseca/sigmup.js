import Game from "./src/Game";
import ActorsGroup from "./src/Group"

function randRange(min, max) {
    return Math.random() * (max - min) + min;
}

class square {
  constructor(SquareAtr) {
    this.x = SquareAtr.x;
    this.y = SquareAtr.y;

    this.width = SquareAtr.width || 30;
    this.height = SquareAtr.height || 30;

    this.color = SquareAtr.color;
    this.speed_x = typeof (SquareAtr.speed_x) == "undefined" ? 10 : SquareAtr.speed_x ;
    this.speed_y = typeof (SquareAtr.speed_y) == "undefined" ?  10 : SquareAtr.speed_y;
  }

  destroy () {
    this.color = "black";
  }

  update() {
    if(this.x + this.width >= g.canvas.width || this.x <= 0 ) {
      this.speed_x *= -1;
    }

    if(this.y + this.height >= g.canvas.height || this.y <= 0 ) {
      this.speed_y *= -1;
    }

    if(this.x + this.width >= g.canvas.width) {
      this.x = g.canvas.width - this.width; 
    }

    if(this.x < 0) {
      this.x = 0; 
    }

    if(this.y + this.height > g.canvas.height) {
      this.y = g.canvas.height - this.height;
    }     

    if(this.y < 0) {
      this.y = 0;
    }

    this.x += this.speed_x;
    this.y += this.speed_y;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Bullet {
  constructor(BulletAtr) {
    this.x = BulletAtr.x;
    this.y = BulletAtr.y;

    this.width = BulletAtr.width || 30;
    this.height = BulletAtr.height || 30;

    this.color = BulletAtr.color;
    this.speed_x = typeof (BulletAtr.speed_x) == "undefined" ? 10 : BulletAtr.speed_x ;
    this.speed_y = typeof (BulletAtr.speed_y) == "undefined" ?  10 : BulletAtr.speed_y;
  }

  destroy () {
    this.color = "black";
  }

  update() {
    if(
      this.x + this.width >= g.canvas.width || 
      this.x < 0 ||
      this.y + this.height > g.canvas.height ||
      this.y < 0
    ) {
      this.destroy();
    }

    this.x += this.speed_x;
    this.y += this.speed_y;
  }


  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
var g = new Game("black", "gameScreen" );

var ship = new square({x:100, y:550, color:"white", width: 100, height:20, speed_x:0, speed_y:0});
g.addActor(ship);

var groupEnemys = new ActorsGroup();
for (var i = 40; i <= 550; i += 40) {
  groupEnemys.actors.push(new square({x:i, y:100, color:"purple", speed_x: 0, speed_y:0}));
}
var groupBullets = new ActorsGroup();
g.addActor(groupEnemys.actors);

g.registerColisionGroups(function(enemy, bullet){  
  enemy.destroy();
}, groupEnemys, groupBullets);

document.addEventListener("keydown", (e)=>{
  
  if(e.key == "ArrowLeft") {
    ship.x -= 10;
  }

  if(e.key == "ArrowRight") {
    ship.x += 10;
  }
  if(e.key == " ") {
    var bullet_x = ship.x + (ship.width /2);
    var bullet = new Bullet({x:bullet_x, y:ship.y, color:"red", speed_x: 0, speed_y:-30, width:4, heigth:4 });
    groupBullets.actors.push(bullet);
    g.addActor(bullet);
  }

});

//  

 g.loop(20);
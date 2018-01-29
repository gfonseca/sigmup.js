import Game from "./src/Game";
import ActorsGroup from "./src/Group";
import Actor from "./src/Actor";
import {Square} from "./src/Actor";
export default function gameSi (){
  function randRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  class Bullet extends Square{
    constructor(bulletAtr) {
      super(bulletAtr);
      this.color = bulletAtr.color;
      this.speed_x = typeof (bulletAtr.speed_x) == "undefined" ? 10 : bulletAtr.speed_x ;
      this.speed_y = typeof (bulletAtr.speed_y) == "undefined" ?  10 : bulletAtr.speed_y;
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
  }

  var g = new Game("black", "gameScreen" );
  var ship = new Square({x:100, y:550, color:"white", width: 100, height:20, speed_x:0, speed_y:0});
  g.addActor(ship);

  var groupEnemys = new ActorsGroup();
  for (var i = 40; i <= 550; i += 40) {
    groupEnemys.actors.push(new Square({x:i, y:100, color:"purple", speed_x: 0, speed_y:0, width:30, height:30}));
  }
  var groupBullets = new ActorsGroup();
  g.addActor(groupEnemys.actors);

  g.registerColisionGroups(function(enemy, bullet){
    enemy.destroy();
    bullet.destroy();
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
      var bullet = new Bullet({x:bullet_x, y:ship.y, color:"red", speed_x: 0, speed_y:-5, width:4, heigth:4 });
      groupBullets.actors.push(bullet);
      g.addActor(bullet);
    }
    
  });

  g.loop(20);
}
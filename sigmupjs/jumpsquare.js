import Game from "./src/Game";
import ActorsGroup from "./src/Group";
import Actor from "./src/Actor";
import {Square} from "./src/Actor";

export default function jumpingSquare() {
  function randRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  class Player extends Square{
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
        this.x = 10;
      }
      
      if(this.speed_x >= 15) {
        this.speed_x = 15;
      }

      if(this.speed_x <= -15) {
        this.speed_x = -15;
      }
      this.x += this.speed_x * randRange(0.7, 0.9);
      this.y += this.speed_y* randRange(0.7, 0.9);
    }
  }

  var g = new Game("black", "gameScreen" );
  var sqr = new Player({x:100, y:500, color:"red", width: 50, height:50, speed_x:0, speed_y:0});
  g.addActor(sqr);

  document.addEventListener("keydown", (e)=>{
    var acc = 0.5;
    var breaks = 10;
    if(e.key == "ArrowLeft") {
      sqr.speed_x += acc *-1;
    }
    
    if(e.key == "ArrowRight") {
        sqr.speed_x += acc;    
    }


    if(e.key == "ArrowUp") {
        sqr.speed_y += acc * -1;    
    }


    if(e.key == "ArrowDown") {
        sqr.speed_y += acc;    
    }

    if(e.key == " ") {
            sqr.speed_x = 0;
            sqr.speed_y = 0;
    }
  });

  g.loop(20);
}
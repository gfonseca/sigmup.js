import Game from "./src/Game";
import ActorsGroup from "./src/Group";
import Actor from "./src/Actor";
import {Square} from "./src/Actor";

export default function jumpingSquare() {
  function randRange(min, max) {
    return Math.random() * (max - min) + min;
  }


  var g = new Game("black", "gameScreen");
  var sqr = new Square({boundary:true, x:100, y:500, color:"cyan", width: 50, height:50, speed_x:0, speed_y:0});
  sqr.addFriction(new Friction({fx: 0.75, fy:1 }));
  sqr.addVector(new Vector({vx: -0.15,  vy:0 }));
  sqr.addVector(new Vector({vx: 0,  vy:0.5   }));
  g.addActor(sqr);

  document.addEventListener("keydown", (e)=>{
    if(e.key == "ArrowLeft") {
      sqr.speed_x = -10;
    }
    
    if(e.key == "ArrowRight") {
      sqr.speed_x = 10;
    }

    if(e.key == "ArrowUp") {
      sqr.speed_y = -10;
    }

    if(e.key == "ArrowDown") {
      sqr.speed_y = 10;
    }

    if(e.key == ".") {
      g.render();
    }            

    if(e.key == " ") {
      sqr.setSpeedY(-15);
    }
  }); 

  g.loop(60);
}
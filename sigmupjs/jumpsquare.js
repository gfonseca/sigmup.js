import Game from "./src/Game";
import ActorsGroup from "./src/Group";
import Actor from "./src/Actor";
import {Square} from "./src/Actor";

export default function jumpingSquare() {
  var g = new Game("black", "gameScreen" );

  function randRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  class vector {
    constructor(vectorAttr) {
      this.speed_x = vectorAttr.speed_x;
      this.speed_y = vectorAttr.speed_y;
    }

    revertX() {
      this.speed_x *= -1;
    }

    revertY() {
      this.speed_y *= -1;
    }
  }

  class Player extends Square{
    constructor(bulletAtr) {
      super(bulletAtr);
      this.color = bulletAtr.color;

      this.vectorQueue = [];

      this.speed_x = typeof (bulletAtr.speed_x) === "undefined" ? 10 : bulletAtr.speed_x ;
      this.speed_y = typeof (bulletAtr.speed_y) === "undefined" ?  10 : bulletAtr.speed_y;
    }

    addVector(vec) {
      this.vectorQueue.push(vec);
    }

    update() {
      if(
        this.x + this.width >= g.canvas.width || 
        this.x < 0 ||
        this.y + this.height > g.canvas.height ||
        this.y < 0
      ) {
        this.x = 0;
      }
      
      this.vectorQueue.forEach((v)=>{
        this.speed_y += v.speed_y;
        this.speed_x += v.speed_x;;
      })
      
      if(this.speed_x >= 15) {
        this.speed_x = 15;
      }

      if(this.speed_x <= 0) {
        this.speed_x = 0;
      }

      if(this.speed_x <= -15) {
        this.speed_x = -15;
      }
      this.x += this.speed_x * randRange(0.7, 0.9);
      this.y += this.speed_y* randRange(0.7, 0.9);

      if(this.y + this.height  >= g.canvas.height - 20) {  
        this.y = g.canvas.height -this.height - 20;  
        this.speed_y *=  -1; 
        this.speed_y +=  4.5;          
      }

      console.log({
        x: this.x,
        y: this.y,
        speed_y: this.speed_y
      });
    }
  }

  var sqr = new Player({x:100, y:300, color:"red", width: 50, height:50, speed_x:0, speed_y:0});

  sqr.addVector(new vector({speed_x:0, speed_y: 0.9}));
  sqr.addVector(new vector({speed_x:2, speed_y: -2}));

  g.addActor(sqr);

  document.addEventListener("keydown", (e)=>{
    var acc = 0.5;
    var breaks = 10;
    if(e.key == "ArrowLeft") {
      
    }
    
    if(e.key == "ArrowRight") {
      sqr.speed_x = 50;
    }


    if(e.key == "ArrowUp") {
        sqr.speed_y += acc * -1;    
    }


    if(e.key == "ArrowDown") {
        sqr.speed_y += acc;    
    }

    if(e.key == " ") {
            sqr.speed_y = -15;
    }

    if(e.key == ".") {
      g.render();
    }
});



  g.loop(20);
}
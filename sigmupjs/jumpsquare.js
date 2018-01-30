import Game from "./src/Game";
import ActorsGroup from "./src/Group";
import Actor from "./src/Actor";
import {Square} from "./src/Actor";
import {Friction, Physics, Vector} from "./src/Moves";
var colors = ['coral', 'aqua', 'red', 'green', 'blue', 'yellow', 'purple', 'brown', 'cyan', 'white', 'magenta', 'pink', 'turquoise'];
export default function jumpingSquare() {
  function randRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  var g = new Game("black", "gameScreen");
  g.addGlobalVector(new Vector({vx: 0,  vy:0.5 }));
  
  var cyan_sqrs = [];
  for (var i = 0; i < 12; i++) {
    cyan_sqrs.push(
      new Square({
      boundary:true,
      x:randRange(0, g.canvas.width),
      y:randRange(0, g.canvas.height-100),
      color:"grey",
      width: 50,
      height:50,
      speed_x:0,
      speed_y:0})
    );
  } 
  
  g.addActor(cyan_sqrs);

  var groupSquares = new ActorsGroup(cyan_sqrs);
  
  var floor =  new Square({
    boundary:true,
    x:0,
    y:g.canvas.height-10,
    color:"red",
    width: g.canvas.width,
    height:10,
    speed_x:0,
    speed_y:0});

  var groupBounds = new ActorsGroup([floor]);
  g.addActor(floor);

  g.registerColisionGroups((b, s)=>{
    s.color = colors[Math.round(randRange(0, colors.length - 1))];
    s.speed_y *= -1;
    
    if(s.y+s.height > b.y) {
      s.y = b.y-s.height
    }
  }, groupBounds, groupSquares);

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
      sqr.setSpeedY(-85);
    }
  }); 

  g.loop(60);
}
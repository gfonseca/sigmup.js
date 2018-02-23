import Game from "./src/Game";
import {World, Body, CollisionGroup, Rect, SquareBody, Vector, Friction} from "./src/Dynamica";

var joystick = {
  left: false,
  right: false,
  space: false
}

class Boundary {
  constructor(params) {
    this.body = new SquareBody(params);
    this.color = params.color || "cyan";
  }
  
  draw(ctx) {
    ctx.fillStyle = this.color;
    this.body.getRects().forEach((r)=>{
      ctx.fillRect(this.body.x+r.x, this.body.y+r.x, r.width, r.height);
    });
  } 
  
  isAlive () {
    return true;
  }
}

function boundaryes(game) {
  var b = [];
  b.push(new Boundary({
    x: 0,
    y: 0,
    width: game.canvas.width,
    height: 10,
    visible: true
  }));
  
  b.push(new Boundary({
    x: 0,
    y: game.canvas.height - 10,
    width: game.canvas.width,
    height: 10,
    visible: true
  }));
  
  b.push(new Boundary({
    x: 0,
    y: 10,
    width: 10,
    height: 800,
    visible: true
  }));
  
  b.push(new Boundary({
    x: game.canvas.width - 10,
    y: 10,
    width: 100,
    height: game.canvas.height - 10,
    visible: true
  }));
  
  b.push(new Boundary({
    x: 480,
    y: 200,
    width: 100,
    height: 50 - 10,
    visible: true,
    color:"orchid"
  }));

  b.push(new Boundary({
    x: 300,
    y: 250,
    width: 100,
    height: 50 - 10,
    visible: true,
    color:"orchid"
  }));

  b.push(new Boundary({
    x: 180,
    y: 350,
    width: 100,
    height: 50 - 10,
    visible: true,
    color:"orchid"
  }));

  b.push(new Boundary({
    x: 30,
    y: 450,
    width: 100,
    height: 50 - 10,
    visible: true,
    color:"orchid"
  }));
  
  return b;
}

class Squarei {
  constructor(params) {
    this.body = new SquareBody(params);
    this.color = params.color || "red";
    this.onAir = true;
  }
  
  draw(ctx) {
    ctx.fillStyle = this.color;
    this.body.getRects().forEach((r)=>{
      ctx.fillRect(this.body.x+r.x, this.body.y+r.x, r.width, r.height);
    });
  } 
  
  isAlive () {
    return true;
  }
}

var g = new Game("black", "gameScreen" );
var bounds = boundaryes(g);
var block = bounds[4];

g.world = new World();
var squarei = new Squarei({
  x: 100,
  y: 450,
  width: 20,
  height: 20,
  speed_y: 0,
  visible: true,
  vectors: new Vector({vy: 0.3}),
  friction: new Friction({fx: 0.5}),
  color: "red"
});

var boundGroup = new CollisionGroup();
var playerGroup = new CollisionGroup();
playerGroup.addCollider(squarei.body);

bounds.forEach((b)=>{
  boundGroup.addCollider(b.body);
});
g.addActor(bounds);
g.addActor(squarei);

g.world.registerCollision((bound, sq)=>{
  var bR = bound.rects[0];
  var sR = sq.rects[0];
  
  var dx = ((sR.x + sq.x)+sR.width/2) - ((bR.x + bound.x)+bR.width/2);
  var dy = ((sR.y + sq.y)+sR.height/2) - ((bR.y + bound.y)+bR.height/2);
  
  var width = (sR.width + bR.width)/2;
  var height = (sR.height + bR.height)/2;
  var crossWidth = width*dy;
  var crossHeight = height*dx;
  var collision = 'none';

  if(crossWidth > crossHeight){
    collision = (crossWidth > (-crossHeight)) ? 'bottom' : 'left';
  }else{
    collision = (crossWidth > -(crossHeight)) ? 'right' : 'top';
  }

  if(collision == "left" || collision == "right"){
    sq.speed_x = 0;
    if(collision == "left") {
      sq.x = bound.x-sR.width;
    }else{
      sq.x = bound.x+bR.width;
    }
  }

  if(collision == "top" || collision == "bottom"){
    sq.speed_y = 0;
    if(collision == "top") {
      sq.y = bound.y-sR.height;
    }else{
      sq.y = bound.y+bR.height;
    }
  }
}, boundGroup, playerGroup);
  
  g.run = () =>{
    // var sqy =squarei.body.rects[0].y + squarei.body.y;
    // var sqh =squarei.body.rects[0].height;
    // var bly = block.body.rects[0].y + block.body.y;
    // var blh = block.body.rects[0].height;
    // console.log(sqy + sqh, bly);
    // if(
    //   sqy + sqh > bly
    //   && sqy < bly + blh
    // )  {
    //   console.log('hit')
    // }
    
    console.log(squarei.body.speed_y);
    if(joystick.left) { 
      squarei.body.speed_x = -5
    }
    
    if(joystick.right) { 
      squarei.body.speed_x = 5
    }
    
    if(joystick.space) { 
      squarei.body.speed_y = -5
    }
  };
  
  g.canvas.addEventListener("click", (e)=>{
    squarei.body.x = e.layerX-10;
    squarei.body.y = e.layerY-10;
  });

  window.addEventListener("keyup", (e)=>{
    if(e.code == "ArrowLeft") {
      joystick.left = false;
    }
    if(e.code == "ArrowRight") {
      joystick.right = false;
    }
    if(e.code == "Space") {
      joystick.space = false                ;
    }
  });
  
  window.addEventListener("keydown", (e)=>{
    if(e.code == "ArrowLeft") {
      joystick.left = true;
    }
    if(e.code == "ArrowRight") {
      joystick.right = true;
    }
    
    if(e.code == "Space") {
      joystick.space = true;
    }
    if(e.code == "KeyZ") {
      g.render();
    }
  });
  
  export default function game (){
    g.gameStart();
  }
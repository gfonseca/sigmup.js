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
    x: 400,
    y: 200,
    width: 100,
    height: 100 - 10,
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
  y: 100,
  width: 20,
  height: 20,
  visible: true,
  // vectors: new Vector({vy: 0.3}),
  // friction: new Friction({fx: 0.5}),
  color: "red"
});

console.log(squarei)
var boundGroup = new CollisionGroup();
var playerGroup = new CollisionGroup();
playerGroup.addCollider(squarei.body);

bounds.forEach((b)=>{
  boundGroup.addCollider(b.body);
});
g.addActor(bounds);
g.addActor(squarei);

g.world.registerCollision((bound, sq)=>{
  // var bnRe = bound.rects[0];
  // var sqRe = sq.rects[0];
  // var sqre_area = sqRe.y + sqRe.height + sq.y;
  // var bnd_area = bnRe.y + bound.y; 
  // console.log(sqre_area, bnd_area)
  // if( 
  //   sqre_area > bnd_area 
  //   && sqRe.y + sq.y < bnRe.y + bnRe.height + bound.y
  // ){
  //   console.log("vertical")
  //   sq.speed_y = 0;    
  //   sq.y = bound.y - sq.rects[0].height; 
  // }else{
  //   console.log("horizontal")
  // }
  
  }, boundGroup, playerGroup);
  
  g.run = () =>{
    var sqy =squarei.body.rects[0].y + squarei.body.y;
    var sqh =squarei.body.rects[0].height;
    var bly = block.body.rects[0].y + block.body.y;
    var blh = block.body.rects[0].height;
    console.log(sqy + sqh, bly);
    if(
      sqy + sqh > bly
      && sqy < bly + blh
    )  {
      console.log('hit')
    }

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
  
  g.canvas.addEventListener("mousemove", (e)=>{
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
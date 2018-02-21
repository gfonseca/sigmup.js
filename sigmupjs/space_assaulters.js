import Game from "./src/Game";
import {World, Body, CollisionGroup, Rect, SquareBody, Vector, Friction} from "./src/Dynamica";

const BLOCK_WIDTH = 10;
const BLOCK_HEIGHT = 7;
const BLOCK_START_X = 100;
const BLOCK_START_Y = 40;
const BLOCK_START_SPACE = 10;

const VESSEL_COLOR = ['cyan', 'red', 'purple', 'yellow', 'orchid'];
const VESSEL_WIDTH = 20;
const VESSEL_HEIGHT = 10
var VESSEL_DIRECTION = -1

var joystick = {
  left: false,
  right: false,
  space: false
}

var catridge = null;

class Bullet {
  constructor(params) {

    this.body = new SquareBody(params);
    this.color = "magenta";
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    this.body.getRects().forEach((r)=>{
      ctx.fillRect(this.body.x+r.x, this.body.y+r.x, r.width, r.height);
    });
  } 
  
  isAlive () {
    return this.body.isAlive();
  }
}

class Destroyer {
  constructor(params) {
    this.body = new SquareBody(params);
    this.color = "red";
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    this.body.getRects().forEach((r)=>{
      ctx.fillRect(this.body.x+r.x, this.body.y+r.x, r.width, r.height);
    });
  } 
  
  isAlive () {
    return this.body.isAlive();
  }
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

class Vessel {
  constructor(vessel) {
    this.body = new Body({
      speed_x: 10,
      x: vessel.x || 0,
      y: vessel.y || 0,
      speed_y: 0,
      rect: new Rect({width:VESSEL_WIDTH, height:VESSEL_HEIGHT}),
    });
    
    this.color = vessel.color || "purple";
  }
  
  isAlive () {
    return this.body.isAlive();
  }
  
  draw(ctx) {
    
    ctx.fillStyle = this.color;
    this.body.getRects().forEach((r)=>{
      ctx.fillRect(this.body.x+r.x, this.body.y+r.x, r.width, r.height);
    });
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
  
  return b;
}

function iteroverAll(block, cb) {
  block.forEach((row)=>{
    row.forEach((v)=>{
      cb(v);
    });
  });
}

var g = new Game("black", "gameScreen" );
var bounds = boundaryes(g);
var bound_up = bounds[0];
var bound_left = bounds[2];
var bound_right = bounds[3];
var bound_down = bounds[1];

var vesselGroup = new CollisionGroup();
var boundGroup = new CollisionGroup();
var bulletGroup = new CollisionGroup();
var block = Array(BLOCK_HEIGHT);
var destroyer = new Destroyer({x: 220, y: 550, width:80, height: 10, friction: new Friction({fx:0.3})})
g.world = new World({friction: new Friction({fx: 0.90, fy: 0.8})});
g.addActor(bounds);
g.addActor(destroyer);

for(var i = 0; i <= BLOCK_HEIGHT-1; i++) {
  block[i] = Array(BLOCK_WIDTH);
  for(var j = 0; j <= BLOCK_WIDTH-1; j++) {
    var v = new Vessel({
      x: BLOCK_START_X + j*30,
      y: BLOCK_START_Y + i*20,
      color: VESSEL_COLOR[i],
    });
    block[i][j] = v;
    g.addActor(v);
    vesselGroup.addCollider(v.body);
  }
}

bounds.forEach((b)=>{
  boundGroup.addCollider(b.body);
});

g.world.registerCollision((b, v)=>{
  b.destroy();
  v.destroy();
  catridge = null;
}, bulletGroup, vesselGroup);

g.run = () =>{
  if(destroyer.body.collide(bound_left.body)) {
    destroyer.body.x = 10;
  }

  if(destroyer.body.collide(bound_right.body)) {
    destroyer.body.x = g.canvas.width - 90;
  }

  if(catridge){
    if(bound_up.body.collide(catridge.body)) {
      catridge.body.destroy();
      catridge = null;
    }
  }

  iteroverAll(block, (v) => {
    if(v.body.collide(bound_left.body)) {
      VESSEL_DIRECTION = 1;
      iteroverAll(block, v => v.body.x += 5 )
    }

    if(v.body.collide(bound_right.body)) {
      VESSEL_DIRECTION = -1;
      iteroverAll(block, v => v.body.x -= 5 )
    }

    if(v.body.collide(bound_left.body) || v.body.collide(bound_right.body)) {
      iteroverAll(block, v => v.body.speed_x = 0 )
      iteroverAll(block, v => v.body.speed_y = 9 )
      return;
    }
  });

  if(joystick.left) {
    destroyer.body.speed_x = -15;
  }

  if(joystick.right) {
    destroyer.body.speed_x = 15;
  }

  if(joystick.space && !catridge) {
    catridge = new Bullet({
      x: destroyer.body.x+destroyer.body.rects[0].width /2,
      y: destroyer.body.y,
      speed_y: -15  ,
      width: 5,
      height: 10,
      friction: new Friction(),
    });
    bulletGroup.addCollider(catridge.body);
     g.addActor(catridge);
  }
};

setInterval(()=>{
  vesselGroup.colliders.forEach((v)=>{
    if(Math.round(v.speed_y) <= 0 ){
      v.speed_x = 10*VESSEL_DIRECTION; 
    }
  });
}, 1000)

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
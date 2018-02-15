import Game from "./src/Game";
import {World, Body, CollisionGroup, Rect, SquareBody, Vector} from "./src/Dynamica";
import { Friction } from "./src/Moves";

export default function gameSi (){
  var WIDTH = 10;
  var HEIGHT = 10;
  function randRange(min, max) {
    return Math.random() * (max - min) + min;
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
  
  class Bullet{
    constructor(bulletParams) {
      var b = new Body({
        x: bulletParams.x || randRange(0, 400),
        y: bulletParams.y || randRange(0, 800), 
        speed_x: randRange(-1, 1),
        speed_y: randRange(-1, 1),
        rect: new Rect({width:WIDTH, height:HEIGHT}),
        vectors: new Vector({vy: 0.2}),
      });
      this.body = b;
      this.color = "red";
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
      height: game.canvas.height - 10,
      visible: true
    }));
    
    b.push(new Boundary({
      x: game.canvas.width - 10,
      y: 10,
      width: 10,
      height: game.canvas.height - 10,
      visible: true
    }));
    
    return b;
  }
  
  var g = new Game("black", "gameScreen" );
  var bounds = boundaryes(g);
  
  g.world = new World();
  // g.world.addFriction(new Friction({fy: 1}));
  g.addActor(bounds);
  
  var squareGroups = new CollisionGroup();
  var boundsGroups = new CollisionGroup();
  
  bounds.forEach((b) => {
    boundsGroups.addCollider(b.body);
  });
  
  g.run = ()=>{};
  
  g.world.registerCollision([(a, b) => {
    console.log(a.speed_y)    ;
    
    a.speed_y *= 0.6;
    a.speed_y *= -1;

    a.speed_x *= 0.6;
    a.speed_x *= -1;
    
    if(a.y + HEIGHT >= 580) {
      a.y = 580;  
    }
    
  }, (a, b) => {
    // if(Math.round(a.speed_y) == 0 ){
    //   a.destroy();
    // }
  }], squareGroups, boundsGroups);
  
  g.world.registerCollision((a, b) => {
    if(a.x < b.x) {
      a.x = b.x - 1;  
      b.x += 1;  
    } else{
      a.x = b.x + 1;  
      b.x -= 1;
    }

    if(a.y < b.y) {
      a.y = b.y - 1;  
      b.y += 1;  
    } else{
      a.y = b.y + 1;  
      b.y -= 1;
    }
    
    a.speed_x *= 0.7;
    a.speed_y *= 0.7;
    b.speed_x *= 0.7;
    b.speed_y *= 0.7;
    
    b.speed_x *= -1;
    b.speed_y *= -1;
    a.speed_x *= -1;
    a.speed_y *= -1;
  }, squareGroups);
  
  
  g.canvas.addEventListener("click", (e)=>{

    for( var i = 0; i <= 2; i++ ){
      var bullet = new Bullet({
        x: e.layerX + randRange(-50, +50),
        y: e.layerY + randRange(-50, +50)
      });
      g.addActor(bullet);
      squareGroups.addCollider(bullet.body);
    }
  });
  
  document.addEventListener("keydown", (e)=>{
  
    if(e.key == "ArrowLeft") {
      ship.x -= 10;
    }
  
    if(e.key == "ArrowRight") {
      ship.x += 10;
    }

    if(e.key == " ") {
      g.render();
      // g.addActor(bullet);
    }
  
  });
  
   g.loop(20);
}
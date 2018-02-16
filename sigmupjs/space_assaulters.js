import Game from "./src/Game";
import {World, Body, CollisionGroup, Rect, SquareBody, Vector, Friction} from "./src/Dynamica";

const VESSEL_COLOR = ['cyan', 'red', 'purple', 'yellow'];
const VESSEL_WIDTH = 20;
const VESSEL_HEIGHT = 10

class Vessel {
  constructor(vessel) {
    this.body = new Body({
      speed_x: 10,
      x: vessel.x || 0,
      y: vessel.y || 0,
      speed_y: 0,
      friction: new Friction({fx: 0.90}),
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

var g = new Game("black", "gameScreen" );
var vesselGroup = new CollisionGroup();

g.world = new World();

for(var i = 1; i <= 4; i++) {
  for(var j = 1; j <= 14; j++) {
    console.log(i*30);
    var v = new Vessel({
      x: j*30,
      y: i*20,
      color: VESSEL_COLOR[i-1],
    });
    g.addActor(v);
    vesselGroup.addCollider(v.body);
  }
}

setInterval(()=>{
  vesselGroup.colliders.forEach((v)=>{
    v.speed_x = 10;
    console.log(v);
  });
}, 1000)

export default function game (){
  
  g.gameStart();
}
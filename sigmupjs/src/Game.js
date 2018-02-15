import { ColisionRegistration } from "./Group";
import physics from "./Moves";

class Game {
  constructor(backgroundColor, canvasId) {
    this.backgroundColor = backgroundColor || "black";
    this.canvas = document.getElementById(canvasId || "gameScreen");
    this.context = this.canvas.getContext("2d");
    this.gameActors = [];
    this.colisionReg = [];
    this.world = null;
    this.interval = 1000 / 60
    this.lastTime = performance.now();
    this.currentTime = 0;
    this.delta = 0;
  }
  
  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = this.backgroundColor;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  render() {
    this.clear();
    this.removeDead();
    if(this.world) {
      this.world.walk();
    }
    if(this.run) {
      this.run();
    }
    this.gameActors.forEach((actor)=>{
      actor.draw(this.context);
    });
    
  }
  
  addActor(a) {
    if (Array.isArray(a)) {
      this.gameActors = this.gameActors.concat(a);
    } else {
      this.gameActors.push(a);
    }
    if(Array.isArray(a)) {
      a.forEach((ac)=>{
        this.world.registerBody(ac.body);  
      });
    }else{
      this.world.registerBody(a.body);
    }
  }
  
  removeDead() {
    for (var i in this.gameActors) {
      if(!this.gameActors[i].isAlive()) {
        this.gameActors.splice(i, 1);
      }
    }
  }
  
  loop(timestamp) {
    this.currentTime = timestamp;
    this.delta += (timestamp - this.lastTime);
    this.lastTime = timestamp;
    if(this.delta >= this.interval) {
      this.render();
      this.delta -= this.interval;
      this.context.fillStyle = "magenta";
      this.context.font = "10px Arial";
      this.context.fillText(this.delta, 10, 50);
    }
    
    window.requestAnimationFrame((timestamp)=>{
      this.loop(timestamp);
    });
    
  }
}


export default Game;
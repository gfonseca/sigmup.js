import { ColisionRegistration } from "./Group";
import physics from "./Moves";

class Game {
  constructor(backgroundColor, canvasId) {
    this.backgroundColor = backgroundColor || "black";
    this.canvas = document.getElementById(canvasId || "gameScreen");
    this.context = this.canvas.getContext("2d");
    this.gameActors = [];
    this.world = null;
    
    this.logFps = false;
    this.lastFrameTimeMs = 0;
    this.lastFpsUpdate = 0;
    this.framesThisSecond = 0;
    this.maxFPS = 60;
    this.fps = 30;
    this.timestep = 1000/60;
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
  
  panic() {
    this.delta = 0; // discard the unsimulated time
    // ... snap the player to the authoritative state
  }
  
  gameStart(timestamp) {
    requestAnimationFrame((timestamp)=>{
      this.loop(timestamp);
    });
  }

  loop(timestamp) {
    // Throttle the frame rate.    
    if (timestamp < this.lastFrameTimeMs + (1000 / this.maxFPS)) {
      requestAnimationFrame((timestamp)=>{
        this.loop(timestamp);
      });
      return;
    }
    this.delta += timestamp - this.lastFrameTimeMs;
    this.lastFrameTimeMs = timestamp;
    
    if (timestamp > this.lastFpsUpdate + 1000) {
      this.fps = 0.25 * this.framesThisSecond + 0.75 * this.fps;
      
      this.lastFpsUpdate = timestamp;
      this.framesThisSecond = 0;
    }
    this.framesThisSecond++;
    
    var numUpdateSteps = 0;
    while (this.delta >= this.timestep) {
      this.render();
      this.delta -= this.timestep;
      if (++numUpdateSteps >= 240) {
        this.panic();
        break;
      }
      
      if(this.logFps) {
        console.log("FPS: "+ this.fps);
      }
      
    }
    
    requestAnimationFrame((timestamp)=>{
      this.loop(timestamp);
    });
  }
}

export default Game;
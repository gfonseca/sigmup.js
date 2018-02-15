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
    this.interval = 1000/60;
    this.lastTime = (new Date()).getTime();
    this.currentTime = 0;
    this.delta = 0;
  }
  
  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = this.backgroundColor;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  bound(actor) {
    if(actor.x + actor.width >= this.canvas.width) {
      actor.x = this.canvas.width - actor.width;
    }
    
    if(actor.x < 0) {
      actor.x = 0;
    }
    
    if(actor.y + actor.height > this.canvas.height){
      actor.y = this.canvas.height - actor.height;
    }
    
    if(actor.y < 0){
      actor.y = 0;
    }
  }
  
  render() {
    this.clear();
    this.removeDead();
    this.world.walk();
    this.run();
    this.gameActors.forEach((actor)=>{
      actor.draw(this.context);
    });
    
  }

  render2() {
    this.clear();
    this.colideGroups();
    this.gameActors.forEach((actor)=>{
      actor.update();
      if(actor.boundary) {
        this.bound(actor);
      }
      actor.draw(this.context);
    });
    
    for(var i in this.gameActors){
      if(!this.gameActors[i].isAlive()) {
        delete this.gameActors[i];
        this.gameActors.splice(i, 1);
      }
    }
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
  
  colideGroups() {
    this.colisionReg.forEach((cr)=>{
      if(!cr.groupB) {
        cr.groupA.selfColide(cr.callback);
      }else {
        cr.groupA.colide(cr.groupB, cr.callback);
      }
    });
  }

  removeDead() {
    for (var i in this.gameActors) {
        if(!this.gameActors[i].isAlive()) {
            this.gameActors.splice(i, 1);
        }
    }
}
  
  registerColisionGroups(callback, groupA, groupB){
    this.colisionReg.push(new ColisionRegistration(callback, groupA, groupB));
  }
  
  loop(fps) {
    this.currentTime = (new Date()).getTime();
    this.delta = (this.currentTime - this.lastTime);
    if(this.delta > this.interval) {
      this.render();
      this.lastTime = this.currentTime - (this.delta % this.interval);
    }

    window.requestAnimationFrame(()=>{
      this.loop();
    });
  }
}

export default Game;
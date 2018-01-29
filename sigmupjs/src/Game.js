import { ColisionRegistration } from "./Group";

class Game {
    constructor(backgroundColor, canvasId) {
      this.backgroundColor = backgroundColor || "black";
      this.canvas = document.getElementById(canvasId || "gameScreen");
      this.context = this.canvas.getContext("2d");
      this.gameActors = [];
      this.colisionReg = [];
    }
  
    clear() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.fillStyle = this.backgroundColor;
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  
    render() {
      this.clear();
      this.colideGroups();
      this.gameActors.forEach((actor)=>{
        actor.update();
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
    
    registerColisionGroups(callback, groupA, groupB){
      this.colisionReg.push(new ColisionRegistration(callback, groupA, groupB));
    }
    
    loop(fps) {
      this.interval = setInterval(() => {
         this.render();
      }, fps || 30);
    }
  }

  export default Game;

class ColisionRegistration {
    constructor(callback, groupA, groupB) {
      this.groupA = groupA;
      this.groupB = groupB;
      this.callback = callback;
    }
  }
  
  class ActorsGroup {
    constructor(actors){
      if ( Array.isArray(actors) ) {
        this.actors = actors;  
      } else {
        this.actors = [];
        if(actors != null){
          this.actors.push(actors)
        }
      }    
    }
  
    selfColide(callback) {
      for (var i = 0; i < this.actors.length - 1; i++) {
        for (var j = i; j < this.actors.length - 1; j++) {
           var a = this.actors[i];
           var b = this.actors[j+1];
           if (a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.height + a.y > b.y) {
            callback(a, b);
          }
        }
      };
    }
  
    colide(groupB, callback) {
      if( ! groupB instanceof ActorsGroup ) {
        throw "groupB must be instance of ActorsGroupvou";
      }
      
      for (var i = 0; i <= this.actors.length - 1; i++) {
        var a = this.actors[i];
        for (var j = 0; j <= groupB.actors.length - 1; j++) {
           var b = groupB.actors[j];         
           if (a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.height + a.y > b.y) {
            callback(a, b);
          }
        }
      };
    }
  }

  export default ActorsGroup;
  export {ColisionRegistration};
class Physcs {
    constructor() {
        this.globalVectors = [];
        this.globalFrictions = [];
    }

    addGlobalVector(vec) {
        this.globalVectors.push(vec);
    }

    addGlobalFriction(frc) {
        this.globalFrictions.push(frc);
    }
    
    clearGlobalVector() {
        this.globalVectors = [];
    }

    clearGlobalFriction() {
        this.globalFrictions = []
    }

    calcPhysicsToActors(actors){
        actors.forEach((a)=>{
            this.update(a);
        });
    }

    update(actor) {
        var frx = 1;
        var fry = 1;
        
        (actor.frictionQueue.concat(this.globalFrictions)).forEach((f)=>{
            frx = f.fx;
            fry = f.fy;
        });
        
        var vecx = 0;
        var vecy = 0;
        
        (actor.vectorQueue.concat(this.globalVectors)).forEach((v)=>{
            
            vecx += v.vx;
            vecy += v.vy;
        });
        
        actor.speed_x += vecx;
        actor.speed_y += vecy;
        
        actor.speed_x *= frx;
        actor.speed_y *= fry;
        
        actor.x += actor.speed_x;
        actor.y += actor.speed_y;        
    }
}

class Vector {
    constructor (vecAttr) {
        this.vx = vecAttr.vx;
        this.vy = vecAttr.vy ;
    }
}

class Friction {
    constructor (frcAttr) {
        this.fx = frcAttr.fx ; 
        this.fy = frcAttr.fy ;
    }  
}

export default Physcs;
export {Vector, Friction};
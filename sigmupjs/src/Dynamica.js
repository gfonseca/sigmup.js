class World {
    constructor(worldParams) {
        if(!Array.isArray(worldParams.collisionRegs) && typeof(worldParams.collisionRegs) !== "undefined") {
            throw "worldParams.collisionRegs must be array in World.constructor().";
        } else{
            this.collisionRegistrations = [];
        }
        
        this.globalVectors = worldParams.globalVecs || [];
        this.globalFriction = worldParams.globalFric || null;
        this.bodies = worldParams.bodies || [];
    }
    
    
    
    calcPhysicsToActors(actors){
        actors.forEach((a)=>{
            this.update(a);
        });
    }
    
    update(actor) {
        var frx = 1;
        var fry = 1;
        
        (actor.frictionQueue.concat(this.globalVectors)).forEach((f)=>{
            frx = f.fx;
            fry = f.fy;
        });
        
        var vecx = 0;
        var vecy = 0;
        
        (actor.vectorQueue.concat()).forEach((v)=>{
            vecx += v.vx;
            vecy += v.vy;
        });
        
        actor.speed_x += vecx;
        actor.speed_y += vecy;
        
        actor.speed_x = actor.speed_x * frx;
        actor.speed_y = actor.speed_y * fry;
        
        actor.x += actor.speed_x;
        actor.y += actor.speed_y;
    }
}

class Rect {
    constructor(rectParams) {
        rectParams = rectParams || {};
        
        this.x =  Number(rectParams.x) || 0;
        this.y = Number(rectParams.y) || 0;
        this.width =  Number(rectParams.width) || 10;
        this.height = Number(rectParams.height) || 10;
        this.visible = Boolean(rectParams.visible);
    }
    
    show() {
        this.visible = true;
    }
    
    hide() {
        this.visible = false;
    }
    
    isVisible() {
        return this.visible;
    }
}

class Body {
    constructor(bodyParams) {
        bodyParams = bodyParams || {};
        
        this.speed_x = Number(bodyParams.speed_x) || 0;
        this.speed_y = Number(bodyParams.speed_y) || 0;
        this.mass = Number(bodyParams.mass) || 0;;
        this.boundary = Boolean(bodyParams.boundary);
        this.ethereal = Boolean(bodyParams.ethereal);
        
        this.vectorInX = typeof(bodyParams.vectorInX) === "undefined" ? true : Boolean(bodyParams.vectorInX);
        this.vectorInY = typeof(bodyParams.vectorInY) === "undefined" ? true : Boolean(bodyParams.vectorInY);
        this.frictionInX = typeof(bodyParams.frictionInX) === "undefined" ? true : Boolean(bodyParams.frictionInX);
        this.frictionInY = typeof(bodyParams.frictionInY) === "undefined" ? true : Boolean(bodyParams.frictionInY);
        
        this.live = true;
        
        this.rects = [];
        this.vectors = [];
        this.friction = new Friction({});
        
        this.setRects(bodyParams.rect);
        this.applyVectors(bodyParams.vectors);
        if(bodyParams.friction) {
            this.applyFriction(bodyParams.friction);
        }
    }
    
    setRects(rects) {
        if(Array.isArray(rects)) {
            rects.forEach(function(rects){
                if(!rects instanceof Rect) {
                    throw "Body.rect must be a list of Rect."
                }
            });
            this.rects = rects;
        }else {
            if(rects instanceof Rect) { 
                this.rects = this.rects.concat([rects]);
            }else{
                this.rects = this.rects.concat([new Rect()]);
            }
        }
    }
    
    applyVectors(vectors) {
        if(Array.isArray(vectors)) {
            vectors.forEach(function(v){
                if(!v instanceof Vector) {
                    throw "Body.vectors must be a list of Vector or a vector."
                }
            });
            this.vectors = vectors;
        } 
        if(vectors instanceof Vector) {
            this.vectors = [vectors];
        }
    }
    
    applyFriction(friction) {
        this.friction = friction;
    }
    
    clearVectors() {
        this.vectors = [];
    }
    
    clearFriction() {
        this.friction = new Friction({fx:1, fy:1});
    }
    
    addVector(vector) {
        this.vectors.push(vector);
    }
    
    setSpeedX(speed_x) {
        this.speed_x = speed_x;
    }
    
    setSpeedY(speed_y) {
        this.speed_y = speed_y;
    }
    
    setAsEthereal(ethereal) {
        this.ethereal = ethereal
    }
    
    isEthereal() {
        return this.etheral;
    }
    
    isAlive() {
        return this.live;
    }
    
    destroy() {
        this.live = false;
    }
    
    hasVectors() {
        return Boolean(this.vectors.length);
    }
    
    getRects() {
        return this.rects;
    }
    
    colide(bodyB) {
        for (var i = 0; i <= this.rects.length - 1; i++) {
            var a = this.rects[i];
            for (var j = 0; j <= bodyB.rects.length - 1; j++) {
                var b = bodyB.rects[j];         
                if (
                    a.x < b.x + b.width 
                    && a.x + a.width > b.x 
                    && a.y < b.y + b.height 
                    && a.height + a.y > b.y
                ) {
                    return true;
                }
            }
        }
        return false;
    }
}
    
    class Vector {
        constructor (vecAttr) {
            vecAttr = vecAttr || {};
            this.vx = vecAttr.vx || 0;
            this.vy = vecAttr.vy || 0;
        }
    }
    
    class Friction {
        constructor (frcAttr) {
            frcAttr = frcAttr || {}
            this.fx = frcAttr.fx || 1; 
            this.fy = frcAttr.fy || 1;
        }  
    }
    
    export {Body, Rect, Friction, Vector};
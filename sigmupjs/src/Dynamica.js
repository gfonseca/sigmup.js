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
        
        this.x =  Number(bodyParams.x) || 0;
        this.y = Number(bodyParams.y) || 0;
        
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
    
    collide(bodyB) {
        for (var i = 0; i <= this.rects.length - 1; i++) {
            var a = this.rects[i];
            for (var j = 0; j <= bodyB.rects.length - 1; j++) {
                var b = bodyB.rects[j];         
                if (
                    a.x + this.x < bodyB.x + b.x + b.width 
                    && this.x + a.x + a.width > b.x + bodyB.x 
                    && a.y + this.y < b.y + b.height + bodyB.y
                    && a.height + a.y + this.y  > b.y + bodyB.y
                ) {
                    return true;
                }
            }
        }
        return false;
    }
    
    setXY(xy) {
        xy = xy || {};
        
        if(!xy.x && !xy.y) {
            return;
        }
        
        this.x = xy.x || this.x;
        this.y = xy.y || this.y;
    }
}

class CollisionGroup {
    constructor(colliders) {
        this.colliders = [];
        
        if(Array.isArray(colliders)){ 
            this.colliders = this.colliders.concat(colliders);
        }
        
        if(colliders instanceof Body) { 
            this.colliders.push(colliders);
        }
    }
    
    addCollider(collider) {
        this.colliders.push(collider);
    }
    
    selfCollide(callback) {
        this.removeDead();
        for (var i = 0; i < this.colliders.length - 1; i++) {
            for (var j = i; j < this.colliders.length - 1; j++) {
                var a = this.colliders[i];
                var b = this.colliders[j+1];
                if (a.collide(b)) {
                    callback(a, b);
                }
            }
        }
    }
    
    collideWithGroupB(callback, groupB){
        this.removeDead();
        if( ! groupB instanceof CollisionGroup ) {
            throw "groupB must be instance of ActorsGroupvou";
        }
        for (var i = 0; i <= this.colliders.length - 1; i++) {
            var a = this.colliders[i];
            for (var j = 0; j <= groupB.colliders.length - 1; j++) {
                var b = groupB.colliders[j];         
                if (a.collide(b)) {
                    callback(a, b);
                }
            }
        }
    }

    removeDead() {
        for (var i in this.colliders) {
            if(!this.colliders[i].isAlive()) {
                this.colliders.splice(i, 1);
            }
        }
    }
}

class CollisionRegistration {
    constructor(callback, groupA, groupB) {
        this.groupA = groupA;
        this.groupB = groupB;
        this.callback = callback;
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

export {Body, Rect, Friction, Vector, CollisionGroup};
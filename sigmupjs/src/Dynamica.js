class World {
    constructor(worldParams) {
        worldParams = worldParams || {};
        
        this.collisionRegistrations = [];
        this.vectors = worldParams.vectors || [];
        this.friction = worldParams.friction || null;
        this.bodies = worldParams.bodies || [];
    }

    registerCollision(callback, groupA, groupB) {
        
        if(!Array.isArray(callback)) {
            callback = [callback];
        }

        this.collisionRegistrations.push(
            new CollisionRegistration(callback, groupA, groupB)
        ); 
    }

    collideGroups() {
        this.collisionRegistrations.forEach(function(reg) {
            if(reg.groupB) {
                reg.groupA.collideWithGroupB(reg.callback, reg.groupB);
            } else{
                reg.groupA.selfCollide(reg.callback);
            }
        });
    }

    moveBodies(){
        this.bodies.forEach(function(b) {
            this.update(b);
        })
    }
    
    registerBody(body) {
        if(Array.isArray(body)) {
            this.bodies = this.bodies.concat(body);    
        }else{
            this.bodies.push(body);
        }
    }
    
    addVector(vector) {
        if(Array.isArray(vector)) {
            this.vectors = this.vectors.concat(vector);
        }else{
            this.vectors.push(vector);
        }
    }
    
    addFriction(friction) { 
        this.friction = friction;
    }
    
    getVectorsSum() {
        var x = 0;
        var y = 0;
        
        this.vectors.forEach(function(vec){
            x += vec.vx;
        });
        
        this.vectors.forEach(function(vec){
            y += vec.vy;
        });
        
        return {vx:x, vy:y};
    }
    
    clearFriction() {
        this.friction = null;
    }
    
    clearVectors() {
        this.vectors = [];
    }
    
    walk(){
        this.removeDead();
        this.collideGroups();
        this.bodies.forEach((b)=>{
            this.applyFriction(b);
            this.applyVectors(b);
            this.update(b);
        });
    }
    
    removeDead() {
        for (var i in this.bodies) {
            if(!this.bodies[i].isAlive()) {
                this.bodies.splice(i, 1);
            }
        }
    }

    applyFriction(body) {
        var frx = 1;
        var fry = 1;
        
        if(this.friction) {
            frx = this.friction.fx;
            fry = this.friction.fy;
        }
        
        if(body.friction){
            frx = body.friction.fx;
            fry = body.friction.fy;
        } 
        
        body.speed_x *= frx;
        body.speed_y *= fry;
    }
     
    applyVectors(body) {
        var vecx = 0;
        var vecy = 0;
        
        (body.vectors.concat(this.vectors)).forEach((v)=>{
            vecx += v.vx;
            vecy += v.vy;
        });

        body.speed_x += vecx;
        body.speed_y += vecy;
    }

    update(body) {
        body.x += body.speed_x;
        body.y += body.speed_y;
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
        this.friction = null;
        
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
                    if(Array.isArray(callback)) {
                        callback.forEach((cb)=>{
                            cb(a, b);
                        });
                    }else{
                        callback(a, b);
                    }
                }
            }
        }
    }
    
    collideWithGroupB(callback, groupB){
        this.removeDead();
        if( ! groupB instanceof CollisionGroup ) {
            throw "groupB must be instance of CollisionGroup";
        }
        for (var i = 0; i <= this.colliders.length - 1; i++) {
            var a = this.colliders[i];
            for (var j = 0; j <= groupB.colliders.length - 1; j++) {
                var b = groupB.colliders[j];         
                if (a.collide(b)) {
                    if(Array.isArray(callback)) { 
                        callback.forEach((cb)=>{
                            cb(a, b);
                        });
                    }else {
                        callback(a, b);
                    }
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
        callback = callback || [];
        
        this.groupA = groupA;
        this.groupB = groupB;
        this.callback = Array.isArray(callback) ? callback : [callback];
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

function SquareBody(sqr) {
    var r = new Rect({
        x: 0,
        y: 0,
        width: sqr.width,
        height: sqr.height,
        color: sqr.color,
        visible: Boolean(sqr.visible)
    });

    return new Body({
        rect: r,
        x: sqr.x, 
        y: sqr.y
    })
}

export {Body, Rect, Friction, Vector, CollisionGroup, World, CollisionRegistration, SquareBody};
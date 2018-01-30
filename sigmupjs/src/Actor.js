class Actor{
    constructor(actorAttr) {
        this.x = actorAttr.x || 0;
        this.y = actorAttr.y || 0;
        
        this.width = actorAttr.width || 10;
        this.height = actorAttr.height || 10;
        
        this.speed_x = typeof (actorAttr.speed_x) === "undefined" ? 0 : actorAttr.speed_x ;
        this.speed_y = typeof (actorAttr.speed_y) === "undefined" ? 0 : actorAttr.speed_y;
        
        this.boundary = Boolean(actorAttr.boundary);

        this.frictionQueue = [];
        this.vectorQueue = [];
        
        var _live = true;
        this.isAlive = function() {
            return _live;
        }
        this.destroy = function() {
            _live = false;
        }
    }
    
    addFriction(fr) {
        this.frictionQueue.push(fr);
    }
    
    addVector(vec) {
        this.vectorQueue.push(vec);
    }
    
    clearVectorQueue() {
        this.vectorQueue = [];
    }

    clearFrictionQueue() {
        this.frictionQueue = [];
    }

    setSpeedX(sx) {
        this.speed_x = sx;
    }

    setSpeedY(sy) {
        this.speed_y = sy;
    }
}

class Square extends Actor{
    constructor(SquareAtr) {
        super(SquareAtr);
        this.color = SquareAtr.color;
    }
    
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

export default Actor;
export {Square};
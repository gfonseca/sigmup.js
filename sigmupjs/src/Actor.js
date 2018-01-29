class Actor{
    constructor(actorAttr) {
        this.x = actorAttr.x || 0;
        this.y = actorAttr.y || 0;
        
        this.width = actorAttr.width || 10;
        this.height = actorAttr.height || 10;
        
        var _live = true;
        this.isAlive = function() {
            return _live;
        }
        this.destroy = function() {
            _live = false;
        }
    }
}

class Square extends Actor{
    constructor(SquareAtr) {
      super(SquareAtr);
      this.color = SquareAtr.color;
      this.speed_x = typeof (SquareAtr.speed_x) == "undefined" ? 0 : SquareAtr.speed_x ;
      this.speed_y = typeof (SquareAtr.speed_y) == "undefined" ?  0 : SquareAtr.speed_y;
    }
  
    update() {
      
    }
  
    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

export default Actor;
export {Square};
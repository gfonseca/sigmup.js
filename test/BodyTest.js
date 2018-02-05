import {assert as assert}  from "chai";
import {Body, Rect, Vector, Friction} from "../sigmupjs/src/Dynamica";

const BOOL_CASES = [
    [true, true],
    [1, true],
    ["foo", true],
    [false, false],
    [0, false],
    [undefined, false],
    [null, false],
]

const BOOL_CASES_UNDEFINED_TRUE = [
    [true, true],
    [1, true],
    ["foo", true],
    [false, false],
    [0, false],
    [undefined, true],
    [null, false],
]

describe("Dynamica.Body", function (){
    describe("#constructor()", function(){
        it("it should define a value for Body.speed_x", function(){
            var b = new Body();
            assert.equal(b.speed_x, 0);
            
            var b = new Body({speed: 1});
            assert.equal(b.speed_x, 0);
            
            var b = new Body({speed_x: 10});
            assert.equal(b.speed_x, 10);
        });
        
        it("it should define a value for Body.speed_y", function(){
            var b = new Body();
            assert.equal(b.speed_y, 0);
            
            var b = new Body({speed: 1});
            assert.equal(b.speed_y, 0);
            
            var b = new Body({speed_y: 20});
            assert.equal(b.speed_y, 20);
        });
        
        it("it should define a default value for Body.mass", function(){
            var b = new Body()
            assert.equal(b.mass, 0);
            
            var b = new Body({mass: 100})
            assert.equal(b.mass, 100);
        });
        
        it("it should define a default value for Body.boundary", function(){
            var b = new Body();
            assert.equal(b.boundary, false);
            
            BOOL_CASES.forEach(function(c){
                var b = new Body({boundary: c[0]});
                assert.equal(b.boundary, c[1]);
            });
        });
        
        it("it should define a default value for Body.etheral", function(){
            var b = new Body();
            assert.equal(b.ethereal, false);            
            
            BOOL_CASES.forEach(function(c){
                var b = new Body({ethereal: c[0]});
                assert.equal(b.ethereal, c[1]);
            });
        });
        
        it("it should define a default value for Body.rect", function(){
            var b = new Body();
            assert.equal(Array.isArray(b.rects), true);
            assert.equal(b.rects[0] instanceof Rect, true);
            
            var b = new Body({rect: new Rect({x: 200})});
            assert.equal(b.rects[0].x, 200);
            
            var b = new Body({rect: [new Rect({x: 200})]});
            assert.equal(b.rects[0].x, 200);
        });
        
        it("it should define a default value for vector action in Body ", function(){
            var b = new Body();
            assert.equal(b.vectorInX, true);
            // assert.equal(b.vectorInY, true);
            // assert.equal(b.frictionInY, true);
            // assert.equal(b.frictionInY, true);
            
            BOOL_CASES_UNDEFINED_TRUE.forEach(function(c){                
                var b = new Body({vectorInX: c[0]});
                assert.equal(b.vectorInX, c[1]);
            });
            
            BOOL_CASES_UNDEFINED_TRUE.forEach(function(c){                
                var b = new Body({vectorInY: c[0]});
                assert.equal(b.vectorInY, c[1]);
            });
            
            BOOL_CASES_UNDEFINED_TRUE.forEach(function(c){                
                var b = new Body({frictionInX: c[0]});
                assert.equal(b.frictionInX, c[1]);
            });
            
            BOOL_CASES_UNDEFINED_TRUE.forEach(function(c){                
                var b = new Body({frictionInY: c[0]});
                assert.equal(b.frictionInY, c[1]);
            });
        });
        
        it("it should define a default value for Body.vectors", function(){
            var b = new Body();
            assert.equal(Array.isArray(b.vectors), true);
            assert.equal(b.vectors.length, 0);
            
            var b = new Body({vectors: new Vector()});
            assert.equal(b.vectors[0] instanceof Vector, true);
            
            var b = new Body({vectors: [new Vector()]});
            assert.equal(b.vectors[0] instanceof Vector, true);
        });
        
        it("it should define a default value for Body.friction", function(){
            var b = new Body({friction: new Friction({fx:0.5})});
            assert.equal(b.friction.fx , 0.5, "Friction is not being setted properly in Body");
            assert.ok(b.friction instanceof Friction,  "Friction is not being setted properly in Body");
        });
        
        it("it should define a default value for Body.live", function(){
            var b = new Body();
            assert.ok(b.live, "Default value for Body.live must be true");
        });
        
        
    });
    
    describe("#addVector()", function(){
        it("it should add a vector to the vector list", function(){
            var b = new Body();
            b.addVector(new Vector());
            assert.equal(b.vectors.length, 1, "Failed to add a Vector.");
            
            b.addVector(new Vector());
            assert.equal(b.vectors.length, 2, "Failed to add a Vector.");
        });
    });
    
    describe("#clearVector()", function(){
        it("it should clear the vector list", function(){
            var b = new Body();
            assert.equal(b.vectors.length, 0);        
            b.addVector(new Vector());
            assert.equal(b.vectors.length, 1);     
            b.clearVectors();
            assert.equal(b.vectors.length, 0, "Failed to clar Vector list.");        
        });
    });
    
    describe("#clearFriction()", function(){
        it("it should a default friction", function(){
            var b = new Body({friction: new Friction({fx: 0.5, fy: 0.2})});
            assert.equal(b.friction.fx, 0.5);
            b.clearFriction();
            assert.equal(b.friction.fx, 1, "Failed set the default Friction");
            assert.equal(b.friction.fy, 1, "Failed set the default Friction");
        });
    });
    
    describe("#setSpeedX()", function(){
        it("it should define a speed for Body.speed_x ", function(){
            var b = new Body();
            assert.equal(b.speed_x, 0);
            b.setSpeedX(16);
            assert.equal(b.speed_x, 16, "Failed to set speed_x");
            
        });
    });
    
    describe("#collide()", function(){
        it("it should return if a body is colliding with another", function(){
            var a = new Body({rect: new Rect({width: 100, height:100})});
            var b = new Body({rect: new Rect({width: 100, height: 100})});
            
            assert.ok(a.collide(b), "State colliding wrong return");
            
            b.x = 150;
            
            assert.notOk(a.collide(b), "State not colliding wrong return");
            
            b.setRects([
                new Rect({x: 10, y: 10}),
                new Rect({x: -51, y: 20})
            ])
            
            assert.ok(a.collide(b), "State not colliding wrong return. rect B 2 squares");            
        });
    });
    
    describe("#setXY()", function(){
        it("it should return if a body is colliding with another", function(){
            var b = new Body();
            assert.equal(b.x, 0);
            
            b.setXY({x: 10});
            assert.equal(b.x, 10, "b.x must be 10 wrong value.");
        
            b.setXY({y: 20});
            assert.equal(b.y, 20, "b.y must be 20 wrong value.");
            
            b.setXY();
            assert.equal(b.x, 10, "b.x must be 10 wrong value.");
        });
    });
});
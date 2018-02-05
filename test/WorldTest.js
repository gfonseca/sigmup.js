import {assert as assert}  from "chai";
import {Body, World, Vector, Friction, CollisionRegistration} from "../sigmupjs/src/Dynamica";

describe("Dynamica.World", function (){
    describe("#registerCollision()", function(){
        it("it should register groups for check collision.", function(){

        });
    });

    describe("#update()", function(){
        it("it should reduce the movment of body through Body.friction", function(){
            var frc = new Friction({fx: 0.7});
            var b = new Body({friction: frc, speed_x: 10});
            var w = new World({friction: new Friction({fx: 0.2})});
            
            w.update(b);
            assert.equal(b.x, 7);
        });

        it("it should reduce the movmen of body through World.friction", function(){
            var frc = new Friction({fx: 0.2});
            var b = new Body({speed_x: 10});
            var w = new World({friction:frc});
            
            w.update(b);
            assert.equal(b.x, 2);
        });
    });
});
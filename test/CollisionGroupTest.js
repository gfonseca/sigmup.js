import {CollisionGroup, Body} from "../sigmupjs/src/Dynamica";
import {assert} from "chai";

describe("Dynamica.CollisionGroup", function(){
    describe("#constructor()", function(){
        it("it shoud set default value for CollisionGroup.colliders.", function(){
            var g = new CollisionGroup();
            assert.equal(g.colliders.length, 0, "CollisionGroup.colliders must be an empty list by default.");
            
            var g = new CollisionGroup(new Body);
            assert.equal(g.colliders.length, 1, "CollisionGroup.colliders must have 1 element.");
            
            var g = new CollisionGroup([new Body(), new Body()]);
            assert.equal(g.colliders.length, 2, "CollisionGroup.colliders must have 2 elements.");
        });
    });    
    
    describe("#addCollider()", function(){
        it("It should add a collider to the CollisionGroup.", function(){
            var g = new CollisionGroup();
            
            g.addCollider(new Body());
            assert.equal(g.colliders.length, 1);
            
            g.addCollider(new Body());
            assert.equal(g.colliders.length, 2);
        });
    });
    
    describe("#selfCollide()", function(){
        it("It should call the callbackfunction with the due colliders.", function(){
            var ba = new Body({x: 0, y: 0});
            var bb = new Body({x: 5, y: 5});
            var bc = new Body({x: 12, y: 12});
            
            var g = new CollisionGroup([
                ba,
                bb
            ]);
            
            g.selfCollide(function(a, b){
                b.speed_x = 123;
            });
            
            assert.equal(bb.speed_x, 123);
            
            g.addCollider(bc);
            g.selfCollide(function(a, b){
                b.speed_x = 222;
            });
            
            assert.equal(bc.speed_x, 222);
        });
    });
    
    describe("#collideWithGroupB()", function(){
        it("It check the collision between group A and B.", function(){
            var collisionCount = 0;
            
            var a1 = new Body({x: 0, y: 0});
            var a2 = new Body({x: 5, y: 5});
            var a3 = new Body({x: 12, y: 12});
            
            var b1 = new Body({x: 0, y: 0});
            var b2 = new Body({x: 5, y: 5});
            var b3 = new Body({x: 12, y: 12});
            
            var ga = new CollisionGroup([a1, a2, a3]);
            var gb = new CollisionGroup([b1, b2, b3]);
            
            ga.collideWithGroupB((a, b) => {
                collisionCount += 1;
            }, gb)
            
            assert.equal(collisionCount, 7);
        });
    });
    
    describe("#removeDead()", function(){
        it("It should remove the dead bodies.", function(){
            var b1 = new Body({x: 0, y: 0});
            var b2 = new Body({x: 5, y: 5});
            var b3 = new Body({x: 12, y: 12});
            
            var g = new CollisionGroup([b1, b2, b3]);
            b1.destroy();
            g.removeDead();
            assert.equal(g.colliders.length, 2);
            b2.destroy();
            g.removeDead();
            assert.equal(g.colliders.length, 1);
        });
    });
});
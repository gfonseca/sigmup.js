import {World, Body, Vector, Friction, CollisionRegistration, CollisionGroup} from "../sigmupjs/src/Dynamica";
import {assert} from "chai";

describe("Dynamica.World", function(){
    describe("#registerBodies()", function(){
        it("it should register a body to be update.", function(){
            var w = new World();
            assert.equal(w.bodies.length, 0);
            
            w.registerBody(new Body());
            assert.equal(w.bodies.length, 1, "World.body count expected 1");
            
            w.registerBody([new Body(), new Body()]);
            assert.equal(w.bodies.length, 3, "World.body count expected 3");
        });
    });
    
    describe("#addVector()", function(){
        it("it should register a vector to be applyied.", function(){
            var w = new World();
            assert.equal(w.vectors.length, 0, "World.vectors count expected 0");
            
            w.addVector(new Vector());
            assert.equal(w.vectors.length, 1, "World.vectors count expected 1");
            
            w.addVector([new Vector(), new Vector()]);
            assert.equal(w.vectors.length, 3, "World.vectors count expected 3");
        });
    });
    
    describe("#applyFriction()", function(){
        it("it should register a friction to be applyied.", function(){
            var w = new World();
            assert.equal(w.friction, null, "World.friction must start as null");
            
            w.addFriction(new Friction());
            assert.ok(w.friction instanceof Friction, "World.friction must be instance of Friction");
        });
    });
    
    describe("#getVectorsSum()", function(){
        it("it should return the sum of  World.vectors applied in body.x and body.y .", function(){
            var w = new World({vectors: [
                new Vector({vx:1, vy:2}),
                new Vector({vx:1, vy:2}),
                new Vector({vx:1, vy:2}),
            ]});
            assert.equal(w.getVectorsSum().vx, 3, "The expected sum of vectors x is 3");
            assert.equal(w.getVectorsSum().vy, 6, "The expected sum of vectors y is 6");
        });
    });
    
    describe("#clearVectors()", function(){
        it("it should clear the World.vectors array.", function(){
            var w = new World({vectors: [
                new Vector({vx:1, vy:2}),
                new Vector({vx:1, vy:2}),
                new Vector({vx:1, vy:2}),
            ]});
            
            assert.equal(w.vectors.length, 3, "The case must start with 3 vectors");
            w.clearVectors();
            assert.equal(w.vectors.length, 0, "The clearVectors() method should set the World.vectors to a empty array.");
        });
    });
    
    describe("#clearFriction()", function(){
        it("it should set World.friction to null.", function(){
            var w = new World({friction: new Friction()});
            
            assert.ok(w.friction instanceof Friction, "The case must start with Friction setted.");
            w.clearFriction();
            assert.ok(w.friction === null, "The clearFriction() method should set the world.friction to null.");
        });
    });
    describe("#colideGroups()", function(){
        it("it should accept a list of callbacks.", function(){
            var bodyA = new Body({x: 0, y: 0});
            var bodyB = new Body({x: 0, y: 0});
            
            var groupA = new CollisionGroup([bodyA, bodyB]);
            
            var checkCollisionA = false;
            var checkCollisionB = false;
            
            var w = new World();
            w.registerCollision([
                (a, b)=>{
                    checkCollisionA = true;
                },
                (a, b)=>{
                    checkCollisionB = true;
                }
            ], groupA);

            w.collideGroups();
            assert.ok(checkCollisionA);
            assert.ok(checkCollisionB);
        });
        
        it("it should check collisions between groups.", function(){
            var bodyA = new Body({x: 0, y: 0});
            var bodyB = new Body({x: 100, y: 100});
            
            var groupA = new CollisionGroup(bodyA);
            var groupB = new CollisionGroup(bodyB);
            
            var checkCollision = false;
            
            var w = new World();
            
            w.registerCollision(()=>{
                checkCollision = true;
            }, groupA, groupB);
            
            
            w.collideGroups();
            assert.notOk(checkCollision);
            
            bodyB.x = 0;
            bodyB.y = 0;
            w.collideGroups();
            assert.ok(checkCollision);
            
        });
    });
    describe("#registerCollision()", function(){
        it("it should register groups for check collision.", function(){
            var w = new World();
            
            w.registerCollision(()=>{}, "GroupA", "GroupB");
            assert.equal(w.collisionRegistrations.length, 1);
            
            assert.ok(w.collisionRegistrations[0] instanceof CollisionRegistration);

            w.registerCollision(()=>{}, "GroupA", "GroupB");
            assert.equal(w.collisionRegistrations.length, 2)
        });
    });
    
    describe("#applyVectors()", function(){
        it("it should update Body.speed_x in World.vectors and Body.vectors.", function(){
            var w = new World({vectors: new Vector({vx: 1}) });
            var b = new Body({vectors: new Vector({vx: 2}) });
            
            w.applyVectors(b);
            assert.equal(b.speed_x, 3, "Error adding boxy.x 3 pixels.");
            
            w.applyVectors(b);
            assert.equal(b.speed_x, 6, "Error adding boxy.x 3 pixels.");
            
            w.applyVectors(b);
            assert.equal(b.speed_x, 9, "Error adding boxy.x 3 pixels.");
        });
        
        it("it should update Body.speed_y by World.vectors.", function(){
            var b = new Body();
            var w = new World({vectors: new Vector({vy: 1})});
            
            w.applyVectors(b);
            assert.equal(b.speed_y, 1, "Error adding body.speed_y");
            
            var w = new World({vectors: [new Vector({vy: 1}), new Vector({vy: 3})]});
            var b = new Body();
            w.applyVectors(b);
            assert.equal(b.speed_y, 4, "Error adding body.y 4 pixels");
        });
        
        it("it should update Body.speed_x through Body.vectors.", function(){
            var b = new Body({vectors: new Vector({vx:1, vy:1})});
            var w = new World();
            
            w.applyVectors(b);
            assert.equal(b.speed_x, 1, "Error adding body.speed_x");
            
            var b = new Body({vectors: new Vector({vx:4, vy:1})});
            var w = new World();
            
            w.applyVectors(b);
            assert.equal(b.speed_x, 4, "Error adding body.speed_x");
            
            w.applyVectors(b);
            assert.equal(b.speed_y, 2, "Error adding body.speed_y");
        });
    });

    describe("#applyVectors()", function(){
        it("it should calculate new Body.x applying World.friction",function(){
            var b = new Body({speed_x: 10});
            var w = new World({friction: new Friction({fx: 0.5})});
            
            w.applyFriction(b);
            assert.equal(b.speed_x, 5, "Error applying friction, expected value for Body.x is 5")
        });
        
        it("it should reduce the movment of body through Body.friction", function(){
            var frc = new Friction({fx: 0.7});
            var b = new Body({friction: frc, speed_x: 10});
            var w = new World({friction: new Friction({fx: 0.2})});
            
            w.applyFriction(b);
            assert.equal(b.speed_x, 7);
        });
        
        it("it should reduce the movmen of body through World.friction", function(){
            var frc = new Friction({fx: 0.2});
            var b = new Body({speed_x: 10});
            var w = new World({friction:frc});
            
            w.applyFriction(b);
            assert.equal(b.speed_x, 2);
        });
    });
});
import {assert as assert}  from "chai";
import {Rect}  from '../sigmupjs/src/Dynamica';

describe('Dynamica.Rect', function() {
  describe('#constructor()', function() {
    it('it shoud define a value for Rect.x', function() {
      var r = new Rect();
      assert.equal(r.x, 0);
      
      var r = new Rect({y: 3});
      assert.equal(r.x, 0);
      
      var r = new Rect({x: 3});
      assert.equal(r.x, 3);
      
      var r = new Rect({x: "10"});
      assert.equal(r.x, 10);
    });
    
    it('it shoud define a default value for Rect.y', function() {
      var r = new Rect();
      assert.equal(r.y, 0);
      
      var r = new Rect({x: 3});
      assert.equal(r.y, 0);
      
      var r = new Rect({y: 3});
      assert.equal(r.y, 3);
    });
    
    it("it shoud define a default value for Rect.width", function(){
      var r = new Rect();
      assert.equal(r.width, 10);
      
      var r = new Rect({x: 3});
      assert.equal(r.width, 10);
      
      var r = new Rect({width: 30});
      assert.equal(r.width, 30);
    });
    
    it("it shoud define a default value for Rect.height", function(){
      var r = new Rect();
      assert.equal(r.height, 10)
      
      var r = new Rect({width: 30});
      assert.equal(r.height, 10)
      
      var r = new Rect({height: 30});
      assert.equal(r.height, 30)
    });
    
    it("it shoud define a default value for Rect.visibility", function(){
      var r = new Rect();
      assert.equal(r.visible, false);
      
      var r = new Rect({x: 10});
      assert.equal(r.visible, false);
      
      var r = new Rect({visible: true});
      assert.equal(r.visible, true);
      
      var r = new Rect({visible: 1});
      assert.equal(r.visible, true);
      
      var r = new Rect({visible: "h"});
      assert.equal(r.visible, true);
    });
  });
  
  describe('#show(), #hide()', function() {
    it("it shoud change Rect.visible", function(){
      var r = new Rect();
      assert.equal(r.visible, false);
      
      r.show();
      assert.equal(r.visible, true);
      
      r.hide();
      assert.equal(r.visible, false);
      
    });
  });
  
  describe('#isVisible()', function() {
    it("it shoud return the value of Rect.visible", function(){
      var r = new Rect();
      
      assert.equal(r.isVisible(), false);
      
      r.show();
      assert.equal(r.isVisible(), true);
    });
  });
});
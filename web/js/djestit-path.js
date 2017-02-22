/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global THREE */

(function (djestit, undefined) {
    djestit.PathInside = 0;
    djestit.PathOutside = -1;

    var Point2D = function (x, y) {
        this.x  = x;
        this.y = y;
    };
    
    djestit.Point2D = Point2D;

    var Line2D = function (a, b, distance) {

        var p1 = new THREE.Vector3(a.x, a.y, 0);
        var p2 = new THREE.Vector3(b.x, b.y, 0);
        var checker = new LineChecker(p1, p2, distance);
        
        this.init = function(){
            checker.reset();
        };
        
        this.check = function(x,y){
            return checker.check(new THREE.Vector3(x, y, 0));
        };
        
       
    };
    djestit.Line2D = Line2D;

    var LineChecker = function (a, b, distance) {
        var line;
        var max = distance;
        var d = new THREE.Line3(0, 0, 0);
        var p = new THREE.Vector3(0, 0, 0);
        this.state = djestit.PathBegin;
        if (a instanceof THREE.Vector3 && b instanceof THREE.Vector3) {
            line = new THREE.Line3(a, b);
        }
        
        this.check = function (current) {
            line.closestPointToPoint(current, true, p);
            d.start = p;
            d.end = current;
            var l = d.distance();
            if(l < max){
                this.state = djestit.PathInside;
            }else{
                this.state = djestit.PathOutside;
            }
            return this.state;
        };
        
        this.reset = function(){
            this.state = djestit.PathBegin;
        };

    };
}(window.djestit = window.djestit || {}, undefined));
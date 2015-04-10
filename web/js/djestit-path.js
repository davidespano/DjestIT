/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global THREE */

(function (djestit, undefined) {
    var _START = 0;
    var _END = 1;
    var _PERFORMING = 2;
    var _ERROR = 3;

    var Point2D = function (x, y) {

    };

    var Line2D = function (points) {

        // check for an array of points
        points instanceof Array ? this.children = points : this.children = [];
        var checker = new LineChecker();
        
        

    };
    djestit.Line2D = Line2D;

    var LineChecker = function (a, b, distance) {
        var line;
        var max = distance;
        var d = new THREE.Line3(0, 0, 0);
        var p = new THREE.Vector3(0, 0, 0);
        this.state = _START;
        if (a instanceof THREE.Vector3 && b instanceof THREE.Vector3) {
            line = new THREE.Line3(a, b);
        }


        this.check = function (current) {
            line.closestPointToPoint(current, true, p);
            d.start = p;
            d.end = current;
            var l = d.distance();
            switch (this.state) {
                case _START:
                    if (l > max) {
                        this.state = _ERROR;
                    } else {
                        this.state = _PERFORMING;
                    }
                    break;
                case _PERFORMING:
                    if (l > max) {
                        this.state = _END;
                    } else {
                        this.state = _PERFORMING;
                    }
                    break;
                case _END:
                    this.state = _ERROR;
                    break;
                default:
                    this.state = _ERROR;
                    break;
            }
            return this.state;
        };
        
        this.reset = function(){
            this.state = _START;
        };

    };
}(window.djestit = window.djestit || {}, undefined));
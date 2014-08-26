/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function GestureAnimator(config) {

    this.config = config;



    this.render = function() {

    };

    this.helpMesh = new THREE.Mesh();

    GestureAnimator.prototype.requestAnimation = function(duration, position, complete) {
        var self = this;
        var _requestAnimation = function(duration, position, onComplete) {
            var _position = function() {
            };
            switch (position) {
                case "right-swipe" :
                    _position = self.rightSwipe;
                    break;
                case "left-swipe" :
                    _position = self.leftSwipe;
                    break;
                case "triangle":
                    _position = self.triangle;
                    break;
                case "x":
                    _position = self.x;
                    break;
                case "rectangle":
                    _position = self.rectangle;
                    break;
                case "circle":
                    _position = self.circle;
                    break;
                case "check":
                    _position = self.check;
                    break;
                case "caret":
                    _position = self.caret;
                    break;
                case "square-braket-left":
                    _position = self.squareBracketLeft;
                    break;
                case "square-braket-right":
                    _position = self.squareBracketRight;
                    break;
                case "v":
                    _position = self.v;
                    break;
                case "pigtail":
                    _position = self.pigtail;
                    duration = pigtailPoints.length;
                    break;
                case "curly-braket-left":
                    _position = self.curlyBracketLeft;
                    duration = leftCurlyPoints.length;
                    break;
                case "curly-braket-right":
                    _position = self.curlyBracketRight;
                    duration = leftCurlyPoints.length;
                    break;
                case "star":
                    _position = self.star;
                    break;
            }

            var _complete = onComplete;
            var pause = 60;
            var i = duration + pause;
            window.requestAnimationFrame(frame);

            function frame() {
                if (i > pause) {
                    var pt = new THREE.Mesh(new THREE.SphereGeometry(4),
                            new THREE.MeshPhongMaterial());
                    pt.material.color.setHex(0xff0000);
                    pt.position.fromArray(_position(duration - i + pause, duration));
                    self.helpMesh.add(pt);
                    self.render();

                }

                if (i === 0) {
                    while (self.helpMesh.children.length > 0) {
                        self.helpMesh.remove(self.helpMesh.children[0]);
                    }
                    self.render();
                    if (_complete) {
                        _complete();
                    }
                    return;
                }

                i--;
                window.requestAnimationFrame(frame);

            }
        };

        return _requestAnimation(duration, position, complete);
    };




    GestureAnimator.prototype.circle = function(i) {
        var r = 150;
        var alpha = (2 * Math.PI / 75) * i;
        var point = [];
        point[0] = Math.cos(alpha) * r;
        point[1] = Math.sin(alpha) * r + config.translateY;
        point[2] = 0;
        return point;
    };

    GestureAnimator.prototype.leftSwipe = function(i) {
        var point = [];
        point[0] = 250 - i * 10;
        point[1] = config.translateY;
        point[2] = 0;
        return point;

    };

    GestureAnimator.prototype.rightSwipe = function(i) {
        var point = [];
        point[0] = -250 + i * 10;
        point[1] = config.translateY;
        point[2] = 0;
        return point;
    };

    GestureAnimator.prototype.triangle = function(i, max) {
        var scale = 400;
        var point = [];

        var n = 1.0 * max / 3.0;
        var l = 2 * Math.cos(Math.PI / 3);
        var h = Math.sin(Math.PI / 3);
        var m1 = Math.tan(Math.PI / 3);
        var m2 = Math.tan(2 * Math.PI / 3);


        if (i <= n) {

            point[0] = -(l / (2 * n)) * i;
            point[1] = (point[0] * m1 + h) * scale;
            point[2] = 0;
            point[0] = point[0] * scale;
        }

        if (i > n && i <= 2 * n) {
            point[0] = (-(l / 2) + (l / n) * (i - n)) * scale;
            point[1] = 0;
            point[2] = 0;
        }

        if (i > 2 * n && i <= 3 * n) {
            point[0] = (l / 2) - ((i - 2 * n) * l / (2 * n));
            point[1] = (point[0] * m2 + h) * scale;
            point[2] = 0;
            point[0] = point[0] * scale;
        }
        return point;
    };

    GestureAnimator.prototype.x = function(i, max) {
        var scale = 400;
        var point = [];

        var n = 1.0 * max / 3.0;
        var l = Math.cos(Math.PI / 4);

        var m1 = Math.tan(Math.PI / 4);
        var m2 = Math.tan(3 * Math.PI / 4);
        if (i <= n) {
            point[0] = -(l / 2) + i * (l / n);
            point[1] = (point[0] * m1 + l / 2) * scale;
            point[2] = 0;
            point[0] = point[0] * scale;
        }

        if (i > n && i <= 2 * n) {
            point[0] = (l / 2);
            point[1] = (l - ((i - n) * (l / n))) * scale;
            point[2] = 0;
            point[0] = point[0] * scale;
        }

        if (i > 2 * n && i <= 3 * n) {
            point[0] = (l / 2) - (i - 2 * n) * (l / n);
            point[1] = (point[0] * m2 + l / 2) * scale;
            point[2] = 0;
            point[0] = point[0] * scale;
        }

        return point;
    };

    GestureAnimator.prototype.check = function(i, max) {
        var scale = 100;
        var point = [];

        var n = 1.0 * max / 3.0;
        var h = Math.sin(Math.PI / 3);
        var l = 2 * Math.cos(Math.PI / 3);
        var m1 = Math.tan(2 * Math.PI / 3);
        var m2 = Math.tan(Math.PI / 3);

        if (i <= n) {
            point[0] = -l / 2 + i * (l / (2 * n));
            point[1] = (point[0] * m1) * scale;
            point[2] = 0;
            point[0] = point[0] * scale;
        }

        if (i > n && i <= 3 * n) {
            point[0] = (i - n) * l / n;
            point[1] = (point[0] * m2) * scale;
            point[2] = 0;
            point[0] = point[0] * scale;
        }

        return point;
    };

    GestureAnimator.prototype.rectangle = function(i, max) {
        var scale = 200;
        var n = max / 4;
        var point = [];
        var lm = 1;
        var lM = 2;

        if (i <= n) {
            point[0] = -lM / 2 * scale;
            point[1] = (lm / 2 - i * lm / n) * scale + config.translateY;
            point[2] = 0;
        }

        if (i > n && i <= 2 * n) {
            point[0] = (-lM / 2 + (i - n) * lM / n) * scale;
            point[1] = -lm / 2 * scale + config.translateY;
            point[2] = 0;
        }

        if (i > 2 * n && i <= 3 * n) {
            point[0] = lM / 2 * scale;
            point[1] = (-lm / 2 + (i - 2 * n) * lm / n) * scale + config.translateY;
            point[2] = 0;
        }

        if (i > 3 * n && i <= 4 * n) {
            point[0] = (lM / 2 - (i - 3 * n) * lM / n) * scale;
            point[1] = lm / 2 * scale + config.translateY;
            point[2] = 0;
        }

        return point;
    };

    GestureAnimator.prototype.caret = function(i, max) {
        var scale = 200;
        var point = [];

        var n = 1.0 * max / 2.0;
        var l = 2 * Math.cos(Math.PI / 3);
        var h = Math.sin(Math.PI / 3);
        var m1 = Math.tan(Math.PI / 3);
        var m2 = Math.tan(2 * Math.PI / 3);


        if (i <= n) {

            point[0] = -l / 2 + i * l / (2 * n);
            point[1] = (point[0] * m1 + h) * scale + config.translateY / 2;
            point[2] = 0;
            point[0] = point[0] * scale;
        }

        if (i > n && i <= 2 * n) {
            point[0] = l / (2 * n) * (i - n);
            point[1] = (point[0] * m2 + h) * scale + config.translateY / 2;
            point[2] = 0;
            point[0] = point[0] * scale;
        }


        return point;
    };



    GestureAnimator.prototype.squareBracketLeft = function(i, max) {
        var scale = 100;
        var point = [];

        var lm = 1;
        var lM = 3;
        var n = 1.0 * max / 4.0;

        if (i < n) {
            point[0] = (-i * lm / n) * scale;
            point[1] = (lM / 2) * scale + config.translateY;
            point[2] = 0;
        }

        if (i > n && i <= 3 * n) {
            point[0] = -lm * scale;
            point[1] = (lM / 2.0 - (lM / (2 * n) * (i - n))) * scale + config.translateY;
            point[2] = 0;
        }

        if (i >= 3 * n) {
            point[0] = (-lm + (i - 3 * n) * lm / n) * scale;
            point[1] = (-lM / 2) * scale + config.translateY;
            point[2] = 0;
        }

        return point;

    };

    GestureAnimator.prototype.squareBracketRight = function(i, max) {
        var scale = 100;
        var point = [];

        var lm = 1;
        var lM = 3;
        var n = 1.0 * max / 4.0;

        if (i <= n) {
            point[0] = (i * lm / n) * scale;
            point[1] = (lM / 2) * scale + config.translateY;
            point[2] = 0;
        }

        if (i > n && i <= 3 * n) {
            point[0] = lm * scale;
            point[1] = (lM / 2.0 - (lM / (2 * n) * (i - n))) * scale + config.translateY;
            point[2] = 0;
        }

        if (i > 3 * n + 1) {
            point[0] = (lm - (i - 3 * n) * lm / n) * scale;
            point[1] = (-lM / 2) * scale + config.translateY;
            point[2] = 0;
        }

        return point;

    };

    GestureAnimator.prototype.v = function(i, max) {
        var scale = 200;
        var point = [];

        var n = 1.0 * max / 2.0;
        var l = 2 * Math.cos(Math.PI / 3);
        var m1 = Math.tan(Math.PI / 3);
        var m2 = Math.tan(2 * Math.PI / 3);


        if (i <= n) {

            point[0] = -l / 2 + i * l / (2 * n);
            point[1] = (point[0] * m2) * scale + config.translateY / 2;
            point[2] = 0;
            point[0] = point[0] * scale;
        }

        if (i > n && i <= 2 * n) {
            point[0] = l / (2 * n) * (i - n);
            point[1] = (point[0] * m1) * scale + config.translateY / 2;
            point[2] = 0;
            point[0] = point[0] * scale;
        }


        return point;
    };

    var pigtailPoints = [
        /*   0*/ [384.58915000, 449.32557262, 0],
        /*   1*/ [388.86394000, 449.18005262, 0],
        /*   2*/ [392.43160000, 449.25305262, 0],
        /*   3*/ [396.34119000, 449.58054262, 0],
        /*   4*/ [400.84800000, 450.32800262, 0],
        /*   5*/ [404.56411000, 451.09180262, 0],
        /*   6*/ [408.82886000, 452.35899262, 0],
        /*   7*/ [412.98236000, 453.94942262, 0],
        /*   8*/ [416.98978000, 455.86154262, 0],
        /*   9*/ [420.81624000, 458.09376262, 0],
        /*  10*/ [424.42688000, 460.64453262, 0],
        /*  11*/ [427.78684000, 463.51226262, 0],
        /*  12*/ [430.05768000, 465.71325262, 0],
        /*  13*/ [434.22076000, 471.12806262, 0],
        /*  14*/ [436.30879000, 474.54487262, 0],
        /*  15*/ [437.95378000, 477.89625262, 0],
        /*  16*/ [440.05677000, 484.20014262, 0],
        /*  17*/ [441.04122000, 490.77588262, 0],
        /*  18*/ [441.04092000, 495.20795262, 0],
        /*  19*/ [440.49237000, 499.60504262, 0],
        /*  20*/ [438.98870000, 504.79224262, 0],
        /*  21*/ [435.84306000, 509.93044262, 0],
        /*  22*/ [431.57462000, 513.17050262, 0],
        /*  23*/ [428.09684000, 513.87729262, 0],
        /*  24*/ [423.87613000, 513.81699262, 0],
        /*  25*/ [419.67556000, 511.59816262, 0],
        /*  26*/ [415.74374000, 506.64718262, 0],
        /*  27*/ [413.73323000, 500.71375262, 0],
        /*  28*/ [413.48533000, 495.82254262, 0],
        /*  29*/ [414.06184000, 489.13930262, 0],
        /*  30*/ [415.74305000, 482.64101262, 0],
        /*  31*/ [418.42486000, 476.47075262, 0],
        /*  32*/ [422.00315000, 470.77163262, 0],
        /*  33*/ [426.35830000, 465.66177262, 0],
        /*  34*/ [428.78639000, 463.34103262, 0],
        /*  35*/ [431.36195000, 461.18056262, 0],
        /*  36*/ [434.07034000, 459.18350262, 0],
        /*  37*/ [436.89690000, 457.35296262, 0],
        /*  38*/ [442.84596000, 454.20393262, 0],
        /*  39*/ [450.00958000, 451.45963262, 0],
        /*  40*/ [457.46106000, 449.63432262, 0],
        /*  41*/ [465.08164000, 448.74935262, 0],
        /*  42*/ [472.75254000, 448.82605262, 0]
    ];

    GestureAnimator.prototype.pigtail = function(i) {
        var point = [];
        var scale = 2.8;
        point[0] = (pigtailPoints[i][0] - 450) * scale;
        point[1] = (pigtailPoints[i][1] - 420) * scale;
        point[2] = pigtailPoints[i][2] * scale;

        return point;
    };

    var leftCurlyPoints = [
        /*   0*/ [408.10163000, 711.14739262, 0],
        /*   1*/ [399.01026000, 700.03571262, 0],
        /*   2*/ [394.96965000, 679.83266262, 0],
        /*   3*/ [394.71711000, 665.69053262, 0],
        /*   4*/ [394.46457000, 651.54839262, 0],
        /*   5*/ [394.21203000, 637.40626262, 0],
        /*   6*/ [393.95949000, 623.26412262, 0],
        /*   7*/ [393.95949000, 603.06107262, 0],
        /*   8*/ [386.88842000, 586.89863262, 0],
        /*   9*/ [394.46457000, 571.24126262, 0],
        /*  10*/ [395.22218000, 546.36626262, 0],
        /*  11*/ [394.46457000, 524.52171262, 0],
        /*  12*/ [394.71711000, 502.67716262, 0],
        /*  13*/ [394.46457000, 483.35799262, 0],
        /*  14*/ [398.00010000, 469.21585262, 0],
        /*  15*/ [407.09148000, 459.11433262, 0]
    ];

    GestureAnimator.prototype.curlyBracketLeft = function(i) {

        var point = [];
        var scale = 1;
        point[0] = (leftCurlyPoints[i][0] - 450) * scale;
        point[1] = (leftCurlyPoints[i][1] - 350) * scale;
        point[2] = leftCurlyPoints[i][2] * scale;

        return point;
    };

    GestureAnimator.prototype.curlyBracketRight = function(i) {

        var point = [];
        var scale = 1;
        point[0] = -1.0 * (leftCurlyPoints[i][0] - 450) * scale;
        point[1] = (leftCurlyPoints[i][1] - 350) * scale;
        point[2] = leftCurlyPoints[i][2] * scale;

        return point;
    };

    GestureAnimator.prototype.star = function(i, max) {
        var scale = 375;
        var point = [];

        var n = 1.0 * max / 5.0;

        // I'll draw a golden pentagram
        var l3 = Math.sin(1.26);

        // the variables names are explained here
        // http://mathworld.wolfram.com/Pentagram.html
        var x = 0.309017;
        var R = 0.200811;
        var a = 0.381966;
        var b = 0.236068;
        var r = 0.16246;
        var rho = 0.525731;
        
        var m1 = Math.tan(1.257); // 72
        var m2 = Math.tan(1.885); // 104
        var m3 = Math.tan(2.51);  // 144
        var m4 = Math.tan(0.628); // 36
        var j = 0;

        if (i < n) {

            point[0] = -x + x / n * i;
            point[1] = (point[0] * m1 + rho) * scale + config.translateY;
            point[2] = 0;
            point[0] = point[0] * scale;
        }

        if (i >= n && i < 2 * n) {
            j = i - n + 1;
            point[0] = j * x / n;
            point[1] = (point[0] * m2 + rho) * scale + config.translateY;
            point[2] = 0;
            point[0] = point[0] * scale;
        }

        if (i >= 2 * n && i < 3 * n) {
            j = i - 2 * n + 1;
            point[0] = x - j * ((x + 0.5) / n);
            point[1] = (point[0] * m3 - R) * scale + config.translateY;
            point[2] = 0;
            point[0] = point[0] * scale;
        }

        if (i >= 3 * n &&  i < 4 * n) {
            j = i - 3 * n;
            point[0] = -a - 0.5 * b + j * (1 / n);
            point[1] = r * scale + config.translateY;
            point[2] = 0;
            point[0] = point[0] * scale;
        }
        
        if( i >= 4 * n && i < 5 * n){
            j = i - 4 * n;
            point[0] = 0.5 - j * ((x + 0.5) / n);
            point[1] = (point[0] * m4 - R) * scale + config.translateY;
            point[2] = 0;
            point[0] = point[0] * scale;    
        }

        return point;
    };
}


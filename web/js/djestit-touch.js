/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function(djestit, undefined) {

    var _TOUCHSTART = 1;
    var _TOUCHMOVE = 2;
    var _TOUCHEND = 3;



    var TouchToken = function(touch, type) {
        this.clientX = touch.clientX;
        this.clientY = touch.clientY;
        this.pageX = touch.pageX;
        this.pageY = touch.pageY;
        this.screenX = touch.screenX;
        this.screenY = touch.screenY;
        this.target = touch.target;
        this.id = touch.identifier;
        this.type = type;
    };
    TouchToken.prototype = new djestit.Token();
    djestit.TouchToken = TouchToken;

    var TouchStart = function(id) {
        this.init();
        this.id = id;

        this._accepts = function(token) {
            if (token.type !== _TOUCHSTART) {
                return false;
            }
            if (this.id && this.id !== null && this.id !== token.id) {
                return false;
            }
            return true;
        };
    };
    TouchStart.prototype = new djestit.GroundTerm();
    djestit.TouchStart = TouchStart;

    var TouchMove = function(id) {
        this.init();
        this.id = id;

        this._accepts = function(token) {
            if (token.type !== _TOUCHMOVE) {
                return false;
            }
            if (this.id && this.id !== null && this.id !== token.id) {
                return false;
            }
            return true;
        };
    };
    TouchMove.prototype = new djestit.GroundTerm();
    djestit.TouchMove = TouchMove;

    var TouchEnd = function(id) {
        this.init();
        this.id = id;

        this._accepts = function(token) {
            if (token.type !== _TOUCHEND) {
                return false;
            }
            if (this.id && this.id !== null && this.id !== token.id) {
                return false;
            }
            return true;
        };
    };
    TouchEnd.prototype = new djestit.GroundTerm();
    djestit.TouchEnd = TouchEnd;


    var TouchStateSequence = function(capacity) {
        this.init(capacity);
        this.touches = [];
        this.t_index = [];


        this.push = function(token) {
            this._push(token);
            switch (token.type) {
                case _TOUCHSTART:
                    this.touches[token.id] = [];
                    this.t_index[token.id] = 0;
                case _TOUCHMOVE:
                case _TOUCHEND:
                    if (this.touches[token.id].length > this.capacity) {
                        this.touches[token.id].push(token);
                        this.t_index[token.id]++;
                    } else {
                        this.t_index[token.id] = (this.t_index[token.id] + 1) % this.capacity;
                        this.touches[token.id] = token;
                    }
                    break;

            }
        };

        this.getById = function(delay, id) {
            var pos = Math.abs(this.t_index[id] - delay) % capacity;
            return touches[id] [pos];
        };
    };

    djestit.TouchStateSequence = TouchStateSequence;

    djestit.touchExpression = function(json) {
        if (json.gt) {
            switch (json.gt) {
                case "touch.start":
                    return new djestit.TouchStart(json.id);
                    break;
                case "touch.move":
                    return new djestit.TouchMove(json.id);
                    break;
                case "touch.end":
                    return new djestit.TouchEnd(json.id);
                    break;
            }
        }
    };

    djestit.registerGroundTerm("touch.start", djestit.touchExpression);
    djestit.registerGroundTerm("touch.move", djestit.touchExpression);
    djestit.registerGroundTerm("touch.end", djestit.touchExpression);


    var TouchSensor = function(element, root, capacity) {
        this.element = element;
        this.root = root;
        this.sequence = new TouchStateSequence(capacity);
        this.touchToEvent = [];
        this.eventToTouch = [];
        // we do not use zero as touch identifier
        this.touchToEvent[0] = -1;

        this.generateToken = function(type, touch) {
            var token = new TouchToken(touch, type);
            switch (type) {
                case _TOUCHSTART:
                    var touchId = this.firstId(touch.identifier);
                    this.eventToTouch[touch.identifier] = touchId;
                    token.id = touchId;
                    break;
                case _TOUCHMOVE:
                    token.id = this.eventToTouch[touch.identifier];
                    break;
                case _TOUCHEND:
                    token.id = this.eventToTouch[touch.identifier];
                    delete eventToTouch[touch.identifier];
                    touchToEvent[token.id] = null;
                    break;
            }
            this.sequence.push(token);
        };

        this.firstId = function(id) {
            for (var i = 1; i < this.touchToEvent.length; i++) {
                if (this.touchToEvent[i] === null) {
                    return i;
                }
            }
            this.touchToEvent.push(id);
            return this.touchToEvent.length - 1;
        };

        this.touchHandler = function(event) {

        };

        this.element.addEventListener(
                "touchstart",
                this.touchHandler,
                false);
        this.element.addEventListener(
                "touchmove",
                this.touchHandler,
                false);
    };

    djestit.TouchSensor = TouchSensor;


}(window.djestit = window.djestit || {}, undefined));

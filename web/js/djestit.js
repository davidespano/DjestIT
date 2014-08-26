/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function(djestit, undefined) {
    var _COMPLETE = 1;
    var _DEFAULT = 0;
    var _ERROR = -1;
    
    djestit.COMPLETE = _COMPLETE;
    djestit.DEFAULT = _DEFAULT;
    djestit.ERROR = _ERROR;

    var Event = function() {
        this.listeners = [];
        this.add = function(listener) {
            this.listeners.push(listener);
        };
        this.remove = function(listener) {
            var index = this.listeners.indexOf(listener);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
        this.trigger = function(evt) {
            this.listeners.forEach(function(l) {
                l(evt);
            });
        };
    };

    // base class for net tokens
    var Token = function() {
    };

    djestit.Token = Token;

    // base class for expressions terms 
    var Term = function() {
        this.init = function() {
            this.onComplete = new Event();
            this.onError = new Event();
            this.state = _DEFAULT;
        };

        this.fire = function(token) {
            this.complete(token);
        };
        this.reset = function() {
            this.state = _DEFAULT;
        };
        this.complete = function(token) {
            this.state = _COMPLETE;
            this.onComplete.trigger({
                "evt": "completed",
                "token": token
            });
        };
        this.error = function(token) {
            this.state = _ERROR;
            this.onError.trigger({
                "evt": "error",
                "token": token
            });
        };
        this.lookahead = function(token) {
            return true;
        };

    };
    djestit.Term = Term;

    // a ground term
    var GroundTerm = function() {
        this.init();
        this.accepts = function(token) {
            return true;
        };
        this.lookahead = function(token) {
            return this.accepts(token);
        };
        this.type = "ground";
        this.modality = undefined;
    };
    GroundTerm.prototype = new Term();
    djestit.GroundTerm = GroundTerm;

    // a composite term 
    var CompositeTerm = function() {
        this.init();
        this.children = [];
        this.reset = function() {
            this.state = _DEFAULT;
            this.children.forEach(function(child) {
                child.reset();
            });
        };
    };
    CompositeTerm.prototype = new Term();
    djestit.CompositeTerm = CompositeTerm;

    // sequence operator
    var Sequence = function(terms) {
        // setting the children property
        terms instanceof Array ? this.children = terms : this.children = [];

        var index = 0;

        this.reset = function() {
            this.state = _DEFAULT;
            index = 0;
            this.children.forEach(function(child) {
                child.reset();
            });
        };

        this.lookahead = function(token) {
            if (this.state === _COMPLETE || this.state === _ERROR) {
                return false;
            }

            if (this.children &&
                    this.children[index] &&
                    this.children[index].lookahead) {
                return this.children[index].lookahead(token);
            } 

            return false;
        };

        this.fire = function(token) {
            if (this.lookahead(token) && this.children[index].fire) {
                this.children[index].fire(token);
            } else {
                this.error();
                return;
            }

            switch (this.children[index].state) {
                case _COMPLETE:
                    index++;
                    if (index >= this.children.length) {
                        this.complete(token);
                    }
                    break;
                case _ERROR:
                    this.error(token);
                    break;
            }

        };
    };
    Sequence.prototype = new CompositeTerm();
    djestit.Sequence = Sequence;


    //iterative operator
    var Iterative = function(term) {
        // ensure that we set an unary operator
        term instanceof Array ? this.children = term[0] : this.children = term;

        this.reset = function() {
            this.state = _DEFAULT;
            if (this.children) {
                this.children.reset();
            }
        };

        this.lookahead = function(token) {
            if (this.children && this.children.lookahead) {
                return this.children.lookahead(token);
            }
        };

        this.fire = function(token) {
            if (this.lookahead(token) && this.children.fire) {
                this.children.fire(token);
                switch (this.children.state) {
                    case _COMPLETE:
                        this.complete(token);
                        this.children.reset();
                        break;

                    case _ERROR:
                        this.error(token);
                        this.children.reset();
                        break;
                }
            }
        };
    };
    Iterative.prototype = new CompositeTerm();
    djestit.Iterative = Iterative;

    // Parallel operator
    var Parallel = function(terms) {
        // setting the children property
        terms instanceof Array ? this.children = terms : this.children = [];

        this.lookahead = function(token) {
            if (this.state === _COMPLETE || this.state === _ERROR) {
                return false;
            }
            if (this.children && this.children instanceof Array) {
                for (var i = 0; i < this.children.length; i++) {
                    if (this.children[i].lookahead(token)) {
                        return true;
                    }
                }
            }
            return false;
        };

        this.fire = function(token) {
            if (this.lookahead(token)) {
                var all = true;
                this.children.forEach(function(child) {
                    if (child.lookahead(token)) {
                        child.fire(token);
                    }
                    if (child.state === _ERROR) {
                        this.error(token);
                    }
                    all = all && child.state === _COMPLETE;
                });
            } else {
                this.error();
            }
            if (all) {
                this.complete(token);
            }
        };
    };
    Parallel.prototype = new CompositeTerm();
    djestit.Parallel = Parallel;

    var Choice = function(terms) {
        // setting the children property
        terms instanceof Array ? this.children = terms : this.children = [];
        var index = -1;
        this.reset = function() {
            this.state = _DEFAULT;
            this.children.forEach(function(child) {
                child.reset();
            });
            index = -1;
        };

        this.selectedIndex = function(token) {
            if (this.state === _COMPLETE || this.state === _ERROR) {
                return -1;
            }
            if (this.children && this.children instanceof Array) {
                for (var i = 0; i < this.children.length; i++) {
                    if (this.children[i].lookahead(token)) {
                        return i;
                    }
                }
            }
            return -1;
        };

        this.lookahead = function(token) {
            if (index === -1) {
                return this.selectIndex(token) !== -1;
            } else {
                return this.children[index].lookahead(token);
            }
        };

        this.fire = function(token) {
            if (index === -1) {
                index = this.selectedIndex(token);
            }

            if (index === -1) {
                this.error();
                return;
            }

            this.children[index].fire(token);
            switch (this.children[index].state) {
                case _COMPLETE:
                    this.complete(token);
                    break;

                case _ERROR:
                    this.error(token);
                    break;
            }
        };


    };
    Choice.prototype = new CompositeTerm();
    djestit.Choice = Choice;

    var OrderIndependence = function(terms) {
        // setting the children property
        terms instanceof Array ? this.children = terms : this.children = [];
        var index = -1;
        this.reset = function() {
            this.state = _DEFAULT;
            index = -1;
            this.children.forEach(function(child) {
                child.reset();
                child._once = false;
            });
        };

        this.lookahead = function(token) {
            if (this.state === _COMPLETE || this.state === _ERROR) {
                return false;
            }
            if (this.children && this.children instanceof Array) {
                for (var i = 0; i < this.children.length; i++) {
                    if (!this.children[i]._once && this.children[i].lookahead(token)) {
                        return true;
                    }
                }
            }
            return false;
        };

        this.fire = function(token) {
            if (index === -1) {
                // the operand to complete is not selected
                index = this.selectedIndex(token);
            }
            if (index !== -1) {
                // we have an operand to execute
                this.children[index].fire(token);

                switch (this.children[index].state) {
                    case _COMPLETE:
                        this.children[index]._once = true;
                        index = -1;
                        var allComplete = true;
                        for (var i = 0; i < this.children.length; i++) {
                            if (!this.children[i]._once) {
                                allComplete = false;
                                break;
                            }
                        }
                        if (allComplete) {
                            this.complete(token);
                        }
                        break;

                    case _ERROR:
                        this.error(token);
                        break;
                }
            }
            else {
                this.error(token);
            }
        };


    };
    OrderIndependence.prototype = new Choice();
    djestit.OrderIndependence = OrderIndependence;

    var Disabling = function(terms) {
        terms instanceof Array ? this.children = terms : this.children = [];
        var index = 0;

        this.reset = function() {
            this.state = _DEFAULT;
            index = 0;
            this.children.forEach(function(child) {
                child.reset();
            });
        };

        this.selectedIndex = function(token) {
            if (this.children && this.children instanceof Array) {
                for (var i = index; i < this.children.length; i++) {
                    if (this.children[i].lookahead(token)) {
                        return i;
                    }
                }
            }
            return -1;
        };

        this.lookahead = function(token) {
            if (this.state === _COMPLETE || this.state === _ERROR) {
                return false;
            }
            return this.selectedIndex(token) !== -1;
        };

        this.fire = function(token) {
            index = this.selectedIndex(token);

            if (index !== -1) {
                this.children[index].fire(token);
                switch (this.children[index].state) {
                    case _COMPLETE:
                        this.complete(token);
                        break;

                    case _ERROR:
                        this.error(token);
                        break;
                }
            } else {
                this.error(token);
            }

        };

    };
    Disabling.prototype = new CompositeTerm();
    djestit.Disabling = Disabling;


}(window.djestit = window.djestit || {}, undefined));




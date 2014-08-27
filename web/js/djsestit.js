/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function(djsestit, undefined) {
    var _COMPLETE = 1;
    var _DEFAULT = 0;
    var _ERROR = -1;

    /**
     * Constant indicating that an expression term is completed
     */
    djsestit.COMPLETE = _COMPLETE;

    /**
     * Constant indicating that an expression term is in the default state
     * (neither completed nor error)
     */
    djsestit.DEFAULT = _DEFAULT;

    /**
     * Constant indicating that an expression term is in an error state
     */
    djsestit.ERROR = _ERROR;

    /**
     * Internal representation of an event (observer pattern)
     * @returns {djestit.Event}
     */
    var Event = function() {

        /**
         * The event callback list
         */
        this.callback = [];

        /**
         * Adds an handler for this event
         * @param {function} handler the handler to be added
         * @returns {undefined}
         */
        this.add = function(handler) {
            this.callback.push(handler);
        };

        /**
         * Removes an handler for this event
         * @param {function} handler the handler to be removed
         * @returns {undefined}
         */
        this.remove = function(handler) {
            var index = this.callback.indexOf(handler);
            if (index > -1) {
                this.callback.splice(index, 1);
            }
        };

        /**
         * Triggers the current event
         * @param {object} evt the event arguments
         * @returns {undefined}
         */
        this.trigger = function(evt) {
            this.callback.forEach(function(l) {
                l(evt);
            });
        };
    };

    /**
     * The base class representing the user input arguments
     * @returns {djestit.Token}
     */
    var Token = function() {
    };

    djsestit.Token = Token;

    /**
     * The base class for the input expression terms
     * @returns {djestit.Term}
     */
    var Term = function() {

        /**
         * Inits an expression term 
         */
        this.init = function() {
            this.onComplete = new Event();
            this.onError = new Event();
            this.state = _DEFAULT;
        };

        /**
         * Executes the current expression term, passing a token as argument
         * @param {djestit.Token} token
         * @returns {undefined} 
         */
        this.fire = function(token) {
            this.complete(token);
        };

        /**
         * Resets the the expression term to the initialization state
         * @returns {undefined} 
         */
        this.reset = function() {
            this.state = _DEFAULT;
        };

        /**
         * Sets the expression state to completed
         * @param {djestit.Token} token the input parameters
         * @returns {undefined}
         */
        this.complete = function(token) {
            this.state = _COMPLETE;
            this.onComplete.trigger({
                "evt": "completed",
                "token": token
            });
        };

        /**
         * Sets the expression state in an error state 
         * @param {djestit.Token} token the input parameters
         * @returns {undefined}
         */
        this.error = function(token) {
            this.state = _ERROR;
            this.onError.trigger({
                "evt": "error",
                "token": token
            });
        };

        /**
         * Test wheter the input can be accepted by the expression term or not
         * @param {djestit.Token} token the input parameters
         * @returns {Boolean} true if the input can be accepted, false otherwise
         */
        this.lookahead = function(token) {
            return true;
        };

    };
    djsestit.Term = Term;

    /**
     * Base class for input ground terms (expressions that cannot be further
     * decomposed)
     * @extends Term
     * @returns {djestit.GroundTerm}
     */
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
    djsestit.GroundTerm = GroundTerm;

    /**
     * Base class for composite expressions 
     * @extends Term
     * @returns {djestit.CompositeTerm}
     */
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
    djsestit.CompositeTerm = CompositeTerm;

    /**
     * A composite expression of terms connected with the sequence operator.
     * The sequence operator expresses that the connected sub-terms (two or more) 
     * have to be performed in sequence, from left to right.
     * @param {type} terms the list of sub-terms
     * @returns {djestit.Sequence}
     * @extends djestit.CompositeTerm
     */
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
    djsestit.Sequence = Sequence;


    /**
     * A composite expression consisting of the iteration of a single term an
     * indefinite number of times
     * @param {type} term the term to iterate
     * @returns {djestit.Iterative}
     * @extends djestit.CompositeTerm
     */
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
    djsestit.Iterative = Iterative;

    /**
     * A composite expression of terms connected with the parallel operator.
     * The sequence operator expresses that the connected sub-terms (two or more) 
     * can be executed at the same time
     * @param {type} terms the list of sub-terms
     * @returns {djestit.Parallel}
     * @extends djestit.CompositeTerm
     */
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
    djsestit.Parallel = Parallel;

    /**
     * A composite expression of terms connected with the choice operator.
     * The sequence operator expresses that it is possible to select one among 
     * the terms in order to complete the whole expression.
     * The implementation exploits a best effort approach for dealing with the 
     * selection ambiguity problem (see [1])
     * 
     * [1] Lucio Davide Spano, Antonio Cisternino, Fabio Paternò, and Gianni Fenu. 2013. 
     * GestIT: a declarative and compositional framework for multiplatform 
     * gesture definition. In Proceedings of the 5th ACM SIGCHI symposium on 
     * Engineering interactive computing systems (EICS '13). 
     * ACM, New York, NY, USA, 187-196
     * 
     * @param {type} terms the list of sub-terms
     * @returns {djestit.Choice}
     * @extends djestit.CompositeTerm
     */
    var Choice = function(terms) {
        // setting the children property
        terms instanceof Array ? this.children = terms : this.children = [];

        this.reset = function() {
            this.state = _DEFAULT;
            this.children.forEach(function(child) {
                child.reset();
                child._excluded = false;
            });
        };

        this.lookahead = function(token) {
            if (this.state === _COMPLETE || this.state === _ERROR) {
                return false;
            }
            if (this.children && this.children instanceof Array) {
                for (var i = 0; i < this.children.length; i++) {
                    if (!children[i]._excluded && this.children[i].lookahead(token) === true) {
                        return true;
                    }
                }
            }
            return false;
        };

        this.feedToken = function(token) {
            var result = {};
            result.index = -1;
            result.count = 0;

            if (this.state === _COMPLETE || this.state === _ERROR) {
                return;
            }

            if (this.children && this.children instanceof Array) {
                for (var i = 0; i < this.children.length; i++) {
                    if (!this.children[i]._excluded &&
                            this.children[i].lookahead(token) === true) {
                        this.children[i].fire(token);
                        result.index = i;
                        result.count++;
                    } else {
                        // the current sub-term is not able to handle the input
                        // sequence
                        this.children[i]._excluded = true;
                        this.children[i].error(token);
                    }
                }
            }


            return result;
        };

        this.fire = function(token) {
            var result = this.feedToken(token);
            if (result.count === 0) {
                // cannot complete any of the sub-terms
                this.error();
                return;
            }

            if (result.count === 1 && result.index !== -1) {
                // only one sub-term can continue the execution, 
                // the choice has been performed
                switch (this.children[result.index].state) {
                    case _COMPLETE:
                        this.complete(token);
                        break;

                    case _ERROR:
                        this.error(token);
                        break;
                }
            }

        };


    };
    Choice.prototype = new CompositeTerm();
    djsestit.Choice = Choice;

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
            var result = this.feedToken(token);

            if (result.count === 0) {
                // cannot complete any of the sub-terms
                this.error();
                return;
            }

            if (result.count === 1 && result.index !== -1) {
                // only one sub-term can continue the execution, 
                // the choice has been performed
                switch (this.children[result.index].state) {
                    case _COMPLETE:
                        this.children[result.index]._once = true;
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
        };

    };
    OrderIndependence.prototype = new Choice();
    djsestit.OrderIndependence = OrderIndependence;

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
    djsestit.Disabling = Disabling;


}(window.djsestit = window.djsestit || {}, undefined));




/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function TutorialSequence(
        actions,
        next,
        previous,
        onComplete) {

    var _position = -1;
    var _actions = actions ? actions : [];
    var _nextButton = next;
    var _previousButton = previous;
    var _onComplete = onComplete;


    TutorialSequence.prototype.next = function() {
        if (_position >= 0) {
            $(_actions[_position].show).hide();
        }


        _position++;
        if (_position === _actions.length) {
            if (_onComplete)
                _onComplete();
        } else {
            update(true);
        }

    };

    TutorialSequence.prototype.previous = function() {
        if (_position < _actions.length) {
            $(_actions[_position].show).hide();
        }
        _position--;
        update(false);
    };

    TutorialSequence.prototype.repeat = function() {
        update(false);
    };

    var update = function(next) {
        $(_nextButton).show();
        $(_previousButton).show();


        if (_position <= 0) {
            $(_previousButton).hide();
        }

        var action = _actions[_position];
        var onComplete;
        if (action.interactive !== undefined && !action.interactive) {
            $(_nextButton).hide();
            $(_previousButton).hide();
            if (next) {
                onComplete = TutorialSequence.prototype.next;
            } else {
                onComplete = TutorialSequence.prototype.previous;
            }
        }

        if (action.show) {
            $(action.show).show();
        }
        if (action.animation) {
            action.animation(onComplete);
        }


    };
}

function TimerManager(timers) {
    var _timers = timers;
    var i;
    TimerManager.prototype.start = function() {
        i = -1;
        tick();
    };

    var tick = function() {
        i++;
        if (i < _timers.length) {
            var timer = _timers[i];
            if (timer.time && timer.action) {
                setTimeout(function() {
                    timer.action();
                    tick();
                },
                        timer.time);
            }
        }
    };
}


/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function(djestit, undefined) {
    var TouchStart = function(id){
        this.init();
        this.id = id;    
    };
    TouchStart.prototype = new djestit.GroundTerm();
    djestit.TouchStart = TouchStart;
    
    var TouchMove = function(id){
        this.init();
        this.id = id;    
    };
    TouchMove.prototype = new djestit.GroundTerm();
    djestit.TouchMove = TouchMove;
    
    var TouchEnd = function(id){
        this.init();
        this.id = id;    
    };
    TouchEnd.prototype = new djestit.GroundTerm();
    djestit.TouchEnd = TouchEnd;
    
    
    djestit.touchExpression = function(json){
        if(json.gt){
            switch(json.gt){
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
    
    
}(window.djestit = window.djestit || {}, undefined));

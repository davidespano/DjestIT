/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function() {
    
    setCanvas = function(){
        var w = $(window).width();
        var h = $(window).height();
         $("#area")
                .attr("width", w)
                .attr("height", h);
        $("#area").width(w);
        $("#area").height(h);
        console.log("width" + w);
        console.log("height" + h);
    };
    

    $(window).resize(function() {
       
        setCanvas();
        paintCanvas.paint();

    });

    // drawing canvas creation
    var paintCanvas = new PaintCanvas({
        canvas : $("#area").get(0)
        
    });
    
    var pan = {
        sequence: [
            {gt: "touch.start", id: 1},
            {disabling: [
                    {gt: "touch.move", id: 1, iterative: true},
                    {gt: "touch.end", id: 1}
                ]}
        ],
        iterative: true
    };

    var currentLine = -1;
    djestit.onComplete(
            ":has(:root > .gt:val(\"touch.start\"))",
            pan,
            function() {
                console.log("line added");
                currentLine = paintCanvas.addLine();
            });

    djestit.onComplete(
            ":has(:root > .gt:val(\"touch.move\"))",
            pan,
            function(args) {
                
                var toAdd = paintCanvas.coordToView({
                    x : args.token.clientX,
                    y : args.token.clientY
                });
                paintCanvas.addPoint(currentLine, toAdd);
                paintCanvas.paint();
            });

    new djestit.TouchSensor($("#area").get(0), pan, 2);
    
    setCanvas();
    paintCanvas.paint();
});

function PaintCanvas(conf) {

    this.colors = ['red', 'green', 'blue', 'gold'];

    this.init = function(conf) {
        this.scale = conf.scale ? conf.scale : 1;
        this.translate = conf.translate ? conf.translate : {x: 0, y: 0};
        this.canvas = conf.canvas;
        this.background = conf.background ? conf.background : "#ffffff";
        this.lines = [];
    };

    this.paint = function() {
        var context = this.canvas.getContext("2d");
        context.save();
        context.fillStyle = this.background;
        context.fillRect(0, 0, context.width, context.height);

        context.scale(this.zoom, this.zoom);
        context.translate(this.translateX, this.translateY);

        for (var i = 0; i < this.lines.length; i++) {
            context.strokeStyle = this.colors[i % this.colors.length];
            //context.lineWidth = this.lineWidth;
            context.beginPath();
            for (var j = 0; j < this.lines[i].length; j++) {
                var point = this.lines[i][j];
                if (j === 0) {
                    context.moveTo(point.x, point.y);
                } else {
                    context.lineTo(point.x, point.y);
                }
            }
            context.stroke();
        }

    };

    this.addLine = function() {
        this.lines.push([]);
        return this.lines.length - 1;
    };

    this.addPoint = function(lineId, point) {
        if (lineId >= 0 && lineId < this.lines.length) {
            this.lines[lineId].push(point);
        }
    };

    this.coordToView = function(screenPoint) {
        var viewPoint = {x: 0, y: 0};
        viewPoint.x = screenPoint.x / this.scale;
        viewPoint.y = screenPoint.y / this.scale;
        
        viewPoint.x = viewPoint.x - this.translate.x;
        viewPoint.y = viewPoint.y - this.translate.y;
        
        return viewPoint;
    };

    this.init(conf);
}
;
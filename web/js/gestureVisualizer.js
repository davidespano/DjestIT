/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = {
    titleHeight: 0,
    translateY: 200
};
$(document).ready(function() {
    var container;

    var camera, controls, scene, renderer, hands, pointVis, help;
    var gesturePoints = [];



    var record;
    init();
    animate();
    ui();
    //user_test();
    startTest();



    Leap.loop({background: true}, {
        hand: function(hand) {

            hands.updateHand(hand);
            if (record && record(hand)) {
                var point = new THREE.Mesh(new THREE.SphereGeometry(2),
                        new THREE.MeshPhongMaterial());
                point.material.color.setHex(0x00cc00);
                point.position.fromArray(hand.indexFinger.bones[3].nextJoint);
                point._timestamp = Date.now();
                gesturePoints.push(point);
                pointVis.add(point);
            }
        }})
            // these two LeapJS plugins, handHold and handEntry are available from leapjs-plugins, included above.
            // handHold provides hand.data
            // handEntry provides handFound/handLost events.
            .use('handHold')
            .use('handEntry')
            .on('handFound', function(hand) {
                hands.newHand(hand);
            })
            .on('handLost', function(hand) {
                hands.lostHand(hand);
            })

            .connect();

    function init() {

        //camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
        camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 3, 2000);
        camera.position.fromArray([0, 50, 650]);
        camera.lookAt(new THREE.Vector3(0, 200, 600));

        $("#container").height(window.innerHeight - config.titleHeight);
        controls = new THREE.TrackballControls(camera, $("#container")[0]);

        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;

        controls.noZoom = false;
        controls.noPan = false;

        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;

        controls.keys = [65, 83, 68];

        controls.addEventListener('change', render);

        controls.handleResize();
        // world

        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0xffffff);



        // lights

        light = new THREE.DirectionalLight(0xffffff);
        light.position.set(1, 1, 1);
        scene.add(light);

        // renderer

        renderer = new THREE.WebGLRenderer({antialias: false});
        renderer.setClearColor(scene.fog.color, 1);
        renderer.setSize($("#container").width(), $("#container").height());

        container = document.getElementById('container');
        container.appendChild(renderer.domElement);


        /*var geometry = new THREE.PlaneGeometry(1000, 700);
         
         var material = new THREE.MeshBasicMaterial({color: 0xcccccc, side: THREE.DoubleSide, opacity: .4, transparent: true});
         var plane = new THREE.Mesh(geometry, material);
         plane.position.set(0, 0, 0);
         scene.add(plane);*/

        hands = new HandMesh();
        hands.onUpdate(render);
        hands.mesh().translateY(-config.translateY);
        scene.add(hands.mesh());

        pointVis = new THREE.Object3D();
        pointVis.translateY(-config.translateY);
        scene.add(pointVis);

        help = new THREE.Object3D();
        help.translateY(-config.translateY);
        scene.add(help);

        window.addEventListener('resize', onWindowResize, false);

        //
        record = function(hand) {
            hand.indexFinger.bones[3].nextJoint[2] < 0
        };
        render();

    }

    function onWindowResize() {


        $("#container").height(window.innerHeight - config.titleHeight);
        renderer.setSize($("#container").width(), $("#container").height());

        camera.aspect = $("#container").width() / $("#container").height();
        camera.updateProjectionMatrix();


        controls.handleResize();

        render();

    }

    function animate() {

        requestAnimationFrame(animate);
        controls.update();

    }

    function render() {

        renderer.render(scene, camera);

    }

    function ui() {
        $("#btn-clear").click(function(event) {
            event.preventDefault();
            clear();
        });

        $("#btn-reset").click(function(event) {
            event.preventDefault();
            controls.reset();
            render();
        });

        $("#btn-load")
                .click(function(event) {
                    $.ajax({
                        url: "file.json",
                        type: 'GET',
                        dataType: 'json',
                        contentType: 'application/json',
                        mimeType: 'application/json',
                        data: {id: "#"},
                        success: function(data) {
                            var list = $("#file-list");
                            list.empty();
                            var template = $("<li><a href=\"#\"></a><ul></ul></li>");
                            template.addClass("folder-close");
                            template.on("click", "a", folderNode);
                            data.forEach(function(file) {
                                var fileElement = template.clone(true);
                                fileElement.children().first().text(file.text);
                                fileElement.attr("data-path", file.id);
                                list.append(fileElement);
                            });
                            $("#btn-load-confirm").prop("disabled", true);
                            $("#load-form").modal();
                        }
                    });

                });

        $("#btn-swipe-right").click(function(event) {
            event.preventDefault();
            helpGestureAnimator(
                    50, gestureAnimation_RightSwipe);
        });

        $("#btn-swipe-left").click(function(event) {
            event.preventDefault();
            helpGestureAnimator(
                    50, gestureAnimation_LeftSwipe);
        });

        $("#btn-triangle").click(function(event) {
            event.preventDefault();
            helpGestureAnimator(75, gestureAnimation_Triangle);
        });

        $("#btn-x").click(function(event) {
            event.preventDefault();
            helpGestureAnimator(75, gestureAnimation_X);
        });

        $("#btn-rectangle").click(function(event) {
            event.preventDefault();
            helpGestureAnimator(80, gestureAnimation_Rectangle);
        });

        $("#btn-circle").click(function(event) {
            event.preventDefault();
            helpGestureAnimator(75, gestureAnimation_Circle);
        });

        $("#btn-check").click(function(event) {
            event.preventDefault();
            helpGestureAnimator(40, gestureAnimation_Check);
        });

        $("#btn-caret").click(function(event) {
            event.preventDefault();
            helpGestureAnimator(40, gestureAnimation_Caret);
        });

        $("#btn-lft-sqr-brk").click(function(event) {
            event.preventDefault();
            helpGestureAnimator(40, gestureAnimation_LftSqrBrk);
        });
        
        $("#btn-rgt-sqr-brk").click(function(event) {
            event.preventDefault();
            helpGestureAnimator(40, gestureAnimation_RgtSqrBrk);
        });
        
        $("#btn-v").click(function(event) {
            event.preventDefault();
            helpGestureAnimator(40, gestureAnimation_V);
        });

        $("#btn-save").click(function() {
            save();
        });

        $("#btn-load-confirm").click(function() {
            load();
        });

        $("#btn-logout").click(function() {
            $.ajax({
                url: "logout.json",
                type: 'GET',
                dataType: 'json',
                contentType: 'application/json',
                mimeType: 'application/json',
                data: {},
                success: function(data) {
                    if (data.status === 0) {
                        location.reload();
                    }
                }
            });
        });

    }

    function clear() {
        gesturePoints.forEach(function(point) {
            pointVis.remove(point);
        });

        gesturePoints = [];
        renderer.render(scene, camera);
    }

    function save(filename) {
        if (!filename) {
            var series = [];
            gesturePoints.forEach(function(p) {
                series.push([p.position.x, p.position.y, p.position.z, p._timestamp]);
            });

            filename = $("#save-name").val();
        }
        var test = {
            points: series,
            name: filename
        };
        $.ajax({
            url: "save.json",
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            mimeType: 'application/json',
            data: JSON.stringify(test),
            success: function(data) {
                $("#save-form").modal("hide");

            }
        });

    }


    function load() {
        $(".file-selected").each(function(sel) {
            var path = $(this).attr("data-path");
            $.ajax({
                url: "load.json",
                type: "GET",
                data: {
                    name: path
                },
                success: function(data) {
                    var color = Math.random() * 0xFFFFFF << 0;
                    data.points.forEach(function(p) {
                        var point = new THREE.Mesh(new THREE.SphereGeometry(2),
                                new THREE.MeshPhongMaterial());
                        point.material.color.setHex(color);
                        point.position.setX(p[0]);
                        point.position.setY(p[1]);
                        point.position.setZ(p[2]);
                        point._timestamp = p[3];
                        gesturePoints.push(point);
                        pointVis.add(point);
                    });
                    render();
                }
            });
        });
        $("#load-form").modal("hide");
    }

    function folderNode(event) {

        event.preventDefault();
        var folder = $(event.delegateTarget);
        var list = folder.children("ul");
        if ($(event.delegateTarget).hasClass("folder-open")) {
            folder.addClass("folder-close");
            folder.removeClass("folder-open");
            list.hide();
        } else {
            folder.addClass("folder-open");
            folder.removeClass("folder-close");
            var id = folder.attr("data-path");
            $.ajax({
                url: "file.json",
                type: 'GET',
                dataType: 'json',
                contentType: 'application/json',
                mimeType: 'application/json',
                data: {"id": id},
                success: function(data) {
                    list.empty();
                    var template = $("<li><a href=\"#\"></a></li>");
                    template.addClass("file");
                    template.on("click", "a", fileSelect);
                    data.forEach(function(file) {
                        var fileElement = template.clone(true);
                        fileElement.children().first().text(file.text);
                        fileElement.attr("data-path", file.id);
                        list.append(fileElement);
                    });
                    list.show();
                }
            });

        }

    }

    function fileSelect(event) {
        event.preventDefault();
        event.stopPropagation();
        if (!event.shiftKey) {
            $("#file-list .file-selected").removeClass("file-selected").addClass("file");
        }
        $(event.delegateTarget).addClass("file-selected");
        $("#btn-load-confirm").prop("disabled", false);
    }

    function helpGestureAnimator(duration, position, onComplete) {
        var _position = position;
        var _complete = onComplete;
        var pause = 60;
        var i = duration + pause;
        requestAnimationFrame(frame);

        function frame() {
            if (i > pause) {
                var pt = new THREE.Mesh(new THREE.SphereGeometry(4),
                        new THREE.MeshPhongMaterial());
                pt.material.color.setHex(0xff0000);
                pt.position.fromArray(_position(duration - i + pause, duration));
                help.add(pt);
                render();

            }

            if (i === 0) {
                while (help.children.length > 0) {
                    help.remove(help.children[0]);
                }
                render();
                if (_complete) {
                    _complete();
                }
                return;
            }

            i--;
            requestAnimationFrame(frame);

        }
    }


    // user-test related functionalities
    function user_test() {
        $(".help-msg > span").hide();

        var actions = [
            {show: $(".help-msg span")[0]},
            {show: $(".help-msg span")[1]},
            {show: $(".help-msg span")[2]},
            {show: $(".help-msg span")[3]},
            {
                show: $(".help-msg span")[4],
                interactive: false,
                animation: function(onComplete) {
                    var msg = $("#countdown").show();
                    msg.text("-3");

                    var timer = new TimerManager([
                        {time: 1000, action: function() {
                                msg.text("-2");
                            }},
                        {time: 1000, action: function() {
                                msg.text("-1");
                            }},
                        {time: 1000, action: function() {
                                msg.text("Azione!");
                            }},
                        {time: 1000, action: function() {
                                helpGestureAnimator(
                                        75,
                                        gestureAnimation_Circle,
                                        onComplete);
                            }}
                    ]);

                    timer.start();
                }
            },
            {show: $(".help-msg span")[5]},
            {show: $(".help-msg span")[6]}
        ];

        var tutorial = new TutorialSequence(
                actions,
                $("#btn-tutorial-next"),
                $("#btn-tutorial-prev"),
                startTest);
        tutorial.next();
        $("#btn-tutorial-prev").click(function(event) {
            event.preventDefault();
            tutorial.previous();
        });
        $("#btn-tutorial-next").click(function(event) {
            event.preventDefault();
            tutorial.next();
        });
    }

    function startTest() {
        $("#help-bar").hide();
        $(".test-msg > span").hide();
        $("#test-bar").show();
        var oldRecord = record;

        var startRecord = function() {
            return true;
        };
        var stopRecord = function() {
            return false;
        };

        record = stopRecord;

        function recordGesture(onComplete, duration) {
            $("#btn-test-repeat").hide();
            var msg = $("#test-count").show();
            msg.text("-3");
            var timer = new TimerManager([
                {time: 1000, action: function() {
                        msg.text("-2");
                    }},
                {time: 1000, action: function() {
                        msg.text("-1");
                    }},
                {time: 1000, action: function() {
                        msg.text("Azione !");
                        record = startRecord;
                    }},
                {time: duration, action: function() {
                        record = stopRecord;
                        onComplete();
                    }}
            ]);
            timer.start();
        }
        ;


        var actions = [
            // benvenuto
            {
                show: $(".test-msg span")[2],
                animation: function() {
                    $("#btn-test-repeat").hide();
                }
            },
            //************************************
            // RIGHT SWIPE
            //************************************
            // right swipe: dimostrazione
            {
                show: $(".test-msg span")[3],
                interactive: true,
                animation: function(onComplete) {
                    $("#btn-test-repeat").show();
                    helpGestureAnimator(
                            60,
                            gestureAnimation_RightSwipe,
                            onComplete);
                }
            },
            // right swipe: registrazione
            {
                show: $(".test-msg span")[0],
                interactive: false,
                skipOnPrevious: true,
                animation: function(onComplete) {
                    recordGesture(onComplete, 2000);
                }
            },
            // right swipe: salvataggio
            {
                show: $(".test-msg span")[1],
                animation: function() {
                    $("#btn-test-repeat").hide();

                }
            },
            //************************************
            // LEFT SWIPE
            //************************************
            // left swipe: dimostrazione
            {
                show: $(".test-msg span")[4],
                interactive: true,
                animation: function(onComplete) {
                    save("right-swipe");
                    clear();
                    $("#btn-test-repeat").show();
                    helpGestureAnimator(
                            60,
                            gestureAnimation_LeftSwipe,
                            onComplete);
                }
            },
            // left swipe: registrazione
            {
                show: $(".test-msg span")[0],
                interactive: false,
                skipOnPrevious: true,
                animation: function(onComplete) {
                    recordGesture(onComplete, 2000);
                }
            },
            // left swipe: conferma
            {
                show: $(".test-msg span")[1],
                animation: function() {
                    $("#btn-test-repeat").hide();

                }
            },
            //************************************
            // CIRCLE
            //************************************

            // circle: dimostrazione
            {
                show: $(".test-msg span")[5],
                interactive: true,
                animation: function(onComplete) {
                    save("left-swipe");
                    clear();
                    $("#btn-test-repeat").show();
                    helpGestureAnimator(
                            75,
                            gestureAnimation_Circle,
                            onComplete);
                }
            },
            // circle: registrazione
            {
                show: $(".test-msg span")[0],
                interactive: false,
                skipOnPrevious: true,
                animation: function(onComplete) {
                    recordGesture(onComplete, 2000);
                }
            },
            {
                show: $(".test-msg span")[6],
                animation: function() {
                    save("circle");
                    clear();
                }
            }
        ];
        var tutorial = new TutorialSequence(
                actions,
                $("#btn-test-next"),
                $("#btn-test-prev"),
                normalEditor);
        tutorial.next();
        $("#btn-test-prev").click(function(event) {
            event.preventDefault();
            tutorial.previous();
        });
        $("#btn-test-next").click(function(event) {
            event.preventDefault();
            tutorial.next();
        });
        $("#btn-test-repeat").click(function(event) {
            event.preventDefault();
            tutorial.repeat();
        });
    }

    function normalEditor() {
        $("#help-bar").hide();
        $("#test-bar").hide();
    }

});



function gestureAnimation_Circle(i) {
    var r = 100;
    var alpha = (2 * Math.PI / 75) * i;
    var point = [];
    point[0] = Math.cos(alpha) * r;
    point[1] = Math.sin(alpha) * r + config.translateY;
    point[2] = 0;
    return point;
}

function gestureAnimation_LeftSwipe(i) {
    var point = [];
    point[0] = 250 - i * 10;
    point[1] = config.translateY;
    point[2] = 0;
    return point;

}

function gestureAnimation_RightSwipe(i) {
    var point = [];
    point[0] = -250 + i * 10;
    point[1] = config.translateY;
    point[2] = 0;
    return point;
}

function gestureAnimation_Triangle(i, max) {
    var scale = 400;
    var point = [];

    var n = 1.0 * max / 3.0;
    var l = 2 * Math.cos(Math.PI / 3);
    var h = Math.sin(Math.PI / 3);
    var m1 = Math.tan(Math.PI / 3);
    var m2 = Math.tan(2 * Math.PI / 3);


    if (i < n) {

        point[0] = -(l / (2 * n)) * i;
        point[1] = (point[0] * m1 + h) * scale;
        point[2] = 0;
        point[0] = point[0] * scale;
    }

    if (i >= n && i < 2 * n) {
        point[0] = (-(l / 2) + (l / n) * (i - n)) * scale;
        point[1] = 0;
        point[2] = 0;
    }

    if (i >= 2 * n && i < 3 * n) {
        point[0] = (l / 2) - ((i - 2 * n) * l / (2 * n));
        point[1] = (point[0] * m2 + h) * scale;
        point[2] = 0;
        point[0] = point[0] * scale;
    }
    return point;
}

function gestureAnimation_X(i, max) {
    var scale = 400;
    var point = [];

    var n = 1.0 * max / 3.0;
    var l = Math.cos(Math.PI / 4);

    var m1 = Math.tan(Math.PI / 4);
    var m2 = Math.tan(3 * Math.PI / 4);
    if (i < n) {
        point[0] = -(l / 2) + i * (l / n);
        point[1] = (point[0] * m1 + l / 2) * scale;
        point[2] = 0;
        point[0] = point[0] * scale;
    }

    if (i >= n && i < 2 * n) {
        point[0] = (l / 2);
        point[1] = (l - ((i - n) * (l / n))) * scale;
        point[2] = 0;
        point[0] = point[0] * scale;
    }

    if (i >= 2 * n && i < 3 * n) {
        point[0] = (l / 2) - (i - 2 * n) * (l / n);
        point[1] = (point[0] * m2 + l / 2) * scale;
        point[2] = 0;
        point[0] = point[0] * scale;
    }

    return point;
}

function gestureAnimation_Check(i, max) {
    var scale = 100;
    var point = [];

    var n = 1.0 * max / 3.0;
    var h = Math.sin(Math.PI / 3);
    var l = 2 * Math.cos(Math.PI / 3);
    var m1 = Math.tan(2 * Math.PI / 3);
    var m2 = Math.tan(Math.PI / 3);

    if (i < n) {
        point[0] = -l / 2 + i * (l / (2 * n));
        point[1] = (point[0] * m1) * scale;
        point[2] = 0;
        point[0] = point[0] * scale;
    }

    if (i >= n && i < 3 * n) {
        point[0] = (i - n) * l / n;
        point[1] = (point[0] * m2) * scale;
        point[2] = 0;
        point[0] = point[0] * scale;
    }

    return point;
}

function gestureAnimation_Rectangle(i, max) {
    var scale = 200;
    var n = max / 4;
    var point = [];
    var lm = 1;
    var lM = 2;

    if (i < n) {
        point[0] = -lM / 2 * scale;
        point[1] = (lm / 2 - i * lm / n) * scale + config.translateY;
        point[2] = 0;
    }

    if (i >= n && i < 2 * n) {
        point[0] = (-lM / 2 + (i - n) * lM / n) * scale;
        point[1] = -lm / 2 * scale + config.translateY;
        point[2] = 0;
    }

    if (i >= 2 * n && i < 3 * n) {
        point[0] = lM / 2 * scale;
        point[1] = (-lm / 2 + (i - 2 * n) * lm / n) * scale + config.translateY;
        point[2] = 0;
    }

    if (i >= 3 * n && i < 4 * n) {
        point[0] = (lM / 2 - (i - 3 * n) * lM / n) * scale;
        point[1] = lm / 2 * scale + config.translateY;
        point[2] = 0;
    }

    return point;
}

function gestureAnimation_Caret(i, max) {
    var scale = 200;
    var point = [];

    var n = 1.0 * max / 2.0;
    var l = 2 * Math.cos(Math.PI / 3);
    var h = Math.sin(Math.PI / 3);
    var m1 = Math.tan(Math.PI / 3);
    var m2 = Math.tan(2 * Math.PI / 3);


    if (i < n) {

        point[0] = -l / 2 + i * l / (2 * n);
        point[1] = (point[0] * m1 + h) * scale + config.translateY / 2;
        point[2] = 0;
        point[0] = point[0] * scale;
    }

    if (i >= n && i <= 2 * n) {
        point[0] = l / (2 * n) * (i - n);
        point[1] = (point[0] * m2 + h) * scale + config.translateY / 2;
        point[2] = 0;
        point[0] = point[0] * scale;
    }


    return point;
}

function gestureAnimation_X(i, max) {
    var scale = 400;
    var point = [];

    var n = 1.0 * max / 3.0;
    var l = Math.cos(Math.PI / 4);

    var m1 = Math.tan(Math.PI / 4);
    var m2 = Math.tan(3 * Math.PI / 4);
    if (i < n) {
        point[0] = -(l / 2) + i * (l / n);
        point[1] = (point[0] * m1 + l / 2) * scale;
        point[2] = 0;
        point[0] = point[0] * scale;
    }

    if (i >= n && i < 2 * n) {
        point[0] = (l / 2);
        point[1] = (l - ((i - n) * (l / n))) * scale;
        point[2] = 0;
        point[0] = point[0] * scale;
    }

    if (i >= 2 * n && i < 3 * n) {
        point[0] = (l / 2) - (i - 2 * n) * (l / n);
        point[1] = (point[0] * m2 + l / 2) * scale;
        point[2] = 0;
        point[0] = point[0] * scale;
    }

    return point;
}

function gestureAnimation_LftSqrBrk(i, max) {
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

    if (i >= n && i < 3 * n) {
        point[0] = -lm * scale;
        point[1] = (lM/2.0 - (lM/(2*n) * (i -n))) *scale + config.translateY;
        point[2] = 0;
    }

    if (i >= 3 * n) {
        point[0] = (- lm + (i - 3 * n ) * lm / n) * scale;
        point[1] = (-lM / 2) * scale + config.translateY;
        point[2] = 0;
    }
    
    return point;

}

function gestureAnimation_RgtSqrBrk(i, max) {
    var scale = 100;
    var point = [];

    var lm = 1;
    var lM = 3;
    var n = 1.0 * max / 4.0;

    if (i < n) {
        point[0] = (i * lm / n) * scale;
        point[1] = (lM / 2) * scale + config.translateY;
        point[2] = 0;
    }

    if (i >= n && i < 3 * n) {
        point[0] = lm * scale;
        point[1] = (lM/2.0 - (lM/(2*n) * (i -n))) *scale + config.translateY;
        point[2] = 0;
    }

    if (i >= 3 * n) {
        point[0] = (lm - (i - 3 * n ) * lm / n) * scale;
        point[1] = (-lM / 2) * scale + config.translateY;
        point[2] = 0;
    }
    
    return point;

}

function gestureAnimation_V(i, max) {
    var scale = 200;
    var point = [];

    var n = 1.0 * max / 2.0;
    var l = 2 * Math.cos(Math.PI / 3);
    var m1 = Math.tan(Math.PI / 3);
    var m2 = Math.tan(2 * Math.PI / 3);


    if (i < n) {

        point[0] = -l / 2 + i * l / (2 * n);
        point[1] = (point[0] * m2) * scale + config.translateY / 2;
        point[2] = 0;
        point[0] = point[0] * scale;
    }

    if (i >= n && i <= 2) {
        point[0] = l / (2 * n) * (i - n);
        point[1] = (point[0] * m1) * scale + config.translateY / 2;
        point[2] = 0;
        point[0] = point[0] * scale;
    }


    return point;
}
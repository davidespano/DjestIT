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

        var gestureAnimator = new GestureAnimator(config);
        gestureAnimator.render = render;
        gestureAnimator.helpMesh = help;

        var animations = [
            {duration: 50, gesture: "right-swipe"},
            {duration: 50, gesture: "left-swipe"},
            {duration: 75, gesture: "triangle"},
            {duration: 75, gesture: "x"},
            {duration: 80, gesture: "rectangle"},
            {duration: 75, gesture: "circle"},
            {duration: 40, gesture: "check"},
            {duration: 40, gesture: "caret"},
            {duration: 40, gesture: "square-braket-left"},
            {duration: 40, gesture: "square-braket-right"},
            {duration: 40, gesture: "v"},
            {duration: 40, gesture: "pigtail"},
            {duration: 40, gesture: "curly-braket-left"},
            {duration: 40, gesture: "curly-braket-right"},
            {duration: 125, gesture: "star"}
        ];

        $("#gesture-menu li a").click(function(event) {
            var index = $(this).parent().prevAll().length;
            gestureAnimator.requestAnimation(
                    animations[index].duration,
                    animations[index].gesture);
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
                                requestAnimation(
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
                    requestAnimation(
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
                    requestAnimation(
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
                    requestAnimation(
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

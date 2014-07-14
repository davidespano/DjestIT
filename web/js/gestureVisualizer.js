/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function() {
    var container;

    var camera, controls, scene, renderer, hands, pointVis, help;
    var gesturePoints = [];

    var config = {
        titleHeight: 186
    };

    init();
    animate();
    ui();




    Leap.loop({background: true}, {
        hand: function(hand) {

            hands.updateHand(hand);
            if (hand.indexFinger.bones[3].nextJoint[2] < 0) {
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


        var geometry = new THREE.PlaneGeometry(1000, 700);

        var material = new THREE.MeshBasicMaterial({color: 0xcccccc, side: THREE.DoubleSide, opacity: .4, transparent: true});
        var plane = new THREE.Mesh(geometry, material);
        plane.position.set(0, 0, 0);
        scene.add(plane);

        hands = new HandMesh();
        hands.onUpdate(render);
        hands.mesh().translateY(-200);
        scene.add(hands.mesh());

        pointVis = new THREE.Object3D();
        pointVis.translateY(-200);
        scene.add(pointVis);

        help = new THREE.Object3D();
        help.translateY(-200);
        scene.add(help);

        window.addEventListener('resize', onWindowResize, false);

        //
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
       // $(".btn").button();
        $("#btn-clear").click(function(event) {
            event.preventDefault();
            gesturePoints.forEach(function(point) {
                pointVis.remove(point);
            });

            gesturePoints = [];
            renderer.render(scene, camera);
        });

        $("#btn-reset").click(function(event) {
            event.preventDefault();
            controls.reset();
            render();
        });

        $("#btn-save")
                .addClass("distance")
                .click(function(event) {
                    $("#save-form").dialog("open");
                });

        $("#btn-load")
                .click(function(event) {
                    $("#jstree").jstree(true).refresh();
                    $("#load-form").dialog("open");
                });

        $("#btn-swipe-right").click(function(event) {
            event.preventDefault();
            helpGestureAnimator(
                    50,
                    function(i) {
                        var point = [];
                        point[0] = -250 + i * 10;
                        point[1] = 200;
                        point[2] = 0;
                        return point;
                    });
        });

        $("#btn-swipe-left").click(function(event) {
            event.preventDefault();
            helpGestureAnimator(
                    50,
                    function(i) {
                        var point = [];
                        point[0] = 250 - i * 10;
                        point[1] = 200;
                        point[2] = 0;
                        return point;
                    });
        });

        $("#btn-circle").click(function(event) {
            event.preventDefault();
            helpGestureAnimator(
                    75,
                    function(i) {
                        var r = 100;
                        var alpha = (2 * Math.PI / 75) * i;
                        var point = [];
                        point[0] = Math.cos(alpha) * r;
                        point[1] = Math.sin(alpha) * r + 200;
                        point[2] = 0;
                        return point;
                    });
        });

        $("#save-form").dialog({
            autoOpen: false,
            height: 300,
            width: 350,
            modal: true,
            buttons: {
                "Save": save,
                Cancel: function() {
                    $("#save-form").dialog("close");
                }
            },
            close: function() {


            }
        });

        $("#load-form").dialog({
            autoOpen: false,
            height: 300,
            width: 350,
            modal: true,
            buttons: {
                "Load": load,
                Cancel: function() {

                    $("#load-form").dialog("close");
                }
            },
            close: function() {


            }
        });

        $('#jstree').jstree({
            'core': {
                "animation": 0,
                "check_callback": true,
                "themes": {"stripes": true},
                'data': {
                    'url': function(node) {
                        return 'file.json'
                    },
                    'data': function(node) {
                        return {'id': node.id};
                    },
                    dataType: 'json',
                    contentType: 'application/json',
                    mimeType: 'application/json'
                }


            },
            "types": {
                "#": {
                    "valid_children": ["default", "file"]
                },
                "default": {
                    "valid_children": ["default", "file"]
                },
                "file": {
                    "icon": "img/file.png",
                    "valid_children": []
                }
            },
            "plugins": [
                "types", "wholerow"
            ]
        });


    }

    function save() {
        var series = [];
        gesturePoints.forEach(function(p) {
            series.push([p.position.x, p.position.y, p.position.z, p._timestamp]);
        });

        var filename = $("#save-name").val();
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
                $("#save-form").dialog("close");
            }
        });

    }


    function load() {
        var selected = $("#jstree").jstree(true).get_selected();
        selected.forEach(function(sel) {
            $.ajax({
                url: "load.json",
                type: "GET",
                data: {
                    name: sel
                },
                success: function(data) {
                    var color = Math.random()*0xFFFFFF<<0
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
        $("#load-form").dialog("close");
    }

    function helpGestureAnimator(duration, position) {
        var _position = position;
        var pause = 30;
        var i = duration + pause;
        requestAnimationFrame(frame);

        function frame() {
            if (i > pause) {
                var pt = new THREE.Mesh(new THREE.SphereGeometry(4),
                        new THREE.MeshPhongMaterial());
                pt.material.color.setHex(0xff0000);
                pt.position.fromArray(_position(duration - i + pause));
                help.add(pt);
                render();

            }

            if (i === 0) {
                while (help.children.length > 0) {
                    help.remove(help.children[0]);
                }
                render();
                return;
            }

            i--;
            requestAnimationFrame(frame);
        }
    }
});
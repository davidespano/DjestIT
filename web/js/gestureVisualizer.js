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

        controls = new THREE.TrackballControls(camera);

        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;

        controls.noZoom = false;
        controls.noPan = false;

        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;

        controls.keys = [65, 83, 68];

        controls.addEventListener('change', render);

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
        $("#container").height(window.innerHeight - config.titleHeight);
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
        $(".btn").button();
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
                    100,
                    function(i) {
                        var r = 200;
                        var alpha = (2 * Math.PI / 100) * i;
                        var point = [];
                        point[0] = Math.cos(alpha) * r;
                        point[1] = Math.sin(alpha) * r + 200;
                        point[2] = 0;
                        return point;
                    });
        });
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
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
    "http://www.w3.org/TR/html4/loose.dtd">

<html>
    <head>
        <title>Bone Hands - Leap</title>
        <script src="//cdnjs.cloudflare.com/ajax/libs/three.js/r67/three.js"></script>
        <script src="//js.leapmotion.com/leap-0.6.0-beta3.min.js"></script>
        <script src="//js.leapmotion.com/leap-plugins-0.1.6.min.js"></script>
        <script src="//js.leapmotion.com/leap.rigged-hand-0.1.4.min.js"></script>
    </head>
    <body>

    </body>

    <script>
        var baseBoneRotation = (new THREE.Quaternion).setFromEuler(
                new THREE.Euler(Math.PI / 2, 0, 0)
                );

        Leap.loop({background: true}, {
            hand: function(hand) {

                hand.fingers.forEach(function(finger) {

                    // This is the meat of the example - Positioning `the cylinders on every frame:
                    finger.data('boneMeshes').forEach(function(mesh, i) {
                        var bone = finger.bones[i];

                        mesh.position.fromArray(bone.center());

                        mesh.setRotationFromMatrix(
                                (new THREE.Matrix4).fromArray(bone.matrix())
                                );

                        mesh.quaternion.multiply(baseBoneRotation);
                    });

                    finger.data('jointMeshes').forEach(function(mesh, i) {
                        var bone = finger.bones[i];

                        if (bone) {
                            mesh.position.fromArray(bone.prevJoint);
                        } else {
                            // special case for the finger tip joint sphere:
                            bone = finger.bones[i - 1];
                            mesh.position.fromArray(bone.nextJoint);
                        }

                    });

                });

                renderer.render(scene, camera);

            }})
                // these two LeapJS plugins, handHold and handEntry are available from leapjs-plugins, included above.
                // handHold provides hand.data
                // handEntry provides handFound/handLost events.
                .use('handHold')
                .use('handEntry')
                .on('handFound', function(hand) {

                    hand.fingers.forEach(function(finger) {

                        var boneMeshes = [];
                        var jointMeshes = [];

                        finger.bones.forEach(function(bone) {

                            // create joints

                            // CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded)
                            var boneMesh = new THREE.Mesh(
                                    new THREE.CylinderGeometry(5, 5, bone.length),
                                    new THREE.MeshPhongMaterial()
                                    );

                            boneMesh.material.color.setHex(0xffffff);
                            scene.add(boneMesh);
                            boneMeshes.push(boneMesh);
                        });
                        
                        

                        for (var i = 0; i < finger.bones.length + 1; i++) {

                            var jointMesh = new THREE.Mesh(
                                    new THREE.SphereGeometry(8),
                                    new THREE.MeshPhongMaterial()
                                    );

                            jointMesh.material.color.setHex(0x0088ce);
                            scene.add(jointMesh);
                            jointMeshes.push(jointMesh);

                        }


                        finger.data('boneMeshes', boneMeshes);
                        finger.data('jointMeshes', jointMeshes);

                    });

                })
                .on('handLost', function(hand) {

                    hand.fingers.forEach(function(finger) {

                        var boneMeshes = finger.data('boneMeshes');
                        var jointMeshes = finger.data('jointMeshes');

                        boneMeshes.forEach(function(mesh) {
                            scene.remove(mesh);
                        });

                        jointMeshes.forEach(function(mesh) {
                            scene.remove(mesh);
                        });

                        finger.data({
                            boneMeshes: null,
                            boneMeshes: null
                        });

                    });

                    renderer.render(scene, camera);

                })
                .use('playback', {
                    // This is a compressed JSON file of preprecorded frame data
                    recording: './scroll-and-swipe-100fps.json.lz',
                    // How long, in ms, between repeating the recording.
                    timeBetweenLoops: 2000,
                    pauseOnHand: true
                })
                .connect();
                
                

        // all units in mm
        var initScene = function() {
            window.scene = new THREE.Scene();
            window.renderer = new THREE.WebGLRenderer({
                alpha: true
            });

            window.renderer.setClearColor(0x000000, 0);
            window.renderer.setSize(window.innerWidth, window.innerHeight);

            window.renderer.domElement.style.position = 'fixed';
            window.renderer.domElement.style.top = 0;
            window.renderer.domElement.style.left = 0;
            window.renderer.domElement.style.width = '100%';
            window.renderer.domElement.style.height = '100%';

            document.body.appendChild(window.renderer.domElement);

            var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(0, 0.5, 1);
            window.scene.add(directionalLight);

            window.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
            window.camera.position.fromArray([0, 150, 700]);
            window.camera.lookAt(new THREE.Vector3(0, 160, 0));

            window.addEventListener('resize', function() {

                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.render(scene, camera);

            }, false);

            scene.add(camera);


            renderer.render(scene, camera);
        };

        initScene();
    </script>
</html>
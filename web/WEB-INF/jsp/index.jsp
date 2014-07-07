<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html>
    <head>
        <title>Leap Canvas</title>
        <link rel="stylesheet" href="css/blitzer/jquery-ui-1.10.4.custom.css">
        <link rel="stylesheet" href="css/dropit.css">
        <link rel="stylesheet" href="css/icett.css">
        <script type="text/javascript" src="js/lib/three.js"></script>
        <script type="text/javascript" src="js/lib/leap.min.js"></script>
        <script type="text/javascript" src="js/lib/leap-plugins.min.js"></script>
        <script type="text/javascript" src="js/lib/leap.rigged-hand.min.js"></script>
        <script type="text/javascript" src="js/lib/leap.rigged-hand.min.js"></script>
        <script type="text/javascript" src="js/lib/TrackballControls.js"></script>
        <script type="text/javascript" src="js/lib/jquery-1.9.1.js"></script>
        <script type="text/javascript" src="js/lib/jquery-ui-1.10.3.min.js"></script>
        <script src="js/handMesh.js"></script>
        <script type="text/javascript" src="js/gestureVisualizer.js"></script>
    <body>
        <header>
            <div id='logo'>Universit&agrave; di Cagliari</div>
            <div id='title'>
                <h1>Leap Canvas</h1>
                <p>Gesture recorder</p>
            </div>


            <div id='stripes'></div>
        </header>
        <div id="main">
            <nav id="menu">
                <h2>Gestures</h2>
                 <button class="btn" type="submit" id="btn-swipe-right" name="btn_swipe_right">Right swipe</button>
                 <button class="btn" type="submit" id="btn-swipe-left" name="btn_swipe_left">Left swipe</button>
                 <button class="btn" type="submit" id="btn-circle" name="circle">Circle</button>
            </nav>
            <div id="container"></div>
            <div class="clear"></div>
        </div>
        <footer>
            <div id="btn_bar">
                <button class="btn" type="submit" id="btn-clear" name="clear">Clear</button>
                <button class="btn" type="submit" id="btn-reset" name="clear">Reset Camera</button>
                <button class="btn" type="submit" id="btn-save" name="clear">Save</button>
            </div>
        </footer>
    </body>
</html>

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
        <link rel="stylesheet" href="js/lib/jsTree/themes/default/style.min.css" />
        <script type="text/javascript" src="js/lib/three.js"></script>
        <script type="text/javascript" src="js/lib/leap.min.js"></script>
        <script type="text/javascript" src="js/lib/leap-plugins.min.js"></script>
        <script type="text/javascript" src="js/lib/leap.rigged-hand.min.js"></script>
        <script type="text/javascript" src="js/lib/leap.rigged-hand.min.js"></script>
        <script type="text/javascript" src="js/lib/TrackballControls.js"></script>
        <script type="text/javascript" src="js/lib/jquery-1.9.1.js"></script>
        <script type="text/javascript" src="js/lib/jquery-ui-1.10.3.min.js"></script>
        <script type="text/javascript" src="js/lib/jsTree/jstree.js"></script>
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
        <div id="save-form" title="Save gesture">
            <p class="validateTips">All form fields are required.</p>

            <form>

                <label for="name">Name</label>
                <input type="text" name="save-name" id="save-name" value="" class="text ui-widget-content ui-corner-all">

                <!-- Allow form submission with keyboard without duplicating the dialog button -->
                <input type="submit" tabindex="-1" style="position:absolute; top:-1000px">

            </form>
        </div>
        <div id="load-form" title="Load gesture">
            <div id="jstree">
            </div>
        </div>

        <footer>
            <div id="btn_bar">
                <button class="btn" type="submit" id="btn-clear" name="clear">Clear</button>
                <button class="btn" type="submit" id="btn-reset" name="reset">Reset Camera</button>
                <button class="btn" type="submit" id="btn-load" name="load">Load</button>
                <button class="btn" type="submit" id="btn-save" name="save">Save</button>
            </div>
        </footer>
    </body>
</html>

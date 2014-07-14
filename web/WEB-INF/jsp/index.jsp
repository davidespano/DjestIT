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
        <!-- Latest compiled and minified CSS -->
        <link rel="stylesheet" href="css/bootstrap.min.css">
        <link rel="stylesheet" href="css/bootstrap-theme.min.css">
        <link rel="stylesheet" href="css/icett.css">

        <script type="text/javascript" src="js/lib/three.js"></script>
        <script type="text/javascript" src="js/lib/leap.min.js"></script>
        <script type="text/javascript" src="js/lib/leap-plugins.min.js"></script>
        <script type="text/javascript" src="js/lib/leap.rigged-hand.min.js"></script>
        <script type="text/javascript" src="js/lib/leap.rigged-hand.min.js"></script>
        <script type="text/javascript" src="js/lib/TrackballControls.js"></script>
        <script type="text/javascript" src="js/lib/jquery-1.9.1.js"></script>
        <script type="text/javascript" src="js/lib/jsTree/jstree.js"></script>
        <script type="text/javascript" src="js/lib/bootstrap.min.js"></script>
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
                <button class="btn btn-primary" type="submit" id="btn-swipe-right" name="btn_swipe_right">Right swipe</button>
                <button class="btn btn-primary" type="submit" id="btn-swipe-left" name="btn_swipe_left">Left swipe</button>
                <button class="btn btn-primary" type="submit" id="btn-circle" name="circle">Circle</button>
            </nav>
            <div id="container"></div>
            <div class="clear"></div>
        </div>

        <!-- Save Modal form -->
        <div class="modal fade" id="save-form" tabindex="-1" role="dialog" aria-labelledby="save form" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                        <h4 class="modal-title" id="myModalLabel">Save gesture data</h4>
                    </div>
                    <div class="modal-body">
                        <p>Please, specify the gesture name</p>
                        <form>
                            <div class="form-group">
                                <label for="name">Name</label>
                                <input type="text" class="form-control" name="save-name" id="save-name" value="" placeholder="Enter gesture name">
                            </div>
                            <!-- Allow form submission with keyboard without duplicating the dialog button -->
                            <input type="submit" tabindex="-1" style="position:absolute; top:-1000px">

                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        <button type="button" id="btn-save" class="btn btn-primary">Save</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Save Modal form -->
        <div class="modal fade" id="load-form" tabindex="-1" role="dialog" aria-labelledby="load form" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                        <h4 class="modal-title" id="myModalLabel">Load gesture data</h4>
                    </div>
                    <div class="modal-body">
                        <ul class="file-view">
                            <li>
                                <a href="#sel">Folder 1</a>
                                <ul>
                                    <li>File 1</li>
                                    <li>File 2</li>
                                    <li>File 3</li>
                                </ul>
                            </li>
                            <li>
                                <a href="#sel">Folder 2</a>
                                <ul>
                                    <li>File 1</li>
                                    <li>File 2</li>
                                    <li>File 3</li>
                                    <li>File 4</li>
                                </ul>
                            </li>
                            <li>
                                <a href="#sel">Folder 1</a>
                                <ul>
                                    <li>File 1</li>
                                    <li>File 2</li>
                                    <li>File 3</li>
                                </ul>
                            </li>
                            <li>
                                <a href="#sel">Folder 2</a>
                                <ul>
                                    <li>File 1</li>
                                    <li>File 2</li>
                                    <li>File 3</li>
                                    <li>File 4</li>
                                </ul>
                            </li>
                            <li>
                                <a href="#sel">Folder 1</a>
                                <ul>
                                    <li>File 1</li>
                                    <li>File 2</li>
                                    <li>File 3</li>
                                </ul>
                            </li>
                            <li>
                                <a href="#sel">Folder 2</a>
                                <ul>
                                    <li>File 1</li>
                                    <li>File 2</li>
                                    <li>File 3</li>
                                    <li>File 4</li>
                                </ul>
                            </li>
                            <li>
                                <a href="#sel">Folder 1</a>
                                <ul>
                                    <li>File 1</li>
                                    <li>File 2</li>
                                    <li>File 3</li>
                                </ul>
                            </li>
                            <li>
                                <a href="#sel">Folder 2</a>
                                <ul>
                                    <li>File 1</li>
                                    <li>File 2</li>
                                    <li>File 3</li>
                                    <li>File 4</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        <button type="button" id="btn-load" class="btn btn-primary">Load</button>
                    </div>
                </div>
            </div>
        </div>

        <footer>
            <div id="btn_bar">
                <button class="btn btn-default" type="submit" id="btn-clear" name="clear">Clear</button>
                <button class="btn btn-default" type="submit" id="btn-reset" name="reset">Reset Camera</button>
                <button class="btn btn-default" type="submit" id="btn-load" name="load" data-toggle="modal" data-target="#load-form">Load</button>
                <button class="btn btn-success" type="submit" name="save" data-toggle="modal" data-target="#save-form">Save</button>
            </div>
        </footer>
    </body>
</html>

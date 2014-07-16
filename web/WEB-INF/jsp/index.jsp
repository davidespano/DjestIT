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
        <link rel="stylesheet" href="css/index.css">

        <script type="text/javascript" src="js/lib/three.js"></script>
        <script type="text/javascript" src="js/lib/leap.min.js"></script>
        <script type="text/javascript" src="js/lib/leap-plugins.min.js"></script>
        <script type="text/javascript" src="js/lib/leap.rigged-hand.min.js"></script>
        <script type="text/javascript" src="js/lib/leap.rigged-hand.min.js"></script>
        <script type="text/javascript" src="js/lib/TrackballControls.js"></script>
        <script type="text/javascript" src="js/lib/jquery-1.9.1.js"></script>
        <script type="text/javascript" src="js/lib/bootstrap.min.js"></script>
        <script src="js/handMesh.js"></script>
        <script type="text/javascript" src="js/gestureVisualizer.js"></script>
    <body>
        <header>
            <div class="btn-toolbar" role="navigation" id="cmd-bar">
                <div class="btn-group">
                    <button  id="btn-menu" type="button" class="btn btn-default navbar-btn dropdown-toggle" data-toggle="dropdown">
                        <span class="glyphicon glyphicon-th-list"></span>
                        Gestures <span class="caret"></span>
                    </button>
                    <ul class="dropdown-menu" role="menu">
                        <li><a id="btn-swipe-right" href="#">Right Swipe</a></li>
                        <li><a id="btn-swipe-left" href="#">Left Swipe</a></li>
                        <li><a id="btn-circle" href="#">Circle</a></li>
                    </ul>
                </div>
                <div class="btn-group">
                    <button class="btn btn-default navbar-btn" type="submit" id="btn-load" name="load" title="Load gesture">
                        <span class="glyphicon glyphicon-floppy-open"></span>
                    </button>
                    <button class="btn btn-default navbar-btn" type="submit" name="save" data-toggle="modal" data-target="#save-form" title="Save gesture">
                        <span class="glyphicon glyphicon-floppy-save"></span>
                    </button>
                </div>
                <div class="btn-group">
                    <button class="btn btn-default navbar-btn" type="submit" id="btn-clear" name="clear" title="Clear">
                        <span class="glyphicon glyphicon-trash"></span>
                    </button>
                    <button class="btn btn-default navbar-btn" type="submit" id="btn-reset" name="reset" title="Reset Camera">
                        <span class="glyphicon glyphicon-screenshot"></span>
                    </button>
                </div>

            </div>
            <div class="btn-toolbar" role="navigation" id="user-bar">
                 <div class="btn-group">
                    <button class="btn btn-default navbar-btn" type="submit" id="btn-logout" name="logout" title="Logout">
                        <span class="glyphicon glyphicon-log-out"></span>
                        Logout
                    </button>
            </div>
        </header>
        <div id="main">
            <div id="container"></div>

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

        <!-- Load Modal form -->
        <div class="modal fade" id="load-form" tabindex="-1" role="dialog" aria-labelledby="load form" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                        <h4 class="modal-title" id="myModalLabel">Load gesture data</h4>
                    </div>
                    <div class="modal-body">
                        <ul id="file-list" class="file-view">

                        </ul>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        <button type="button" id="btn-load-confirm" class="btn btn-primary">Load</button>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>

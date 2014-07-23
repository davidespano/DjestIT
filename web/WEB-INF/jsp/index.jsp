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
        <script type="text/javascript" src="js/tutorialSequence.js"></script>
        <script type="text/javascript" src="js/gestureAnimator.js"></script>
    <body>
        <header>
            <div id="up-bar">
                <div class="btn-toolbar left-bar" role="navigation" id="cmd-bar">
                    <div class="btn-group">
                        <button  id="btn-menu" type="button" class="btn btn-default navbar-btn dropdown-toggle" data-toggle="dropdown">
                            <span class="glyphicon glyphicon-th-list"></span>
                            Gestures <span class="caret"></span>
                        </button>
                        <ul id="gesture-menu" class="dropdown-menu" role="menu">
                            <li><a id="btn-swipe-right" href="#">Right Swipe</a></li>
                            <li><a id="btn-swipe-left" href="#">Left Swipe</a></li>
                            <li><a id="btn-triangle" href="#">Triangle</a></li>
                            <li><a id="btn-x" href="#">X</a></li>
                            <li><a id="btn-rectangle" href="#">Rectangle</a></li>
                            <li><a id="btn-circle" href="#">Circle</a></li>
                            <li><a id="btn-check" href="#">Check</a></li>
                            <li><a id="btn-caret" href="#">Caret</a></li>
                            <li><a id="btn-lft-sqr-brk" href="#">Left square bracket</a></li>
                            <li><a id="btn-rgt-sqr-brk" href="#">Right square bracket</a></li>
                            <li><a id="btn-v" href="#">V</a></li>
                            <li><a id="btn-pigtail" href="#">Pigtail</a></li>
                            <li><a id="btn-lft-crl-brk" href="#">Left curly bracket</a></li>
                            <li><a id="btn-lft-rgt-brk" href="#">Right curly bracket</a></li>
                            <li><a id="btn-lft-rgt-brk" href="#">Star</a></li>
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
                <div class="btn-toolbar right-bar" role="navigation" id="user-bar">
                    <div class="btn-group">
                        <button class="btn btn-default navbar-btn" type="submit" id="btn-logout" name="logout" title="Logout">
                            <span class="glyphicon glyphicon-log-out"></span>
                            Logout
                        </button>
                    </div>
                </div>
                <div id="help-bar" class="center-bar">
                    <div class="alert alert-info help-msg" role="alert">
                        <span>
                            <p>Benvenuto a questo user test! </p>
                        </span>
                        <span>
                            <p>
                                In questo test ti verrà richiesto di eseguire dei gesti, 
                                cercando di riprodurre la traiettoria mostrata su schermo.
                            </p>
                        </span>
                        <span>
                            <p>
                                Per ogni gesto vedrai prima la traiettoria che devi seguire,
                                come questa
                            </p>
                        </span>
                        <span>
                            <p>
                                Dopo di che dovrai riprodurla quando finisce il conto 
                                alla rovescia come in questo esempio
                            </p>
                        </span>
                        <span>
                            <p id="countdown" class="countdown"></p>
                        </span>
                        <span>
                            <p>
                                Nel caso tu sia soddisfatto della tua esecuzione 
                                allora puoi passare al prossimo gesto, tramite il bottone
                                <button class="btn btn-success" >Continua</button>
                            </p>
                            <p>
                                Altrimenti puoi ripetere l'esecuzione tramite il bottone
                                <button class="btn btn-success" >Indietro</button>
                            </p>
                        </span>
                        <span>
                            <p>
                                Bene, siamo pronti per iniziare!
                            </p>
                        </span>
                        <div class="btn-group-tutorial">
                            <button id="btn-tutorial-prev" type="button" class="btn btn-primary" style="float:left; width: 100px;">
                                <span class="glyphicon glyphicon-chevron-left"></span>
                                Indietro</button>
                            <button id="btn-tutorial-next" type="button" class="btn btn-primary" style="float:right; width: 100px;">
                                Avanti
                                <span class="glyphicon glyphicon-chevron-right"></span>
                            </button>
                        </div>
                        <div style="clear: both"></div>
                    </div>
                </div>
                <div id="test-bar" class="center-bar">
                    <div class="alert alert-success  test-msg" role="alert">
                        <span>
                            <p id="test-count" class="countdown">3</p>
                        </span>
                        <span>
                            <h3>Gesto eseguito</h3>
                            <p>
                                Di sotto puoi visualizzare la traitettoria che
                                hai eseguito. Se non sei soddisfatto, puoi riprovare
                                premendo il bottone "Indietro", altrimenti 
                                puoi andare avanti con il bottone "Continua".
                            </p>
                        </span>
                        <span>
                            <h3>Test utente</h3>
                            <p>Bla bla</p>
                        </span>
                        <span>
                            <h3>1 - Swipe verso destra: dimostrazione</h3>
                            <p>
                                Guarda attentantamente la traiettoria del gesto.
                                Premi "Continua" per eseguirlo o "Ripeti" per 
                                rivedere la traiettoria.
                            </p>
                        </span>
                        <span>
                            <h3>2 - Swipe verso sinistra dimostrazione</h3>
                            <p>
                                Guarda attentantamente la traiettoria del gesto.
                                Premi "Continua" per eseguirlo o "Ripeti" per 
                                rivedere la traiettoria.
                            </p>
                        </span>
                        <span>
                            <h3>3 - Cerchio dimostrazione</h3>
                            <p>
                                Guarda attentantamente la traiettoria del gesto.
                                Premi "Continua" per eseguirlo o "Ripeti" per 
                                rivedere la traiettoria.
                            </p>
                        </span>
                        <span>
                            <h3>Test terminato</h3>
                            <p>
                                Ti ringraziamo per aver partecipato
                            </p>
                        </span>
                        <div class="btn-group-tutorial">
                            <div class="btn-group-tutorial-row">
                                <div class="btn-group-tutorial-cell">
                                    <button id="btn-test-prev" type="button" class="btn btn-success " style="margin-left: 0px; margin-right: auto; width: 100px; display: block">
                                        <span class="glyphicon glyphicon-chevron-left"></span>
                                        Indietro</button>
                                </div>
                                <div class="btn-group-tutorial-cell">
                                    <button id="btn-test-repeat" type="button" class="btn btn-success" style="margin: auto; width: 100px; display: block">
                                        <span class="glyphicon glyphicon-repeat"></span>
                                        Ripeti</button>
                                </div>
                                <div class="btn-group-tutorial-cell">
                                    <button id="btn-test-next" type="button" class="btn btn-success" style="margin-right: 0px; margin-left: auto; width: 100px; display: block">
                                        Continua
                                        <span class="glyphicon glyphicon-chevron-right"></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div style="clear: both"></div>
                    </div>
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

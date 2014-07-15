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
        <link rel="stylesheet" href="css/bootstrap.min.css">
        <link rel="stylesheet" href="css/bootstrap-theme.min.css">
        <link rel="stylesheet" href="css/icett.css">
        <script type="text/javascript" src="js/lib/jquery-1.9.1.js"></script>
        <script type="text/javascript" src="js/lib/bootstrap.min.js"></script>
        <script type="text/javascript" src="js/login.js"></script>
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

            <form role="form" id="login-form">

                <div class="form-group" id="login-group">
                    <label for="username" class="control-label">Username</label>
                    <input type="text" class="form-control" id="username" placeholder="Select a username">
                    <div id="login-error" class="alert alert-danger" role="alert">The username is already in use. <br/>
                        Please, select another one</div>
                </div>

                <button id="btn-login" type="submit" class="btn btn-primary btn-center">Start</button>
            </form>
        </div>
    </body>
</html>
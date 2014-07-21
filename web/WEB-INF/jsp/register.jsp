<html>
    <head>
        <title>Leap Canvas</title>
        <link rel="stylesheet" href="css/bootstrap.min.css">
        <link rel="stylesheet" href="css/bootstrap-theme.min.css">
        <link rel="stylesheet" href="css/icett.css">
        <link rel="stylesheet" href="css/login.css">
        <script type="text/javascript" src="js/lib/jquery-1.9.1.js"></script>
        <script type="text/javascript" src="js/lib/bootstrap.min.js"></script>
        <script type="text/javascript" src="js/register.js"></script>
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
            <h2>Create an account</h2>
            <form role="form" id="login-form">

                <div class="form-group" id="registration-group">
                    <label for="username" class="control-label">Username</label>
                    <input type="text" class="form-control" id="username" placeholder="Enter your username">
                    <div id="login-error" class="alert alert-danger msg-error" role="alert">Select your username</div>
                </div>
                
                 <div class="form-group" id="password-group">
                    <label for="password" class="control-label">Password</label>
                    <input type="password" class="form-control" id="password" placeholder="Select your password">
                    <div id="password-error" class="alert alert-danger msg-error" role="alert">Error placeholder</div>
                </div>
                
                <div class="form-group" id="password-group">
                    <label for="confirm" class="control-label">Confirm Password</label>
                    <input type="password" class="form-control" id="confirm" placeholder="Confirm your password">
                    <div id="password-error" class="alert alert-danger msg-error" role="alert">Error placeholder</div>
                </div>

                <button id="btn-login" type="submit" class="btn btn-primary btn-center">Register</button>
                
            </form>
            <a id="btn-new-account" href="index.html">Login with an existing account</a>
        </div>
    </body>
</html>
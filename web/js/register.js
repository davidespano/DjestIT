/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function() {
    $("#btn-login").click(function(event) {
        event.preventDefault();
        var username = $("#username").val();
        var password = $("#password").val();
        var confirm = $("#confirm").val();

        $.ajax({
            url: "register.json",
            type: 'POST',
            dataType: 'json',
            data: {"username": username, "password": password, "confirm": confirm},
            success: function(data) {
                $("#login-group").removeClass("has-error");
                $("#login-error").hide();
                $("#password-group").removeClass("has-error");
                $("#confirm-group").removeClass("has-error");
                $("#password-error").hide();
                if (data.status === 0) {

                    $("#login-ok").show();
                    $("#btn-login").prop('disabled', true);
                    setTimeout(function() {
                        location.href = "index.html";
                    }, 3000);

                } else {
                    if (data.errors.username) {
                        $("#login-group").addClass("has-error");
                        $("#login-error").text(data.errors.username).show();
                    }
                    if (data.errors.password) {
                        $("#password-group").addClass("has-error");
                        $("#confirm-group").addClass("has-error");
                        $("#password-error").text(data.errors.password).show();
                    }
                }
            }
        });
    });
});
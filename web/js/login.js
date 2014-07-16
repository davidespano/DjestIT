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
        $.ajax({
            url: "login.json",
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            mimeType: 'application/json',
            data: {"username": username, "password": password},
            success: function(data) {
                if (data.status === 0) {
                    location.reload();
                } else {
                    if (data.errors.username) {
                        $("#login-group").addClass("has-error");
                        $("#login-error").text(data.errors.username).show();
                    }
                    if (data.errors.password) {
                        $("#password-group").addClass("has-error");
                        $("#password-error").text(data.errors.password).show();
                    }
                }
            }
        });
    });
});

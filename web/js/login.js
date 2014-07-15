/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function() {
    $("#btn-login").click(function(event) {
        event.preventDefault();
        var username = $("#username").val();
        $.ajax({
            url: "login.json",
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            mimeType: 'application/json',
            data: {"username": username},
            success: function(data) {
                if(data.status === "ok"){
                    location.reload();
                }else{
                    $("#login-group").addClass("has-error");
                    $("#login-error").text(data.loginError).show();
                }
            }
        });
    });
});

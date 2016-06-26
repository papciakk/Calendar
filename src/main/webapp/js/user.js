function validateLoginInputs() {
    return true;
}

function validateRegisterInputs() {
    return true;
}

function initUserEvents() {
    $("#btn_modal_login").click(function () {

        if (!validateLoginInputs()) return;

        var username = $("#login_username").val();
        var password = $("#login_password").val();

        $('#login_modal').modal('hide');

        userResource.login(
            username,
            password,
            function () {
                if (showConfirmAlets) {
                    bootbox.alert("Zalogowano jako " + username);
                }
            },
            function () {
                bootbox.alert("Niepoprawny login lub hasło");
            }
        );
    });

    $("#btn_modal_register").click(function () {
        var username = $("#register_username").val();
        var password = $("#register_password").val();
        var passwordr = $("#register_password_repeat").val();

        $('#register_modal').modal('hide');

        if (password == passwordr) {
            userResource.register(username, password, function () {

            });
        } else {
            bootbox.alert("Podane hasła nie sa takie same");
        }

    });

    $("#btn_logout").click(function () {
        userResource.logout(function () {
            if (showConfirmAlets) {
                bootbox.alert("Wylogowano");
            }
        });
    });
}
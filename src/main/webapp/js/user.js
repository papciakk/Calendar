function initUserEvents() {
    $("#btn_modal_login").click(function () {

        var username = $("#login_username").val();
        var password = $("#login_password").val();

        userResource.login(
            username,
            password,
            function () {
                $('#login_modal').modal('hide');
                if (showConfirmAlets) {
                    bootbox.alert("Zalogowano jako " + username);
                }
            },
            function () {
                $('#login_modal').modal('hide');
                if (showConfirmAlets) {
                    bootbox.alert("Niepoprawny login lub hasło");
                }
            }
        );
    });

    $("#btn_modal_register").click(function () {
        
    });

    $("#btn_logout").click(function () {
        userResource.logout(function () {
            if (showConfirmAlets) {
                bootbox.alert("Wylogowano");
            }
        });
    });
}
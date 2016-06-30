function showUserButtons() {
    userResource.isLoggedIn(function (loggedIn) {
        var buttonsHTML = "";
        if (loggedIn) {
            buttonsHTML += "<button id='btn_logout' type='button' class='btn btn-default'>Wyloguj</button>";
        } else {
            buttonsHTML += "<button id='btn_register' type='button' class='btn btn-primary' data-toggle='modal' data-target='#register_modal'>Zarejestruj</button>" +
                "<button id='btn_login' type='button' class='btn btn-default' data-toggle='modal' data-target='#login_modal'>Zaloguj</button>";
        }

        $("#user_buttons_cont").html(buttonsHTML);
    });
}

function validateLoginInputs() {
    return true;
}

function validateRegisterInputs() {
    return true;
}

function doLogin() {
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
            //location.reload();
            refresh();
        },
        function () {
            bootbox.alert("Niepoprawny login lub hasło");
        }
    );
}

function doRegister() {
    if (!validateRegisterInputs()) return;

    var username = $("#register_username").val();
    var password = $("#register_password").val();
    var passwordr = $("#register_password_repeat").val();

    $('#register_modal').modal('hide');

    if (password == passwordr) {
        userResource.register(username, password, function () {
                bootbox.alert("Rejestracja przebiegła pomyślnie. Teraz możesz się zalogować.");
            },
            function () {
                bootbox.alert("Użytkownik o nazwie \"" + username + "\" już istnieje");
            });
    } else {
        bootbox.alert("Podane hasła nie są takie same");
    }

}

function initUserEvents() {
    $("#btn_logout").click(function () {
        userResource.logout(function () {
            if (showConfirmAlets) {
                bootbox.alert("Wylogowano");
            }
            location.reload();
        });
    });
}
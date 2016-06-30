var userResource = {
    login: function (username, password, ready_func, badcred_func) {
        $.ajax({
            type: 'POST',
            url: "/login",
            data: {"username": username, "password": password},
            success: function () {
                ready_func();
            },
            statusCode: {
                401: function() {
                    badcred_func();
                }
            }
        });
    },

    logout: function (ready_func) {
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: "/logout",
            dataType: "json",
            data: "",
            complete: function () {
                ready_func();
            }
        });
    },

    register: function (username, password, ready_func, duplicate_func) {
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: "/rest/user",
            dataType: "json",
            data: JSON.stringify({"username": username, "password": password}),
            success: function (response) {
                if (response.success) {
                    ready_func();
                } else {
                    if (response.errorCode == 1) {
                        duplicate_func();
                    } else {
                        alert("register: " + response.message);
                    }
                }
            }
        });
    },

    isLoggedIn: function (ready_func) {
        $.ajax({
            type: 'GET',
            url: "/rest/user",
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    var loggedIn = response.object;
                    ready_func(loggedIn);
                } else {
                    alert("isLoggedIn: " + response.message);
                }
            }
        });
    }
};


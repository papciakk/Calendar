var userResource = {
    login: function (username, password, ready_func, badcred_func) {
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: "/login",
            dataType: "json",
            data: JSON.stringify({"username": username, "password": password}),
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
            success: function () {
                ready_func();
            }
        });
    },

    register: function (username, password, ready_func) {
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
                    alert("register: " + response.message);
                }
            }
        });
    }
};


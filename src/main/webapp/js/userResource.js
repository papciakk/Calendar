var userResource = {
    url_prefix: "/rest/user",

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
    },

    update: function (calendar, ready_func) {
        $.ajax({
            type: 'PUT',
            contentType: 'application/json',
            url: this.url_prefix,
            dataType: "json",
            data: JSON.stringify(calendar),
            success: function (response) {
                if (response.success) {
                    ready_func();
                } else {
                    alert("calendarResource.update: " + response.message);
                }
            }
        });
    },

    delete: function (calendarID, ready_func) {
        $.ajax({
            type: 'DELETE',
            url: this.url_prefix + "/" + calendarID,
            success: function (response) {
                if (response.success) {
                    ready_func();
                } else {
                    alert("calendarResource.delete: " + response.message);
                }
            }
        });
    }
};


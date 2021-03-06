var calendarResource = {
    url_prefix: "/rest/calendars",

    getAll: function (ready_func) {
        $.ajax({
            type: 'GET',
            url: this.url_prefix,
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    var calendarList = serializedCollectionToArray(response.object);
                    ready_func(calendarList);
                } else {
                    alert("calendarResource.getAll: " + response.message);
                }
            },
            statusCode: {
                401: function () {
                    $('#login_modal').modal('show');
                }
            }
        });
    },

    add: function (calendar, ready_func) {
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: this.url_prefix,
            dataType: "json",
            data: JSON.stringify(calendar),
            success: function (response) {
                if (response.success) {
                    ready_func();
                } else {
                    alert("calendarResource.add: " + response.message);
                }
            },
            statusCode: {
                401: function () {
                    $('#login_modal').modal('show');
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
            },
            statusCode: {
                401: function () {
                    $('#login_modal').modal('show');
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
            },
            statusCode: {
                401: function () {
                    $('#login_modal').modal('show');
                }
            }
        });
    }
};


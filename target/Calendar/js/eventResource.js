var eventResource = {
    url_prefix: "/rest/",

    getById: function (eventId, ready_func) {
        $.ajax({
            type: 'GET',
            url: this.url_prefix + getCurrentCalendarName() + "/event/id/" + eventId,
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    ready_func(response.object);
                } else {
                    alert("getEventResourceById: " + response.message);
                }
            },
            statusCode: {
                401: function() {
                    $('#login_modal').modal('show');
                }
            }
        });
    },

    getByDate: function (date, ready_func) {
        if (getCurrentCalendarName() == null) return;
        $.ajax({
            type: 'GET',
            url: this.url_prefix + getCurrentCalendarName() + "/event/date/" + date,
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    var eventList = serializedCollectionToArray(response.object);
                    ready_func(eventList);
                } else {
                    alert("getEventsResourceByDate: " + response.message);
                }
            },
            statusCode: {
                401: function() {
                    $('#login_modal').modal('show');
                }
            }
        });
    },

    add: function (event, ready_func) {
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: this.url_prefix + getCurrentCalendarName() + "/event",
            dataType: "json",
            data: JSON.stringify(event),
            success: function (response) {
                if (response.success) {
                    ready_func();
                } else {
                    alert("addEventResource: " + response.message);
                }
            },
            statusCode: {
                401: function() {
                    $('#login_modal').modal('show');
                }
            }
        });
    },

    update: function (event, ready_func) {
        $.ajax({
            type: 'PUT',
            contentType: 'application/json',
            url: this.url_prefix + getCurrentCalendarName() + "/event",
            dataType: "json",
            data: JSON.stringify(event),
            success: function (response) {
                if (response.success) {
                    ready_func();
                } else {
                    alert("updateEventResource: " + response.message);
                }
            },
            statusCode: {
                401: function() {
                    $('#login_modal').modal('show');
                }
            }
        });
    },

    delete: function (eventId, ready_func) {
        $.ajax({
            type: 'DELETE',
            url: this.url_prefix + getCurrentCalendarName() + "/event/" + eventId,
            success: function (response) {
                if (response.success) {
                    ready_func();
                } else {
                    alert("deleteEventResource: " + response.message);
                }
            },
            statusCode: {
                401: function() {
                    $('#login_modal').modal('show');
                }
            }
        });
    }
};

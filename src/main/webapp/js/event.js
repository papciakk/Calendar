var url_prefix = "/rest/";

function serializedCollectionToArray(data) {
    return data == null ? [] : (data instanceof Array ? data : [data]);
}

function getEventResourceById(eventId, ready_func) {
    $.ajax({
        type: 'GET',
        url: url_prefix + current_calendar + "/event/id/" + eventId,
        dataType: "json",
        success: function (response) {
            if (response.success) {
                ready_func(response.object);
            } else {
                alert("getEventResourceById: " + response.message);
            }
        }
    });
}

function getEventsResourceByDate(date, ready_func) {
    $.ajax({
        type: 'GET',
        url: url_prefix + current_calendar + "/event/date/" + date,
        dataType: "json",
        success: function (response) {
            if (response.success) {
                var eventList = serializedCollectionToArray(response.object);
                ready_func(eventList);
            } else {
                alert("getEventsResourceByDate: " + response.message);
            }
        }
    });
}

function addEventResource(event, ready_func) {
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: url_prefix + current_calendar + "/event",
        dataType: "json",
        data: JSON.stringify(event),
        success: function (response) {
            if (response.success) {
                ready_func();
            } else {
                alert("addEventResource: " + response.message);
            }
        }
    });
}

function updateEventResource(event, ready_func) {
    $.ajax({
        type: 'PUT',
        contentType: 'application/json',
        url: url_prefix + current_calendar + "/event",
        dataType: "json",
        data: JSON.stringify(event),
        success: function (response) {
            if (response.success) {
                ready_func();
            } else {
                alert("updateEventResource: " + response.message);
            }
        }
    });
}

function deleteEventResource(eventId, ready_func) {
    $.ajax({
        type: 'DELETE',
        url: url_prefix + current_calendar + "/event/" + eventId,
        success: function (response) {
            if (response.success) {
                ready_func();
            } else {
                alert("deleteEventResource: " + response.message);
            }
        }
    });
}

var currentEventID;
var loadedEvents = {};

function clearVisibleEvents() {
    for(var i=0; i<=6; i++) {
        $(".col" + i + "_cont").html("");
    }
}

function showEventsByDay(date) {
    eventResource.getByDate(date, function (eventArray) {
        if (eventArray != null) {
            $.each(eventArray, function (i, event) {
                loadedEvents[event.id] = event;
                showEvent(event);
            });
        }
    });
}

function validateEventEditInputs() {
    return true;
}

function updateEvent(eventID) {s;
    var event = {};
    event.title = $("#event_edit_event").val();
    event.date = $("#event_edit_date").val();
    event.startTime = $("#event_edit_start").val();
    event.endTime = $("#event_edit_end").val();
    event.info = $("#event_edit_info").val();

    if (eventID == "0") {
        eventResource.add(event, function () {
            hideEventModal();
            updateCalendar();
            if (showConfirmAlets) {
                bootbox.alert("Dodano wydarzenie: " + event.title);
            }
        });
    } else {
        event.id = eventID;
        eventResource.update(event, function () {
            hideEventModal();
            updateCalendar();
            if (showConfirmAlets) {
                bootbox.alert("Zaktualizowano wydarzenie: " + event.title);
            }
        });
    }
}

function deleteEvent(eventID) {
    eventResource.delete(eventID, function () {
        hideEventModal();
        updateCalendar();
        if (showConfirmAlets) {
            bootbox.alert("Usunięto wydarzenie");
        }
    });
}

function showEvent(event) {
    if ($("#event" + event.id).length) {
        return;
    } // only one event with givent id visible

    var date_start = moment(event.date + " " + event.startTime, "YYYY-MM-DD HH:mm");
    var date_end = moment(event.date + " " + event.endTime, "YYYY-MM-DD HH:mm");

    var time_str = date_start.format("HH:mm") + "-" + date_end.format("HH:mm");
    var day_of_week = date_start.format("e");

    var duration_percent = moment.duration(date_end.diff(date_start)).asMinutes() / minutes_in_day * 100;
    var start_percent = moment.duration(date_start.format("HH:mm")).asMinutes() / minutes_in_day * 100;

    $(".col" + day_of_week + "_cont").append(
        "<div id='event" + event.id + "' class='event ev_col" + event.color + "' style='top:" + start_percent + "%; height:" + duration_percent +
            "%' data-toggle='modal' data-target='#event_modal' data-id='" + event.id + "'>" +
        "	<div style='margin:4px; overflow:hidden;'>" +
        "		<div class='event_time ev_col" + event.color + "'>" + time_str + "</div>" +
        "		<span class='event_text'>" + event.title + "</span>" +
        "	</div>" +
        "</div>"
    );

    $("#event" + event.id).click(function () {
        $("#event" + event.id).popover();
        currentEventID = event.id;

        $("#event_edit_event").val(event.title);
        $("#event_edit_date").val(event.date);
        $("#event_edit_start").val(event.startTime);
        $("#event_edit_end").val(event.endTime);
        $("#event_edit_info").val(event.info);

        $("#event_edit_delete").show();
    });

}

function hideEventModal() {
    $('#event_modal').modal('hide');
}

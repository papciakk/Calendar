var currentCalendarID;
var loadedCalendars = {};

var editingCalendar;

function updateCalendarList() {
    calendarResource.getAll(function (calendars) {
        var calendarsStr = "";
        $.each(calendars, function (i, calendar) {
            calendarsStr += "<option>" + calendar.name + "</option>" + "\n";
            loadedCalendars[calendar.id] = calendar;
        });

        $("#select_calendar").html(calendarsStr);
    });
}

function getLoadedCalendarByName(name) {
    var cal;
    $.each(loadedCalendars, function (i, calendar) {
        if (calendar.name == name) {
            cal = calendar;
        }
    });

    return cal;
}

function editCalendarResource(calendarID) {
    var calendar = {};
    calendar.name = $("#calendar_name").val();

    if (editingCalendar) {
        calendar.id = calendarID;
        calendarResource.update(calendar, function () {
            hideCalendarModal();
            if (showConfirmAlets) {
                bootbox.alert("Zaktualizowano kalendarz: " + calendar.name);
            }
        });
    } else {
        calendarResource.add(calendar, function () {
            hideCalendarModal();
            if (showConfirmAlets) {
                bootbox.alert("Dodano kalendarz: " + calendar.name);
            }
        });
    }
}

function deleteCalendarResource(calendarID) {
    bootbox.confirm("Czy na pewno chcesz usunąć ten kalendarz? Wszystkie wydarzenie zostaną także usunięte.", function (result) {
        if (result) {
            calendarResource.delete(calendarID, function () {
                hideCalendarModal();
                if (showConfirmAlets) {
                    bootbox.alert("Usunięto kalendarz");
                }
            });
        }
    });
}

function initCalendarEvents() {
    $("#btn_add_calendar").click(function () {
        currentCalendarID = "0";
        $("#calendar_edit_delete").hide();
        $("#calendar_name").val("");
        editingCalendar = false;
    });

    $("#btn_edit_calendar").click(function () {
        console.log(getLoadedCalendarByName($("#select_calendar").val()))
        currentCalendarID = getLoadedCalendarByName($("#select_calendar").val()).id;
        $("#calendar_edit_delete").show();
        console.log($("#select_calendar").val());
        $("#calendar_name").val($("#select_calendar").val());
        editingCalendar = true;
    });

    $("#calendar_edit_save").click(function () {
        editCalendarResource(currentCalendarID);
    });

    $("#calendar_edit_delete").click(function () {
        deleteCalendarResource(currentCalendarID);
    });
}

function hideCalendarModal() {
    $('#calendar_modal').modal('hide');
}

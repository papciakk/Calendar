var minutes_in_day = 1440;
var current_date_start;

var showConfirmAlets = true;

function getCurrentCalendarName() {
    return $("#select_calendar").val();
}

function serializedCollectionToArray(data) {
    return data == null ? [] : (data instanceof Array ? data : [data]);
}

function setDateRange(date) {
    var _date = date.subtract(date.format("e"), 'days');

    if (!date.isSame(current_date_start)) {
        current_date_start = moment(_date);

        var date_range_str = _date.format("D") + " - " +
            _date.add(6, 'days').format("D") + " " +
            _date.format("MMMM YYYY");

        $("#date_range").html(date_range_str);

        $('#date_range_start_picker').data("DateTimePicker").date(current_date_start);

        updateCalendar();
    }
}

function updateCalendar() {
    var datesOfWeek = moment(current_date_start);

    clearVisibleEvents();
    for (var member in loadedEvents) delete loadedEvents[member]; // celar event map

    for (var i = 0; i < 7; i++) {
        showEventsByDay(datesOfWeek.format("YYYY-MM-DD"));
        datesOfWeek.add(1, 'days');
    }
}

// ********************************************
function calendar(container_class) {
    $("." + container_class).append(
        "<div class='calendar'>" +
        "	<div class='hours_col'></div>" +
        "</div>"
    );

    for (var j = 0; j < 7; j++) {
        addColumn(j);
    }

    for (var i = 0; i < 24; i++) {
        addHoursRow(i);
    }
}

function addHoursRow(h) {
    var time_str = moment({hour: h}).format("HH:mm");

    $(".hours_col").append(
        "<div class='calendar_row hour_row'>" +
        "	<div class='hours_col_inner'>" + time_str + "</div>" +
        "</div>"
    );
}

function addColumn(n) {
    $(".calendar").append("<div class='calendar_column col" + n + "'>" +
        "<div class='col" + n + "_cont' style='width:100%; float:left;'></div>" +
        "</div>"
    );

    $(document).ready(function () {
        $(".col" + n + "_cont").height($(".calendar").height()-1);
    });

    for (var i = 0; i < 24; i++) {
        addRow(n);
    }
}

function addRow(n) {
    $(".calendar_column.col" + n).append(
        "<div class='calendar_row'>" +
        "	<div class='calendar_halfanhour'></div>" +
        "</div>"
    );
}


// ********************************************************

function initTimeCursor() {
    var day_of_week = moment().format("e");

    var calendarColumnSel = $(".calendar_column.col" + day_of_week);
    calendarColumnSel.append(
        "<div class='time_cursor'></div>"
    );

    calendarColumnSel.css('background-color', '#F7F7F7');

    updateCursorPosition();
    setInterval(updateCursorPosition, 60000);
}

function updateCursorPosition() {
    var cursor_pos = moment.duration(moment().format("HH:mm")).asMinutes() / minutes_in_day * 100;
    $(".time_cursor").css("top", String(cursor_pos) + "%");

}

// ********************************************************


function showColorBoxes() {
    for (var i = 0; i < 9; i++) {
        $("#event_edit_color").append(
            "<label>" +
            "	<input type='radio' name='options' style='margin-right:10px;' id='ev_col" + i + "' autocomplete='off'>" +
            "	<div style='margin-top:2px;' class='color_box ev_col" + i + "'></div>" +
            "</label>"
        );
    }

    $("#ev_col0").attr("checked", "checked");
}

function initModals() {
    $('#event_edit_date_picker').datetimepicker({
        locale: 'pl',
        format: 'YYYY-MM-DD',
        defaultDate: moment()
    });

    $('#event_edit_start_time_picker').datetimepicker({
        locale: 'pl',
        format: 'HH:mm',
        defaultDate: moment().set('minutes', 0)
    });

    $('#event_edit_end_time_picker').datetimepicker({
        locale: 'pl',
        format: 'HH:mm',
        defaultDate: moment().set('minutes', 0).add(1, 'hour').add(30, 'minutes')
    });

    $('#date_range_start_picker').datetimepicker({
        locale: 'pl',
        format: 'YYYY-MM-DD',
        defaultDate: moment(),
        inline: true
    });


    // ****************************************************************

    $("#btn_add_event").click(function () {
        currentEventID = "0";

        // TODO: actual hours and date instead of ""
        $("#event_edit_event").val("");
        $("#event_edit_date").val("");
        $("#event_edit_start").val("");
        $("#event_edit_end").val("");
        $("#event_edit_info").val("");

        $("#event_edit_delete").hide();
    });

    $("#event_edit_delete").click(function () {
        hideEventModal();
        bootbox.confirm("Czy na pewno chcesz usunąć to wydarzenie?", function (result) {
            if (result) {
                deleteEvent(currentEventID);
            }
        });
    });
}

function initChangeDateRangeEvents() {
    $("#btn_previous_week").click(function () {
        var m = moment(current_date_start);
        m = m.subtract(1, 'weeks');
        setDateRange(m);
    });

    $("#btn_next_week").click(function () {
        var m = moment(current_date_start);
        m = m.add(1, 'weeks');
        setDateRange(m);
    });

    $("#date_range_start_picker").on("dp.change", function (event) {
        setDateRange(event.date);
    });
}

function initUserModalEvents() {
    $("#login_modal").on("shown.bs.modal", function () {
        $("#login_username").val("");
        $("#login_password").val("");
    });

    $("#register_modal").on("shown.bs.modal", function () {
        $("#register_username").val("");
        $("#register_password").val("");
        $("#register_password_repeat").val("");
    });
}

function initFormValidators() {
    $('#form_calendar').bootstrapValidator({
        fields: {
            calendar_name: {
                validators: {
                    notEmpty: {
                        message: 'Podaj nazwę kalendarza'
                    },
                    stringLength: {
                        min: 3,
                        max: 20,
                        message: 'Nazwa kalendarza musi mieć długość od 3 do 20 znaków'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9_]+$/,
                        message: 'Nazwa kalendarza może zawierać tylko litery, cyfry i znak podkreślenia'
                    }
                }
            }
        }
    }).on('success.form.bv', function(e) {
        editCalendarResource(currentCalendarID);
        e.preventDefault();
    });


    $('#form_event').bootstrapValidator({
        fields: {
            event_title: {
                validators: {
                    notEmpty: {
                        message: 'Podaj tytuł wydarzenia'
                    },
                    regexp: {
                        regexp: /^[^'"]+$/,
                        message: 'Tutuł wydarzenia zawiera nieprawidłowe znaki'
                    }
                }
            },
            event_date: {
                validators: {
                    notEmpty: {
                        message: 'Podaj datę wydarzenia'
                    }
                }
            },
            event_start: {
                validators: {
                    notEmpty: {
                        message: 'Podaj godzinę rozpoczęcia'
                    }
                }
            },
            event_end: {
                validators: {
                    notEmpty: {
                        message: 'Podaj godzinę zakończenia'
                    }
                }
            }

        }
    }).on('success.form.bv', function(e) {
        updateEvent(currentEventID);
        e.preventDefault();
    });
}

function init() {
    bootbox.setLocale("pl");

    initTimeCursor();
    showColorBoxes();
    initModals();
    initChangeDateRangeEvents();
    initCalendarEvents();
    initUserEvents();
    initUserModalEvents();
    initFormValidators();

    //showUserButtons();

    var date = moment();
    setDateRange(date);

    updateCalendarList();
}

function refresh() {
    var date = moment();
    setDateRange(date);
    updateCalendarList();
}

$(document).ready(function () {
	calendar("calendar_container");
	init();
});
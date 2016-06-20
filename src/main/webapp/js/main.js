var minutes_in_day = 1440;
var current_date_start;

var current_calendar = "calendar_test";

var currentEventID;

var loadedEvents = {};

var showConfirmAlets = false;

$(document).ready(function(){

    function setDateRange(date) {
        var _date = date.subtract(date.format("e"), 'days');

        if(!date.isSame(current_date_start)) {
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
        for(var i=0; i<7; i++) {
            showEventsByDay(datesOfWeek.format("YYYY-MM-DD"));
            datesOfWeek.add(1, 'days');
        }
    }

    function showEventsByDay(date) {
        getEventsResourceByDate(date, function (eventArray) {
            console.log("Date: " + date);
            console.log(eventArray);

            // TODO: clear old events!
            for (var member in loadedEvents) delete loadedEvents[member]; // celar event map

            if(eventArray != null) {
                $.each(eventArray, function(i, event) {
                    loadedEvents[event.id] = event;
                    showEvent(event);
                });
            }
        });
    }

    function validateEventEditInputs() {
        return true;
    }

    function updateEvent(eventID) {
        // TODO: add input checking
        if(!validateEventEditInputs()) return;

        var event = {};
        event.title = $("#event_edit_event").val();
        event.date = $("#event_edit_date").val();
        event.startTime = $("#event_edit_start").val();
        event.endTime = $("#event_edit_end").val();
        event.info = $("#event_edit_info").val();
        event.color = 5;
        // TODO: selected color

        if(eventID == "0") {
            addEventResource(event, function () {
                if(showConfirmAlets) {
                    bootbox.alert("Dodano wydarzenie: " + event.title);
                }
                hideEventModal();
                updateCalendar();
            });
        } else {
            event.id = eventID;
			updateEventResource(event, function () {
                if(showConfirmAlets) {
                    bootbox.alert("Zaktualizowano wydarzenie: " + event.title);
                }
                hideEventModal();
                updateCalendar();
            });
        }
    }

    function deleteEvent(eventID) {
        deleteEventResource(eventID, function () {
            if(showConfirmAlets) {
                bootbox.alert("Usunięto wydarzenie");
            }
        });
    }


	function calendar(container_class) {
		$("." + container_class).append(
			"<div class='calendar'>" +
			"	<div class='hours_col'></div>" +
			"</div>"
		);

		for(var j=0; j<7; j++) {
			addColumn(j);
		}

		for(var i=0; i<24; i++) {
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
		$(".calendar").append("<div class='calendar_column col" + n + "'></div>");

		for(var i=0; i<24; i++) {
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

	function showEvent(event) {
		if($("#event" + event.id).length) {
            return;
        } // only one event with givent id visible

        var date_start = moment(event.date + " " + event.startTime, "YYYY-MM-DD HH:mm");
        var date_end = moment(event.date + " " + event.endTime, "YYYY-MM-DD HH:mm");

		var time_str = date_start.format("HH:mm") + "-" + date_end.format("HH:mm");
		var day_of_week = date_start.format("e");

        var duration_percent = moment.duration(date_end.diff(date_start)).asMinutes() / minutes_in_day * 100;
        var start_percent = moment.duration(date_start.format("HH:mm")).asMinutes() / minutes_in_day * 100;

		$(".calendar_column.col" + day_of_week).append(
			"<div id='event" + event.id + "' class='event ev_col" + event.color +"' style='top:" + start_percent + "%; height:" + duration_percent + "%' data-toggle='modal' data-target='#event_modal' data-id='" + event.id + "'>" +
			"	<div style='margin:4px; overflow:hidden;'>" +
			"		<div class='event_time ev_col" + event.color + "'>" + time_str + "</div>" +
			"		<span class='event_text'>" + event.title + "</span>" +
			"	</div>" +
			"</div>"
		);

		$("#event" + event.id).click(function() {
			$("#event" + event.id).popover();
            currentEventID = event.id;

            console.log("Editing event with id: " + event.id);

            $("#event_edit_event").val(event.title);
            $("#event_edit_date").val(event.date);
            $("#event_edit_start").val(event.startTime);
            $("#event_edit_end").val(event.endTime);
            $("#event_edit_info").val(event.info);
		});

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

    function hideEventModal() {
        $('#event_modal').modal('hide');
    }

	function initEventModal() {
		$('#event_modal').on('show.bs.modal', function (event) {
			var button = $(event.relatedTarget);
			var id = button.data('id');

			var modal = $(this);
			modal.find('#event_edit_id').val(id);
		});
	}

	function showColorBoxes() {
		for(var i=0; i<9; i++) {
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
			inline:true
		});


        // ****************************************************************
        // ****************************************************************
        // ****************************************************************

        $("#event_edit_save").click(function () {
			updateEvent(currentEventID);
        });

        $("#btn_add_event").click(function () {
            currentEventID = "0";

			// TODO: actual hours and date instead of ""
            $("#event_edit_event").val("");
            $("#event_edit_date").val("");
            $("#event_edit_start").val("");
            $("#event_edit_end").val("");
            $("#event_edit_info").val("");
        });

        $("#event_edit_delete").click(function () {
            hideEventModal()
            bootbox.confirm("Czy na pewno chcesz usunąć to wydarzenie?", function(result) {
                if(result) {
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

	// ********************************************************

	function init() {
        bootbox.setLocale("pl");

		initTimeCursor();
		initEventModal();
		showColorBoxes();
		initModals();
        initChangeDateRangeEvents();

        var date = moment();
        setDateRange(date);

        updateCalendar();
	}

	calendar("calendar_container");
	init();
});